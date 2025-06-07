"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  MessageSquare,
  Phone,
  Settings,
  Users,
  Clock,
  Eye,
  Shield,
  Play,
  Square,
  FileText,
  Send,
  MoreVertical
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function InterviewRoom({ params }: { params: { roomId: string } }) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true) 
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00")
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Interviewer", message: "Welcome to your interview! Please introduce yourself.", time: "14:30" },
    { id: 2, sender: "Candidate", message: "Thank you! I'm excited to be here.", time: "14:31" }
  ])
  const [newMessage, setNewMessage] = useState("")

  // Mock interview data
  const interviewData = {
    candidate: "John Park",
    position: "Senior Frontend Developer", 
    company: "TechCorp Inc",
    interviewer: "Sarah Chen",
    duration: "60 minutes",
    status: "in-progress"
  }

  // Mock code editor content
  const [code, setCode] = useState(`// Welcome to your coding interview!
// Please solve the following problem:

function twoSum(nums, target) {
  // Your solution here
  
}

// Example:
// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: nums[0] + nums[1] = 2 + 7 = 9`)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      setCurrentTime(`${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage("")
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-lg font-semibold">
                {interviewData.candidate} - {interviewData.position}
              </h1>
              <p className="text-sm text-muted-foreground">
                {interviewData.company} • Room: {params.roomId}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{currentTime}</span>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>2 participants</span>
            </Badge>
            <Button variant="destructive" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              End Interview
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Section */}
          <div className="h-64 bg-black relative">
            <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">
              {/* Interviewer Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {interviewData.interviewer} (Interviewer)
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Monitoring
                  </Badge>
                </div>
              </div>

              {/* Candidate Video */} 
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {interviewData.candidate} (You)
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant="secondary" className="bg-red-600 text-white text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Protected
                  </Badge>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isAudioOn ? "secondary" : "destructive"}
                size="icon"
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="icon"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </Button>
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Code Editor and Questions */}
          <div className="flex-1 p-4">
            <Tabs defaultValue="code" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code">Code Editor</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Collaborative Code Editor
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">JavaScript</Badge>
                        <Button variant="outline" size="sm">Run Code</Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono text-sm h-full resize-none"
                      placeholder="Write your code here..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="questions" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Interview Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">1. Tell me about yourself and your experience with React.</p>
                        <Badge variant="secondary" className="mt-2">Behavioral</Badge>
                      </div>
                      <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950">
                        <p className="font-medium">2. Solve the Two Sum problem (current)</p>
                        <Badge variant="default" className="mt-2">Technical</Badge>
                      </div>
                      <div className="p-3 border rounded-lg opacity-50">
                        <p className="font-medium">3. Explain your approach to state management</p>
                        <Badge variant="outline" className="mt-2">Technical</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Interview Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Take notes during the interview..."
                      className="h-64 resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-card">
          <Tabs defaultValue="chat" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="h-full flex flex-col p-4">
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-lg bg-muted">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="h-full p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                      Gaze Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attention Score</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} />
                      <p className="text-xs text-muted-foreground">
                        Candidate maintains good eye contact
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-green-500" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Screen monitoring active
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        No suspicious activity
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Browser locked
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Problem Solving</span>
                        <span>Good</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={90} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="controls" className="h-full p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Interview Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Observer
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Interview Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Send Question
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Code Review
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Technical Break
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}