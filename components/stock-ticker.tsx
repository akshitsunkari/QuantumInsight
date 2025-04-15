"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

// Mock stock data
const initialStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 187.54, change: 1.25 },
  { symbol: "MSFT", name: "Microsoft", price: 415.32, change: -2.18 },
  { symbol: "GOOGL", name: "Alphabet", price: 152.14, change: 0.87 },
  { symbol: "AMZN", name: "Amazon", price: 178.75, change: -1.32 },
  { symbol: "NVDA", name: "NVIDIA", price: 924.67, change: 15.43 },
  { symbol: "META", name: "Meta Platforms", price: 475.21, change: 3.76 },
  { symbol: "TSLA", name: "Tesla", price: 175.21, change: -5.72 },
  { symbol: "V", name: "Visa Inc.", price: 271.45, change: 0.53 },
]

export function StockTicker() {
  const [stocks, setStocks] = useState(initialStocks)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Random small fluctuation (-1% to +1%)
          const fluctuation = (Math.random() * 2 - 1) * stock.price * 0.01
          const newPrice = Number((stock.price + fluctuation).toFixed(2))
          const newChange = Number((stock.change + fluctuation).toFixed(2))

          return {
            ...stock,
            price: newPrice,
            change: newChange,
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full backdrop-blur-sm bg-background/70 border border-border/30 rounded-lg overflow-hidden">
      <div className="overflow-hidden relative">
        <div className="flex gap-8 py-3 px-2 animate-scroll min-w-full whitespace-nowrap">
          {stocks.concat(stocks).map((stock, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="font-bold">{stock.symbol}</span>
              <span className="hidden sm:inline text-muted-foreground">{stock.name}</span>
              <span>${stock.price.toFixed(2)}</span>
              <span className={`flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stock.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(stock.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
