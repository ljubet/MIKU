import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Miku — Find internships in 60 seconds",
  description:
    "Miku helps students discover and apply to internships and jobs faster than ever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900 font-[family-name:var(--font-poppins)]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
