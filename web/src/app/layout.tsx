import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

/**
 * Archivo carries the display voice: a grotesque with squarer terminals and
 * tighter apertures than Inter, which reads as trackside signage at headline
 * scale. Inter handles UI text, where neutrality is the point.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Itzfizz — Welcome",
  description:
    "Itzfizz pick-up point network: fewer failed deliveries, fewer support calls, lower cost per parcel.",
};

export const viewport: Viewport = {
  themeColor: "#d2d2d2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
