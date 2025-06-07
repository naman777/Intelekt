import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Video, 
  Code2, 
  Eye, 
  Shield, 
  Users, 
  BarChart3, 
  Clock, 
  Zap,
  Monitor,
  Brain,
  CheckCircle,
  Globe
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "HD Video Calling",
      description: "Crystal clear video communication with low latency and automatic quality adjustment",
      badge: "Core",
      color: "text-blue-500"
    },
    {
      icon: Code2,
      title: "Real-time Code Editor",
      description: "Collaborative coding environment with syntax highlighting and multiple language support",
      badge: "Core",
      color: "text-green-500"
    },
    {
      icon: Eye,
      title: "Gaze Tracking AI",
      description: "Advanced eye tracking to monitor candidate attention and detect unusual behavior patterns",
      badge: "AI",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Anti-Cheating System",
      description: "Multi-layered security with screen monitoring and behavioral analysis",
      badge: "Security",
      color: "text-red-500"
    },
    {
      icon: Monitor,
      title: "Screen Monitoring",
      description: "Real-time screen sharing and monitoring to ensure interview integrity",
      badge: "Security",
      color: "text-orange-500"
    },
    {
      icon: Users,
      title: "Multi-participant Support",
      description: "Include multiple interviewers and panel discussions in a single session",
      badge: "Collaboration",
      color: "text-indigo-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed performance metrics and behavioral insights for better decision making",
      badge: "Analytics",
      color: "text-cyan-500"
    },
    {
      icon: Clock,
      title: "Session Recording",
      description: "Automatic recording of interviews with searchable transcripts and highlights",
      badge: "Recording",
      color: "text-emerald-500"
    },
    {
      icon: Brain,
      title: "AI Code Analysis",
      description: "Intelligent code evaluation with automated scoring and feedback generation",
      badge: "AI",
      color: "text-violet-500"
    },
    {
      icon: Zap,
      title: "Instant Deployment",
      description: "Quick setup with pre-configured environments for popular programming languages",
      badge: "Efficiency",
      color: "text-yellow-500"
    },
    {
      icon: CheckCircle,
      title: "Automated Scoring",
      description: "AI-powered assessment with customizable rubrics and instant feedback",
      badge: "AI",
      color: "text-teal-500"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Multi-language support with timezone management for international teams",
      badge: "Global",
      color: "text-pink-500"
    }
  ]

  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for perfect interviews
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Comprehensive platform combining cutting-edge technology with intuitive design 
            to transform how technical interviews are conducted.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}