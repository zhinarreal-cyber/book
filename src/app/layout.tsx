import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ئەرشیفی کتێب | پێشانگای سەرەکی کتێب",
  description: "پێشانگای نایاب و ناوازەی ئەرشیفی کتێبی کوردی - دیزاینێکی مۆدێرن بۆ گەڕان و بینینی کتێبەکان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
