import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TimeWise - Smart Work Hours & Tax Management',
  description: 'Track your work hours wisely and calculate UK tax with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
