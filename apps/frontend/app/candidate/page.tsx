"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Award,
  TrendingUp,
  Code,
  Monitor
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function CandidatePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const upcomingInterviews = [
    {
      id: 1,
      company: "TechCorp Inc",
      position: "Senior Frontend Developer",
      date: "2024-01-16",
      time: "2:00 PM",
      interviewer: "Sarah Chen",
      duration: "60 minutes",
      type: "Technical",
      logo: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Engineer", 
      date: "2024-01-18",
      time: "10:00 AM",
      interviewer: "Marcus Rodriguez",
      duration: "45 minutes",
      type: "Behavioral",
      logo: "https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    }
  ]

  const completedInterviews = [
    {
      id: 1,
      company: "MegaScale Inc",
      position: "Backend Developer",
      date: "2024-01-10",
      score: 87,
      status: "passed",
      feedback: "Strong technical skills, good problem-solving approach"
    },
    {
      id: 2,
      company: "CloudFirst",
      position: "DevOps Engineer", 
      date: "2024-01-08",
      score: 92,
      status: "passed",
      feedback: "Excellent knowledge of cloud platforms and automation"
    }
  ]

  const preparationResources = [
    {
      title: "JavaScript Fundamentals",
      type: "Course",
      progress: 75,
      icon: Code
    },
    {
      title: "System Design Basics",
      type: "Tutorial",
      progress: 45,
      icon: Monitor
    },
    {
      title: "Interview Best Practices",
      type: "Guide",
      progress: 100,
      icon: BookOpen
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Candidate Dashboard</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button size="icon" variant="ghost">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-muted/10 h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "interviews" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("interviews")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              My Interviews
            </Button>
            <Button 
              variant={activeTab === "preparation" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("preparation")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Preparation
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Award className="mr-2 h-4 w-4" />
              Achievements
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, John!</h2>
                <p className="text-muted-foreground">Ready to ace your next interview?</p>
              </div>
              <Button>
                <Video className="mr-2 h-4 w-4" />
                Join Interview
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    interviews scheduled
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    interviews completed
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-green-600">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">80%</div>
                  <p className="text-xs text-green-600">
                    4 of 5 passed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Next Interview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
                      Next Interview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingInterviews[0] && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={upcomingInterviews[0].logo} />
                            <AvatarFallback>TC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{upcomingInterviews[0].company}</p>
                            <p className="text-sm text-muted-foreground">{upcomingInterviews[0].position}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Date & Time</p>
                            <p className="font-medium">{upcomingInterviews[0].date} at {upcomingInterviews[0].time}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{upcomingInterviews[0].duration}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interviewer</p>
                            <p className="font-medium">{upcomingInterviews[0].interviewer}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <Badge variant="secondary">{upcomingInterviews[0].type}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button className="flex-1">
                            <Video className="mr-2 h-4 w-4" />
                            Join Interview
                          </Button>
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Performance</CardTitle>
                    <CardDescription>Your latest interview results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedInterviews.map((interview) => (
                      <div key={interview.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{interview.company}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Passed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{interview.position}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Score: {interview.score}%</span>
                          <span className="text-xs text-muted-foreground">{interview.date}</span>
                        </div>
                        <Progress value={interview.score} className="mt-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "interviews" && (
              <div className="space-y-6">
                {/* Upcoming Interviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Interviews</CardTitle>
                    <CardDescription>Your scheduled interview sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={interview.logo} />
                              <AvatarFallback>{interview.company.split(' ').map(w => w[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{interview.company}</p>
                              <p className="text-sm text-muted-foreground">{interview.position}</p>
                              <p className="text-xs text-muted-foreground">
                                {interview.date} at {interview.time} • {interview.duration}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm">
                              <Video className="mr-2 h-4 w-4" />
                              Join
                            </Button>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Interview History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Interview History</CardTitle>
                    <CardDescription>Your completed interviews and results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedInterviews.map((interview) => (
                      <div key={interview.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">{interview.company}</p>
                            <p className="text-sm text-muted-foreground">{interview.position}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Passed
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score: {interview.score}%</span>
                            <span className="text-muted-foreground">{interview.date}</span>
                          </div>
                          <Progress value={interview.score} />
                          <p className="text-sm text-muted-foreground italic">"{interview.feedback}"</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "preparation" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preparation Resources</CardTitle>
                    <CardDescription>Study materials and practice sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {preparationResources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <resource.icon className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{resource.progress}%</span>
                          </div>
                          <Progress value={resource.progress} />
                        </div>
                        
                        <Button variant="outline" size="sm" className="mt-3">
                          {resource.progress === 100 ? "Review" : "Continue"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}