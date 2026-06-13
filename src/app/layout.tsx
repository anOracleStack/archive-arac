import type { Metadata } from "next";
import { outfit } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oidib.io"),
  title: "Archive Arac | Vanguard Weave",
  description:
    "Digital real estate intelligence — curated strands, Silk Analyzer, compare URLs, strand composer, & audit vault. Plain-language explainers beside every bold term.",
  openGraph: {
    title: "Archive Arac | Vanguard Weave",
    description:
      "Curated interface strands, Silk Analyzer, compare URLs, strand composer, & audit vault.",
    type: "website",
    url: "https://oidib.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className={`${outfit.className} antialiased selection:bg-[#E67E22] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
