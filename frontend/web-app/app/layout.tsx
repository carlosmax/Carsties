import type { Metadata } from "next"
import "./globals.css"
import Navbar from "./nav/Navbar"
import ToasterProvider from "@/providers/ToasterProvider"
import SignalRProvider from "@/providers/SignalRProvider"
import { getCurrentUser } from "./actions/authActions"

export const metadata: Metadata = {
  title: "Carsties",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <html lang="en">
      <body>
        <ToasterProvider></ToasterProvider>
        <Navbar></Navbar>
        <main className="container mx-auto px-2 pt-5">
          <SignalRProvider user={user}>{children}</SignalRProvider>
        </main>
      </body>
    </html>
  )
}
