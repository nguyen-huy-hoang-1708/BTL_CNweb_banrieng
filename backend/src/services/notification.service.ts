import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Notification = {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'reminder' | 'info' | 'warning';
  is_read: boolean;
  related_event_id?: string;
  created_at: Date;
};

// In-memory notification store (trong production nên dùng Redis hoặc database)
const notifications: Map<string, Notification[]> = new Map();

// Track which event reminders have been sent
const sentReminders: Set<string> = new Set();

export function addNotification(userId: string, notification: Omit<Notification, 'notification_id' | 'created_at' | 'is_read'>) {
  if (!notifications.has(userId)) {
    notifications.set(userId, []);
  }
  
  const newNotification: Notification = {
    ...notification,
    notification_id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    is_read: false,
    created_at: new Date(),
  };
  
  const userNotifs = notifications.get(userId)!;
  userNotifs.unshift(newNotification);
  
  // Keep only last 50 notifications per user
  if (userNotifs.length > 50) {
    userNotifs.splice(50);
  }
  
  return newNotification;
}

export function getUserNotifications(userId: string, unreadOnly = false): Notification[] {
  const userNotifs = notifications.get(userId) || [];
  return unreadOnly ? userNotifs.filter(n => !n.is_read) : userNotifs;
}

export function markNotificationAsRead(userId: string, notificationId: string): boolean {
  const userNotifs = notifications.get(userId);
  if (!userNotifs) return false;
  
  const notif = userNotifs.find(n => n.notification_id === notificationId);
  if (notif) {
    notif.is_read = true;
    return true;
  }
  return false;
}

export function markAllNotificationsAsRead(userId: string): number {
  const userNotifs = notifications.get(userId);
  if (!userNotifs) return 0;
  
  let count = 0;
  userNotifs.forEach(n => {
    if (!n.is_read) {
      n.is_read = true;
      count++;
    }
  });
  return count;
}

// Check for upcoming events and send notifications
export async function checkUpcomingEvents() {
  const now = new Date();
  const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);
  
  // Query events starting soon
  const upcomingEvents = await prisma.learningEvent.findMany({
    where: {
      start_utc: {
        gte: now,
        lte: in30Minutes,
      },
      is_deleted: false,
      status: 'planned',
    },
    include: {
      module: {
        select: {
          title: true,
          roadmap_id: true,
        },
      },
    },
  });
  
  console.log(`🔍 Checking ${upcomingEvents.length} upcoming events...`);
  
  for (const event of upcomingEvents) {
    const minutesUntil = Math.round((event.start_utc.getTime() - now.getTime()) / 60000);
    
    // Create unique key for this reminder
    const reminderKey = `${event.event_id}-${event.reminder_minutes}`;
    
    // Check if we should send notification
    if (event.reminder_minutes && minutesUntil <= event.reminder_minutes && !sentReminders.has(reminderKey)) {
      console.log(`✅ Sending reminder for event "${event.title}" (${minutesUntil} minutes until start)`);
      
      addNotification(event.user_id, {
        user_id: event.user_id,
        title: '🔔 Nhắc nhở học tập',
        message: `"${event.title}" sẽ bắt đầu trong ${minutesUntil} phút${event.module ? ` - ${event.module.title}` : ''}`,
        type: 'reminder',
        related_event_id: event.event_id,
      });
      
      // Mark as sent
      sentReminders.add(reminderKey);
    }
  }
}

// Start notification checker (runs every 5 minutes)
let notificationInterval: NodeJS.Timeout | null = null;

export function startNotificationService() {
  if (notificationInterval) return;
  
  console.log('📢 Notification service started');
  
  // Check immediately
  checkUpcomingEvents().catch(err => console.error('Error checking events:', err));
  
  // Then check every 5 minutes
  notificationInterval = setInterval(() => {
    checkUpcomingEvents().catch(err => console.error('Error checking events:', err));
  }, 5 * 60 * 1000);
  
  // Clean up old sent reminders every hour (to prevent memory leak)
  setInterval(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const keysToDelete: string[] = [];
    
    // In a real implementation, you'd track timestamps for each key
    // For now, just clear all after 24 hours
    if (sentReminders.size > 1000) {
      sentReminders.clear();
      console.log('🧹 Cleared old reminder tracking');
    }
  }, 60 * 60 * 1000);
}

export function stopNotificationService() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
    console.log('📢 Notification service stopped');
  }
}
