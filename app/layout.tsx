import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6366f1',
}

export const metadata: Metadata = {
  title: "Endless Runner - Play Now!",
  description: "An exciting endless runner game. Jump over obstacles and beat your high score!",
  metadataBase: new URL('https://endless-runner.vercel.app'),
  keywords: ['game', 'endless runner', 'arcade', 'browser game', 'jumping game'],
  authors: [{ name: 'Endless Runner Team' }],
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  openGraph: {
    title: 'Endless Runner - Play Now!',
    description: 'An exciting endless runner game. Jump over obstacles and beat your high score!',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Endless Runner - Play Now!',
    description: 'An exciting endless runner game. Jump over obstacles and beat your high score!',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
