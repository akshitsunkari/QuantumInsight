import Link from "next/link"
import { BrainCircuit, ChevronRight, BarChart, Sparkles, Shield, Zap } from "lucide-react"

import { StockTicker } from "@/components/stock-ticker"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-20 blur-[100px]"></div>

        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  <div className="flex items-center gap-1">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span>Powered by AI & Machine Learning</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Intelligent Financial Analytics
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Advanced financial insights and predictions powered by large language models and cutting-edge machine
                  learning.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard" passHref>
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 group">
                    <span>Explore Dashboard</span>
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/predict" passHref>
                  <Button variant="outline" className="border-border/60 backdrop-blur-sm">
                    Try Predictions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex items-center justify-center lg:justify-end relative">
              <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-xl border border-border/40 backdrop-blur-sm bg-background/60 shadow-2xl p-4">
                {/* Animated glow effect */}
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-20 blur group-hover:opacity-30 transition duration-1000 animate-pulse"></div>

                <div className="relative h-full rounded-lg flex flex-col divide-y divide-border/30">
                  <div className="flex items-center justify-between p-3">
                    <h3 className="font-semibold">NVDA Price Prediction</h3>
                    <div className="text-xs text-muted-foreground">AI Confidence: 92%</div>
                  </div>
                  <div className="flex-1 p-3 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=300&width=350"
                      alt="Market prediction chart"
                      className="rounded w-full h-auto"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-green-500 font-semibold">+12.4%</span>
                      <span className="text-muted-foreground ml-1">Expected Growth</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Ticker */}
      <section className="container px-4 py-6 md:px-6">
        <StockTicker />
      </section>

      {/* Features */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                <Sparkles className="mr-1 h-3.5 w-3.5 inline-block" />
                <span>Features</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Advanced Financial Intelligence
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl">
                Our AI-powered analytics provides unparalleled insights into market trends, risk assessment, and
                predictive modeling.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <div className="relative flex flex-col space-y-2 rounded-xl border border-border/40 p-6 backdrop-blur-sm bg-background/60">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Market Analytics</h3>
                <p className="text-muted-foreground">
                  Real-time analysis of market trends, historical data, and predictive modeling powered by advanced
                  machine learning.
                </p>
                <Link href="/dashboard" className="text-primary hover:underline inline-flex items-center pt-4">
                  <span>Explore Analytics</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <div className="relative flex flex-col space-y-2 rounded-xl border border-border/40 p-6 backdrop-blur-sm bg-background/60">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI Predictions</h3>
                <p className="text-muted-foreground">
                  Harness the power of large language models to predict market movements and generate actionable
                  investment insights.
                </p>
                <Link href="/predict" className="text-primary hover:underline inline-flex items-center pt-4">
                  <span>Try Predictions</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <div className="relative flex flex-col space-y-2 rounded-xl border border-border/40 p-6 backdrop-blur-sm bg-background/60">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Comprehensive risk analysis of your investments, with volatility metrics, trend confidence, and market
                  sentiment insights.
                </p>
                <Link href="/risk-analysis" className="text-primary hover:underline inline-flex items-center pt-4">
                  <span>Assess Risks</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm p-8 md:p-12">
            <div className="absolute -top-24 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-10 blur-[100px]"></div>

            <div className="relative grid gap-6 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Ready to transform your investment strategy?
                  </h2>
                  <p className="text-muted-foreground md:text-xl">
                    Access cutting-edge AI-powered financial analytics and make data-driven investment decisions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard" passHref>
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      Get Started Now
                    </Button>
                  </Link>
                  <Link href="#" passHref>
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Dashboard preview"
                  className="rounded-lg border border-border/40 shadow-xl aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
