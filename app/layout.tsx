import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StackMatch - Connect with Top Software Providers",
  description: "Find and hire the best software development teams for your projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("🔍 DEBUG: RootLayout rendering")
  console.log("🔍 DEBUG: Environment:", process.env.NODE_ENV)
  console.log("🔍 DEBUG: Next.js version:", process.env.NEXT_RUNTIME || "unknown")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("🔍 DEBUG: HTML head loaded");
              console.log("🔍 DEBUG: User agent:", navigator.userAgent);
              console.log("🔍 DEBUG: Connection:", navigator.connection ? navigator.connection.effectiveType : "unknown");
              
              // Monitor chunk loading errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk')) {
                  console.error("❌ CHUNK ERROR:", e.message);
                  console.error("❌ CHUNK ERROR Source:", e.filename);
                  console.error("❌ CHUNK ERROR Line:", e.lineno);
                  console.error("❌ CHUNK ERROR Stack:", e.error?.stack);
                }
              });
              
              // Monitor unhandled promise rejections (common with chunk loading)
              window.addEventListener('unhandledrejection', function(e) {
                console.error("❌ UNHANDLED REJECTION:", e.reason);
                if (e.reason && e.reason.toString().includes('Loading chunk')) {
                  console.error("❌ CHUNK LOADING REJECTION:", e.reason);
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
