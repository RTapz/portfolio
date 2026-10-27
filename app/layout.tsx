import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ryan Ofori-Koree | Software Developer",
  description:
    "Portfolio of Ryan Ofori-Koree. Computer Science student, full-stack developer, projects and contact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-black antialiased text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
