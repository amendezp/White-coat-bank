import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "White Coat Bank | Banking Built for Physicians",
  description:
    "The only bank that underwrites your future, not just your credit score. Premium banking built exclusively for doctors and medical professionals.",
  keywords: [
    "doctor bank",
    "physician banking",
    "medical professional finance",
    "resident loans",
    "doctor credit card",
    "malpractice insurance",
    "white coat bank",
  ],
  openGraph: {
    title: "White Coat Bank | Banking Built for Physicians",
    description:
      "You didn't spend 12 years in training for a generic bank. Join the waitlist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
