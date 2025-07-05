import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

// Dynamically import PWAInstallPrompt to prevent SSR issues
const PWAInstallPrompt = dynamic(() => import("@/components/pwa-install-prompt"), {
  ssr: false, // Disable server-side rendering
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LingslatePal - Language Learning & Translation",
  description:
    "Learn and translate languages with ease. Free translation tools and interactive language learning with 100+ languages including African languages.",
  manifest: "/manifest.json",
  keywords: [
    "language learning",
    "translation",
    "lingslate",
    "education",
    "free translation",
    "African languages",
    "Yoruba",
    "Swahili",
    "language exchange",
    "PWA",
    "offline learning",
  ],
  authors: [{ name: "LingslatePal Team" }],
  creator: "LingslatePal",
  publisher: "LingslatePal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.dev",
  applicationName: "LingslatePal",
  referrer: "origin-when-cross-origin",
  category: "education",
  classification: "Education",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lingslatepal.com",
    siteName: "LingslatePal",
    title: "LingslatePal - Language Learning & Translation",
    description: "Learn and translate languages with ease. Free translation tools and interactive language learning.",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "LingslatePal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LingslatePal - Language Learning & Translation",
    description: "Learn and translate languages with ease. Free translation tools and interactive language learning.",
    images: ["/icon-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  colorScheme: "light", // Moved from metadata
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LingslatePal" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="application-name" content="LingslatePal" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-TileImage" content="/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://libretranslate.com" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <PWAInstallPrompt />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
