import React, { useState } from 'react';
import {
  Upload,
  Maximize2,
  X,
  MapPin,
  FileImage,
  Calendar,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import type { EventCategory, EventItem, MediaAsset } from '../types';
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

interface GalleryViewProps {
  mediaAssets: MediaAsset[];
  events: EventItem[];
  onUploadMedia: (asset: Omit<MediaAsset, 'id'>) => void;
  onDeleteMedia: (assetId: string) => void;
  onBookLinkedEvent: (eventId: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  mediaAssets,
  events,
  onUploadMedia,
  onDeleteMedia,
  onBookLinkedEvent,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [inspecting, setInspecting] = useState<MediaAsset | null>(null);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  // Upload form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Conference');
  const [venue, setVenue] = useState('');
  const [caption, setCaption] = useState('');
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [linkedEventId, setLinkedEventId] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [filename, setFilename] = useState('');
  const [fileSize, setFileSize] = useState('');

  const filteredAssets = filterCategory
    ? mediaAssets.filter((m) => m.category === filterCategory)
    : mediaAssets;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    setFileSize(`${Math.max(1, Math.round(file.size / 1024))} KB`);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '));
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewSrc || !title.trim() || !detailedExplanation.trim()) return;

    onUploadMedia({
      title: `${String(mediaAssets.length + 1).padStart(2, '0')}. ${title.trim()}`,
      filename: filename || 'uploaded_event_photo.jpg',
      src: previewSrc,
      category,
      dimensions: 'Custom Upload (Responsive 4:3)',
      fileSize: fileSize || 'Uploaded',
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: 'Portal Organizer',
      venue: venue.trim() || 'Specified Venue',
      linkedEventId: linkedEventId || undefined,
      caption: caption.trim() || title.trim(),
      detailedExplanation: detailedExplanation.trim(),
      isUserUploaded: true,
    });

    setTitle('');
    setVenue('');
    setCaption('');
    setDetailedExplanation('');
    setLinkedEventId('');
    setPreviewSrc('');
    setFilename('');
    setFileSize('');
    setShowUploadPanel(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Uploaded Event Media & Detailed Image Guide
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums">{mediaAssets.length}</span> uploaded high-resolution event assets with venue specifications and editorial explanations
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploadPanel((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
        >
          <Upload className="h-4 w-4" />
          {showUploadPanel ? 'Close Upload Studio' : 'Upload New Image'}
        </button>
      </div>

      {/* Upload Studio Panel */}
      {showUploadPanel && (
        <form
          onSubmit={handleUploadSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Upload Event Photograph & Documentation
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Attach a local image file along with venue details and a clear explanation of what the image depicts.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <label className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center hover:border-blue-600 dark:border-slate-700 dark:bg-slate-950/50">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Upload preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="p-4">
                    <Upload className="mx-auto h-7 w-7 text-slate-400" />
                    <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Click to select image file
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      JPG, PNG, or WEBP
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  required={!previewSrc}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Image Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Main Hall Auditorium Setup"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Event Category
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
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g., West Wing Exhibition Hall"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Link to Event (Optional)
                </label>
                <select
                  value={linkedEventId}
                  onChange={(e) => setLinkedEventId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">None</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="One-sentence summary of the scene..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Explanation
                </label>
                <textarea
                  rows={3}
                  required
                  value={detailedExplanation}
                  onChange={(e) => setDetailedExplanation(e.target.value)}
                  placeholder="Explain the photographic subject, room layout, capacity context, and how this visual is used in the portal..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowUploadPanel(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Publish Image to Gallery
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setFilterCategory('')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            filterCategory === ''
              ? 'bg-blue-700 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          All ({mediaAssets.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = mediaAssets.filter((m) => m.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterCategory === cat
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* 10+ Uploaded Images Grid with Detailed Explanations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredAssets.map((asset) => {
          const linkedEvent = events.find((e) => e.id === asset.linkedEventId);

          return (
            <article
              key={asset.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="group relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <ResilientImage
                  src={asset.src}
                  alt={asset.title}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setInspecting(asset)}
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-slate-900"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Inspect
                </button>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {asset.category} · {asset.dimensions} · {asset.fileSize} · {asset.uploadedAt}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {asset.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {asset.caption}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Detailed Image Explanation
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {asset.detailedExplanation}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {asset.venue}
                  </span>

                  <div className="flex items-center gap-2">
                    {linkedEvent && (
                      <button
                        type="button"
                        onClick={() => onBookLinkedEvent(linkedEvent.id)}
                        className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline dark:text-blue-400 whitespace-nowrap shrink-0"
                      >
                        Book {linkedEvent.name}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                    {asset.isUserUploaded && (
                      <button
                        type="button"
                        onClick={() => onDeleteMedia(asset.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:underline dark:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Inspector Modal */}
      {inspecting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {inspecting.title}
                </h3>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {inspecting.filename}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspecting(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-950">
              <ResilientImage
                src={inspecting.src}
                alt={inspecting.title}
                className="mx-auto max-h-[55vh] w-full object-contain"
              />
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div>
                  <span className="block text-slate-500 dark:text-slate-400">Resolution</span>
                  <span className="mt-0.5 block font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {inspecting.dimensions}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-slate-400">File Size</span>
                  <span className="mt-0.5 block font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {inspecting.fileSize}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-slate-400">Uploaded Date</span>
                  <span className="mt-0.5 flex items-center gap-1 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    <Calendar className="h-3 w-3" />
                    {inspecting.uploadedAt}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-slate-400">Uploaded By</span>
                  <span className="mt-0.5 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                    <FileImage className="h-3 w-3" />
                    {inspecting.uploadedBy}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Venue & Detailed Editorial Context
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {inspecting.detailedExplanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
