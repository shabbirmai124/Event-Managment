import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Heart,
  MapPin,
  Clock,
  User,
  X,
  Upload,
  Pencil,
  Trash2,
  Calendar,
} from 'lucide-react';
import type {
  Attendee,
  EventCategory,
  EventItem,
  MediaAsset,
} from '../types';
import { ResilientImage } from './ResilientImage';

const CATEGORIES: EventCategory[] = [
  'Conference',
  'Workshop',
  'Meetup',
  'Webinar',
  'Gala',
  'Hackathon',
  'Forum',
  'Bootcamp',
  'Exhibition',
  'Retreat',
];

interface EventsViewProps {
  events: EventItem[];
  attendees: Attendee[];
  mediaAssets: MediaAsset[];
  wishlist: string[];
  isFormOpen: boolean;
  onSetFormOpen: (open: boolean) => void;
  onSaveEvent: (
    eventData: Omit<EventItem, 'id'>,
    editingId?: string,
    newUploadedAsset?: Omit<MediaAsset, 'id'>
  ) => void;
  onDeleteEvent: (eventId: string) => void;
  onBookEvent: (eventId: string) => void;
  onToggleWishlist: (eventId: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  attendees,
  mediaAssets,
  wishlist,
  isFormOpen,
  onSetFormOpen,
  onSaveEvent,
  onDeleteEvent,
  onBookEvent,
  onToggleWishlist,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc'>('date');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Create/Edit form state
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [date, setDate] = useState('2027-03-01');
  const [time, setTime] = useState('09:30');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('Conference');
  const [price, setPrice] = useState('95');
  const [capacity, setCapacity] = useState('120');
  const [speaker, setSpeaker] = useState('');
  const [speakerRole, setSpeakerRole] = useState('');
  const [imageUrl, setImageUrl] = useState(mediaAssets[0]?.src || '');
  const [uploadedPreviewName, setUploadedPreviewName] = useState('');
  const [uploadedAssetMeta, setUploadedAssetMeta] = useState<Omit<MediaAsset, 'id'> | undefined>(
    undefined
  );

  const ticketsSoldByEvent = useMemo(() => {
    const map = new Map<string, number>();
    attendees.forEach((a) => {
      map.set(a.eventId, (map.get(a.eventId) || 0) + a.tickets);
    });
    return map;
  }, [attendees]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((ev) => {
        const matchesSearch =
          !q ||
          ev.name.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q) ||
          ev.location.toLowerCase().includes(q) ||
          ev.speaker.toLowerCase().includes(q);
        const matchesCat = !categoryFilter || ev.category === categoryFilter;
        const matchesDate = !dateFilter || ev.date === dateFilter;
        return matchesSearch && matchesCat && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return a.date.localeCompare(b.date);
      });
  }, [events, search, categoryFilter, dateFilter, sortBy]);

  const openCreateModal = () => {
    setEditingId(undefined);
    setName('');
    setDescription('');
    setDetailedExplanation('');
    setDate('2027-03-01');
    setTime('09:30');
    setLocation('');
    setCategory('Conference');
    setPrice('95');
    setCapacity('120');
    setSpeaker('');
    setSpeakerRole('');
    setImageUrl(mediaAssets[0]?.src || '');
    setUploadedPreviewName('');
    setUploadedAssetMeta(undefined);
    onSetFormOpen(true);
  };

  const openEditModal = (ev: EventItem) => {
    setEditingId(ev.id);
    setName(ev.name);
    setDescription(ev.description);
    setDetailedExplanation(ev.detailedExplanation);
    setDate(ev.date);
    setTime(ev.time);
    setLocation(ev.location);
    setCategory(ev.category);
    setPrice(String(ev.price));
    setCapacity(String(ev.capacity));
    setSpeaker(ev.speaker);
    setSpeakerRole(ev.speakerRole);
    setImageUrl(ev.imageUrl);
    setUploadedPreviewName('');
    setUploadedAssetMeta(undefined);
    setSelectedEvent(null);
    onSetFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setImageUrl(dataUrl);
      setUploadedPreviewName(file.name);
      setUploadedAssetMeta({
        title: `${name || 'Custom Event'} Visual`,
        filename: file.name,
        src: dataUrl,
        category,
        dimensions: 'Uploaded Custom Aspect',
        fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        uploadedAt: new Date().toISOString().slice(0, 10),
        uploadedBy: 'Portal Organizer',
        venue: location || 'Custom Event Venue',
        caption: `User-uploaded visual for ${name || 'scheduled event'}.`,
        detailedExplanation:
          detailedExplanation ||
          `Custom image (${file.name}) uploaded via the Event Creation studio to illustrate the venue and atmosphere.`,
        isUserUploaded: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !location.trim()) return;

    const existing = editingId ? events.find((ev) => ev.id === editingId) : undefined;
    const payload: Omit<EventItem, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      detailedExplanation:
        detailedExplanation.trim() || description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      price: Math.max(0, parseFloat(price) || 0),
      capacity: Math.max(1, parseInt(capacity, 10) || 100),
      speaker: speaker.trim() || 'Program Chair',
      speakerRole: speakerRole.trim() || 'Lead Organizer',
      imageUrl: imageUrl.trim() || mediaAssets[0]?.src || '',
      agenda: existing?.agenda || [
        {
          time,
          title: `Opening Session: ${name.trim()}`,
          speaker: speaker.trim() || 'Program Chair',
        },
      ],
    };

    onSaveEvent(payload, editingId, uploadedAssetMeta);
    onSetFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Events Directory
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-mono tabular-nums">{filteredEvents.length}</span> of{' '}
            <span className="font-mono tabular-nums">{events.length}</span> scheduled programs
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative md:col-span-5">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, speaker, or venue..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="date">Date</option>
            <option value="price-asc">Price: Low</option>
            <option value="price-desc">Price: High</option>
          </select>
          {(search || categoryFilter || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setDateFilter('');
              }}
              className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Calendar className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            No matching events found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Adjust your search criteria or create a new scheduled event.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((ev) => {
            const isWishlisted = wishlist.includes(ev.id);
            const sold = ticketsSoldByEvent.get(ev.id) || 0;
            const remaining = Math.max(0, ev.capacity - sold);

            return (
              <article
                key={ev.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => setSelectedEvent(ev)}
                  className="aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left dark:bg-slate-800"
                >
                  <ResilientImage
                    src={ev.imageUrl}
                    alt={ev.name}
                    className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                  />
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {ev.category} · {ev.date} · {ev.time}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="text-left hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      {ev.name}
                    </button>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {ev.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {ev.speaker} · {ev.speakerRole}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <span className="font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {ev.price === 0 ? 'Free' : `$${ev.price.toFixed(2)}`}
                      </span>
                      <span className="ml-2 font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                        {remaining} seats left
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(ev.id)}
                        className={`rounded-lg border p-2 transition-colors ${
                          isWishlisted
                            ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                            : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800'
                        }`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(ev)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onBookEvent(ev.id)}
                        className="rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <ResilientImage
                src={selectedEvent.imageUrl}
                alt={selectedEvent.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {selectedEvent.category} · {selectedEvent.date} · {selectedEvent.time}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {selectedEvent.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-y border-slate-100 py-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedEvent.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {selectedEvent.speaker} ({selectedEvent.speakerRole})
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                  <Clock className="h-3.5 w-3.5" />
                  Capacity: {selectedEvent.capacity}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Program Overview & Detailed Explanation
                </h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedEvent.detailedExplanation}
                </p>
              </div>

              {selectedEvent.agenda.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Scheduled Agenda
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                    {selectedEvent.agenda.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.speaker}
                          </p>
                        </div>
                        <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedEvent)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const idToDelete = selectedEvent.id;
                      setSelectedEvent(null);
                      onDeleteEvent(idToDelete);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {selectedEvent.price === 0
                      ? 'Free Admission'
                      : `$${selectedEvent.price.toFixed(2)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedEvent.id;
                      setSelectedEvent(null);
                      onBookEvent(id);
                    }}
                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
                  >
                    Reserve Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingId ? 'Edit Event Program' : 'Create New Event'}
              </h3>
              <button
                type="button"
                onClick={() => onSetFormOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Distributed Systems Symposium"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Convention Center Hall B"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ticket Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Venue Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Lead Speaker / Host
                  </label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    placeholder="Dr. Maya Vance"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Speaker Title / Organization
                  </label>
                  <input
                    type="text"
                    value={speakerRole}
                    onChange={(e) => setSpeakerRole(e.target.value)}
                    placeholder="VP Engineering, Meridian"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Concise summary displayed on the event directory card..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Explanation & Logistics
                </label>
                <textarea
                  rows={3}
                  value={detailedExplanation}
                  onChange={(e) => setDetailedExplanation(e.target.value)}
                  placeholder="Full curriculum, audience profile, venue amenities, and ticket inclusions..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Event Cover Image (Select from Uploaded Library or Upload New File)
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={mediaAssets.some((m) => m.src === imageUrl) ? imageUrl : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setImageUrl(e.target.value);
                        setUploadedAssetMeta(undefined);
                        setUploadedPreviewName('');
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">Select from {mediaAssets.length} uploaded media assets...</option>
                    {mediaAssets.map((m) => (
                      <option key={m.id} value={m.src}>
                        {m.title}
                      </option>
                    ))}
                  </select>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadedPreviewName ? uploadedPreviewName : 'Upload Image File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSetFormOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  {editingId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
