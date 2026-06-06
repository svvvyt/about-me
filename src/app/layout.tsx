import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Svyat Korolyov — Frontend Developer',
  description: 'Frontend developer building interfaces people remember.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
