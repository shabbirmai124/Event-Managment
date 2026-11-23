import React, { useState } from 'react';
import { HelpCircle, X, ArrowRight, Send } from 'lucide-react';
import type { NavSection } from '../types';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  stats: {
    eventsCount: number;
    mediaCount: number;
    attendeesCount: number;
    sponsorsCount: number;
  };
}

interface HelpMessage {
  sender: 'user' | 'desk';
  text: string;
  actionLabel?: string;
  actionSection?: NavSection;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  stats,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<HelpMessage[]>([
    {
      sender: 'desk',
      text: `Welcome to the EventPortal Help Desk. There are currently ${stats.eventsCount} published events and ${stats.mediaCount} uploaded media assets in the workspace. Select a quick topic or type a question below.`,
    },
  ]);

  if (!isOpen) return null;

  const resolveResponse = (inputText: string): HelpMessage => {
    const q = inputText.toLowerCase();
    if (q.includes('image') || q.includes('upload') || q.includes('photo') || q.includes('gallery')) {
      return {
        sender: 'desk',
        text: `The Media Gallery holds ${stats.mediaCount} curated and uploaded event photographs with detailed venue explanations. You can also upload custom JPG/PNG/WEBP files directly from your computer.`,
        actionLabel: 'Open Media Gallery',
        actionSection: 'gallery',
      };
    }
    if (q.includes('book') || q.includes('ticket') || q.includes('pay')) {
      return {
        sender: 'desk',
        text: 'Select any event from the Events directory and click Book Tickets, or open the Booking checkout directly to choose ticket quantities and receive an instant digital receipt.',
        actionLabel: 'Go to Booking',
        actionSection: 'booking',
      };
    }
    if (q.includes('attendee') || q.includes('check')) {
      return {
        sender: 'desk',
        text: `There are ${stats.attendeesCount} registered attendee bookings. You can toggle live check-ins, inspect ticket receipts, or export CSV rosters inside Attendees.`,
        actionLabel: 'Manage Attendees',
        actionSection: 'attendees',
      };
    }
    if (q.includes('sponsor') || q.includes('partner')) {
      return {
        sender: 'desk',
        text: `Currently tracking ${stats.sponsorsCount} active sponsors across Platinum, Gold, Silver, and Bronze tiers.`,
        actionLabel: 'View Sponsors',
        actionSection: 'sponsors',
      };
    }
    if (q.includes('analytic') || q.includes('report') || q.includes('csv') || q.includes('revenue')) {
      return {
        sender: 'desk',
        text: 'The Analytics section computes live revenue per event, occupancy percentages, check-in rates, and supports one-click CSV and JSON exports.',
        actionLabel: 'Open Analytics',
        actionSection: 'analytics',
      };
    }
    return {
      sender: 'desk',
      text: 'You can browse all 10 featured events, upload new event photography in Media Gallery, book tickets, check in attendees, or export live financial reports from Analytics.',
      actionLabel: 'Browse Events',
      actionSection: 'events',
    };
  };

  const handleSend = (textOverride?: string) => {
    const text = (textOverride ?? query).trim();
    if (!text) return;
    const reply = resolveResponse(text);
    setMessages((prev) => [...prev, { sender: 'user', text }, reply]);
    if (!textOverride) setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Portal Help Desk
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close help drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Quick Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'How do I upload images?',
              'How to book tickets?',
              'Attendee check-in',
              'Export CSV analytics',
            ].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleSend(topic)}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-700 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <p>{msg.text}</p>
                {msg.actionLabel && msg.actionSection && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(msg.actionSection!);
                      onClose();
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                  >
                    {msg.actionLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 border-t border-slate-200 p-4 dark:border-slate-800"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about events, images, booking..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
