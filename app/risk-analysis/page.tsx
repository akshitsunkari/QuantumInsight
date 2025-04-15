"use client"

import { useState, useEffect, useRef } from "react"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Plus,
  Sliders,
  BarChart,
  LucideLineChart,
  PieChart,
} from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for Risk Analysis
const portfolioRiskData = [
  { name: "Market Risk", value: 65, color: "#ef4444" },
  { name: "Sector Risk", value: 45, color: "#f59e0b" },
  { name: "Company Risk", value: 35, color: "#22c55e" },
  { name: "Volatility", value: 55, color: "#0ea5e9" },
]

const riskScoreHistory = [
  { month: "Jan", score: 42 },
  { month: "Feb", score: 48 },
  { month: "Mar", score: 52 },
  { month: "Apr", score: 47 },
  { month: "May", score: 53 },
  { month: "Jun", score: 59 },
  { month: "Jul", score: 64 },
  { month: "Aug", score: 58 },
]

const sectorRiskData = [
  { name: "Technology", risk: 72, return: 18 },
  { name: "Financial", risk: 58, return: 12 },
  { name: "Healthcare", risk: 45, return: 9 },
  { name: "Consumer", risk: 38, return: 8 },
  { name: "Energy", risk: 65, return: 14 },
  { name: "Utilities", risk: 25, return: 5 },
]

const stockRiskData = [
  { symbol: "AAPL", name: "Apple Inc.", riskScore: 42, volatility: 28, momentum: 76 },
  { symbol: "MSFT", name: "Microsoft Corp.", riskScore: 38, volatility: 25, momentum: 82 },
  { symbol: "GOOGL", name: "Alphabet Inc.", riskScore: 45, volatility: 32, momentum: 68 },
  { symbol: "AMZN", name: "Amazon.com Inc.", riskScore: 51, volatility: 36, momentum: 74 },
  { symbol: "NVDA", name: "NVIDIA Corp.", riskScore: 68, volatility: 52, momentum: 88 },
  { symbol: "META", name: "Meta Platforms", riskScore: 56, volatility: 42, momentum: 64 },
  { symbol: "TSLA", name: "Tesla Inc.", riskScore: 78, volatility: 65, momentum: 72 },
  { symbol: "JPM", name: "JPMorgan Chase", riskScore: 44, volatility: 31, momentum: 58 },
]

const riskFactorComparisonData = [
  { name: "Market Beta", portfolio: 1.2, benchmark: 1.0 },
  { name: "Volatility", portfolio: 18.5, benchmark: 15.2 },
  { name: "Sharpe Ratio", portfolio: 1.8, benchmark: 1.5 },
  { name: "Drawdown", portfolio: 12.3, benchmark: 10.8 },
  { name: "VaR (95%)", portfolio: 2.4, benchmark: 2.1 },
]

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

export default function RiskAnalysisPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [chartsReady, setChartsReady] = useState(false)
  const chartRefs = useRef({
    riskHistory: null,
    riskBreakdown: null,
    sectorRisk: null,
    riskReturn: null,
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

  // Calculate the overall risk score as the average of all risk factors
  const overallRiskScore = Math.round(
    portfolioRiskData.reduce((acc, item) => acc + item.value, 0) / portfolioRiskData.length,
  )

  // Determine risk level based on score
  const getRiskLevel = (score) => {
    if (score < 30) return { level: "Low", color: "green", icon: CheckCircle }
    if (score < 60) return { level: "Moderate", color: "yellow", icon: AlertCircle }
    return { level: "High", color: "red", icon: AlertTriangle }
  }

  const riskLevel = getRiskLevel(overallRiskScore)

  return (
    <div className="flex-1">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Risk Analysis</h1>
          <p className="text-muted-foreground">Comprehensive risk assessment and portfolio analysis</p>
        </div>

        <div className="space-y-6">
          {/* Risk Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm col-span-full md:col-span-2">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-10 blur"></div>
              <CardHeader className="relative pb-2">
                <CardTitle>Overall Risk Assessment</CardTitle>
                <CardDescription>AI-powered analysis of your portfolio risk factors</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted opacity-25"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray="377"
                          strokeDashoffset={377 - (377 * overallRiskScore) / 100}
                          className={`text-${riskLevel.color}-500 transition-all duration-1000 ease-in-out transform origin-center -rotate-90`}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{overallRiskScore}</span>
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                      </div>
                    </div>
                    <div className={`mt-4 flex items-center gap-1 text-${riskLevel.color}-500 font-medium`}>
                      <riskLevel.icon className="h-5 w-5" />
                      <span>{riskLevel.level} Risk</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {portfolioRiskData.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-2" indicatorColor={item.color} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm md:col-span-1">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-10 blur"></div>
              <CardHeader className="relative pb-2">
                <CardTitle className="text-sm font-medium">Market Volatility</CardTitle>
                <CardDescription>Current Market Conditions</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">Medium</div>
                    <div className="flex items-center text-yellow-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>52% Indicator</span>
                    </div>
                  </div>
                  <div className="h-16 w-16">
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={riskScoreHistory.slice(-5)}>
                          <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative group overflow-hidden backdrop-blur-sm bg-background/60 border-border/40 shadow-sm md:col-span-1">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-10 blur"></div>
              <CardHeader className="relative pb-2">
                <CardTitle className="text-sm font-medium">Risk-Adjusted Return</CardTitle>
                <CardDescription>Sharpe Ratio</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">1.82</div>
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Above Average</span>
                    </div>
                  </div>
                  <div className="h-16 w-16 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="sectors" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span>Sector Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="stocks" className="flex items-center gap-1">
                <LucideLineChart className="h-4 w-4" />
                <span>Stock Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-1">
                <Sliders className="h-4 w-4" />
                <span>Comparisons</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Risk Score History Chart */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Risk Score History</CardTitle>
                    <CardDescription>8-month historical risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px]" ref={(el) => (chartRefs.current.riskHistory = el)}>
                      {chartsReady && selectedTab === "overview" && (
                        <ChartContainer
                          config={{
                            score: {
                              label: "Risk Score",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={riskScoreHistory}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid stroke="#888" strokeDasharray="5 5" opacity={0.2} vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke="var(--color-score)"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                              />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Breakdown */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Risk Breakdown</CardTitle>
                    <CardDescription>Contribution of risk factors to overall score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="h-[300px] flex items-center justify-center"
                      ref={(el) => (chartRefs.current.riskBreakdown = el)}
                    >
                      {chartsReady && selectedTab === "overview" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={portfolioRiskData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {portfolioRiskData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Insights */}
              <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle>AI Risk Insights</CardTitle>
                  <CardDescription>Machine learning-powered analysis of your portfolio risks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <span>Market Risk Exposure</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Your portfolio currently has a beta of 1.2, indicating slightly higher market risk than the
                        benchmark. Consider reducing exposure to high-beta stocks if you're concerned about potential
                        market downturns. Key contributors to your market risk include technology stocks and consumer
                        discretionary sectors.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <span>Concentration Risk</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Your portfolio shows high concentration in the technology sector (42% allocation). While this
                        has driven strong returns, it increases vulnerability to sector-specific downturns. Consider
                        diversifying into defensive sectors like utilities or consumer staples to balance risk.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Volatility Management</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Your portfolio volatility is well-managed at 18.5%, only slightly above the benchmark. The
                        inclusion of low-correlation assets has effectively reduced overall portfolio swings. Continue
                        maintaining a mix of growth and value stocks to manage volatility effectively.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span>Risk Trend Analysis</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Your portfolio risk score has increased by 16 points over the past 6 months. This trend
                        correlates with increased market volatility and your shift toward growth stocks. Monitor this
                        trend carefully, especially if you have a medium-term investment horizon.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-purple-500" />
                          <span>Recommendation Summary</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Consider reducing technology exposure by 5-10% to mitigate concentration risk</li>
                          <li>
                            Add low-correlation assets like utilities or consumer staples (suggested allocation: 8-12%)
                          </li>
                          <li>Maintain your high-quality growth stocks but balance with value stocks for stability</li>
                          <li>
                            Review individual high-risk stocks like TSLA and NVDA that contribute disproportionately to
                            portfolio risk
                          </li>
                          <li>Your risk-adjusted return remains strong despite increased risk profile</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sector Analysis Tab Content */}
            <TabsContent value="sectors" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Sector Risk Chart */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Sector Risk Analysis</CardTitle>
                    <CardDescription>Risk assessment by market sector</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px]" ref={(el) => (chartRefs.current.sectorRisk = el)}>
                      {chartsReady && selectedTab === "sectors" && (
                        <ChartContainer
                          config={{
                            risk: {
                              label: "Risk Score",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                              data={sectorRiskData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid stroke="#888" strokeDasharray="5 5" opacity={0.2} vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="risk" fill="var(--color-risk)" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Risk-Return Scatter Plot */}
                <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                  <CardHeader>
                    <CardTitle>Risk vs. Return</CardTitle>
                    <CardDescription>Sector comparison of risk and potential return</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]" ref={(el) => (chartRefs.current.riskReturn = el)}>
                      {chartsReady && selectedTab === "sectors" && (
                        <ChartContainer
                          config={{
                            risk: {
                              label: "Risk",
                              color: "hsl(var(--chart-1))",
                            },
                            return: {
                              label: "Return",
                              color: "hsl(var(--chart-2))",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={sectorRiskData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid stroke="#888" strokeDasharray="5 5" opacity={0.2} />
                              <XAxis
                                type="number"
                                dataKey="risk"
                                name="Risk"
                                domain={[0, 100]}
                                label={{ value: "Risk Score", position: "bottom" }}
                              />
                              <YAxis
                                dataKey="return"
                                name="Return"
                                domain={[0, 20]}
                                label={{ value: "Expected Return (%)", angle: -90, position: "left" }}
                              />
                              <Tooltip
                                formatter={(value, name) => [
                                  value,
                                  name === "risk" ? "Risk Score" : "Expected Return (%)",
                                ]}
                              />
                              {sectorRiskData.map((entry, index) => (
                                <Line
                                  key={index}
                                  type="monotone"
                                  dataKey="return"
                                  data={[entry]}
                                  name={entry.name}
                                  strokeWidth={0}
                                >
                                  <Cell fill={`hsl(var(--chart-${(index % 6) + 1}))`} />
                                </Line>
                              ))}
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sector Recommendations */}
              <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle>Sector Recommendations</CardTitle>
                  <CardDescription>AI-generated insights on sector allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Technology Sector */}
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Technology</h3>
                          <div className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full">
                            High Risk (72)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          High volatility with strong growth potential. Current allocation: 42%
                        </p>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-sm">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                            Reduce Exposure
                          </Button>
                          <span className="text-xs text-muted-foreground">Target: 30-35%</span>
                        </div>
                      </div>

                      {/* Financial Sector */}
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Financial</h3>
                          <div className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                            Medium Risk (58)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Moderate volatility with dividend potential. Current allocation: 18%
                        </p>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-sm">
                            <Info className="h-3.5 w-3.5 mr-1 text-blue-500" />
                            Maintain
                          </Button>
                          <span className="text-xs text-muted-foreground">Target: 15-20%</span>
                        </div>
                      </div>

                      {/* Healthcare Sector */}
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Healthcare</h3>
                          <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                            Lower Risk (45)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Defensive sector with stable growth. Current allocation: 12%
                        </p>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-sm">
                            <Plus className="h-3.5 w-3.5 mr-1 text-green-500" />
                            Increase
                          </Button>
                          <span className="text-xs text-muted-foreground">Target: 15-18%</span>
                        </div>
                      </div>

                      {/* Consumer Sector */}
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Consumer</h3>
                          <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                            Lower Risk (38)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Stable with defensive characteristics. Current allocation: 8%
                        </p>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-sm">
                            <Plus className="h-3.5 w-3.5 mr-1 text-green-500" />
                            Increase
                          </Button>
                          <span className="text-xs text-muted-foreground">Target: 12-15%</span>
                        </div>
                      </div>

                      {/* Energy Sector */}
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Energy</h3>
                          <div className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                            Medium Risk (65)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cyclical with commodity exposure. Current allocation: 10%
                        </p>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-sm">
                            <AlertCircle className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                            Monitor
                          </Button>
                          <span className="text-xs text-muted-foreground">Target: 8-10%</span>
                        </div>
                      </div>

                      {/* Utilities Sector */}
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Utilities</h3>
                          <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                            Low Risk (25)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Defensive with stable dividends. Current allocation: 5%
                        </p>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-sm">
                            <Plus className="h-3.5 w-3.5 mr-1 text-green-500" />
                            Increase
                          </Button>
                          <span className="text-xs text-muted-foreground">Target: 8-10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stock Analysis Tab Content */}
            <TabsContent value="stocks" className="space-y-4">
              <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle>Individual Stock Risk Analysis</CardTitle>
                  <CardDescription>Risk assessment of top holdings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockRiskData.map((stock) => (
                      <div key={stock.symbol} className="rounded-lg border border-border/40 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold">
                              {stock.symbol} - {stock.name}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              Allocation: {Math.floor(5 + Math.random() * 10)}%
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              stock.riskScore < 40
                                ? "bg-green-500/10 text-green-500"
                                : stock.riskScore < 60
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {stock.riskScore < 40 ? "Low" : stock.riskScore < 60 ? "Medium" : "High"} Risk (
                            {stock.riskScore})
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Volatility</span>
                              <span className="font-medium">{stock.volatility}%</span>
                            </div>
                            <Progress value={stock.volatility} className="h-2" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Momentum</span>
                              <span className="font-medium">{stock.momentum}%</span>
                            </div>
                            <Progress value={stock.momentum} className="h-2" indicatorColor="#22c55e" />
                          </div>

                          <div className="lg:text-right">
                            <Button variant="outline" size="sm" className="text-sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparisons Tab Content */}
            <TabsContent value="compare" className="space-y-4">
              <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle>Risk Factor Comparison</CardTitle>
                  <CardDescription>Your portfolio vs. benchmark</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {riskFactorComparisonData.map((factor) => (
                      <div key={factor.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{factor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {((factor.portfolio / factor.benchmark - 1) * 100).toFixed(1)}% vs. Benchmark
                          </div>
                        </div>

                        <div className="relative pt-6">
                          <div className="absolute top-0 left-0 text-xs text-muted-foreground">
                            Portfolio: {factor.portfolio}
                          </div>
                          <div className="absolute top-0 right-0 text-xs text-muted-foreground">
                            Benchmark: {factor.benchmark}
                          </div>

                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${(factor.portfolio / (factor.portfolio > factor.benchmark ? factor.portfolio : factor.benchmark * 1.5)) * 100}%`,
                              }}
                            />
                          </div>

                          <div className="h-2 w-full rounded-full bg-muted mt-2">
                            <div
                              className="h-full rounded-full bg-muted-foreground"
                              style={{
                                width: `${(factor.benchmark / (factor.portfolio > factor.benchmark ? factor.portfolio : factor.benchmark * 1.5)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-lg border border-border/40 p-4 mt-6">
                      <h3 className="font-semibold mb-2">Analysis Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        Your portfolio shows slightly higher risk metrics compared to the benchmark, with a 20% higher
                        beta and 21.7% higher volatility. However, this is balanced by a stronger Sharpe ratio (1.8 vs
                        1.5), indicating better risk-adjusted returns. The maximum drawdown is 13.9% higher than the
                        benchmark, suggesting potentially larger temporary losses during market downturns. Overall, your
                        portfolio is positioned for higher returns with moderately increased risk exposure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/60 border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Actionable insights to optimize your risk-return profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border/40 p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Beta Management
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Consider reducing your portfolio beta from 1.2 to 1.0-1.1 by trimming high-beta technology
                        stocks and adding more defensive positions. This adjustment would bring your market risk closer
                        to the benchmark while maintaining most of your return potential.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/40 p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Maintain Strong Sharpe Ratio
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your portfolio's Sharpe ratio of 1.8 exceeds the benchmark, indicating efficient risk-taking.
                        Continue focusing on quality companies with strong fundamentals to maintain this advantage.
                        Consider adding 5-8% allocation to dividend aristocrats to further enhance risk-adjusted
                        returns.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/40 p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Reduce Drawdown Risk
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your portfolio's maximum drawdown risk is 12.3% compared to the benchmark's 10.8%. Consider
                        implementing a 5-8% allocation to uncorrelated assets like gold ETFs or treasury bonds to
                        provide downside protection during market corrections. This could reduce your maximum drawdown
                        by an estimated 1-2 percentage points.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/40 p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <Info className="h-4 w-4 text-blue-500" />
                        Value at Risk (VaR) Management
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your portfolio's 95% VaR of 2.4% means there's a 5% chance of losing 2.4% or more in a single
                        day. This is slightly higher than the benchmark's 2.1%. Consider implementing a more diversified
                        sector allocation to reduce this metric while maintaining return potential.
                      </p>
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
