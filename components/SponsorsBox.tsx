'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  X,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import {
  Sponsor,
  INITIAL_SPONSORS,
  SPONSORS_STORAGE_KEY,
} from '@/lib/sponsors-data'
import { useTournament } from '@/context/TournamentContext'

// Clean vector / PNG logo presets for one-click admin selection
const LOGO_PRESETS = [
  { label: 'GitHub', url: 'https://cdn.simpleicons.org/github/white' },
  { label: 'Red Bull', url: 'https://cdn.simpleicons.org/redbull/D7F22B' },
  { label: 'JetBrains', url: 'https://cdn.simpleicons.org/jetbrains/white' },
  { label: 'Logitech G', url: 'https://cdn.simpleicons.org/logitechg/white' },
  { label: 'Intel', url: 'https://cdn.simpleicons.org/intel/white' },
  { label: 'ACM', url: 'https://cdn.simpleicons.org/acm/white' },
  { label: 'Google Cloud', url: 'https://cdn.simpleicons.org/googlecloud/white' },
  { label: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/white' },
]

export default function SponsorsBox() {
  const { isAdmin } = useTournament()
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_SPONSORS)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingSponsorId, setEditingSponsorId] = useState<string>('sponsor-github')
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formTier, setFormTier] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formLogoUrl, setFormLogoUrl] = useState('')
  const [formWebsiteUrl, setFormWebsiteUrl] = useState('')
  const [formIsFeatured, setFormIsFeatured] = useState(false)

  // Track client mount for createPortal SSR safety
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load persisted sponsors from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SPONSORS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSponsors(parsed)
          setEditingSponsorId(parsed[0].id)
        }
      }
    } catch (e) {
      console.warn('Could not load sponsors from storage:', e)
    }
  }, [])

  // Save to localStorage
  const saveSponsors = (updated: Sponsor[]) => {
    setSponsors(updated)
    try {
      localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('Could not save sponsors to storage:', e)
    }
  }

  // Keyboard accessibility: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditorOpen) {
        setIsEditorOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditorOpen])

  // Prevent background scrolling while modal is active
  useEffect(() => {
    if (isEditorOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isEditorOpen])

  // Open edit pop-up directly for a specific sponsor
  const startEditSponsor = (sp: Sponsor) => {
    setEditingSponsorId(sp.id)
    setFormName(sp.name)
    setFormTier(sp.tier)
    setFormTagline(sp.tagline || '')
    setFormLogoUrl(sp.logoUrl || '')
    setFormWebsiteUrl(sp.websiteUrl || '')
    setFormIsFeatured(sp.isFeatured || false)
    setIsEditorOpen(true)
    setSaveSuccessNotice(null)
  }

  // Open pop-up configured for the first sponsor or add
  const handleOpenConfigure = () => {
    if (sponsors.length > 0) {
      const target = sponsors.find((s) => s.id === editingSponsorId) || sponsors[0]
      startEditSponsor(target)
    } else {
      startAddSponsor()
    }
  }

  // Open pop-up to add a new sponsor
  const startAddSponsor = () => {
    setEditingSponsorId('new')
    setFormName('')
    setFormTier('Official Partner')
    setFormTagline('')
    setFormLogoUrl(LOGO_PRESETS[0].url)
    setFormWebsiteUrl('https://')
    setFormIsFeatured(false)
    setIsEditorOpen(true)
    setSaveSuccessNotice(null)
  }

  // Switch active sponsor being edited inside the pop-up
  const handleSelectSponsorToEdit = (id: string) => {
    if (id === 'new') {
      startAddSponsor()
    } else {
      const found = sponsors.find((s) => s.id === id)
      if (found) {
        startEditSponsor(found)
      }
    }
  }

  // Save changes or create sponsor from the pop-up
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formTier.trim()) return

    if (editingSponsorId === 'new') {
      const newSponsor: Sponsor = {
        id: `sponsor-${Date.now()}`,
        name: formName.trim(),
        tier: formTier.trim(),
        tagline: formTagline.trim() || undefined,
        logoUrl: formLogoUrl.trim() || undefined,
        websiteUrl: formWebsiteUrl.trim() || undefined,
        isFeatured: formIsFeatured,
      }
      const updated = [...sponsors, newSponsor]
      saveSponsors(updated)
      setEditingSponsorId(newSponsor.id)
      setSaveSuccessNotice(`Added ${newSponsor.name}`)
    } else {
      const updated = sponsors.map((sp) =>
        sp.id === editingSponsorId
          ? {
              ...sp,
              name: formName.trim(),
              tier: formTier.trim(),
              tagline: formTagline.trim() || undefined,
              logoUrl: formLogoUrl.trim() || undefined,
              websiteUrl: formWebsiteUrl.trim() || undefined,
              isFeatured: formIsFeatured,
            }
          : sp
      )
      saveSponsors(updated)
      setSaveSuccessNotice(`Updated ${formName.trim()}`)
    }

    setTimeout(() => {
      setIsEditorOpen(false)
      setSaveSuccessNotice(null)
    }, 400)
  }

  // Delete a sponsor
  const handleDeleteSponsor = (id: string) => {
    const updated = sponsors.filter((sp) => sp.id !== id)
    saveSponsors(updated)
    if (updated.length > 0) {
      startEditSponsor(updated[0])
    } else {
      startAddSponsor()
    }
  }

  // Reset to reference defaults
  const handleResetDefaults = () => {
    saveSponsors(INITIAL_SPONSORS)
    startEditSponsor(INITIAL_SPONSORS[0])
  }

  // Image load fallback helper
  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          SPONSORS BAR / RIBBON ON HOMEPAGE
          Compact horizontal strip showing partners
          ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl bg-ink-800/80 border border-white/10 px-3.5 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md shadow-subtle flex items-center justify-between gap-3">
        {/* Left: Eyebrow kicker */}
        <div className="flex items-center space-x-2 shrink-0 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-acid shadow-[0_0_6px_rgba(215,242,43,0.7)]" />
          <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-fog hidden xs:inline">
            SPONSORS
          </span>
          <span className="h-4 w-px bg-white/10 hidden xs:inline" />
        </div>

        {/* Center: Horizontal Ribbon of Sponsors */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
          {sponsors.map((sponsor) => {
            const isFeatured = sponsor.isFeatured
            const hasImage = sponsor.logoUrl && !brokenImages[sponsor.id]

            const Content = (
              <div
                className={`group/item flex items-center space-x-2 px-2.5 py-1 rounded-xl border transition-all duration-200 shrink-0 select-none ${
                  isFeatured
                    ? 'bg-acid/10 border-acid/35 hover:border-acid hover:bg-acid/15'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                {/* Photo / Logo Thumbnail */}
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-0.5 border ${
                    isFeatured
                      ? 'bg-acid/20 border-acid/40'
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  {hasImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="w-full h-full object-contain filter brightness-100"
                      onError={() => handleImageError(sponsor.id)}
                    />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-acid leading-none">
                      {sponsor.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Sponsor Name & Tier Pill */}
                <span className="text-xs font-sans font-bold text-paper whitespace-nowrap group-hover/item:text-acid transition-colors">
                  {sponsor.name}
                </span>

                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded shrink-0 ${
                    isFeatured
                      ? 'bg-acid text-slate-950 font-black'
                      : 'bg-white/5 text-mist'
                  }`}
                >
                  {sponsor.tier}
                </span>

                {/* Non-admin external link icon */}
                {!isAdmin && sponsor.websiteUrl && sponsor.websiteUrl !== '#' && (
                  <ExternalLink className="w-2.5 h-2.5 text-fog group-hover/item:text-acid transition-colors shrink-0" />
                )}

                {/* Admin edit indicator icon */}
                {isAdmin && (
                  <span
                    className="p-0.5 rounded text-acid/80 group-hover/item:text-acid transition-colors ml-0.5"
                    title="Click to edit details in pop-up box"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            )

            // In admin mode, clicking any sponsor chip directly opens the edit pop-up for it
            if (isAdmin) {
              return (
                <button
                  key={sponsor.id}
                  type="button"
                  onClick={() => startEditSponsor(sponsor)}
                  className="shrink-0 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-acid rounded-xl"
                  title={`Click to edit ${sponsor.name}`}
                >
                  {Content}
                </button>
              )
            }

            // For visitors: Click opens external website if present
            if (sponsor.websiteUrl && sponsor.websiteUrl !== '#') {
              return (
                <a
                  key={sponsor.id}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  {Content}
                </a>
              )
            }

            return (
              <div key={sponsor.id} className="shrink-0">
                {Content}
              </div>
            )
          })}
        </div>

        {/* Right: Admin Controls (Configure button & Add button) */}
        {isAdmin && (
          <div className="flex items-center space-x-1.5 shrink-0 pl-1 border-l border-white/10 select-none">
            <button
              onClick={handleOpenConfigure}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-cream hover:text-paper border border-white/15 text-[11px] font-mono font-semibold transition-colors shadow-xs"
              title="Open pop up to edit sponsor details"
            >
              <Edit3 className="w-3 h-3 text-acid" />
              <span className="hidden sm:inline">Configure</span>
            </button>

            <button
              onClick={startAddSponsor}
              className="flex items-center space-x-1 px-2 py-1 rounded-full bg-acid text-acid-ink font-mono font-bold text-[11px] shadow-xs hover:bg-acid-hot transition-all"
              title="Add a new sponsor"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          POP-UP MODAL BOX FOR EDITING SPONSORS
          Portaled directly to document.body so it NEVER gets clipped
          by parent backdrop-filter or overflow restrictions!
          ───────────────────────────────────────────────────────────── */}
      {mounted && isEditorOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-sponsor-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-ink-900 border border-white/20 rounded-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl text-cream animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pop-up Box Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-ink-800 border border-white/15 flex items-center justify-center shadow-subtle shrink-0">
                  <ShieldCheck className="w-5 h-5 text-acid" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-acid tracking-wider block">
                    ADMIN CONFIGURATOR
                  </span>
                  <h3 id="modal-sponsor-title" className="font-serif font-black text-xl text-paper tracking-tight">
                    {editingSponsorId === 'new' ? 'Enroll New Sponsor' : 'Edit Sponsor & Partner'}
                  </h3>
                  <p className="text-xs text-mist mt-0.5">
                    Configure official partner logos, tier labels, links, and featured accents.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-mist hover:text-paper hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success toast inside modal */}
            {saveSuccessNotice && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessNotice}</span>
              </div>
            )}

            {/* Partner Switcher Tabs */}
            <div className="bg-ink-800/90 p-3 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-fog tracking-wider">
                  Select Partner to Edit:
                </span>
                <button
                  type="button"
                  onClick={startAddSponsor}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                    editingSponsorId === 'new'
                      ? 'bg-acid text-acid-ink shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-acid border border-white/10'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>+ New Sponsor</span>
                </button>
              </div>

              {/* Horizontal scrollable pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {sponsors.map((sp) => {
                  const isSelected = editingSponsorId === sp.id
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSelectSponsorToEdit(sp.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 border ${
                        isSelected
                          ? 'bg-acid text-slate-950 font-black border-acid shadow-xs'
                          : 'bg-white/5 text-mist hover:text-paper border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span className="truncate max-w-[130px]">{sp.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Direct Edit Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 bg-ink-800/50 p-4 sm:p-5 rounded-xl border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono font-semibold text-fog block mb-1">
                    Brand / Sponsor Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. GitHub Education"
                    required
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-semibold text-fog block mb-1">
                    Sponsorship Tier / Role *
                  </label>
                  <input
                    type="text"
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value)}
                    placeholder="e.g. Title Partner, Energy Partner"
                    required
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              {/* Logo URL with Live Thumbnail Preview */}
              <div>
                <label className="text-[11px] font-mono font-semibold text-fog block mb-1">
                  Logo / Photo URL (SVG, PNG, or Web Image)
                </label>
                <div className="flex items-center space-x-2.5">
                  {/* Live Thumbnail Preview */}
                  <div className="w-10 h-10 rounded-xl bg-ink-900 border border-white/15 p-1 flex items-center justify-center shrink-0">
                    {formLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formLogoUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-fog" />
                    )}
                  </div>

                  <input
                    type="url"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    placeholder="https://cdn.simpleicons.org/github/white"
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-fog mr-1">Quick Presets:</span>
                  {LOGO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormLogoUrl(preset.url)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-mist hover:text-paper border border-white/10 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono font-semibold text-fog block mb-1">
                    Website Link
                  </label>
                  <input
                    type="url"
                    value={formWebsiteUrl}
                    onChange={(e) => setFormWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-semibold text-fog block mb-1">
                    Tagline / Description
                  </label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Official Developer Tools & Cloud"
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none bg-white/[0.02] p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#D7F22B] rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-paper block">
                      Featured Partner Accent
                    </span>
                    <span className="text-[11px] text-mist block">
                      Applies Electric Acid glow border and prominent spotlight badge in the sponsors ribbon.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons inside pop-up */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  {editingSponsorId !== 'new' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSponsor(editingSponsorId)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-mono transition-colors flex items-center space-x-1.5"
                      title="Delete this sponsor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-[11px] font-mono text-fog hover:text-rose-400 transition-colors flex items-center space-x-1 px-2 py-1"
                    title="Reset all sponsors to initial defaults"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-mist hover:text-paper hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-acid text-acid-ink font-mono font-bold text-xs hover:bg-acid-hot transition-all shadow-md flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-acid-ink" />
                    <span>{editingSponsorId === 'new' ? 'Add Sponsor' : 'Save Details'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
