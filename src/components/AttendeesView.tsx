import React, { useMemo, useState } from 'react';
import { Search, Download, Check, Undo2, Trash2, Users } from 'lucide-react';
import type { Attendee, EventItem } from '../types';

interface AttendeesViewProps {
  attendees: Attendee[];
  events: EventItem[];
  onToggleCheckIn: (attendeeId: string) => void;
  onRemoveAttendee: (attendeeId: string) => void;
}

export const AttendeesView: React.FC<AttendeesViewProps> = ({
  attendees,
  events,
  onToggleCheckIn,
  onRemoveAttendee,
}) => {
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked' | 'pending'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attendees.filter((att) => {
      const matchesEvent = !eventFilter || att.eventId === eventFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'checked' && att.checkedIn) ||
        (statusFilter === 'pending' && !att.checkedIn);
      const matchesSearch =
        !q ||
        att.name.toLowerCase().includes(q) ||
        att.email.toLowerCase().includes(q) ||
        att.ticketCode.toLowerCase().includes(q);
      return matchesEvent && matchesStatus && matchesSearch;
    });
  }, [attendees, eventFilter, statusFilter, search]);

  const handleExportCsv = () => {
    const headers = [
      'Ticket Code',
      'Name',
      'Email',
      'Event',
      'Seats',
      'Total Paid ($)',
      'Payment Method',
      'Checked In',
      'Booked Date',
    ];
    const rows = filtered.map((a) => [
      a.ticketCode,
      a.name,
      a.email,
      a.eventName,
      String(a.tickets),
      a.totalPaid.toFixed(2),
      a.paymentMethod,
      a.checkedIn ? 'Yes' : 'No',
      a.bookedAt,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-roster-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Attendee Roster & Check-In
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums">
              {attendees.filter((a) => a.checkedIn).length}
            </span>{' '}
            of <span className="font-mono tabular-nums">{attendees.length}</span> registrations checked in
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative md:col-span-5">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by attendee name, email, or ticket code..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">All Events</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 md:col-span-3 dark:border-slate-700 dark:bg-slate-800">
          {(['all', 'checked', 'pending'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`flex-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              No attendees match your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-5 py-3">Ticket Code</th>
                  <th className="px-5 py-3">Attendee</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3 text-right">Seats</th>
                  <th className="px-5 py-3 text-right">Paid</th>
                  <th className="px-5 py-3">Check-In Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((att) => (
                  <tr
                    key={att.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-3 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
                      {att.ticketCode}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {att.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {att.email}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      {att.eventName}
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {att.tickets}
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      ${att.totalPaid.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold">
                      <span
                        className={
                          att.checkedIn
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }
                      >
                        {att.checkedIn ? 'Checked In' : 'Pending Arrival'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleCheckIn(att.id)}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            att.checkedIn
                              ? 'border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {att.checkedIn ? (
                            <>
                              <Undo2 className="h-3.5 w-3.5" />
                              Undo
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Check In
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveAttendee(att.id)}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          aria-label={`Remove ${att.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
