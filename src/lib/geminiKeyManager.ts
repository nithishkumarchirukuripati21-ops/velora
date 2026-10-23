export interface GeminiKeyStatus {
  id: string;
  masked: string;
  tier: 'user_override' | 'system_default';
  status: 'active' | 'rate_limited' | 'invalid';
  cooldownUntil?: number;
}

export class GeminiNetworkManager {
  // Pre-configured 3-Key System Pool
  private systemKeys: string[] = [];
  private userKey: string = '';
  private currentSystemIndex: number = 0;
  private keyCooldowns: Map<string, number> = new Map();

  constructor() {
    this.refreshSystemKeys();
  }

  private refreshSystemKeys() {
    const explicit3Keys = [
      process.env.GEMINI_API_KEY_1 || '',
      process.env.GEMINI_API_KEY_2 || '',
      process.env.GEMINI_API_KEY_3 || '',
    ]
      .map((k) => k.trim())
      .filter((k) => k.length > 10);

    if (explicit3Keys.length > 0) {
      this.systemKeys = explicit3Keys;
      return;
    }

    // Fallback: check comma-separated GEMINI_API_KEYS or single GEMINI_API_KEY
    const fallbackKeys = [
      ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : []),
      ...(process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY] : []),
    ]
      .map((k) => k.trim())
      .filter((k) => k.length > 10);

    this.systemKeys = Array.from(new Set(fallbackKeys)).slice(0, 3);
  }

  public setUserKey(key: string) {
    this.userKey = key ? key.trim() : '';
  }

  public setUserKeys(rawKeysString?: string) {
    if (!rawKeysString) {
      this.userKey = '';
      return;
    }
    const firstKey = rawKeysString.split(/[\n,]+/)[0]?.trim() || '';
    this.setUserKey(firstKey);
  }

  public getNetworkStatus(): {
    activeModel: string;
    totalKeys: number;
    systemKeyCount: number;
    hasUserOverride: boolean;
    keys: GeminiKeyStatus[];
    userKeyCount: number;
    totalActive: number;
    pool: { id: string; masked: string; source: string; status: string; cooldownUntil?: number }[];
  } {
    const now = Date.now();
    const result: GeminiKeyStatus[] = [];

    this.refreshSystemKeys();

    if (this.userKey) {
      const isCooldown = (this.keyCooldowns.get(this.userKey) || 0) > now;
      result.push({
        id: 'user-key',
        masked: `${this.userKey.slice(0, 6)}...${this.userKey.slice(-4)}`,
        tier: 'user_override',
        status: isCooldown ? 'rate_limited' : 'active',
        cooldownUntil: this.keyCooldowns.get(this.userKey),
      });
    }

    this.systemKeys.forEach((k, idx) => {
      const isCooldown = (this.keyCooldowns.get(k) || 0) > now;
      result.push({
        id: `system-key-${idx + 1}`,
        masked: `${k.slice(0, 6)}...${k.slice(-4)}`,
        tier: 'system_default',
        status: isCooldown ? 'rate_limited' : 'active',
        cooldownUntil: this.keyCooldowns.get(k),
      });
    });

    const activeCount = result.filter((k) => k.status === 'active').length;

    return {
      activeModel: 'gemini-1.5-flash',
      totalKeys: result.length,
      systemKeyCount: this.systemKeys.length,
      hasUserOverride: Boolean(this.userKey),
      keys: result,
      userKeyCount: this.userKey ? 1 : 0,
      totalActive: activeCount,
      pool: result.map((k) => ({
        id: k.id,
        masked: k.masked,
        source: k.tier,
        status: k.status,
        cooldownUntil: k.cooldownUntil,
      })),
    };
  }

  public getNetworkTelemetry() {
    return this.getNetworkStatus();
  }

  public async executeWithAutoFailover<T>(
    operation: (activeKey: string) => Promise<T>
  ): Promise<{ data: T; keyUsed: string; tier: string; rotated: boolean }> {
    const now = Date.now();
    this.refreshSystemKeys();
    const candidateKeys: { key: string; tier: string }[] = [];

    // Priority 1: User's custom key
    if (this.userKey && (this.keyCooldowns.get(this.userKey) || 0) <= now) {
      candidateKeys.push({ key: this.userKey, tier: 'user_override' });
    }

    // Priority 2: 3 System Keys in round-robin order
    for (let i = 0; i < this.systemKeys.length; i++) {
      const idx = (this.currentSystemIndex + i) % this.systemKeys.length;
      const sysKey = this.systemKeys[idx];
      if ((this.keyCooldowns.get(sysKey) || 0) <= now) {
        candidateKeys.push({ key: sysKey, tier: `system_key_${idx + 1}` });
      }
    }

    if (candidateKeys.length === 0) {
      throw new Error('ALL_KEYS_EXHAUSTED_OR_RATE_LIMITED');
    }

    for (let i = 0; i < candidateKeys.length; i++) {
      const current = candidateKeys[i];
      try {
        const result = await operation(current.key);
        // Advance system index if a system key succeeded
        if (current.tier.startsWith('system_key_')) {
          this.currentSystemIndex = (this.currentSystemIndex + 1) % Math.max(1, this.systemKeys.length);
        }
        return {
          data: result,
          keyUsed: `${current.key.slice(0, 6)}...${current.key.slice(-4)}`,
          tier: current.tier,
          rotated: i > 0,
        };
      } catch (err: unknown) {
        const errorObj = err as { status?: number; statusCode?: number; message?: string };
        const status = errorObj?.status || errorObj?.statusCode || 0;
        const msg = String(errorObj?.message || '').toLowerCase();

        // If rate limit (429) or quota exceeded, cool down for 60 seconds and try next key
        if (status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
          console.warn(`[Gemini Network] ${current.tier} hit free-tier rate limit (429). Setting 60s cooldown and rotating to next key...`);
          this.keyCooldowns.set(current.key, Date.now() + 60000);
          continue; // Seamless failover to next key
        }

        // If invalid key, cool down for 1 hour
        if (status === 400 || status === 403 || msg.includes('api_key_invalid') || msg.includes('key not valid')) {
          console.warn(`[Gemini Network] ${current.tier} invalid key. Disabling key for 1 hour.`);
          this.keyCooldowns.set(current.key, Date.now() + 3600000);
          continue;
        }

        throw err;
      }
    }

    throw new Error('ALL_KEYS_EXHAUSTED_OR_RATE_LIMITED');
  }

  // Backward compatibility wrapper
  public async executeWithFailover<T>(
    operation: (key: string, model: string) => Promise<T>
  ): Promise<{ result: T; keyUsed: string; source: string; failovers: number } | null> {
    try {
      const outcome = await this.executeWithAutoFailover((key) => operation(key, 'gemini-1.5-flash'));
      return {
        result: outcome.data,
        keyUsed: outcome.keyUsed,
        source: outcome.tier,
        failovers: outcome.rotated ? 1 : 0,
      };
    } catch {
      return null;
    }
  }
}

const globalForGemini = globalThis as unknown as { geminiNetwork?: GeminiNetworkManager };
export const geminiNetwork =
  globalForGemini.geminiNetwork && typeof globalForGemini.geminiNetwork.executeWithAutoFailover === 'function'
    ? globalForGemini.geminiNetwork
    : new GeminiNetworkManager();
if (process.env.NODE_ENV !== 'production') globalForGemini.geminiNetwork = geminiNetwork;
