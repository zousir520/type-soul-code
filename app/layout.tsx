import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Type Soul Codes - The Escapist',
  description: 'All working Type Soul codes for August 2025 - Complete guide with redemption instructions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="bg-escapist-bg text-escapist-text font-sans">
        {children}
      </body>
    </html>
  )
}
