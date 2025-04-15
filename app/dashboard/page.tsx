"use client"

import { useState, useLayoutEffect } from "react"
import {
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BarChart2, BookOpen, TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockTicker } from "@/components/stock-ticker"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for charts
const stockData = [
  { date: "2023-08", AAPL: 180, MSFT: 325, GOOGL: 135, AMZN: 140 },
  { date: "2023-09", AAPL: 178, MSFT: 328, GOOGL: 133, AMZN: 145 },
  { date: "2023-10", AAPL: 175, MSFT: 345, GOOGL: 136, AMZN: 155 },
  { date: "2023-11", AAPL: 185, MSFT: 355, GOOGL: 142, AMZN: 158 },
  { date: "2023-12", AAPL: 188, MSFT: 365, GOOGL: 144, AMZN: 163 },
  { date: "2024-01", AAPL: 185, MSFT: 375, GOOGL: 148, AMZN: 160 },
  { date: "2024-02", AAPL: 182, MSFT: 390, GOOGL: 152, AMZN: 165 },
  { date: "2024-03", AAPL: 187, MSFT: 415, GOOGL: 152, AMZN: 178 },
]

const marketSentiment = [
  { name: "Positive", value: 60, color: "#22c55e" },
  { name: "Neutral", value: 25, color: "#f59e0b" },
  { name: "Negative", value: 15, color: "#ef4444" },
]

const portfolioPerformance = [
  { month: "Jan", return: 2.5 },
  { month: "Feb", return: -1.2 },
  { month: "Mar", return: 3.8 },
  { month: "Apr", return: 1.5 },
  { month: "May", return: -0.8 },
  { month: "Jun", return: 2.2 },
  { month: "Jul", return: 4.1 },
  { month: "Aug", return: 0.5 },
]

const sectorPerformance = [
  { name: "Technology", value: 35 },
  { name: "Healthcare", value: 25 },
  { name: "Finance", value: 15 },
  { name: "Consumer", value: 10 },
  { name: "Energy", value: 8 },
  { name: "Other", value: 7 },
]

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("1M")
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting state to prevent ResizeObserver errors
  useLayoutEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return (
    <div className="flex-1">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor performance, analyze trends, and make data-driven decisions.</p>
        </div>

        <div className="space-y-6">
          {/* Stock Ticker */}
          <StockTicker />

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Market Overview Card */}
            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
                <CardDescription>S&P 500</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">4,682.95</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+1.37%</span>
                    </div>
                  </div>
                  <div className="h-16 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockData}>
                        <Line type="monotone" dataKey="MSFT" stroke="#22c55e" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Portfolio Card */}
            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                <CardDescription>All Assets</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">$248,329.54</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+2.54%</span>
                    </div>
                  </div>
                  <div className="h-16 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={portfolioPerformance.slice(0, 6)}>
                        <Bar dataKey="return" fill="currentColor" className="text-primary fill-current" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Sentiment Card */}
            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                <CardDescription>AI Analysis</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-500">Bullish</div>
                    <div className="text-muted-foreground">Confidence: 78%</div>
                  </div>
                  <div className="h-16 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketSentiment}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={30}
                        >
                          {marketSentiment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performer Card */}
            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                <CardDescription>Today</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">NVDA</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+3.21%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border/60">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Performance Chart */}
          <Card className="relative overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Market Performance</CardTitle>
                <CardDescription>Historical price data for major tech stocks</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {["1W", "1M", "3M", "1Y", "All"].map((period) => (
                  <Button
                    key={period}
                    variant={timeframe === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe(period)}
                    className={timeframe === period ? "bg-primary" : "border-border/60"}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                {isMounted && (
                  <ChartContainer
                    config={{
                      AAPL: {
                        label: "Apple Inc.",
                        color: "hsl(var(--chart-1))",
                      },
                      MSFT: {
                        label: "Microsoft",
                        color: "hsl(var(--chart-2))",
                      },
                      GOOGL: {
                        label: "Alphabet",
                        color: "hsl(var(--chart-3))",
                      },
                      AMZN: {
                        label: "Amazon",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                  >
                    <LineChart data={stockData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.toLocaleString("default", { month: "short" })}`
                        }}
                      />
                      <YAxis tickLine={false} axisLine={false} />
                      <CartesianGrid stroke="#888" strokeDasharray="5 5" opacity={0.2} vertical={false} />
                      <Line type="monotone" dataKey="AAPL" stroke="var(--color-AAPL)" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="MSFT" stroke="var(--color-MSFT)" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="GOOGL" stroke="var(--color-GOOGL)" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="AMZN" stroke="var(--color-AMZN)" strokeWidth={2} dot={false} />
                      <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    </LineChart>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="historical" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="historical" className="group">
                <BarChart2 className="h-4 w-4 mr-2" />
                <span>Historical Data</span>
              </TabsTrigger>
              <TabsTrigger value="predictions" className="group">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>AI Predictions</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="group">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>News Analysis</span>
              </TabsTrigger>
            </TabsList>

            {/* Historical Data Tab */}
            <TabsContent value="historical" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Portfolio Performance */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Portfolio Performance</CardTitle>
                    <CardDescription>Monthly returns over the past year</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[250px]">
                      {isMounted && (
                        <ChartContainer
                          config={{
                            return: {
                              label: "Monthly Return (%)",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                        >
                          <BarChart data={portfolioPerformance} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <CartesianGrid stroke="#888" strokeDasharray="5 5" opacity={0.2} vertical={false} />
                            <Bar dataKey="return" radius={[4, 4, 0, 0]} className="fill-primary" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </BarChart>
                        </ChartContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sector Allocation */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Sector Allocation</CardTitle>
                    <CardDescription>Portfolio distribution by sector</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[250px] flex items-center justify-center">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sectorPerformance}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              fill="#8884d8"
                              className="stroke-background stroke-2"
                              paddingAngle={2}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {sectorPerformance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Predictions Tab */}
            <TabsContent value="predictions" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Stock Price Predictions */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>AI Stock Predictions</CardTitle>
                    <CardDescription>7-day forecast powered by machine learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Apple Prediction */}
                      <div className="rounded-lg border border-border/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">AAPL</div>
                          <div className="flex items-center text-green-500 text-sm">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+2.3% (7-day)</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Confidence: 82%</div>
                          <div className="text-primary">Details →</div>
                        </div>
                      </div>

                      {/* Microsoft Prediction */}
                      <div className="rounded-lg border border-border/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">MSFT</div>
                          <div className="flex items-center text-green-500 text-sm">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+3.8% (7-day)</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Confidence: 78%</div>
                          <div className="text-primary">Details →</div>
                        </div>
                      </div>

                      {/* Google Prediction */}
                      <div className="rounded-lg border border-border/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">GOOGL</div>
                          <div className="flex items-center text-red-500 text-sm">
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                            <span>-1.2% (7-day)</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Confidence: 69%</div>
                          <div className="text-primary">Details →</div>
                        </div>
                      </div>

                      {/* Tesla Prediction */}
                      <div className="rounded-lg border border-border/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">TSLA</div>
                          <div className="flex items-center text-green-500 text-sm">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+5.1% (7-day)</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Confidence: 75%</div>
                          <div className="text-primary">Details →</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Trend Analysis */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Market Trend Analysis</CardTitle>
                    <CardDescription>AI-powered market insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-border/40 p-4">
                        <h4 className="font-medium mb-2">Tech Sector Outlook</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          AI analysis predicts continued growth in the tech sector over the next quarter, with
                          particular strength in semiconductor stocks due to increasing AI adoption.
                        </p>
                        <div className="text-sm text-primary">Full Report →</div>
                      </div>

                      <div className="rounded-lg border border-border/40 p-4">
                        <h4 className="font-medium mb-2">Interest Rate Impact</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our models suggest a 72% probability of a rate cut in the next FOMC meeting, which could boost
                          growth stocks and REITs in the short term.
                        </p>
                        <div className="text-sm text-primary">Full Report →</div>
                      </div>

                      <div className="rounded-lg border border-border/40 p-4">
                        <h4 className="font-medium mb-2">Volatility Forecast</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Market volatility is expected to remain moderate for the coming weeks, with opportunity for
                          strategic buying during periodic dips.
                        </p>
                        <div className="text-sm text-primary">Full Report →</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* News Analysis Tab */}
            <TabsContent value="news" className="space-y-4">
              <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle>AI News Sentiment Analysis</CardTitle>
                  <CardDescription>Market news analyzed by our language models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Federal Reserve Hints at Rate Cuts</h4>
                        <div className="px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded-full">
                          Positive Impact
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Fed Chair Powell suggested that lower inflation numbers could pave the way for interest rate
                        cuts in the coming months.
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">2 hours ago • The Wall Street Journal</div>
                        <div className="text-primary">Read More →</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">NVIDIA Announces New AI Chip</h4>
                        <div className="px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded-full">
                          Positive Impact
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        NVIDIA unveiled its next-generation AI chip, promising 2x performance over previous models,
                        boosting its lead in the AI hardware race.
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">5 hours ago • TechCrunch</div>
                        <div className="text-primary">Read More →</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Apple Supply Chain Constraints</h4>
                        <div className="px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded-full">Negative Impact</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reports indicate Apple may face supply constraints for its upcoming iPhone 16 lineup due to
                        manufacturing challenges.
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">8 hours ago • Bloomberg</div>
                        <div className="text-primary">Read More →</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">New EU Tech Regulations</h4>
                        <div className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-500 rounded-full">
                          Neutral Impact
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        The European Union has announced new tech regulations that may affect operations of major tech
                        companies in the region.
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">12 hours ago • Reuters</div>
                        <div className="text-primary">Read More →</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
