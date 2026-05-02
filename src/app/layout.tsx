import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archive Arac | Vanguard Weave",
  description:
    "A standalone exhibit of future-facing interfaces—curated strands, live demos, and the Silk Analyzer. Built for visitors who need context, not jargon, with depth on demand.",
  openGraph: {
    title: "Archive Arac | Vanguard Weave",
    description:
      "Curated interface strands, tactile demos, and a URL analyzer—with plain-language gateways at every section.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-[#E67E22] selection:text-white">
        {children}
      </body>
    </html>
  );
}
