import type { Metadata } from "next"
import "./globals.css"
import Navbar from "./nav/Navbar"

export const metadata: Metadata = {
  title: "Carsties",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar></Navbar>
        <main className="container mx-auto px-2 pt-5">{children}</main>
      </body>
    </html>
  )
}
