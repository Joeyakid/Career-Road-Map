import type { Metadata } from "next";
import { ThemeProvider, ThemeToggle } from "@/components/ui/theme-provider";
import AuthGate from "@/components/auth/auth-gate";
import "./globals.css";
import "./career-flow.css";
import "./account.css";

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
      <body className="min-h-full flex flex-col"><ThemeProvider><AuthGate>{children}</AuthGate><ThemeToggle /></ThemeProvider></body>
    </html>
  );
}
