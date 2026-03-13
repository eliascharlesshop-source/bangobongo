'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  MessageSquare, 
  Mic, 
  Video, 
  VideoOff, 
  MicOff, 
  Share, 
  Settings,
  Music,
  Clock,
  UserPlus,
  UserMinus,
  Send,
  Volume2,
  Play,
  Pause
} from 'lucide-react'

interface Collaborator {
  id: string
  name: string
  email: string
  role: 'producer' | 'musician' | 'lyricist' | 'vocalist'
  status: 'online' | 'away' | 'busy'
  avatar?: string
  permissions: string[]
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  type: 'text' | 'system' | 'music'
}

interface MusicProject {
  id: string
  name: string
  description: string
  genre: string
  tempo: number
  key: string
  collaborators: Collaborator[]
  createdAt: string
  lastModified: string
  status: 'draft' | 'in_progress' | 'review' | 'completed'
}

export default function CollaborationPage() {
  const [activeProject, setActiveProject] = useState<MusicProject | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Alex Producer',
      email: 'alex@studio.com',
      role: 'producer',
      status: 'online',
      permissions: ['edit', 'mix', 'export']
    },
    {
      id: '2',
      name: 'Sarah Musician',
      email: 'sarah@music.com',
      role: 'musician',
      status: 'online',
      permissions: ['edit', 'record']
    },
    {
      id: '3',
      name: 'Mike Lyricist',
      email: 'mike@lyrics.com',
      role: 'lyricist',
      status: 'away',
      permissions: ['edit_lyrics', 'comment']
    }
  ])
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Alex Producer',
      message: 'Hey team! Let\'s work on the chorus section today.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Musician',
      message: 'Great! I have some guitar ideas ready.',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'text'
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(240) // 4 minutes in seconds
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    
    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const addCollaborator = () => {
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: 'New Collaborator',
      email: 'new@example.com',
      role: 'musician',
      status: 'online',
      permissions: ['edit']
    }
    setCollaborators(prev => [...prev, newCollaborator])
  }

  const removeCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleIcon = (role: Collaborator['role']) => {
    switch (role) {
      case 'producer': return <Settings className="h-4 w-4" />
      case 'musician': return <Music className="h-4 w-4" />
      case 'lyricist': return <MessageSquare className="h-4 w-4" />
      case 'vocalist': return <Mic className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Music Collaboration Studio</h1>
          <p className="text-purple-200">Real-time collaboration for music production</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Collaboration Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Audio Controls */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Live Session
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Audio/video collaboration with team members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Preview Area */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative bg-black/50 rounded-lg aspect-video flex items-center justify-center">
                    {isVideoOn ? (
                      <div className="text-white text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-2">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">Your Camera</p>
                      </div>
                    ) : (
                      <VideoOff className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="relative bg-black/50 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-white text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-2">
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">Alex Producer</p>
                      <Badge className="mt-1 bg-green-500">Online</Badge>
                    </div>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={isAudioOn ? "default" : "destructive"}
                    size="lg"
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="lg"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`border-white/20 text-white ${isRecording ? 'bg-red-600/20 border-red-600' : 'hover:bg-white/10'}`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                    {isRecording ? 'Recording' : 'Record'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Share className="h-5 w-5 mr-2" />
                    Share Screen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Music Project Workspace */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Music className="h-5 w-5 mr-2" />
                  Project Workspace
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Current music project and timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Info */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">Summer Vibes</h3>
                    <p className="text-purple-200 text-sm">Electronic • 120 BPM • C Major</p>
                  </div>
                  <Badge className="bg-purple-600">In Progress</Badge>
                </div>

                {/* Timeline/Transport Controls */}
                <div className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1">
                      <div className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                      <div className="bg-white/20 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Volume2 className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Track Lanes */}
                  <div className="space-y-2">
                    {['Drums', 'Bass', 'Synth Lead', 'Vocals'].map((track, index) => (
                      <div key={track} className="flex items-center space-x-3">
                        <div className="w-20 text-white text-sm">{track}</div>
                        <div className="flex-1 bg-white/10 rounded h-8 relative">
                          <div className="absolute inset-y-0 left-0 bg-purple-600/30 rounded" style={{ width: '60%' }} />
                          <div className="absolute inset-y-0 left-0 bg-green-500/60 rounded" style={{ width: '30%' }} />
                        </div>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Add Track
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Import Audio
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Mix Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Collaborators */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Collaborators
                  </span>
                  <Button variant="ghost" size="sm" onClick={addCollaborator} className="text-white hover:bg-white/10">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {collaborators.map(collaborator => (
                  <div key={collaborator.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(collaborator.status)}`} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{collaborator.name}</p>
                        <p className="text-purple-200 text-xs flex items-center">
                          {getRoleIcon(collaborator.role)}
                          <span className="ml-1">{collaborator.role}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollaborator(collaborator.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <UserMinus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Team Chat */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Team Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 space-y-3">
                  {chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.userId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.userId === 'current-user' ? 'bg-purple-600' : 'bg-white/10'} rounded-lg p-3`}>
                        {message.type === 'system' ? (
                          <p className="text-purple-200 text-sm italic">{message.message}</p>
                        ) : (
                          <>
                            <p className="text-white text-xs font-medium mb-1">{message.userName}</p>
                            <p className="text-white text-sm">{message.message}</p>
                            <p className="text-purple-200 text-xs mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </ScrollArea>
                
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Session Duration</span>
                  <span className="text-white font-medium">45:23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Tracks Created</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Messages Sent</span>
                  <span className="text-white font-medium">28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Files Shared</span>
                  <span className="text-white font-medium">5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
