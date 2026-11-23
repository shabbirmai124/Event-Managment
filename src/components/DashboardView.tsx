import React from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Award,
  ArrowRight,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';
import type { Attendee, EventItem, MediaAsset, NavSection, Sponsor } from '../types';
import { ResilientImage } from './ResilientImage';

interface DashboardViewProps {
  events: EventItem[];
  attendees: Attendee[];
  sponsors: Sponsor[];
  mediaAssets: MediaAsset[];
  onNavigate: (section: NavSection) => void;
  onBookEvent: (eventId: string) => void;
  onOpenCreateEvent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  attendees,
  sponsors,
  mediaAssets,
  onNavigate,
  onBookEvent,
  onOpenCreateEvent,
}) => {
  const totalTickets = attendees.reduce((sum, a) => sum + a.tickets, 0);
  const totalRevenue = attendees.reduce((sum, a) => sum + a.totalPaid, 0);
  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const checkInRate =
    attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0;

  const upcomingEvents = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const recentAttendees = [...attendees].slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Published Events</span>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {events.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {mediaAssets.length} uploaded visual assets linked
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Tickets Issued</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {totalTickets}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums">{checkInRate}%</span> attendee check-in rate
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Ticket Revenue</span>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across {attendees.length} confirmed orders
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Active Sponsors</span>
            <Award className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {sponsors.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            $
            {sponsors
              .reduce((sum, s) => sum + s.contribution, 0)
              .toLocaleString('en-US')}{' '}
            underwritten
          </p>
        </div>
      </div>

      {/* Quick Operations Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Event Operations & Media Studio
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Schedule events, manage live attendee check-ins, inspect the 10 curated event photographs with venue notes, or upload new media assets directly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
          >
            <ImageIcon className="h-4 w-4" />
            View 10 Media Uploads
          </button>
          <button
            type="button"
            onClick={onOpenCreateEvent}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* Upcoming Events Spotlight */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Upcoming Flagship Events
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Next scheduled programs open for ticket reservation
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400 whitespace-nowrap shrink-0"
          >
            View all {events.length} events
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {upcomingEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <ResilientImage
                  src={ev.imageUrl}
                  alt={ev.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {ev.category} · {ev.date} · {ev.time}
                </p>
                <h3 className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {ev.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                  {ev.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-4 dark:border-slate-800">
                  <span className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {ev.price === 0 ? 'Free' : `$${ev.price.toFixed(2)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => onBookEvent(ev.id)}
                    className="rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings Ledger */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Recent Attendee Registrations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest ticket reservations and check-in statuses
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('attendees')}
            className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400 whitespace-nowrap shrink-0"
          >
            Open Attendee Roster
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                <th className="px-6 py-3">Ticket Code</th>
                <th className="px-6 py-3">Attendee</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3 text-right">Seats</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAttendees.map((att) => (
                <tr
                  key={att.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-3 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
                    {att.ticketCode}
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {att.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {att.email}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-700 dark:text-slate-300">
                    {att.eventName}
                  </td>
                  <td className="px-6 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {att.tickets}
                  </td>
                  <td className="px-6 py-3 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    ${att.totalPaid.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-xs font-semibold">
                    <span
                      className={
                        att.checkedIn
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }
                    >
                      {att.checkedIn ? 'Checked In' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
