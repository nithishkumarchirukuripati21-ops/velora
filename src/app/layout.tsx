import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuditProvider } from '@/context/AuditContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'VELORA - WCAG Accessibility Auditor | A better web, verified.',
  description:
    'Audit your website for accessibility issues with AI-powered analysis and real browser testing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('velora-theme');
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 min-h-screen transition-colors duration-200 flex flex-col font-sans">
        <AuditProvider>{children}</AuditProvider>
      </body>
    </html>
  );
}
