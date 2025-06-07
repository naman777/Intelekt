"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Mail, 
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("schedule")

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]

  const upcomingInterviews = [
    {
      id: 1,
      candidate: "Sarah Chen",
      position: "Senior Frontend Developer",
      date: "2024-01-16",
      time: "2:00 PM",
      duration: "60 min",
      status: "confirmed",
      email: "sarah@email.com"
    },
    {
      id: 2,
      candidate: "Marcus Rodriguez", 
      position: "Full Stack Engineer",
      date: "2024-01-16",
      time: "4:00 PM",
      duration: "45 min",
      status: "pending",
      email: "marcus@email.com"
    },
    {
      id: 3,
      candidate: "Emily Johnson",
      position: "DevOps Engineer", 
      date: "2024-01-17",
      time: "10:00 AM",
      duration: "60 min", 
      status: "confirmed",
      email: "emily@email.com"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
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
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Interview Scheduling</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="schedule">Schedule New</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Scheduling Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule New Interview</CardTitle>
                  <CardDescription>
                    Create a new interview session with all the details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Candidate First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Candidate Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Candidate Email</Label>
                    <Input id="email" type="email" placeholder="john@email.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" placeholder="Senior Frontend Developer" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interviewType">Interview Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Interview</SelectItem>
                        <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                        <SelectItem value="system-design">System Design</SelectItem>
                        <SelectItem value="cultural-fit">Cultural Fit</SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">PST (UTC-8)</SelectItem>
                          <SelectItem value="est">EST (UTC-5)</SelectItem>
                          <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                          <SelectItem value="cet">CET (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any special requirements or notes for the interview..."
                      className="h-24"
                    />
                  </div>

                  <Button className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Date and Time Selection */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Time Slots</CardTitle>
                    <CardDescription>
                      {selectedDate ? selectedDate.toDateString() : "Select a date first"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-10"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>
                  Manage your scheduled interview sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{interview.candidate}</h3>
                            {getStatusBadge(interview.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {interview.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {interview.time} ({interview.duration})
                            </div>
                            <div className="flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {interview.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  Overview of all scheduled interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single" 
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">
                      Interviews on {selectedDate?.toDateString()}
                    </h3>
                    
                    {upcomingInterviews
                      .filter(interview => interview.date === selectedDate?.toISOString().split('T')[0])
                      .map((interview) => (
                        <div key={interview.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{interview.time}</span>
                            {getStatusBadge(interview.status)}
                          </div>
                          <p className="text-sm">{interview.candidate}</p>
                          <p className="text-xs text-muted-foreground">{interview.position}</p>
                        </div>
                      ))}
                    
                    {upcomingInterviews.filter(interview => 
                      interview.date === selectedDate?.toISOString().split('T')[0]
                    ).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No interviews scheduled for this date
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}