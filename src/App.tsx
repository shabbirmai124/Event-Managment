import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Images,
  Ticket,
  Users,
  Heart,
  Award,
  BarChart3,
  Sun,
  Moon,
  HelpCircle,
  LogIn,
  LogOut,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  SEED_ATTENDEES,
  SEED_EVENTS,
  SEED_MEDIA_ASSETS,
  SEED_REMINDERS,
  SEED_SPONSORS,
} from './data/seedData';
import type {
  Attendee,
  EventItem,
  MediaAsset,
  NavSection,
  ReminderItem,
  Sponsor,
  ToastMessage,
  UserAccount,
} from './types';
import { DashboardView } from './components/DashboardView';
import { EventsView } from './components/EventsView';
import { GalleryView } from './components/GalleryView';
import { BookingView } from './components/BookingView';
import { AttendeesView } from './components/AttendeesView';
import { WishlistView } from './components/WishlistView';
import { SponsorsView } from './components/SponsorsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AuthModal } from './components/AuthModal';
import { ConfirmModal } from './components/ConfirmModal';
import { HelpDrawer } from './components/HelpDrawer';
import { ToastContainer } from './components/ToastContainer';

const STORAGE_KEYS = {
  events: 'ep_events_v2',
  media: 'ep_media_v2',
  attendees: 'ep_attendees_v2',
  sponsors: 'ep_sponsors_v2',
  wishlist: 'ep_wishlist_v2',
  reminders: 'ep_reminders_v2',
  users: 'ep_users_v2',
  currentUser: 'ep_current_user_v2',
  theme: 'ep_theme_v2',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'gallery', label: 'Media Gallery', icon: Images },
  { id: 'booking', label: 'Booking', icon: Ticket },
  { id: 'attendees', label: 'Attendees', icon: Users },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'sponsors', label: 'Sponsors', icon: Award },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function App() {
  const [section, setSection] = useState<NavSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return readStorage<boolean>(STORAGE_KEYS.theme, false);
  });

  const [events, setEvents] = useState<EventItem[]>(() =>
    readStorage<EventItem[]>(STORAGE_KEYS.events, SEED_EVENTS)
  );
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() =>
    readStorage<MediaAsset[]>(STORAGE_KEYS.media, SEED_MEDIA_ASSETS)
  );
  const [attendees, setAttendees] = useState<Attendee[]>(() =>
    readStorage<Attendee[]>(STORAGE_KEYS.attendees, SEED_ATTENDEES)
  );
  const [sponsors, setSponsors] = useState<Sponsor[]>(() =>
    readStorage<Sponsor[]>(STORAGE_KEYS.sponsors, SEED_SPONSORS)
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.wishlist, ['evt-01', 'evt-05'])
  );
  const [reminders, setReminders] = useState<ReminderItem[]>(() =>
    readStorage<ReminderItem[]>(STORAGE_KEYS.reminders, SEED_REMINDERS)
  );
  const [users, setUsers] = useState<Array<UserAccount & { password: string }>>(() =>
    readStorage(STORAGE_KEYS.users, [
      {
        id: 'usr-demo',
        name: 'Jordan Avery',
        email: 'organizer@eventportal.io',
        role: 'Organizer',
        password: 'demo',
      },
    ])
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    readStorage<UserAccount | null>(STORAGE_KEYS.currentUser, {
      id: 'usr-demo',
      name: 'Jordan Avery',
      email: 'organizer@eventportal.io',
      role: 'Organizer',
    })
  );

  const [selectedBookingEventId, setSelectedBookingEventId] = useState<string>(
    SEED_EVENTS[0].id
  );
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });
  const [helpOpen, setHelpOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist domain state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.media, JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify(attendees));
  }, [attendees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sponsors, JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  }, [currentUser]);

  const notify = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const handleNavigate = (target: NavSection) => {
    setSection(target);
    setMobileMenuOpen(false);
  };

  const handleBookEvent = (eventId: string) => {
    setSelectedBookingEventId(eventId);
    setSection('booking');
    setMobileMenuOpen(false);
  };

  const handleSaveEvent = (
    eventData: Omit<EventItem, 'id'>,
    editingId?: string,
    newUploadedAsset?: Omit<MediaAsset, 'id'>
  ) => {
    const finalId = editingId || `evt-${Date.now()}`;
    if (newUploadedAsset) {
      const mediaId = `img-${Date.now()}`;
      setMediaAssets((prev) => [
        { ...newUploadedAsset, id: mediaId, linkedEventId: finalId },
        ...prev,
      ]);
    }

    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingId ? { ...eventData, id: editingId } : ev))
      );
      notify('success', 'Event updated', `"${eventData.name}" changes have been saved.`);
    } else {
      setEvents((prev) => [{ ...eventData, id: finalId }, ...prev]);
      notify('success', 'Event published', `"${eventData.name}" is now live in the directory.`);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    setConfirmState({
      open: true,
      title: 'Delete Event',
      message: `Are you sure you want to remove "${ev?.name || 'this event'}"? Existing attendee records will remain in the roster.`,
      confirmLabel: 'Delete Event',
      onConfirm: () => {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        setWishlist((prev) => prev.filter((id) => id !== eventId));
        setConfirmState((s) => ({ ...s, open: false }));
        notify('info', 'Event deleted');
      },
    });
  };

  const handleUploadMedia = (asset: Omit<MediaAsset, 'id'>) => {
    const id = `img-${Date.now()}`;
    setMediaAssets((prev) => [{ ...asset, id }, ...prev]);
    notify('success', 'Image uploaded', `"${asset.title}" added to the Media Gallery.`);
  };

  const handleDeleteMedia = (assetId: string) => {
    setConfirmState({
      open: true,
      title: 'Remove Uploaded Image',
      message: 'Remove this user-uploaded image from the Media Gallery?',
      confirmLabel: 'Remove Image',
      onConfirm: () => {
        setMediaAssets((prev) => prev.filter((m) => m.id !== assetId));
        setConfirmState((s) => ({ ...s, open: false }));
        notify('info', 'Image removed');
      },
    });
  };

  const handleCompleteBooking = (
    booking: Omit<Attendee, 'id' | 'ticketCode' | 'bookedAt'>
  ): Attendee => {
    const record: Attendee = {
      ...booking,
      id: `att-${Date.now()}`,
      ticketCode: `EVT-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}`,
      bookedAt: new Date().toISOString().slice(0, 10),
    };
    setAttendees((prev) => [...prev, record]);
    notify('success', 'Booking confirmed', `Ticket ${record.ticketCode} issued for ${record.name}.`);
    return record;
  };

  const handleToggleCheckIn = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === attendeeId ? { ...a, checkedIn: !a.checkedIn } : a))
    );
    const target = attendees.find((a) => a.id === attendeeId);
    if (target) {
      notify(
        'success',
        target.checkedIn ? 'Check-in reverted' : 'Attendee checked in',
        `${target.name} (${target.ticketCode})`
      );
    }
  };

  const handleRemoveAttendee = (attendeeId: string) => {
    const target = attendees.find((a) => a.id === attendeeId);
    setConfirmState({
      open: true,
      title: 'Remove Attendee',
      message: `Remove registration for ${target?.name || 'this attendee'}?`,
      confirmLabel: 'Remove',
      onConfirm: () => {
        setAttendees((prev) => prev.filter((a) => a.id !== attendeeId));
        setConfirmState((s) => ({ ...s, open: false }));
        notify('info', 'Attendee removed');
      },
    });
  };

  const handleToggleWishlist = (eventId: string) => {
    const exists = wishlist.includes(eventId);
    setWishlist((prev) =>
      exists ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
    notify('info', exists ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleSetReminder = (eventId: string, leadTime: string) => {
    setReminders((prev) => {
      const without = prev.filter((r) => r.eventId !== eventId);
      return [
        ...without,
        { eventId, leadTime, createdAt: new Date().toISOString().slice(0, 10) },
      ];
    });
    notify('success', 'Reminder scheduled', `Notification set for ${leadTime}.`);
  };

  const handleSaveSponsor = (data: Omit<Sponsor, 'id'>, editingId?: string) => {
    if (editingId) {
      setSponsors((prev) =>
        prev.map((s) => (s.id === editingId ? { ...data, id: editingId } : s))
      );
      notify('success', 'Sponsor updated', `${data.name} saved.`);
    } else {
      setSponsors((prev) => [{ ...data, id: `spn-${Date.now()}` }, ...prev]);
      notify('success', 'Sponsor added', `${data.name} added to directory.`);
    }
  };

  const handleRemoveSponsor = (sponsorId: string) => {
    const sp = sponsors.find((s) => s.id === sponsorId);
    setConfirmState({
      open: true,
      title: 'Remove Sponsor',
      message: `Remove ${sp?.name || 'this sponsor'} from the underwriting directory?`,
      confirmLabel: 'Remove',
      onConfirm: () => {
        setSponsors((prev) => prev.filter((s) => s.id !== sponsorId));
        setConfirmState((s) => ({ ...s, open: false }));
        notify('info', 'Sponsor removed');
      },
    });
  };

  const handleLogin = (email: string, password: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: 'Email or password did not match any registered account.' };
    }
    const { password: _pw, ...account } = found;
    setCurrentUser(account);
    notify('success', 'Signed in', `Welcome back, ${account.name}.`);
    return { ok: true };
  };

  const handleRegister = (name: string, email: string, password: string) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'Member' as const,
      password,
    };
    setUsers((prev) => [...prev, newUser]);
    const { password: _pw, ...account } = newUser;
    setCurrentUser(account);
    notify('success', 'Account created', `Signed in as ${account.name}.`);
    return { ok: true };
  };

  const handleDemoLogin = () => {
    const demo: UserAccount = {
      id: 'usr-demo',
      name: 'Jordan Avery',
      email: 'organizer@eventportal.io',
      role: 'Organizer',
    };
    setCurrentUser(demo);
    notify('success', 'Signed in as Demo Organizer');
  };

  const handleResetDemoData = () => {
    setConfirmState({
      open: true,
      title: 'Restore Default Dataset',
      message:
        'Restore the default 10 events, 10 uploaded photographs, attendees, sponsors, and reminders?',
      confirmLabel: 'Restore Defaults',
      onConfirm: () => {
        setEvents(SEED_EVENTS);
        setMediaAssets(SEED_MEDIA_ASSETS);
        setAttendees(SEED_ATTENDEES);
        setSponsors(SEED_SPONSORS);
        setWishlist(['evt-01', 'evt-05']);
        setReminders(SEED_REMINDERS);
        setConfirmState((s) => ({ ...s, open: false }));
        notify('success', 'Workspace restored', 'All 10 default events and images restored.');
      },
    });
  };

  const activeNavLabel = NAV_ITEMS.find((n) => n.id === section)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleNavigate('dashboard')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
          >
            EventPortal
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            const count =
              item.id === 'events'
                ? events.length
                : item.id === 'gallery'
                  ? mediaAssets.length
                  : item.id === 'wishlist'
                    ? wishlist.length
                    : undefined;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {count !== undefined && (
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      active ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Account & Workspace Controls */}
        <div className="border-t border-slate-200 p-4 space-y-3 dark:border-slate-800">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser(null);
                  notify('info', 'Signed out');
                }}
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModal({ open: true, mode: 'login' })}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In / Register
            </button>
          )}

          <button
            type="button"
            onClick={handleResetDemoData}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Demo Dataset
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Top Bar (Clean 3-Zone Contract) */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-8 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8 dark:border-slate-800 dark:bg-slate-900/95">
          {/* Zone 1: Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm whitespace-nowrap shrink-0">
              <span className="text-slate-400 dark:text-slate-500">Workspace</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <h1 className="font-semibold text-slate-900 dark:text-slate-100">
                {activeNavLabel}
              </h1>
            </div>
          </div>

          {/* Zone 2: Quick Jump Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => handleNavigate('events')}
              className="hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('gallery')}
              className="hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
            >
              10 Uploaded Photos
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('attendees')}
              className="hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
            >
              Check-In
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('analytics')}
              className="hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
            >
              Reports
            </button>
          </nav>

          {/* Zone 3: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open help desk"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSection('events');
                setIsEventFormOpen(true);
              }}
              className="rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
            >
              New Event
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-8">
          {section === 'dashboard' && (
            <DashboardView
              events={events}
              attendees={attendees}
              sponsors={sponsors}
              mediaAssets={mediaAssets}
              onNavigate={handleNavigate}
              onBookEvent={handleBookEvent}
              onOpenCreateEvent={() => {
                setSection('events');
                setIsEventFormOpen(true);
              }}
            />
          )}

          {section === 'events' && (
            <EventsView
              events={events}
              attendees={attendees}
              mediaAssets={mediaAssets}
              wishlist={wishlist}
              isFormOpen={isEventFormOpen}
              onSetFormOpen={setIsEventFormOpen}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              onBookEvent={handleBookEvent}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {section === 'gallery' && (
            <GalleryView
              mediaAssets={mediaAssets}
              events={events}
              onUploadMedia={handleUploadMedia}
              onDeleteMedia={handleDeleteMedia}
              onBookLinkedEvent={handleBookEvent}
            />
          )}

          {section === 'booking' && (
            <BookingView
              events={events}
              attendees={attendees}
              selectedEventId={selectedBookingEventId}
              onSelectEventId={setSelectedBookingEventId}
              currentUser={currentUser}
              onCompleteBooking={handleCompleteBooking}
              onGoToAttendees={() => handleNavigate('attendees')}
            />
          )}

          {section === 'attendees' && (
            <AttendeesView
              attendees={attendees}
              events={events}
              onToggleCheckIn={handleToggleCheckIn}
              onRemoveAttendee={handleRemoveAttendee}
            />
          )}

          {section === 'wishlist' && (
            <WishlistView
              events={events}
              wishlist={wishlist}
              reminders={reminders}
              onRemoveFromWishlist={handleToggleWishlist}
              onSetReminder={handleSetReminder}
              onBookEvent={handleBookEvent}
              onExploreEvents={() => handleNavigate('events')}
            />
          )}

          {section === 'sponsors' && (
            <SponsorsView
              sponsors={sponsors}
              onSaveSponsor={handleSaveSponsor}
              onRemoveSponsor={handleRemoveSponsor}
            />
          )}

          {section === 'analytics' && (
            <AnalyticsView
              events={events}
              attendees={attendees}
              sponsors={sponsors}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal((s) => ({ ...s, open: false }))}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={handleDemoLogin}
        currentUser={currentUser}
      />

      <HelpDrawer
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        onNavigate={handleNavigate}
        stats={{
          eventsCount: events.length,
          mediaCount: mediaAssets.length,
          attendeesCount: attendees.length,
          sponsorsCount: sponsors.length,
        }}
      />

      <ConfirmModal
        isOpen={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}

export default App;
