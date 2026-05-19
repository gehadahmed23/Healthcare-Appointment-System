export interface INotification {
  id: string;
  recipientId: string;
  message: string;
  type: 'appointment_booked' | 'appointment_updated' | 'status_changed';
  status: 'unread' | 'read';
  createdAt: string;
  appointmentId: string;
}
