import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, UserPlus, Video, BarChart3 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: CalendarDays,
      title: "Schedule Interview",
      description: "Create interview slots, set requirements, and invite candidates through our intuitive scheduling system.",
      features: ["Automated reminders", "Calendar integration", "Custom requirements"]
    },
    {
      step: "02", 
      icon: UserPlus,
      title: "Candidate Joins",
      description: "Candidates receive secure links and join the virtual interview room with identity verification.",
      features: ["Identity verification", "System checks", "Practice environment"]
    },
    {
      step: "03",
      icon: Video,
      title: "Live Interview",
      description: "Conduct the interview with real-time collaboration, AI monitoring, and comprehensive recording.",
      features: ["Live coding", "Video calls", "Screen monitoring", "AI analysis"]
    },
    {
      step: "04",
      icon: BarChart3,
      title: "Review Results",
      description: "Access detailed analytics, AI insights, and collaborative feedback tools for decision making.",
      features: ["Performance metrics", "AI scoring", "Team collaboration", "Export reports"]
    }
  ]

  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How Intelekt Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Simple yet powerful workflow that transforms traditional interviews into 
            intelligent, fair, and insightful assessments.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden xl:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}
              
              <Card className="relative z-10 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="outline" className="mx-auto w-fit mb-2">
                    Step {step.step}
                  </Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {step.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {step.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}