import type { Metadata } from 'next'
import { Inter, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-pro',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'StackMatch - Intelligent Software Procurement',
  description: 'Transform your B2B software procurement process with expert-guided workflows, AI-powered matching, and secure deal rooms. End the chaos of software buying.',
  keywords: 'B2B software procurement, enterprise software, procurement consulting, software marketplace, deal rooms',
  authors: [{ name: 'StackMatch Team' }],
  openGraph: {
    title: 'StackMatch - Intelligent Software Procurement',
    description: 'Transform your B2B software procurement process with expert-guided workflows and AI-powered matching.',
    url: 'https://stackmatch.io',
    siteName: 'StackMatch',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackMatch - Intelligent Software Procurement',
    description: 'Transform your B2B software procurement process with expert-guided workflows and AI-powered matching.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSans3.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}