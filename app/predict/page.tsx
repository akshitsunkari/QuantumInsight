"use client"

import { useEffect, useState, useRef } from "react"
import {
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart,
  BadgeInfo,
  Info,
  Loader2,
  ArrowDownUp,
  ChevronDown,
  BookOpen,
  LucideLineChart,
  BarChart3,
  Clipboard,
  Braces,
  Briefcase,
  Landmark,
  BrainCircuit,
} from "lucide-react"
import { Area, AreaChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Mock prediction data
const generatePredictionData = (baseline: number, days: number, trend: "up" | "down" | "volatile") => {
  const data = []
  let currentPrice = baseline

  for (let i = 0; i < days; i++) {
    let change = 0

    if (trend === "up") {
      // Upward trend with some volatility
      change = (Math.random() * 2 - 0.5) * baseline * 0.01
    } else if (trend === "down") {
      // Downward trend with some volatility
      change = (Math.random() * 2 - 1.5) * baseline * 0.01
    } else {
      // Volatile/sideways with larger swings
      change = (Math.random() * 6 - 3) * baseline * 0.01
    }

    currentPrice = Number((currentPrice + change).toFixed(2))

    data.push({
      day: i + 1,
      price: currentPrice,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    })
  }

  return data
}

// News sentiment data
const newsSentiment = [
  { source: "Financial Times", sentiment: 0.8, title: "Tech sector poised for growth amid AI advancements" },
  { source: "Wall Street Journal", sentiment: 0.6, title: "Positive outlook for semiconductor industry" },
  { source: "Bloomberg", sentiment: 0.5, title: "Markets respond to global economic indicators" },
  { source: "CNBC", sentiment: 0.3, title: "Consumer spending slows amid inflation concerns" },
  { source: "Reuters", sentiment: 0.7, title: "Tech companies report stronger than expected earnings" },
]

const monthlyPredictions = [
  { month: "Jan", price: 430 },
  { month: "Feb", price: 448 },
  { month: "Mar", price: 470 },
  { month: "Apr", price: 452 },
  { month: "May", price: 490 },
  { month: "Jun", price: 520 },
  { month: "Jul", price: 555 },
  { month: "Aug", price: 580 },
  { month: "Sep", price: 610 },
  { month: "Oct", price: 640 },
  { month: "Nov", price: 670 },
  { month: "Dec", price: 710 },
]

const sectors = [
  { id: "tech", name: "Technology" },
  { id: "finance", name: "Financial Services" },
  { id: "healthcare", name: "Healthcare" },
  { id: "energy", name: "Energy" },
  { id: "consumer", name: "Consumer Goods" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "transport", name: "Transportation" },
]

const stocks = {
  tech: [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com, Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "META", name: "Meta Platforms, Inc." },
  ],
  finance: [
    { symbol: "JPM", name: "JPMorgan Chase & Co." },
    { symbol: "BAC", name: "Bank of America Corporation" },
    { symbol: "WFC", name: "Wells Fargo & Company" },
    { symbol: "GS", name: "The Goldman Sachs Group, Inc." },
    { symbol: "MS", name: "Morgan Stanley" },
  ],
  healthcare: [
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "PFE", name: "Pfizer Inc." },
    { symbol: "UNH", name: "UnitedHealth Group Incorporated" },
    { symbol: "MRK", name: "Merck & Co., Inc." },
    { symbol: "ABBV", name: "AbbVie Inc." },
  ],
}

// Custom hook to handle ResizeObserver errors
function useResizeObserverErrorHandler() {
  useEffect(() => {
    // Create a handler for the error
    const handleError = (event) => {
      if (
        event.message === "ResizeObserver loop limit exceeded" ||
        event.message === "ResizeObserver loop completed with undelivered notifications."
      ) {
        // Prevent the error from being displayed in the console
        event.stopImmediatePropagation()
      }
    }

    // Add the event listener
    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleError)

    // Clean up
    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleError)
    }
  }, [])
}

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [predictionData, setPredictionData] = useState(null)
  const [selectedSector, setSelectedSector] = useState("tech")
  const [selectedStock, setSelectedStock] = useState(stocks.tech[0].symbol)
  const [predictionTimeframe, setPredictionTimeframe] = useState("short")
  const [activeTab, setActiveTab] = useState("metrics")
  const [chartsReady, setChartsReady] = useState(false)
  const chartRefs = useRef({
    mainChart: null,
    monthlyChart: null,
  })

  // Use the custom hook to handle ResizeObserver errors
  useResizeObserverErrorHandler()

  // Debounced chart rendering
  useEffect(() => {
    // Delay chart rendering to avoid ResizeObserver issues
    const timer = setTimeout(() => {
      setChartsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handlePrediction = () => {
    setIsLoading(true)
    setChartsReady(false) // Reset charts when making a new prediction

    // Simulate API call delay
    setTimeout(() => {
      // Generate prediction data based on selected stock
      const basePrice =
        selectedStock === "AAPL"
          ? 187
          : selectedStock === "MSFT"
            ? 415
            : selectedStock === "GOOGL"
              ? 152
              : selectedStock === "NVDA"
                ? 924
                : selectedStock === "AMZN"
                  ? 178
                  : 200 + Math.random() * 300

      const days = predictionTimeframe === "short" ? 7 : 30
      const trend = Math.random() > 0.7 ? "down" : "up"

      setPredictionData({
        symbol: selectedStock,
        name: stocks[selectedSector].find((s) => s.symbol === selectedStock)?.name || "Stock",
        shortTerm: generatePredictionData(basePrice, 7, trend),
        longTerm: generatePredictionData(basePrice, 30, trend),
        currentPrice: basePrice,
        priceTarget: Number((basePrice * (1 + (trend === "up" ? 0.15 : -0.08))).toFixed(2)),
        sentiment: trend === "up" ? "Bullish" : "Bearish",
        confidence: Math.floor(60 + Math.random() * 30),
        volatility: Math.floor(20 + Math.random() * 40),
        riskScore: Math.floor(30 + Math.random() * 40),
      })

      setIsLoading(false)

      // Delay chart rendering to avoid ResizeObserver issues
      setTimeout(() => {
        setChartsReady(true)
      }, 100)
    }, 2000)
  }

  // Auto-predict on initial load
  useEffect(() => {
    handlePrediction()
  }, [])

  return (
    <div className="flex-1">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">AI Stock Predictions</h1>
          <p className="text-muted-foreground">Get AI-powered stock price predictions and insights</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {/* Input Form */}
            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-10 blur"></div>
              <CardHeader className="relative pb-2">
                <CardTitle>Predict Stock Performance</CardTitle>
                <CardDescription>Enter a stock symbol or search by company name</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                      <div className="space-y-2">
                        <Label htmlFor="sector">Sector</Label>
                        <Select value={selectedSector} onValueChange={setSelectedSector}>
                          <SelectTrigger id="sector" className="w-full">
                            <SelectValue placeholder="Select sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectors.map((sector) => (
                              <SelectItem key={sector.id} value={sector.id}>
                                {sector.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Select value={selectedStock} onValueChange={setSelectedStock}>
                          <SelectTrigger id="stock" className="w-full">
                            <SelectValue placeholder="Select stock" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedSector &&
                              stocks[selectedSector]?.map((stock) => (
                                <SelectItem key={stock.symbol} value={stock.symbol}>
                                  {stock.symbol} - {stock.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeframe">Timeframe</Label>
                        <Select value={predictionTimeframe} onValueChange={setPredictionTimeframe}>
                          <SelectTrigger id="timeframe" className="w-full">
                            <SelectValue placeholder="Timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short-Term (7 days)</SelectItem>
                            <SelectItem value="long">Long-Term (30 days)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handlePrediction}
                      disabled={isLoading}
                      className="group relative overflow-hidden h-10 w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-opacity group-hover:opacity-100 opacity-80"></div>
                      <span className="relative flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Predict Now
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prediction Results */}
            {predictionData && (
              <div className="space-y-6">
                {/* Price Chart */}
                <Card className="relative backdrop-blur-sm bg-background/60 border-border/40 shadow-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <CardTitle>
                          {predictionData.symbol} - {predictionData.name}
                        </CardTitle>
                        <CardDescription>AI-powered price prediction</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">${predictionData.currentPrice.toFixed(2)}</div>
                        <div
                          className={`flex items-center text-sm ${predictionData.priceTarget > predictionData.currentPrice ? "text-green-500" : "text-red-500"}`}
                        >
                          {predictionData.priceTarget > predictionData.currentPrice ? (
                            <>
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span>
                                +{((predictionData.priceTarget / predictionData.currentPrice - 1) * 100).toFixed(2)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 mr-1" />
                              <span>
                                {((predictionData.priceTarget / predictionData.currentPrice - 1) * 100).toFixed(2)}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pb-4">
                    {/* Chart */}
                    <div className="h-[300px] w-full" ref={(el) => (chartRefs.current.mainChart = el)}>
                      {chartsReady && (
                        <ChartContainer
                          config={{
                            price: {
                              label: "Price",
                              color:
                                predictionData.priceTarget > predictionData.currentPrice
                                  ? "hsl(142.1, 76.2%, 36.3%)"
                                  : "hsl(0, 84.2%, 60.2%)",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={
                                predictionTimeframe === "short" ? predictionData.shortTerm : predictionData.longTerm
                              }
                              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            >
                              <CartesianGrid stroke="#888" strokeDasharray="5 5" opacity={0.2} vertical={false} />
                              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                              <YAxis
                                type="number"
                                domain={["auto", "auto"]}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                              />
                              <Tooltip
                                formatter={(value) => [`$${value}`, "Price"]}
                                labelFormatter={(label) => `Date: ${label}`}
                                contentStyle={{
                                  borderRadius: "0.375rem",
                                  border: "1px solid rgba(255, 255, 255, 0.2)",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                }}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop
                                    offset="0%"
                                    stopColor={
                                      predictionData.priceTarget > predictionData.currentPrice
                                        ? "rgb(34, 197, 94)"
                                        : "rgb(239, 68, 68)"
                                    }
                                    stopOpacity={0.4}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={
                                      predictionData.priceTarget > predictionData.currentPrice
                                        ? "rgb(34, 197, 94)"
                                        : "rgb(239, 68, 68)"
                                    }
                                    stopOpacity={0.05}
                                  />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke="var(--color-price)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#gradient)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Tabs */}
                <Tabs defaultValue="metrics" className="space-y-4" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                    <TabsTrigger value="metrics" className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      <span>Key Metrics</span>
                    </TabsTrigger>
                    <TabsTrigger value="sentiment" className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>News Sentiment</span>
                    </TabsTrigger>
                    <TabsTrigger value="longterm" className="flex items-center gap-1">
                      <LucideLineChart className="h-4 w-4" />
                      <span>Long-Term</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Key Metrics Tab */}
                  <TabsContent value="metrics">
                    <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                      <CardHeader>
                        <CardTitle>AI Analysis Metrics</CardTitle>
                        <CardDescription>Key metrics derived from our machine learning models</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                          {/* AI Confidence */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                <BadgeInfo className="h-3.5 w-3.5" />
                                <span>AI Confidence</span>
                              </div>
                              <div className="font-medium">{predictionData.confidence}%</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                style={{ width: `${predictionData.confidence}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Model confidence in the prediction</p>
                          </div>

                          {/* Volatility Index */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                <ArrowDownUp className="h-3.5 w-3.5" />
                                <span>Volatility Index</span>
                              </div>
                              <div className="font-medium">{predictionData.volatility}%</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-yellow-500"
                                style={{ width: `${predictionData.volatility}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Expected price fluctuations</p>
                          </div>

                          {/* Risk Score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                <ChevronDown className="h-3.5 w-3.5" />
                                <span>Risk Score</span>
                              </div>
                              <div className="font-medium">{predictionData.riskScore}%</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${
                                  predictionData.riskScore < 30
                                    ? "bg-green-500"
                                    : predictionData.riskScore < 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${predictionData.riskScore}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Overall investment risk assessment</p>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">AI Insights</h3>

                          <div className="rounded-lg border border-border/40 p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              Price Target Analysis
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Our AI predicts a {predictionTimeframe === "short" ? "7-day" : "30-day"} price target of
                              <span
                                className={`font-semibold ${predictionData.priceTarget > predictionData.currentPrice ? "text-green-500" : "text-red-500"}`}
                              >
                                {" "}
                                ${predictionData.priceTarget}{" "}
                              </span>
                              for {predictionData.symbol}, representing a
                              <span
                                className={`font-semibold ${predictionData.priceTarget > predictionData.currentPrice ? "text-green-500" : "text-red-500"}`}
                              >
                                {" "}
                                {predictionData.priceTarget > predictionData.currentPrice ? "+" : ""}
                                {((predictionData.priceTarget / predictionData.currentPrice - 1) * 100).toFixed(2)}%{" "}
                              </span>
                              change from the current price of ${predictionData.currentPrice.toFixed(2)}. The prediction
                              has a confidence level of {predictionData.confidence}%.
                            </p>
                          </div>

                          <div className="rounded-lg border border-border/40 p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-1">
                              <BarChart3 className="h-4 w-4 text-primary" />
                              Technical Indicators
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Technical analysis indicators suggest a {predictionData.sentiment.toLowerCase()} outlook.
                              The stock is showing {predictionData.volatility > 50 ? "high" : "moderate"} volatility
                              with a{predictionData.riskScore > 50 ? " high" : " moderate"} risk profile.
                              {predictionData.priceTarget > predictionData.currentPrice
                                ? " Moving averages indicate positive momentum with potential support levels established at recent lows."
                                : " Moving averages suggest downward pressure with potential resistance at recent highs."}
                            </p>
                          </div>

                          <div className="rounded-lg border border-border/40 p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-1">
                              <Clipboard className="h-4 w-4 text-primary" />
                              Recommendation
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Based on our AI analysis, we{" "}
                              {predictionData.priceTarget > predictionData.currentPrice &&
                              predictionData.confidence > 70
                                ? "recommend considering this stock for potential opportunities, given the positive price trajectory and high confidence level."
                                : predictionData.priceTarget > predictionData.currentPrice
                                  ? "suggest monitoring this stock for potential opportunities, though exercise caution due to moderate confidence levels."
                                  : "suggest caution with this stock in the short term, as our models indicate potential downside risk."}
                              Always consider your investment goals and risk tolerance before making investment
                              decisions.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* News Sentiment Tab */}
                  <TabsContent value="sentiment">
                    <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                      <CardHeader>
                        <CardTitle>News Sentiment Analysis</CardTitle>
                        <CardDescription>
                          AI analysis of recent news articles about {predictionData.symbol}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Overall Sentiment */}
                            <div className="rounded-lg border border-border/40 p-4 text-center">
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">Overall Sentiment</h3>
                              <div
                                className={`text-xl font-bold ${
                                  predictionData.sentiment === "Bullish" ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {predictionData.sentiment}
                              </div>
                            </div>

                            {/* Article Count */}
                            <div className="rounded-lg border border-border/40 p-4 text-center">
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">Articles Analyzed</h3>
                              <div className="text-xl font-bold">38</div>
                            </div>

                            {/* Sentiment Score */}
                            <div className="rounded-lg border border-border/40 p-4 text-center">
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">Sentiment Score</h3>
                              <div className="text-xl font-bold">0.76</div>
                              <p className="text-xs text-muted-foreground">Scale: -1 to 1</p>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h3 className="font-semibold">Recent News Articles</h3>

                            <div className="space-y-4">
                              {newsSentiment.map((news, index) => (
                                <div key={index} className="rounded-lg border border-border/40 p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{news.title}</h4>
                                    <div
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        news.sentiment > 0.7
                                          ? "bg-green-500/10 text-green-500"
                                          : news.sentiment > 0.4
                                            ? "bg-yellow-500/10 text-yellow-500"
                                            : "bg-red-500/10 text-red-500"
                                      }`}
                                    >
                                      {news.sentiment > 0.7
                                        ? "Positive"
                                        : news.sentiment > 0.4
                                          ? "Neutral"
                                          : "Negative"}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="text-muted-foreground">{news.source}</div>
                                    <Button variant="ghost" size="sm" className="text-primary">
                                      Read Full Article
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-lg border border-border/40 p-4">
                            <h3 className="font-semibold mb-2">Key Topics & Themes</h3>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { name: "Earnings", count: 12 },
                                { name: "Market Share", count: 8 },
                                { name: "Product Launch", count: 7 },
                                { name: "Innovation", count: 6 },
                                { name: "Competition", count: 5 },
                                { name: "Regulatory", count: 4 },
                                { name: "Leadership", count: 3 },
                              ].map((topic, index) => (
                                <div key={index} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                  {topic.name} ({topic.count})
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Long-Term Tab */}
                  <TabsContent value="longterm">
                    <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                      <CardHeader>
                        <CardTitle>Long-Term Forecast</CardTitle>
                        <CardDescription>12-month price projections and analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Chart */}
                          <div className="rounded-lg border border-border/40 p-4">
                            <h3 className="font-semibold mb-4">12-Month Price Projection</h3>
                            <div className="h-[300px] w-full" ref={(el) => (chartRefs.current.monthlyChart = el)}>
                              {chartsReady && activeTab === "longterm" && (
                                <ChartContainer
                                  config={{
                                    price: {
                                      label: "Price",
                                      color: "hsl(var(--chart-1))",
                                    },
                                  }}
                                >
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={monthlyPredictions}
                                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                    >
                                      <CartesianGrid
                                        stroke="#888"
                                        strokeDasharray="5 5"
                                        opacity={0.2}
                                        vertical={false}
                                      />
                                      <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                      />
                                      <YAxis
                                        type="number"
                                        domain={["auto", "auto"]}
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                      />
                                      <Tooltip
                                        formatter={(value) => [`$${value}`, "Projected Price"]}
                                        labelFormatter={(label) => `Month: ${label}`}
                                        contentStyle={{
                                          borderRadius: "0.375rem",
                                          border: "1px solid rgba(255, 255, 255, 0.2)",
                                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        }}
                                      />
                                      <Bar dataKey="price" fill="var(--color-price)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </ChartContainer>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-semibold">Long-Term Analysis</h3>

                            <div className="rounded-lg border border-border/40 p-4">
                              <h4 className="font-medium mb-2 flex items-center gap-1">
                                <Braces className="h-4 w-4 text-primary" />
                                Fundamental Analysis
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {predictionData.symbol}'s long-term outlook is supported by strong fundamentals,
                                including
                                {predictionData.priceTarget > predictionData.currentPrice
                                  ? " robust revenue growth, expanding profit margins, and increasing market share in key segments."
                                  : " consistent revenue, though with pressure on profit margins due to increasing competition and market saturation."}
                                The company's P/E ratio is
                                {predictionData.priceTarget > predictionData.currentPrice
                                  ? " currently in line with the sector average, suggesting reasonable valuation given its growth prospects."
                                  : " currently above the sector average, suggesting potential overvaluation compared to peers."}
                              </p>
                            </div>

                            <div className="rounded-lg border border-border/40 p-4">
                              <h4 className="font-medium mb-2 flex items-center gap-1">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Growth Catalysts
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Key growth drivers for {predictionData.symbol} include
                                {predictionData.symbol === "AAPL"
                                  ? " expansion in services revenue, continued strength in the premium smartphone market, and potential new product categories like AR/VR."
                                  : predictionData.symbol === "MSFT"
                                    ? " cloud services growth through Azure, expanding enterprise software adoption, and AI integration across its product suite."
                                    : predictionData.symbol === "GOOGL"
                                      ? " digital advertising recovery, YouTube growth, and expanding cloud market share with AI-enhanced offerings."
                                      : predictionData.symbol === "NVDA"
                                        ? " accelerating AI chip demand, data center growth, and expanding use cases in automotive and robotics."
                                        : " product innovation, market expansion, and strategic acquisitions in high-growth segments."}
                                These factors contribute to our
                                {predictionData.priceTarget > predictionData.currentPrice ? " positive" : " cautious"}
                                long-term outlook.
                              </p>
                            </div>

                            <div className="rounded-lg border border-border/40 p-4">
                              <h4 className="font-medium mb-2 flex items-center gap-1">
                                <Landmark className="h-4 w-4 text-primary" />
                                Market Position
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {predictionData.symbol} maintains a
                                {predictionData.symbol === "AAPL" ||
                                predictionData.symbol === "MSFT" ||
                                predictionData.symbol === "GOOGL" ||
                                predictionData.symbol === "NVDA"
                                  ? " dominant"
                                  : " competitive"}
                                position in its core markets, with
                                {predictionData.priceTarget > predictionData.currentPrice
                                  ? " strong brand recognition and customer loyalty providing resilience against competitive threats."
                                  : " increasing competition putting pressure on market share in key segments."}
                                Industry trends including
                                {predictionData.symbol === "AAPL"
                                  ? " digital transformation and premium consumer electronics demand"
                                  : predictionData.symbol === "MSFT"
                                    ? " cloud computing and enterprise digital transformation"
                                    : predictionData.symbol === "GOOGL"
                                      ? " digital advertising growth and AI-powered services"
                                      : predictionData.symbol === "NVDA"
                                        ? " AI acceleration and advanced computing demands"
                                        : " technology adoption and digitalization"}
                                {predictionData.priceTarget > predictionData.currentPrice
                                  ? " align favorably with the company's strategic direction."
                                  : " present both opportunities and challenges for the company's strategic direction."}
                              </p>
                            </div>

                            <div className="rounded-lg border border-border/40 p-4">
                              <h4 className="font-medium mb-2 flex items-center gap-1">
                                <Info className="h-4 w-4 text-primary" />
                                12-Month Price Target
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Our AI models project a 12-month price target of
                                <span className="font-semibold">
                                  {" "}
                                  ${monthlyPredictions[monthlyPredictions.length - 1].price}
                                </span>
                                for {predictionData.symbol}, representing a
                                <span
                                  className={`font-semibold ${monthlyPredictions[monthlyPredictions.length - 1].price > predictionData.currentPrice ? "text-green-500" : "text-red-500"}`}
                                >
                                  {" "}
                                  {monthlyPredictions[monthlyPredictions.length - 1].price > predictionData.currentPrice
                                    ? "+"
                                    : ""}
                                  {(
                                    (monthlyPredictions[monthlyPredictions.length - 1].price /
                                      predictionData.currentPrice -
                                      1) *
                                    100
                                  ).toFixed(2)}
                                  %{" "}
                                </span>
                                change from the current price. This forecast has a
                                <span className="font-semibold"> {Math.floor(50 + Math.random() * 20)}%</span>{" "}
                                confidence level and considers macroeconomic factors, sector trends, and
                                company-specific growth drivers.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help Card */}
            <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Our AI prediction system explained</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BarChart className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Data Analysis</div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Our system analyzes historical market data, fundamental metrics, and technical indicators.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Sentiment Analysis</div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    We process news articles, social media, and financial reports to gauge market sentiment.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BrainCircuit className="h-4 w-4" />
                    </div>
                    <div className="font-medium">AI Prediction</div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Advanced machine learning models generate price forecasts with confidence scores.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Regular Updates</div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Predictions are automatically updated with new market data and events.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More About Our AI
                </Button>
              </CardFooter>
            </Card>

            {/* Popular Stocks */}
            <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Popular Stocks</CardTitle>
                <CardDescription>Frequently analyzed stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSector("tech")
                      setSelectedStock("AAPL")
                      handlePrediction()
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium">AAPL</div>
                      <div className="text-sm text-muted-foreground">Apple Inc.</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSector("tech")
                      setSelectedStock("NVDA")
                      handlePrediction()
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium">NVDA</div>
                      <div className="text-sm text-muted-foreground">NVIDIA Corp.</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSector("tech")
                      setSelectedStock("MSFT")
                      handlePrediction()
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium">MSFT</div>
                      <div className="text-sm text-muted-foreground">Microsoft Corp.</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSector("tech")
                      setSelectedStock("GOOGL")
                      handlePrediction()
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium">GOOGL</div>
                      <div className="text-sm text-muted-foreground">Alphabet Inc.</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full mt-2">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
