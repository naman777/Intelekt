import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const benefits = [
    "Start immediately with no setup required",
    "Free 14-day trial with full feature access", 
    "Cancel anytime with no long-term commitment",
    "24/7 support and onboarding assistance"
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10" />
          <CardContent className="relative p-12 lg:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Limited Time Offer
              </Badge>
              
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
                Ready to revolutionize your 
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {" "}hiring process?
                </span>
              </h2>
              
              <p className="text-lg leading-8 text-muted-foreground mb-8">
                Join leading companies using Intelekt to conduct fair, efficient, 
                and insightful technical interviews. Start your free trial today.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/schedule">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Book a Demo
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                No credit card required • Free 14-day trial • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}