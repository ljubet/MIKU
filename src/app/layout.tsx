import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";
import { LanguageProvider } from "@/lib/language-context";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Linker — Find internships in 60 seconds",
  description:
    "Linker helps candidates discover and apply to internships and jobs faster than ever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900 font-[family-name:var(--font-poppins)]">
        <LanguageProvider>
          <AppProvider>{children}</AppProvider>
        </LanguageProvider>
        <Script
          src="https://widget.easeaccess24.com/sdk.js?key=R3Nm9UmVcX"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
