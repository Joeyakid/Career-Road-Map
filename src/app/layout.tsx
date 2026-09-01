import type { Metadata } from "next";
import { ThemeProvider, ThemeToggle } from "@/components/ui/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathForge — Build your career path",
  description: "A focused career development and learning roadmap platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col"><ThemeProvider>{children}<ThemeToggle /></ThemeProvider></body>
    </html>
  );
}
