import type { Metadata } from 'next'
import './globals.css'

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
      <body className="bg-escapist-bg text-escapist-text font-sans">
        {children}
      </body>
    </html>
  )
}
