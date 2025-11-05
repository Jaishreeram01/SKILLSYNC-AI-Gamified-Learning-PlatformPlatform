"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Send } from "lucide-react"

interface Conversation {
  id: string
  name: string
  type: "direct" | "group"
  lastMessage: string
  timestamp: string
  unread: number
  avatar: string
  members: number
  isOnline?: boolean
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar: string
  isOwn: boolean
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Chen",
      type: "direct",
      lastMessage: "Looks great! Let me review the code.",
      timestamp: "2 min ago",
      unread: 2,
      avatar: "SC",
      isOnline: true,
    },
    {
      id: "2",
      name: "React Dashboard Team",
      type: "group",
      lastMessage: "Marcus: PR is ready for review",
      timestamp: "15 min ago",
      unread: 0,
      avatar: "RD",
      members: 3,
    },
    {
      id: "3",
      name: "Marcus Williams",
      type: "direct",
      lastMessage: "When is the deadline?",
      timestamp: "1 hour ago",
      unread: 0,
      avatar: "MW",
      isOnline: false,
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Sarah Chen",
      content: "Hey! How's the API integration going?",
      timestamp: "10:30 AM",
      avatar: "SC",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content: "Almost done! Just need to handle error cases.",
      timestamp: "10:32 AM",
      avatar: "AJ",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Sarah Chen",
      content: "Looks great! Let me review the code.",
      timestamp: "10:35 AM",
      avatar: "SC",
      isOwn: false,
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "AJ",
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const selectedChat = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-border bg-card/50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-input border-border focus:border-primary"
              />
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="p-4 border-b border-border">
            <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
              <Plus size={18} />
              New Message
            </Button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full px-4 py-3 border-b border-border transition text-left ${
                  selectedConversation === conversation.id
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : "hover:bg-card/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                      {conversation.avatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{conversation.name}</p>
                      {conversation.unread > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs">{conversation.unread}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-background">
          {selectedChat && (
            <>
              {/* Chat Header */}
              <div className="border-b border-border bg-card/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedChat.name}</p>
                    {selectedChat.type === "group" ? (
                      <p className="text-xs text-muted-foreground">{selectedChat.members} members</p>
                    ) : (
                      <p className="text-xs text-green-400">Online</p>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="border-border hover:bg-card bg-transparent">
                  Details
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {message.avatar}
                    </div>
                    <div className={message.isOwn ? "flex-row-reverse flex" : "flex"}>
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          message.isOwn
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-card border border-border rounded-tl-none"
                        }`}
                      >
                        {!message.isOwn && <p className="text-xs font-semibold mb-1 opacity-70">{message.sender}</p>}
                        <p className="text-sm break-words">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border bg-card/50 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-input border-border focus:border-primary"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* No Selection State */}
        {!selectedChat && (
          <div className="hidden md:flex flex-1 items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground">Select a chat or create a new one to begin messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
