import React, { useState } from 'react';
import { Bell, Heart, Trash2, Calendar } from 'lucide-react';
import type { EventItem, ReminderItem } from '../types';
import { ResilientImage } from './ResilientImage';

interface WishlistViewProps {
  events: EventItem[];
  wishlist: string[];
  reminders: ReminderItem[];
  onRemoveFromWishlist: (eventId: string) => void;
  onSetReminder: (eventId: string, leadTime: string) => void;
  onBookEvent: (eventId: string) => void;
  onExploreEvents: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  events,
  wishlist,
  reminders,
  onRemoveFromWishlist,
  onSetReminder,
  onBookEvent,
  onExploreEvents,
}) => {
  const [leadSelections, setLeadSelections] = useState<Record<string, string>>({});

  const savedEvents = events.filter((ev) => wishlist.includes(ev.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Saved Wishlist & Event Reminders
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track programs you want to attend and schedule advance calendar notifications
        </p>
      </div>

      {savedEvents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Heart className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            Your wishlist is empty
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Save events from the Events Directory to configure reminders and compare schedules.
          </p>
          <button
            type="button"
            onClick={onExploreEvents}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Calendar className="h-4 w-4" />
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedEvents.map((ev) => {
            const activeReminder = reminders.find((r) => r.eventId === ev.id);
            const chosenLead =
              leadSelections[ev.id] || activeReminder?.leadTime || '1 day before';

            return (
              <div
                key={ev.id}
                className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-44 dark:bg-slate-800">
                  <ResilientImage
                    src={ev.imageUrl}
                    alt={ev.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {ev.category} · {ev.date} · {ev.time}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {ev.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {ev.location} ·{' '}
                    <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                      {ev.price === 0 ? 'Free' : `$${ev.price.toFixed(2)}`}
                    </span>
                  </p>

                  {activeReminder && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <Bell className="h-3.5 w-3.5" />
                      Reminder scheduled: {activeReminder.leadTime}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={chosenLead}
                    onChange={(e) =>
                      setLeadSelections((prev) => ({ ...prev, [ev.id]: e.target.value }))
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="2 hours before">2 hours before</option>
                    <option value="1 day before">1 day before</option>
                    <option value="3 days before">3 days before</option>
                    <option value="1 week before">1 week before</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onSetReminder(ev.id, chosenLead)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    {activeReminder ? 'Update Reminder' : 'Set Reminder'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookEvent(ev.id)}
                    className="rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
                  >
                    Book Tickets
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveFromWishlist(ev.id)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    aria-label={`Remove ${ev.name} from wishlist`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
