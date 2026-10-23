import { NextRequest, NextResponse } from 'next/server';
import { geminiNetwork } from '@/lib/geminiKeyManager';

export async function GET() {
  return NextResponse.json(geminiNetwork.getNetworkStatus());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = body.userKey ?? body.customKeys ?? body.apiKey;
    if (typeof key === 'string') {
      geminiNetwork.setUserKey(key);
    }
    return NextResponse.json(geminiNetwork.getNetworkStatus());
  } catch {
    return NextResponse.json(geminiNetwork.getNetworkStatus());
  }
}
