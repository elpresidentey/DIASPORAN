import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Diasporan | Your Ultimate Detty December Guide",
  description: "All-in-one travel, events & lifestyle platform for Africans in the diaspora returning home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f0f23" />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main id="main-content" className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
