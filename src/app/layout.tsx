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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#f3f6fc] text-slate-800">
        <AuditProvider>{children}</AuditProvider>
      </body>
    </html>
  );
}
