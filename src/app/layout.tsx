import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://archive-arac.vercel.app"),
  title: "Archive Arac | Vanguard Weave",
  description:
    "Web intelligence platform — curated strands, Silk Analyzer, compare URLs, strand composer, & audit vault. Plain-language explainers beside every bold term.",
  openGraph: {
    title: "Archive Arac | Vanguard Weave",
    description:
      "Curated interface strands, Silk Analyzer, compare URLs, strand composer, & audit vault.",
    type: "website",
    url: "https://archive-arac.vercel.app",
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
