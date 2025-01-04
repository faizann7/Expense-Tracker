import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Expensee - Expense Tracker",
  description: "Track and manage your expenses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>
          <ExpenseProvider>
            <div className="flex min-h-screen">
              <aside className="hidden w-64 md:block">
                <Sidebar />
              </aside>
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto p-6">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </ExpenseProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
