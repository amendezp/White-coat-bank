import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
