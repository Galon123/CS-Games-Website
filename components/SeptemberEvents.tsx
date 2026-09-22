'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  X,
  Share2,
  Info,
  CalendarCheck,
} from 'lucide-react'
import {
  CalendarEvent,
  INITIAL_SEPTEMBER_EVENTS,
  EVENTS_STORAGE_KEY,
} from '@/lib/events-data'
import { useTournament } from '@/context/TournamentContext'

export default function SeptemberEvents() {
  const { isAdmin } = useTournament()
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_SEPTEMBER_EVENTS)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [activeEventModal, setActiveEventModal] = useState<CalendarEvent | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'agenda'>('grid')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state for adding/editing inside editor modal
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [formDay, setFormDay] = useState<number>(1)
  const [formTitle, setFormTitle] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formVenue, setFormVenue] = useState('')
  const [formIsHighlighted, setFormIsHighlighted] = useState(false)
  const [formCategory, setFormCategory] = useState('')
  const [formDescription, setFormDescription] = useState('')

  // Load persisted events from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed)
        }
      }
    } catch (e) {
      console.warn('Could not read events from localStorage:', e)
    }
  }, [])

  // Save to localStorage whenever events change
  const saveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated)
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('Could not save events to localStorage:', e)
    }
  }

  // Reset to original reference image defaults
  const handleResetDefaults = () => {
    saveEvents(INITIAL_SEPTEMBER_EVENTS)
    setIsEditorOpen(false)
    setEditingEventId(null)
  }

  // Keyboard accessibility: Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditorOpen(false)
        setActiveEventModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Open editor for a specific event
  const startEditEvent = (evt: CalendarEvent) => {
    if (!isAdmin) return
    setEditingEventId(evt.id)
    setFormDay(evt.day)
    setFormTitle(evt.title)
    setFormTime(evt.time)
    setFormVenue(evt.venue || '')
    setFormIsHighlighted(evt.isHighlighted)
    setFormCategory(evt.category || '')
    setFormDescription(evt.description || '')
    setIsEditorOpen(true)
  }

  // Open editor for adding a new event
  const startAddEvent = () => {
    if (!isAdmin) return
    setEditingEventId('new')
    setFormDay(1)
    setFormTitle('')
    setFormTime('10:00')
    setFormVenue('')
    setFormIsHighlighted(false)
    setFormCategory('')
    setFormDescription('')
    setIsEditorOpen(true)
  }

  // Submit edit/add form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin || !formTitle.trim()) return

    if (editingEventId === 'new') {
      const newEvt: CalendarEvent = {
        id: `event-${Date.now()}`,
        day: Number(formDay),
        title: formTitle.trim(),
        time: formTime.trim(),
        isHighlighted: formIsHighlighted,
        venue: formVenue.trim() || undefined,
        category: formCategory.trim() || undefined,
        description: formDescription.trim() || undefined,
      }
      saveEvents([...events, newEvt])
    } else if (editingEventId) {
      const updated = events.map((ev) =>
        ev.id === editingEventId
          ? {
              ...ev,
              day: Number(formDay),
              title: formTitle.trim(),
              time: formTime.trim(),
              isHighlighted: formIsHighlighted,
              venue: formVenue.trim() || undefined,
              category: formCategory.trim() || undefined,
              description: formDescription.trim() || undefined,
            }
          : ev
      )
      saveEvents(updated)
    }

    setEditingEventId(null)
  }

  // Delete event
  const handleDeleteEvent = (id: string) => {
    if (!isAdmin) return
    const updated = events.filter((ev) => ev.id !== id)
    saveEvents(updated)
    if (activeEventModal?.id === id) {
      setActiveEventModal(null)
    }
  }

  // Quick toggle highlighted state
  const handleToggleHighlight = (id: string) => {
    if (!isAdmin) return
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, isHighlighted: !ev.isHighlighted } : ev
    )
    saveEvents(updated)
  }

  // 20-slot matrix mapping replicating the 5-column x 4-row layout from reference image
  // Grid slot assignments:
  // Slot 1 -> Day 8 (White card)
  // Slot 3 -> Day 10 (Acid neon card)
  // Slot 6 -> Day 15 (White card)
  // Slot 12 -> Day 22 (White card)
  // Slot 14 -> Day 24 (Acid neon card)
  // Slot 16 -> Day 26 (White card)
  const gridCells = useMemo(() => {
    const cells: {
      index: number
      event?: CalendarEvent
      hasNeonWire?: boolean
      isDarkGlass?: boolean
      neonEdge?: 'left' | 'top-left'
    }[] = []

    const eventByDay = new Map<number, CalendarEvent>()
    events.forEach((ev) => {
      eventByDay.set(ev.day, ev)
    })

    // Default 20 slots layout replicating the reference poster
    const defaultDaySlots: Record<number, number> = {
      1: 8,
      3: 10,
      6: 15,
      12: 22,
      14: 24,
      16: 26,
    }

    // Keep track of events placed in default spots
    const assignedEventIds = new Set<string>()

    for (let i = 0; i < 20; i++) {
      let eventForCell: CalendarEvent | undefined

      // Check if slot has a default assigned day
      if (defaultDaySlots[i] !== undefined) {
        const targetDay = defaultDaySlots[i]
        eventForCell = eventByDay.get(targetDay)
        if (eventForCell) {
          assignedEventIds.add(eventForCell.id)
        }
      }

      cells.push({
        index: i,
        event: eventForCell,
        hasNeonWire: i === 8,
        isDarkGlass: i === 11 || i === 17,
        neonEdge: i === 5 ? 'left' : i === 8 ? 'top-left' : undefined,
      })
    }

    // If there are newly added custom events that weren't assigned, find empty glass slots for them
    const unassignedEvents = events.filter((ev) => !assignedEventIds.has(ev.id))
    let unassignedIdx = 0

    cells.forEach((cell) => {
      if (!cell.event && unassignedIdx < unassignedEvents.length) {
        cell.event = unassignedEvents[unassignedIdx]
        unassignedIdx++
      }
    })

    return cells
  }, [events])

  const copyEventInfo = (evt: CalendarEvent) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(
        `September ${evt.day}: ${evt.title} at ${evt.time}${evt.venue ? ` (${evt.venue})` : ''}`
      )
      setCopiedId(evt.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 shadow-card bg-gradient-to-b from-[#060B0E] via-[#091116] to-[#05080A]">
      {/* ─────────────────────────────────────────────────────────────
          CINEMATIC AUDITORIUM ATMOSPHERE BACKGROUND
          Dark stadium / theater seats with teal ambient light gradient
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-35 -z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop"
          alt="Cinematic auditorium atmosphere"
          className="w-full h-full object-cover grayscale-[35%] contrast-[130%] brightness-[60%]"
        />
        {/* Dark Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080A] via-[#070D11]/70 to-[#05080A]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-10">
        {/* ─────────────────────────────────────────────────────────────
            HEADER & EDIT CONTROLS BAR
            Typography replicating reference image: "september" + "events"
            ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-1">
            {/* Lowercase Month Kicker matching reference style */}
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-sans font-medium text-fog tracking-[0.22em] lowercase">
                september
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] font-mono uppercase text-acid font-bold tracking-wider">
                CS Games 2026
              </span>
            </div>

            {/* Prominent "events" Display Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-black text-paper tracking-tighter lowercase leading-[0.95]">
              events
            </h2>

            <p className="text-xs sm:text-sm text-mist max-w-lg mt-2 font-sans leading-relaxed">
              Official championship milestones, mock assessment rounds, and technical workshops scheduled for the Department of Computer Science.
            </p>
          </div>

          {/* Action Tools & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="bg-ink-900/90 border border-white/10 rounded-full p-1 flex items-center space-x-1">
              <button
                onClick={() => setActiveViewMode('grid')}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
                  activeViewMode === 'grid'
                    ? 'bg-acid text-acid-ink font-bold shadow-xs'
                    : 'text-mist hover:text-paper'
                }`}
              >
                Calendar Grid
              </button>
              <button
                onClick={() => setActiveViewMode('agenda')}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
                  activeViewMode === 'agenda'
                    ? 'bg-acid text-acid-ink font-bold shadow-xs'
                    : 'text-mist hover:text-paper'
                }`}
              >
                Schedule List ({events.length})
              </button>
            </div>

            {/* Editable Controls (Admin Only) */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setEditingEventId(null)
                    setIsEditorOpen(true)
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-cream hover:text-paper border border-white/15 text-xs font-mono font-semibold transition-colors"
                  title="Configure event dates, times, and highlighted cards"
                >
                  <Edit3 className="w-3.5 h-3.5 text-acid" />
                  <span>Configure Events</span>
                </button>

                <button
                  onClick={startAddEvent}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-acid text-acid-ink font-mono font-bold text-xs shadow-xs hover:bg-acid-hot transition-all"
                  title="Add a new calendar event"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CALENDAR GRID VIEW (5 COLUMNS x 4 ROWS)
            Replicating the exact visual hierarchy of the reference poster
            ───────────────────────────────────────────────────────────── */}
        {activeViewMode === 'grid' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
              {gridCells.map((cell) => {
                const event = cell.event

                if (!event) {
                  // Empty glassmorphic calendar tile
                  return (
                    <div
                      key={`empty-cell-${cell.index}`}
                      className={`relative aspect-square rounded-2xl sm:rounded-3xl border transition-all duration-300 flex items-center justify-center select-none ${
                        cell.isDarkGlass
                          ? 'bg-black/35 border-white/[0.06] backdrop-blur-xs'
                          : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.09] backdrop-blur-sm shadow-subtle'
                      }`}
                    >
                      {/* Stylized Neon Wire Edge accents from the reference image */}
                      {cell.neonEdge === 'left' && (
                        <div className="absolute left-0 inset-y-3 w-[2px] bg-acid/60 rounded-full shadow-[0_0_8px_rgba(215,242,43,0.5)]" />
                      )}
                      {cell.hasNeonWire && (
                        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-acid/60">
                            <path
                              d="M 4 28 L 4 12 Q 4 4 12 4 L 28 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-white/10 font-bold">
                        +
                      </span>
                    </div>
                  )
                }

                // Scheduled Event Card (White Card or Highlighted Acid Neon Card)
                const isNeon = event.isHighlighted

                return (
                  <div
                    key={event.id}
                    onClick={() => setActiveEventModal(event)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveEventModal(event)
                      }
                    }}
                    className={`group relative aspect-square rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-acid select-none ${
                      isNeon
                        ? 'bg-acid text-slate-950 shadow-[0_0_30px_rgba(215,242,43,0.4)] ring-1 ring-acid'
                        : 'bg-white text-slate-950 shadow-elevated hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    {/* Top: Day Number in dominant display font */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight leading-none ${
                          isNeon ? 'text-slate-950' : 'text-slate-950'
                        }`}
                      >
                        {event.day}
                      </span>

                      {/* Small indicator pill */}
                      {isNeon && (
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-black/15 text-slate-950">
                          HOT
                        </span>
                      )}
                    </div>

                    {/* Bottom: Event Title & Time */}
                    <div className="space-y-0.5 mt-auto">
                      <div
                        className={`text-xs sm:text-sm font-sans font-bold leading-tight line-clamp-2 ${
                          isNeon ? 'text-slate-950 font-black' : 'text-slate-900'
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>

                      <div
                        className={`text-[11px] sm:text-xs font-mono font-medium truncate ${
                          isNeon ? 'text-slate-900 font-semibold' : 'text-slate-600 font-semibold'
                        }`}
                      >
                        {event.time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ─────────────────────────────────────────────────────────────
                BOTTOM BRAND BADGE ("START 21" STYLE SPEECH EMBLEM)
                Directly inspired by the badge in the reference image
                ───────────────────────────────────────────────────────────── */}
            <div className="pt-4 flex items-center justify-center">
              <div className="relative inline-flex items-center space-x-1.5 bg-black px-4 py-1.5 rounded-full border border-white/10 shadow-elevated">
                <span className="text-[11px] font-mono font-black tracking-widest text-paper uppercase">
                  START
                </span>
                <span className="bg-acid text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded-md shadow-xs">
                  21
                </span>
                <span className="text-fog text-[11px] font-mono font-medium pl-1">
                  | All Events Sanctioned
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            ALTERNATIVE AGENDA / LIST VIEW
            Accessible table/card view for mobile and rapid scanning
            ───────────────────────────────────────────────────────────── */}
        {activeViewMode === 'agenda' && (
          <div className="space-y-3 max-w-4xl mx-auto">
            {events
              .slice()
              .sort((a, b) => a.day - b.day)
              .map((evt) => {
                const isNeon = evt.isHighlighted

                return (
                  <div
                    key={evt.id}
                    onClick={() => setActiveEventModal(evt)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isNeon
                        ? 'bg-acid text-slate-950 border-acid shadow-[0_0_20px_rgba(215,242,43,0.25)]'
                        : 'bg-ink-900/80 text-cream border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Day Pill */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                          isNeon
                            ? 'bg-black text-acid border-black'
                            : 'bg-white/10 text-paper border-white/15'
                        }`}
                      >
                        <span className="text-xl font-sans font-black leading-none">{evt.day}</span>
                        <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">SEP</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`font-sans font-black text-base sm:text-lg truncate ${
                              isNeon ? 'text-slate-950' : 'text-paper'
                            }`}
                          >
                            {evt.title}
                          </h3>
                          {isNeon && (
                            <span className="bg-black/20 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-full uppercase">
                              HIGHLIGHTED
                            </span>
                          )}
                        </div>

                        <div
                          className={`flex flex-wrap items-center gap-3 text-xs font-mono mt-1 ${
                            isNeon ? 'text-slate-900 font-semibold' : 'text-mist'
                          }`}
                        >
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{evt.time}</span>
                          </span>

                          {evt.venue && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{evt.venue}</span>
                            </span>
                          )}

                          {evt.category && (
                            <span className="px-2 py-0.2 rounded bg-black/10 text-[10px]">
                              {evt.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditEvent(evt)
                          }}
                          className={`p-2 rounded-lg text-xs font-mono transition-colors ${
                            isNeon
                              ? 'bg-black/15 hover:bg-black/25 text-slate-950'
                              : 'bg-white/5 hover:bg-white/10 text-mist hover:text-paper'
                          }`}
                          title="Edit event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EVENT DETAILS INSPECTOR MODAL (ACCESSIBLE, ESC DISMISSIBLE)
          ───────────────────────────────────────────────────────────── */}
      {mounted && activeEventModal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-event-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveEventModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-ink-800 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                    activeEventModal.isHighlighted
                      ? 'bg-acid text-slate-950 border-acid shadow-[0_0_16px_rgba(215,242,43,0.3)]'
                      : 'bg-white text-slate-950 border-white'
                  }`}
                >
                  <span className="text-2xl font-sans font-black leading-none">
                    {activeEventModal.day}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5">
                    SEPTEMBER
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-acid font-bold">
                      {activeEventModal.category || 'DEPARTMENT EVENT'}
                    </span>
                    {activeEventModal.isHighlighted && (
                      <span className="bg-acid text-acid-ink font-mono font-black text-[9px] px-2 py-0.2 rounded-full uppercase">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <h3 id="modal-event-title" className="font-sans font-black text-2xl text-paper mt-0.5">
                    {activeEventModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveEventModal(null)}
                className="p-2 rounded-xl text-mist hover:text-paper hover:bg-white/10 transition-colors"
                aria-label="Close dialog (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Timing & Venue Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-ink-900 p-3 rounded-xl border border-white/10">
                <span className="text-fog text-[10px] uppercase block">Scheduled Time</span>
                <span className="text-paper font-bold text-sm mt-0.5 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-acid" />
                  <span>{activeEventModal.time}</span>
                </span>
              </div>

              <div className="bg-ink-900 p-3 rounded-xl border border-white/10">
                <span className="text-fog text-[10px] uppercase block">Venue</span>
                <span className="text-paper font-bold text-sm mt-0.5 truncate flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-acid shrink-0" />
                  <span className="truncate">{activeEventModal.venue || 'Campus Center'}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            {activeEventModal.description && (
              <p className="text-xs text-mist leading-relaxed font-sans bg-white/[0.02] p-4 rounded-xl border border-white/5">
                {activeEventModal.description}
              </p>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyEventInfo(activeEventModal)}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-mist hover:text-paper transition-colors flex items-center space-x-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedId === activeEventModal.id ? 'Copied Details!' : 'Copy Info'}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      handleToggleHighlight(activeEventModal.id)
                      setActiveEventModal({
                        ...activeEventModal,
                        isHighlighted: !activeEventModal.isHighlighted,
                      })
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors border ${
                      activeEventModal.isHighlighted
                        ? 'bg-acid/20 text-acid border-acid/40'
                        : 'bg-white/5 text-mist hover:text-paper border-white/10'
                    }`}
                  >
                    {activeEventModal.isHighlighted ? '★ Highlighted' : '☆ Make Highlighted'}
                  </button>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    startEditEvent(activeEventModal)
                    setActiveEventModal(null)
                  }}
                  className="px-4 py-1.5 rounded-full bg-acid text-acid-ink text-xs font-mono font-bold hover:bg-acid-hot transition-colors flex items-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Event</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─────────────────────────────────────────────────────────────
          EVENT CONFIGURATION / EDITOR MODAL (ADMIN ONLY)
          Makes all dates, names, times, and highlighted states editable
          ───────────────────────────────────────────────────────────── */}
      {mounted && isEditorOpen && isAdmin && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-editor-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-ink-800 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-acid tracking-wider">
                  EVENT CONFIGURATOR
                </span>
                <h3 id="modal-editor-title" className="font-sans font-black text-2xl text-paper">
                  {editingEventId ? (editingEventId === 'new' ? 'Add Calendar Event' : 'Edit Event') : 'September Events Management'}
                </h3>
                <p className="text-xs text-mist font-mono mt-0.5">
                  Update event names, scheduled day, time slots, and neon highlighted states
                </p>
              </div>

              <button
                onClick={() => {
                  setIsEditorOpen(false)
                  setEditingEventId(null)
                }}
                className="p-2 rounded-xl text-mist hover:text-paper hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inline Add / Edit Form */}
            {editingEventId ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 bg-ink-900/90 p-5 rounded-2xl border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-fog block mb-1">
                      Day of Month (1-30) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={formDay}
                      onChange={(e) => setFormDay(parseInt(e.target.value, 10) || 1)}
                      required
                      className="w-full bg-ink-800 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-fog block mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. CDI Mock, Spelling Bee"
                      required
                      className="w-full bg-ink-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-fog block mb-1">
                      Time Slot *
                    </label>
                    <input
                      type="text"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      placeholder="e.g. 10:00 or 9:00/14:00"
                      required
                      className="w-full bg-ink-800 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-fog block mb-1">
                      Venue Location
                    </label>
                    <input
                      type="text"
                      value={formVenue}
                      onChange={(e) => setFormVenue(e.target.value)}
                      placeholder="e.g. Seminar Hall A"
                      className="w-full bg-ink-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-fog block mb-1">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="e.g. Assessment, Workshop"
                      className="w-full bg-ink-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsHighlighted}
                        onChange={(e) => setFormIsHighlighted(e.target.checked)}
                        className="w-4 h-4 accent-[#D7F22B] rounded"
                      />
                      <span className="text-xs font-mono font-bold text-cream">
                        Highlight as Acid Neon Card (Featured)
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-fog block mb-1">
                    Description / Details
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Event details and notes for students..."
                    className="w-full bg-ink-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEventId(null)}
                    className="px-4 py-2 rounded-full text-xs font-mono text-mist hover:text-paper"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-acid text-acid-ink font-mono font-bold text-xs hover:bg-acid-hot transition-colors shadow-xs"
                  >
                    {editingEventId === 'new' ? 'Create Event' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-fog uppercase">
                    Configured Events ({events.length})
                  </span>
                  <button
                    onClick={startAddEvent}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-acid text-acid-ink font-mono font-bold text-xs hover:bg-acid-hot transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Event</span>
                  </button>
                </div>

                {/* List of current events with rapid edit/toggle actions */}
                <div className="space-y-2">
                  {events
                    .slice()
                    .sort((a, b) => a.day - b.day)
                    .map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-ink-900/80 p-3.5 rounded-xl border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-sans font-black text-sm shrink-0 ${
                              evt.isHighlighted
                                ? 'bg-acid text-slate-950 font-black'
                                : 'bg-white text-slate-950'
                            }`}
                          >
                            {evt.day}
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-paper truncate">
                                {evt.title}
                              </span>
                              {evt.isHighlighted && (
                                <span className="bg-acid/20 text-acid text-[9px] font-mono px-1.5 py-0.2 rounded">
                                  NEON
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-mist block truncate">
                              {evt.time} {evt.venue ? `• ${evt.venue}` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleToggleHighlight(evt.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors border ${
                              evt.isHighlighted
                                ? 'bg-acid text-slate-950 border-acid font-bold'
                                : 'bg-white/5 text-mist hover:text-paper border-white/10'
                            }`}
                            title="Toggle highlighted neon style"
                          >
                            {evt.isHighlighted ? 'Acid Neon' : 'Standard'}
                          </button>

                          <button
                            onClick={() => startEditEvent(evt)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mist hover:text-paper transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-mist hover:text-rose-400 transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Footer with Reset to Defaults button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <button
                onClick={handleResetDefaults}
                className="flex items-center space-x-1.5 text-fog hover:text-rose-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Reference Defaults</span>
              </button>

              <button
                onClick={() => {
                  setIsEditorOpen(false)
                  setEditingEventId(null)
                }}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-paper font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
