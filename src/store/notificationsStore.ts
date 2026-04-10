import { create } from 'zustand';
import { notificationsService, type Notification } from '../services/notifications.service';
import { useAuthStore } from './authStore';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  reset: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    set({ loading: true, error: null });
    try {
      const notifications = await notificationsService.getNotifications(user.id);
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('Error fetching notifications:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  markAllAsRead: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) throw new Error('User not authenticated');

    try {
      await notificationsService.markAllAsRead(user.id);
      set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadCount: 0
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      set((state) => {
        const notification = state.notifications.find(n => n.id === notificationId);
        const wasUnread = notification && !notification.read;
        
        return {
          notifications: state.notifications.filter(n => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        };
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null
    });
  }
}));