/**
 * Real-time Notification Service
 * Handles notification management and real-time updates
 */

export type NotificationType = "task" | "message" | "team" | "achievement"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  userId: string
  action?: {
    label: string
    href: string
  }
}

export class NotificationService {
  private listeners: ((notification: Notification) => void)[] = []
  private notifications: Map<string, Notification[]> = new Map()

  /**
   * Subscribe to notifications
   */
  subscribe(callback: (notification: Notification) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  /**
   * Create and broadcast a notification
   */
  notify(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    const fullNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    // Store notification
    const userNotifications = this.notifications.get(notification.userId) || []
    userNotifications.unshift(fullNotification)
    this.notifications.set(notification.userId, userNotifications)

    // Broadcast to listeners
    this.listeners.forEach((listener) => listener(fullNotification))

    // Show browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(fullNotification.title, {
        body: fullNotification.description,
        icon: "/favicon.ico",
      })
    }
  }

  /**
   * Task assignment notification
   */
  notifyTaskAssigned(userId: string, taskName: string, assignerName: string) {
    this.notify({
      type: "task",
      userId,
      title: "Task assigned",
      description: `${assignerName} assigned you '${taskName}'`,
      action: { label: "View Task", href: "/dashboard/projects" },
    })
  }

  /**
   * New message notification
   */
  notifyNewMessage(userId: string, senderName: string, messagePreview: string) {
    this.notify({
      type: "message",
      userId,
      title: "New message",
      description: `${senderName}: ${messagePreview}`,
      action: { label: "Reply", href: "/dashboard/messages" },
    })
  }

  /**
   * Team event notification
   */
  notifyTeamEvent(userId: string, eventType: string, details: string) {
    this.notify({
      type: "team",
      userId,
      title: "Team update",
      description: details,
      action: { label: "View Team", href: "/dashboard/teams" },
    })
  }

  /**
   * Achievement notification
   */
  notifyAchievement(userId: string, achievementName: string, achievementDetails: string) {
    this.notify({
      type: "achievement",
      userId,
      title: "Achievement unlocked",
      description: `${achievementName}: ${achievementDetails}`,
    })
  }

  /**
   * Get user notifications
   */
  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || []
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string) {
    const userNotifications = this.notifications.get(userId) || []
    const notification = userNotifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService()
