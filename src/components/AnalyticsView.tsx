import React, { useMemo } from 'react';
import { Download, FileJson } from 'lucide-react';
import type { Attendee, EventItem, Sponsor } from '../types';

interface AnalyticsViewProps {
  events: EventItem[];
  attendees: Attendee[];
  sponsors: Sponsor[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  events,
  attendees,
  sponsors,
}) => {
  const eventMetrics = useMemo(() => {
    return events.map((ev) => {
      const evAttendees = attendees.filter((a) => a.eventId === ev.id);
      const ticketsSold = evAttendees.reduce((sum, a) => sum + a.tickets, 0);
      const checkedInSeats = evAttendees
        .filter((a) => a.checkedIn)
        .reduce((sum, a) => sum + a.tickets, 0);
      const revenue = evAttendees.reduce((sum, a) => sum + a.totalPaid, 0);
      const occupancyPct = ev.capacity > 0 ? Math.min(100, Math.round((ticketsSold / ev.capacity) * 100)) : 0;

      return {
        id: ev.id,
        name: ev.name,
        category: ev.category,
        capacity: ev.capacity,
        ticketsSold,
        checkedInSeats,
        revenue,
        occupancyPct,
      };
    });
  }, [events, attendees]);

  const totalTicketRevenue = attendees.reduce((s, a) => s + a.totalPaid, 0);
  const totalSponsorRevenue = sponsors.reduce((s, sp) => s + sp.contribution, 0);
  const totalCombinedRevenue = totalTicketRevenue + totalSponsorRevenue;
  const totalTickets = attendees.reduce((s, a) => s + a.tickets, 0);
  const totalCapacity = events.reduce((s, e) => s + e.capacity, 0);
  const overallOccupancy =
    totalCapacity > 0 ? ((totalTickets / totalCapacity) * 100).toFixed(1) : '0.0';

  const maxEventRevenue = Math.max(1, ...eventMetrics.map((m) => m.revenue));

  const exportCsv = () => {
    const headers = [
      'Event ID',
      'Event Name',
      'Category',
      'Capacity',
      'Tickets Sold',
      'Occupancy %',
      'Checked-In Seats',
      'Ticket Revenue ($)',
    ];
    const rows = eventMetrics.map((m) => [
      m.id,
      m.name,
      m.category,
      String(m.capacity),
      String(m.ticketsSold),
      `${m.occupancyPct}%`,
      String(m.checkedInSeats),
      m.revenue.toFixed(2),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalEvents: events.length,
        totalTicketsSold: totalTickets,
        totalCapacity,
        overallOccupancyPct: overallOccupancy,
        ticketRevenue: totalTicketRevenue,
        sponsorshipRevenue: totalSponsorRevenue,
        combinedRevenue: totalCombinedRevenue,
      },
      events: eventMetrics,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Analytics & Financial Reporting
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live attendance occupancy, ticket revenue, and sponsorship underwriting metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
          >
            <FileJson className="h-3.5 w-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Combined Gross Revenue
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            ${totalCombinedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tickets (${totalTicketRevenue.toLocaleString('en-US')}) + Sponsors ($
            {totalSponsorRevenue.toLocaleString('en-US')})
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Portfolio Seat Occupancy
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {overallOccupancy}%
          </p>
          <p className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {totalTickets} / {totalCapacity} seats reserved
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Average Ticket Order Value
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            $
            {attendees.length > 0
              ? (totalTicketRevenue / attendees.length).toFixed(2)
              : '0.00'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across {attendees.length} confirmed bookings
          </p>
        </div>
      </div>

      {/* Revenue Distribution Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Ticket Revenue by Event
        </h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Proportional gross ticket revenue computed from live registrations
        </p>

        <div className="mt-5 space-y-3.5">
          {eventMetrics.map((m) => {
            const widthPct = Math.round((m.revenue / maxEventRevenue) * 100);
            return (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-4">
                    {m.name}
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100 shrink-0">
                    ${m.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-700 dark:bg-blue-500"
                    style={{ width: `${Math.max(m.revenue > 0 ? 3 : 0, widthPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Performance Ledger */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Event Performance Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Capacity</th>
                <th className="px-5 py-3 text-right">Sold</th>
                <th className="px-5 py-3 text-right">Occupancy</th>
                <th className="px-5 py-3 text-right">Checked In</th>
                <th className="px-5 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {eventMetrics.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {m.name}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {m.category}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {m.capacity}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {m.ticketsSold}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {m.occupancyPct}%
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {m.checkedInSeats}
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    ${m.revenue.toFixed(2)}
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
