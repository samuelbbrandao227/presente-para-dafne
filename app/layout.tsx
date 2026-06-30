import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Sacramento } from "next/font/google";
import "./globals.css";

/**
 * Fontes da identidade visual:
 * - Cormorant Garamond: títulos, elegante e delicada (serifada).
 * - Inter: texto corrido, alta legibilidade.
 * - Sacramento: detalhes manuscritos (assinatura, pequenos toques românticos).
 *
 * `display: "swap"` evita texto invisível enquanto a fonte carrega (CLS/performance).
 * `variable` expõe a fonte como CSS var, consumida em globals.css.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Para Você ✨",
  description: "Um presente de aniversário, feito com carinho.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fcfaf8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable} ${sacramento.variable}`}>
      <body className="min-h-dvh bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}