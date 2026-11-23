import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, Printer, Ticket } from 'lucide-react';
import type { Attendee, EventItem, PaymentMethod, UserAccount } from '../types';
import { ResilientImage } from './ResilientImage';

interface BookingViewProps {
  events: EventItem[];
  attendees: Attendee[];
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  currentUser: UserAccount | null;
  onCompleteBooking: (booking: Omit<Attendee, 'id' | 'ticketCode' | 'bookedAt'>) => Attendee;
  onGoToAttendees: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  events,
  attendees,
  selectedEventId,
  onSelectEventId,
  currentUser,
  onCompleteBooking,
  onGoToAttendees,
}) => {
  const selectedEvent =
    events.find((e) => e.id === selectedEventId) || events[0] || null;

  const [tickets, setTickets] = useState(1);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [confirmedTicket, setConfirmedTicket] = useState<Attendee | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName((prev) => prev || currentUser.name);
      setEmail((prev) => prev || currentUser.email);
    }
  }, [currentUser]);

  if (!selectedEvent) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No events are currently available for booking.
        </p>
      </div>
    );
  }

  const alreadySold = attendees
    .filter((a) => a.eventId === selectedEvent.id)
    .reduce((sum, a) => sum + a.tickets, 0);
  const seatsRemaining = Math.max(0, selectedEvent.capacity - alreadySold);

  const subtotal = tickets * selectedEvent.price;
  const serviceFee = selectedEvent.price === 0 ? 0 : Math.round(subtotal * 0.03 * 100) / 100;
  const grandTotal = subtotal + serviceFee;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please enter your full name and email address.');
      return;
    }
    if (tickets < 1 || tickets > Math.max(1, seatsRemaining)) {
      setError(`Please select between 1 and ${Math.max(1, seatsRemaining)} seats.`);
      return;
    }
    if (paymentMethod === 'card' && selectedEvent.price > 0) {
      if (cardNumber.replace(/\s/g, '').length < 12 || expiry.length < 4 || cvv.length < 3) {
        setError('Please enter complete card number, expiry (MM/YY), and CVV.');
        return;
      }
    }

    const record = onCompleteBooking({
      name: name.trim(),
      email: email.trim(),
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      tickets,
      unitPrice: selectedEvent.price,
      totalPaid: grandTotal,
      paymentMethod,
      checkedIn: false,
    });

    setConfirmedTicket(record);
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  const handleDownloadReceipt = () => {
    if (!confirmedTicket) return;
    const text = [
      'EVENTPORTAL OFFICIAL TICKET RECEIPT',
      '===================================',
      `Ticket Code: ${confirmedTicket.ticketCode}`,
      `Event: ${confirmedTicket.eventName}`,
      `Attendee: ${confirmedTicket.name} (${confirmedTicket.email})`,
      `Quantity: ${confirmedTicket.tickets} seat(s)`,
      `Total Paid: $${confirmedTicket.totalPaid.toFixed(2)}`,
      `Payment Method: ${confirmedTicket.paymentMethod.toUpperCase()}`,
      `Issued Date: ${confirmedTicket.bookedAt}`,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${confirmedTicket.ticketCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Ticket Reservation & Checkout
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select an event, configure seat quantity, and issue an instant digital ticket receipt
        </p>
      </div>

      {confirmedTicket ? (
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Booking Confirmed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your seats have been added to the live attendee check-in roster.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm dark:border-slate-800 dark:bg-slate-950/50">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Ticket Code</span>
              <p className="mt-0.5 font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {confirmedTicket.ticketCode}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Paid</span>
              <p className="mt-0.5 font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                ${confirmedTicket.totalPaid.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Event</span>
              <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                {confirmedTicket.eventName}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Attendee</span>
              <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                {confirmedTicket.name} ({confirmedTicket.tickets} seat
                {confirmedTicket.tickets > 1 ? 's' : ''})
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              Download Receipt
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmedTicket(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Book Another
              </button>
              <button
                type="button"
                onClick={onGoToAttendees}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                View in Attendee Roster
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Checkout Form */}
          <form
            onSubmit={handleConfirm}
            className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Event
              </label>
              <select
                value={selectedEvent.id}
                onChange={(e) => {
                  onSelectEventId(e.target.value);
                  setTickets(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} — {ev.date} ({ev.price === 0 ? 'Free' : `$${ev.price}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, seatsRemaining)}
                  value={tickets}
                  onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Attendee Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jordan Avery"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirmation Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@company.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'card', label: 'Credit Card' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'invoice', label: 'Invoice / Free' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${
                      paymentMethod === m.id
                        ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && selectedEvent.price > 0 && (
                <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="08/28"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  Checkout authorization will be simulated via PayPal Express Checkout and immediately reflected in your ticket receipt.
                </p>
              )}

              {paymentMethod === 'invoice' && (
                <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  Generates an immediate seat reservation with net-15 corporate billing or complimentary free admission.
                </p>
              )}
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              <Ticket className="h-4 w-4" />
              Complete Booking (${grandTotal.toFixed(2)})
            </button>
          </form>

          {/* Right Order Summary */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                <ResilientImage
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {selectedEvent.category} · {selectedEvent.date} · {selectedEvent.time}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {selectedEvent.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedEvent.location}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>
                      Ticket Price (<span className="font-mono tabular-nums">{tickets}</span> × $
                      {selectedEvent.price.toFixed(2)})
                    </span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Platform Processing (3%)</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      ${serviceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2.5 text-base font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                    <span>Total Due</span>
                    <span className="font-mono tabular-nums">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <p className="mt-4 font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                  {seatsRemaining} of {selectedEvent.capacity} seats remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
