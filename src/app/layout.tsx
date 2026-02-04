import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TimerProvider } from "@/context/timer-context";
import { SoundProvider } from "@/context/sound-context";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { VolumeIndicator } from "@/components/VolumeIndicator";
import LayoutWrapper from "@/components/layout-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChronosTask - Time Tracking Minimalista",
  description: "Trackea tu tiempo de trabajo de forma simple y efectiva",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-background min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SoundProvider>
            <TimerProvider>
              <VolumeIndicator />
              <LayoutWrapper>
                <Navbar />
              </LayoutWrapper>
              <main className="flex-1 w-full">{children}</main>
              <LayoutWrapper>
                <footer className="border-t py-6 mt-auto">
                  <div className="container mx-auto px-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">
                      ChronosTask
                    </p>
                    <div className="flex items-center gap-4">
                      <ThemeToggle />
                    </div>
                  </div>
                </footer>
              </LayoutWrapper>
              <VolumeIndicator />
            </TimerProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
