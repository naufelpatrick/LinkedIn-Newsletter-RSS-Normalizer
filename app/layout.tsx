import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "LinkedIn Newsletter RSS Normalizer",
  description: "Normalize LinkedIn newsletter RSS feeds for content importers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
