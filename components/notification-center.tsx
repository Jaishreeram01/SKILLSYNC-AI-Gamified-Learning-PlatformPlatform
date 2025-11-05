"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X } from "lucide-react"

interface Notification {
  id: string
  type: "task" | "message" | "team" | "achievement"
  title: string
  description: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    href: string
  }
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "task",
      title: "Task assigned",
      description: "Sarah assigned you 'Fix authentication bug'",
      timestamp: "5 min ago",
      read: false,
      action: { label: "View Task", href: "/dashboard/projects/1" },
    },
    {
      id: "2",
      type: "message",
      title: "New message",
      description: "Marcus: When is the deadline?",
      timestamp: "15 min ago",
      read: false,
      action: { label: "Reply", href: "/dashboard/messages" },
    },
    {
      id: "3",
      type: "team",
      title: "Team member joined",
      description: "Emma joined React Dashboard Pro",
      timestamp: "1 hour ago",
      read: true,
    },
    {
      id: "4",
      type: "achievement",
      title: "Achievement unlocked",
      description: "You completed your first project!",
      timestamp: "2 hours ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const typeColors = {
    task: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    message: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    team: "bg-green-500/20 text-green-300 border-green-500/30",
    achievement: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="border-border hover:bg-card bg-transparent relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-card/95 border-b border-border p-4 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                className="text-xs hover:bg-card"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`border-0 rounded-none bg-transparent ${!notif.read ? "bg-primary/5" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-xs ${typeColors[notif.type]}`}>
                            {notif.type}
                          </Badge>
                          {!notif.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
                        {notif.action && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="mt-2 border-border hover:bg-card bg-transparent text-xs"
                          >
                            <a href={notif.action.href}>{notif.action.label}</a>
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">{notif.timestamp}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {!notif.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notif.id)}
                            className="hover:bg-card"
                          >
                            <Check size={16} />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => clearNotification(notif.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
