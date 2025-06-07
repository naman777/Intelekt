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
  Users, 
  Clock, 
  TrendingUp, 
  Plus, 
  Video, 
  FileText, 
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Total Interviews",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: Users
    },
    {
      title: "This Week",
      value: "12",
      change: "+8%", 
      trend: "up",
      icon: Calendar
    },
    {
      title: "Avg Duration",
      value: "45m",
      change: "-5m",
      trend: "down",
      icon: Clock
    },
    {
      title: "Success Rate",
      value: "89%",
      change: "+12%",
      trend: "up", 
      icon: TrendingUp
    }
  ]

  const recentInterviews = [
    {
      id: 1,
      candidate: "Sarah Chen",
      position: "Senior Frontend Developer",
      date: "2024-01-15",
      time: "2:00 PM",
      status: "completed",
      score: 85,
      avatar: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      id: 2,
      candidate: "Marcus Rodriguez",
      position: "Full Stack Engineer",
      date: "2024-01-15", 
      time: "4:30 PM",
      status: "scheduled",
      score: null,
      avatar: "https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      id: 3,
      candidate: "Emily Johnson",
      position: "DevOps Engineer",
      date: "2024-01-14",
      time: "10:00 AM", 
      status: "completed",
      score: 92,
      avatar: "https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      id: 4,
      candidate: "David Park",
      position: "Backend Developer",
      date: "2024-01-14",
      time: "3:15 PM",
      status: "no-show",
      score: null,
      avatar: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "scheduled":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "no-show":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary\" className="bg-green-100 text-green-800">Completed</Badge>
      case "scheduled":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "no-show":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search interviews..."
                className="w-[300px] pl-10"
              />
            </div>
            <Button size="icon" variant="ghost">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-muted/10 h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Video className="mr-2 h-4 w-4" />
              Live Interviews
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Reports
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
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Good morning, Sarah!</h2>
              <div className="flex space-x-3">
                <Link href="/schedule">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                </Link>
                <Button variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Start Live Session
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recent">Recent Interviews</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Interviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Schedule</CardTitle>
                      <CardDescription>Upcoming interviews for today</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentInterviews.filter(i => i.status === 'scheduled').map((interview) => (
                        <div key={interview.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={interview.avatar} />
                            <AvatarFallback>{interview.candidate.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{interview.candidate}</p>
                            <p className="text-sm text-muted-foreground">{interview.position}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{interview.time}</p>
                            {getStatusBadge(interview.status)}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Performance Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>This Month's Performance</CardTitle>
                      <CardDescription>Interview completion and success rates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate</span>
                          <span>89%</span>
                        </div>
                        <Progress value={89} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Score</span>
                          <span>76%</span>
                        </div>
                        <Progress value={76} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Hiring Rate</span>
                          <span>34%</span>
                        </div>
                        <Progress value={34} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Interviews</CardTitle>
                        <CardDescription>Latest interview sessions and results</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentInterviews.map((interview) => (
                        <div key={interview.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={interview.avatar} />
                            <AvatarFallback>{interview.candidate.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{interview.candidate}</p>
                              {getStatusIcon(interview.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{interview.position}</p>
                            <p className="text-xs text-muted-foreground">{interview.date} at {interview.time}</p>
                          </div>
                          
                          <div className="text-right space-y-1">
                            {getStatusBadge(interview.status)}
                            {interview.score && (
                              <p className="text-sm font-medium">Score: {interview.score}%</p>
                            )}
                          </div>
                          
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>Detailed insights and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Analytics and reporting features coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}