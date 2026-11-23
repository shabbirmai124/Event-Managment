export type EventCategory =
  | 'Conference'
  | 'Workshop'
  | 'Meetup'
  | 'Webinar'
  | 'Gala'
  | 'Hackathon'
  | 'Forum'
  | 'Bootcamp'
  | 'Exhibition'
  | 'Retreat';

export type SponsorTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export type PaymentMethod = 'card' | 'paypal' | 'invoice';

export type NavSection =
  | 'dashboard'
  | 'events'
  | 'gallery'
  | 'booking'
  | 'attendees'
  | 'wishlist'
  | 'sponsors'
  | 'analytics';

export interface AgendaSession {
  time: string;
  title: string;
  speaker: string;
}

export interface EventItem {
  id: string;
  name: string;
  description: string;
  detailedExplanation: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  price: number;
  capacity: number;
  speaker: string;
  speakerRole: string;
  imageId?: string;
  imageUrl: string;
  agenda: AgendaSession[];
}

export interface MediaAsset {
  id: string;
  title: string;
  filename: string;
  src: string;
  category: EventCategory;
  dimensions: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  venue: string;
  linkedEventId?: string;
  caption: string;
  detailedExplanation: string;
  isUserUploaded?: boolean;
}

export interface Attendee {
  id: string;
  ticketCode: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  tickets: number;
  unitPrice: number;
  totalPaid: number;
  paymentMethod: PaymentMethod;
  checkedIn: boolean;
  bookedAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  level: SponsorTier;
  contact: string;
  website: string;
  contribution: number;
  logoUrl?: string;
  notes: string;
}

export interface ReminderItem {
  eventId: string;
  leadTime: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Organizer' | 'Member';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
