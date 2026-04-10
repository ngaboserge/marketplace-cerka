import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'quote_request' | 'quote_response' | 'listing_update' | 'price_alert' | 'system' | 'welcome' | 'verification';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const notificationsService = {
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('get_unread_notification_count', { user_uuid: userId });

    if (error) throw error;
    return data || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .rpc('mark_all_notifications_read', { user_uuid: userId });

    if (error) throw error;
  },

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data
      })
      .select()
      .single();

    if (error) throw error;
    return notification;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Helper methods for common notification types
  async notifyNewMessage(userId: string, senderName: string, messagePreview: string, conversationId: string): Promise<void> {
    await this.createNotification(
      userId,
      'message',
      `New message from ${senderName}`,
      messagePreview,
      { conversationId }
    );
  },

  async notifyQuoteRequest(userId: string, buyerName: string, productName: string, listingId: string): Promise<void> {
    await this.createNotification(
      userId,
      'quote_request',
      `New quote request from ${buyerName}`,
      `Quote requested for ${productName}`,
      { listingId }
    );
  },

  async notifyQuoteResponse(userId: string, supplierName: string, productName: string, quoteId: string): Promise<void> {
    await this.createNotification(
      userId,
      'quote_response',
      `Quote received from ${supplierName}`,
      `Quote for ${productName} is ready`,
      { quoteId }
    );
  },

  async notifyListingUpdate(userId: string, productName: string, updateType: string, listingId: string): Promise<void> {
    await this.createNotification(
      userId,
      'listing_update',
      `Product update: ${productName}`,
      `${updateType} for ${productName}`,
      { listingId }
    );
  },

  async notifyPriceAlert(userId: string, productName: string, newPrice: number, listingId: string): Promise<void> {
    await this.createNotification(
      userId,
      'price_alert',
      `Price alert: ${productName}`,
      `Price changed to ${newPrice.toLocaleString()} RWF`,
      { listingId }
    );
  },

  async notifyWelcome(userId: string, userName: string): Promise<void> {
    await this.createNotification(
      userId,
      'welcome',
      `Welcome to the marketplace, ${userName}!`,
      'Start exploring products and connect with suppliers across Rwanda.'
    );
  }
};