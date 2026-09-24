'use client'

import React, { useState } from 'react'
import { useTournament, LiveMatchData } from '@/context/TournamentContext'
import { Radio, X, Edit2, Save, Trash2, Activity } from 'lucide-react'

export default function LiveMatchOverlay() {
  const { liveMatch, updateLiveMatch, isAdmin } = useTournament()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Edit State
  const [editData, setEditData] = useState<LiveMatchData>({
    teamA: 'Jigarthanda FC',
    teamB: 'Pallimoola FC',
    scoreA: 0,
    scoreB: 0,
    time: '45+2\\\'',
    isActive: true,
  })

  const handleSave = () => {
    updateLiveMatch(editData)
    setIsEditing(false)
  }

  const handleEndMatch = () => {
    updateLiveMatch(null)
    setIsOpen(false)
  }

  const startEditNewMatch = () => {
    setEditData({
      teamA: 'Team A',
      teamB: 'Team B',
      scoreA: 0,
      scoreB: 0,
      time: '0\\\'',
      isActive: true,
    })
    setIsEditing(true)
    setIsOpen(true)
  }

  return (
    <>
      {/* Floating Button in bottom corner */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {isAdmin && !liveMatch && !isOpen && (
          <button
            onClick={startEditNewMatch}
            className="w-14 h-14 bg-ink-900 border border-white/20 rounded-full flex items-center justify-center shadow-elevated hover:bg-ink-800 transition-colors group"
          >
            <Activity className="w-6 h-6 text-mist group-hover:text-white" />
          </button>
        )}

        {(liveMatch || isOpen) && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-ink-900 border border-white/20 rounded-full flex items-center justify-center shadow-elevated hover:bg-ink-800 transition-colors relative"
          >
            {liveMatch && <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping" />}
            {liveMatch && <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full" />}
            <Radio className={`w-6 h-6 ${liveMatch ? 'text-rose-500' : 'text-mist'}`} />
          </button>
        )}
      </div>

      {/* Pop-up Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-ink-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="flex justify-between items-center p-4 bg-ink-900 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-rose-500">Live Match</span>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && liveMatch && !isEditing && (
                <button onClick={() => { setEditData(liveMatch); setIsEditing(true); }} className="p-1.5 text-fog hover:text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-fog hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5">
            {isEditing && isAdmin ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    value={editData.teamA}
                    onChange={(e) => setEditData({ ...editData, teamA: e.target.value })}
                    className="flex-1 bg-ink-900 border border-white/10 rounded-md p-2 text-sm text-center font-bold font-serif"
                    placeholder="Team A"
                  />
                  <input
                    value={editData.teamB}
                    onChange={(e) => setEditData({ ...editData, teamB: e.target.value })}
                    className="flex-1 bg-ink-900 border border-white/10 rounded-md p-2 text-sm text-center font-bold font-serif"
                    placeholder="Team B"
                  />
                </div>
                <div className="flex justify-center items-center gap-4">
                  <input
                    type="number"
                    value={editData.scoreA}
                    onChange={(e) => setEditData({ ...editData, scoreA: parseInt(e.target.value) || 0 })}
                    className="w-16 bg-ink-900 border border-white/10 rounded-md p-2 text-2xl text-center font-black"
                  />
                  <span className="text-mist">-</span>
                  <input
                    type="number"
                    value={editData.scoreB}
                    onChange={(e) => setEditData({ ...editData, scoreB: parseInt(e.target.value) || 0 })}
                    className="w-16 bg-ink-900 border border-white/10 rounded-md p-2 text-2xl text-center font-black"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    value={editData.time}
                    onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                    className="w-24 bg-ink-900 border border-white/10 rounded-md p-1.5 text-sm text-center font-mono text-acid"
                    placeholder="Time (e.g. 45')"
                  />
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between">
                  <button onClick={handleEndMatch} className="flex items-center space-x-1 text-xs font-bold text-rose-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>End Match</span>
                  </button>
                  <button onClick={handleSave} className="flex items-center space-x-1 text-xs font-bold bg-acid text-acid-ink px-3 py-1.5 rounded-full hover:bg-acid-hot transition-colors">
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : liveMatch ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="font-serif font-bold truncate max-w-[100px] text-center">{liveMatch.teamA}</span>
                  <span className="font-serif font-bold truncate max-w-[100px] text-center">{liveMatch.teamB}</span>
                </div>
                <div className="flex justify-center items-center space-x-6">
                  <span className="text-4xl font-black text-paper">{liveMatch.scoreA}</span>
                  <span className="text-mist font-bold">-</span>
                  <span className="text-4xl font-black text-paper">{liveMatch.scoreB}</span>
                </div>
                <div className="flex justify-center">
                  <span className="text-sm font-mono font-bold text-acid bg-acid/10 px-3 py-1 rounded-full">{liveMatch.time}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-mist font-mono py-4">No live match at the moment.</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
