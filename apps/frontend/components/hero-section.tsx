import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Video, Code, Eye } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Next-Gen Live Coding Interviews
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Transform technical assessments with real-time collaboration, AI-powered monitoring, 
            and seamless video integration. The future of fair, insightful coding interviews.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature preview cards */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-6 bg-card rounded-lg border">
              <Video className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">HD Video Calls</h3>
              <p className="text-sm text-muted-foreground">Crystal clear communication</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-6 bg-card rounded-lg border">
              <Code className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">Live Coding</h3>
              <p className="text-sm text-muted-foreground">Real-time collaborative editing</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-6 bg-card rounded-lg border">
              <Eye className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Gaze Tracking</h3>
              <p className="text-sm text-muted-foreground">AI-powered monitoring</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-6 bg-card rounded-lg border">
              <Shield className="h-8 w-8 text-red-500 mb-3" />
              <h3 className="font-semibold mb-2">Anti-Cheating</h3>
              <p className="text-sm text-muted-foreground">Secure assessment environment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}