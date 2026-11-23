import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import type { Sponsor, SponsorTier } from '../types';

const TIERS: SponsorTier[] = ['Platinum', 'Gold', 'Silver', 'Bronze'];

interface SponsorsViewProps {
  sponsors: Sponsor[];
  onSaveSponsor: (data: Omit<Sponsor, 'id'>, editingId?: string) => void;
  onRemoveSponsor: (sponsorId: string) => void;
}

export const SponsorsView: React.FC<SponsorsViewProps> = ({
  sponsors,
  onSaveSponsor,
  onRemoveSponsor,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<SponsorTier>('Gold');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState('');
  const [contribution, setContribution] = useState('5000');
  const [notes, setNotes] = useState('');

  const openAdd = () => {
    setEditingId(undefined);
    setName('');
    setLevel('Gold');
    setContact('');
    setWebsite('');
    setContribution('5000');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEdit = (sp: Sponsor) => {
    setEditingId(sp.id);
    setName(sp.name);
    setLevel(sp.level);
    setContact(sp.contact);
    setWebsite(sp.website);
    setContribution(String(sp.contribution));
    setNotes(sp.notes);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveSponsor(
      {
        name: name.trim(),
        level,
        contact: contact.trim() || 'partnerships@sponsor.com',
        website: website.trim() || 'https://example.com',
        contribution: Math.max(0, parseFloat(contribution) || 0),
        notes: notes.trim() || 'Program underwriting partner.',
      },
      editingId
    );
    setIsModalOpen(false);
  };

  const totalUnderwritten = sponsors.reduce((sum, s) => sum + s.contribution, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Sponsors & Underwriting Partners
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total committed sponsorship:{' '}
            <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              ${totalUnderwritten.toLocaleString('en-US')}
            </span>{' '}
            across <span className="font-mono tabular-nums">{sponsors.length}</span> partners
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Sponsor
        </button>
      </div>

      {/* Tier Breakdown Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TIERS.map((tier) => {
          const tierSponsors = sponsors.filter((s) => s.level === tier);
          const sum = tierSponsors.reduce((acc, s) => acc + s.contribution, 0);
          return (
            <div
              key={tier}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {tier} Tier
              </p>
              <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                ${sum.toLocaleString('en-US')}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {tierSponsors.length} partner{tierSponsors.length === 1 ? '' : 's'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sponsors Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                <th className="px-5 py-3">Partner Name</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Contribution</th>
                <th className="px-5 py-3">Scope Notes</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sponsors.map((sp) => (
                <tr
                  key={sp.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {sp.name}
                    </div>
                    {sp.website && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        {sp.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {sp.level}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {sp.contact}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                    ${sp.contribution.toLocaleString('en-US')}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {sp.notes}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(sp)}
                        className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        aria-label={`Edit ${sp.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSponsor(sp.id)}
                        className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        aria-label={`Remove ${sp.name}`}
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
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingId ? 'Edit Sponsor Details' : 'Add New Sponsor'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sponsorship Tier
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as SponsorTier)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contribution ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Website
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sponsorship Scope Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  {editingId ? 'Save Sponsor' : 'Add Sponsor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
