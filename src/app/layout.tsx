import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crypto Investment Toolkit',
  description: 'Strategy, tax, and futures calculators for crypto investing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
