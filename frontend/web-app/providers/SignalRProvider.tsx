"use client"

import { getDetailedViewData } from "@/app/actions/auctionActions"
import AuctionCreatedToast from "@/app/components/AuctionCreatedToast"
import AuctionFinishedToast from "@/app/components/AuctionFinishedToast"
import { useAuctionStore } from "@/app/hooks/useAuctionStore"
import { useBidStore } from "@/app/hooks/useBidStore"
import { Auction, AuctionFinished, Bid } from "@/types"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { User } from "next-auth"
import { ReactNode, useEffect, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  user: User | null
  children: ReactNode
}

export default function SignalRProvider({ user, children }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice)
  const addBid = useBidStore((state) => state.addBid)
  const apiUrl =
    process.env.NODE_ENV === "production" ? "https://api.carsties/notifications" : process.env.NEXT_PUBLIC_NOTIFY_URL

  useEffect(() => {
    const newConnection = new HubConnectionBuilder().withUrl(apiUrl!).withAutomaticReconnect().build()

    setConnection(newConnection)
  }, [apiUrl])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to notification hub")

          connection.on("BidPlaced", (bid: Bid) => {
            console.log("Bid placed event received")

            if (bid.status.includes("Accepted")) {
              setCurrentPrice(bid.auctionId, bid.amount)
            }
            addBid(bid)
          })

          connection.on("AuctionCreated", (auction: Auction) => {
            if (user?.username !== auction.seller) {
              return toast(<AuctionCreatedToast auction={auction} />, { duration: 5000 })
            }
          })

          connection.on("AuctionFinished", (finishedAuction: AuctionFinished) => {
            const auction = getDetailedViewData(finishedAuction.auctionId)
            return toast.promise(
              auction,
              {
                loading: "Loading",
                success: (auction) => <AuctionFinishedToast finishedAuction={finishedAuction} auction={auction} />,
                error: (err) => "Auction finished!",
              },
              { success: { duration: 5000, icon: null } }
            )
          })
        })
        .catch((error) => console.log(error))
    }

    return () => {
      connection?.stop()
    }
  }, [addBid, connection, setCurrentPrice, user?.username])

  return children
}
