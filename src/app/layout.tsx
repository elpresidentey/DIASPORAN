import type { Metadata } from "next";
import { Cabin } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationProgress from "@/components/NavigationProgress";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { QueryProvider } from "@/components/QueryProvider";
import { DataPrefetcher } from "@/components/DataPrefetcher";
import { PrefetchLinks } from "@/components/PrefetchLinks";

// Optimize font loading
const cabin = Cabin({
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT (Flash of Invisible Text)
  preload: true,
  variable: '--font-cabin',
});

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
    <html lang="en" suppressHydrationWarning className={cabin.variable}>
      <head>
        <meta name="theme-color" content="#0f0f23" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col transition-colors duration-300">
        <QueryProvider>
          <DataPrefetcher />
          <PrefetchLinks />
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <SmoothScrollProvider duration={600} offset={80}>
                  <NavigationProgress />
                  <Navbar />
                  <main id="main-content" className="flex-grow pt-16">
                    {children}
                  </main>
                  <Footer />
                </SmoothScrollProvider>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
