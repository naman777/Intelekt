import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Engineering",
      company: "TechCorp",
      image: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Intelekt transformed our hiring process. The AI monitoring gives us confidence in remote assessments, and the collaborative coding environment feels natural.",
      rating: 5,
      badge: "Enterprise"
    },
    {
      name: "Marcus Rodriguez",
      role: "Senior Developer",
      company: "StartupXYZ",
      image: "https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "As a candidate, I appreciated the fair and transparent process. The platform made me feel comfortable while demonstrating my skills effectively.",
      rating: 5,
      badge: "Candidate"
    },
    {
      name: "Dr. Amanda Foster",
      role: "Talent Acquisition Director",
      company: "MegaScale Inc",
      image: "https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", 
      content: "The analytics and insights from Intelekt help us make better hiring decisions. We've reduced our time-to-hire by 40% while improving quality.",
      rating: 5,
      badge: "Enterprise"
    },
    {
      name: "James Park",
      role: "Engineering Manager",
      company: "CloudFirst",
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The real-time collaboration features are game-changing. It's like having candidates right in our office, working alongside the team.",
      rating: 5,
      badge: "Manager"
    },
    {
      name: "Lisa Thompson",
      role: "Tech Recruiter",
      company: "DevHire Solutions",
      image: "https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Scheduling and managing interviews has never been easier. The automated workflows save hours of coordination time every week.",
      rating: 5,
      badge: "Recruiter"
    },
    {
      name: "Alex Kumar",
      role: "Principal Architect",
      company: "InnovateTech",
      image: "https://images.pexels.com/photos/3781545/pexels-photo-3781545.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The technical depth and security features give us confidence when interviewing for senior positions. Truly enterprise-grade solution.",
      rating: 5,
      badge: "Enterprise"
    }
  ]

  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by leading companies
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join thousands of companies using Intelekt to find and hire the best talent
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  "{testimonial.content}"
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}