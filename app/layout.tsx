import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://linked-in-newsletter-rss-normalizer.vercel.app"),
  title: "LinkedIn Newsletter RSS Normalizer — Open Source",
  description: "Fix encoding, preserve full articles and make existing LinkedIn newsletter RSS feeds work with Substack and other importers.",
  openGraph: { title: "Make newsletter RSS work everywhere.", description: "An open source RSS normalizer for LinkedIn newsletters, Substack and content importers.", type: "website", url: "/" },
  twitter: { card: "summary_large_image", title: "Make newsletter RSS work everywhere.", description: "Open source RSS normalization for LinkedIn newsletters and content importers." }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
