import type React from "react"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SkillSync - Connect with Teammates</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
