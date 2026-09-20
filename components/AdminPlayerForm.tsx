'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Player, Team, Sport } from '@/lib/types'
import { uploadPlayerPhoto } from '@/lib/storage'
import { Upload, X, Loader2, User, Camera, CheckCircle2, AlertTriangle } from 'lucide-react'

export interface AdminPlayerFormProps {
  /** If provided, form operates in 'edit' mode for this athlete. If undefined, operates in 'create' mode. */
  initialPlayer?: Player | null
  teams: Team[]
  sports: Sport[]
  activeSportId?: string
  onSubmitSuccess?: (player: Player) => void
  onCancel?: () => void
  addPlayer?: (playerData: Omit<Player, 'id'>) => Promise<void>
  updatePlayer?: (playerId: string, updates: Partial<Player>) => Promise<void>
  setIconPlayer?: (teamId: string, playerId: string) => Promise<void>
  notify?: (message: string) => void
}

export const AdminPlayerForm: React.FC<AdminPlayerFormProps> = ({
  initialPlayer,
  teams,
  sports,
  activeSportId,
  onSubmitSuccess,
  onCancel,
  addPlayer,
  updatePlayer,
  setIconPlayer,
  notify = (msg) => alert(msg),
}) => {
  const isEditMode = Boolean(initialPlayer)

  // Form Fields
  const [name, setName] = useState(initialPlayer?.name || '')
  const [teamId, setTeamId] = useState(initialPlayer?.team_id || '')
  const [department, setDepartment] = useState(initialPlayer?.department || 'Computer Science & Engineering')
  const [formSportId, setFormSportId] = useState(
    initialPlayer?.sport_id || activeSportId || (sports.length > 0 ? sports[0].id : '')
  )
  const [role, setRole] = useState(initialPlayer?.role || '')
  const [jerseyNumber, setJerseyNumber] = useState<number | ''>(
    initialPlayer?.jersey_number !== undefined ? initialPlayer.jersey_number : 10
  )
  const [isIcon, setIsIcon] = useState(Boolean(initialPlayer?.is_icon))

  // Photo & Upload States
  const [photoUrl, setPhotoUrl] = useState(initialPlayer?.photo_url || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPlayer?.photo_url || null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Determine current sport and type
  const selectedTeam = teams.find((t) => t.id === teamId)
  const targetSport = sports.find(
    (s) => s.id === (formSportId || selectedTeam?.sport_id || activeSportId)
  )
  const isSolo = targetSport?.type === 'solo' || targetSport?.name?.toLowerCase() === 'chess'
  const isFfa = targetSport?.type === 'free_for_all'
  const isDirectTeamless = isSolo || isFfa
  const isDuo = targetSport?.type === 'duo'
  const isTeamSport = !isSolo && !isDuo && !isFfa

  // Set default team if create mode and team sport
  useEffect(() => {
    if (!isEditMode && !isDirectTeamless && !teamId && teams.length > 0) {
      const validTeams = activeSportId ? teams.filter((t) => t.sport_id === activeSportId) : teams
      if (validTeams.length > 0) {
        setTeamId(validTeams[0].id)
      } else {
        setTeamId(teams[0].id)
      }
    }
  }, [isEditMode, isDirectTeamless, teamId, teams, activeSportId])

  // Sync initialPlayer changes
  useEffect(() => {
    if (initialPlayer) {
      setName(initialPlayer.name)
      setTeamId(initialPlayer.team_id || '')
      setDepartment(initialPlayer.department || 'Computer Science & Engineering')
      if (initialPlayer.sport_id) setFormSportId(initialPlayer.sport_id)
      setRole(initialPlayer.role)
      setJerseyNumber(initialPlayer.jersey_number)
      setIsIcon(Boolean(initialPlayer.is_icon))
      setPhotoUrl(initialPlayer.photo_url || '')
      setPreviewUrl(initialPlayer.photo_url || null)
      setSelectedFile(null)
      setUploadError(null)
    }
  }, [initialPlayer])

  // Handle local file selection with instant preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image mime type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image file size must be less than 5MB.')
      return
    }

    setUploadError(null)
    setSelectedFile(file)

    // Instant local preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  // Clear selected file
  const handleRemovePhoto = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setPhotoUrl('')
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = name.trim()
    if (!cleanName) {
      setUploadError('Please enter an athlete name.')
      return
    }
    if (!isDirectTeamless && !teamId) {
      setUploadError('Please select a squad/team.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      let finalPhotoUrl = photoUrl

      // 1. If user selected a new file, upload to Supabase Storage
      if (selectedFile) {
        const uploadResult = await uploadPlayerPhoto(selectedFile, initialPlayer?.id)
        if (uploadResult.error) {
          setUploadError(uploadResult.error)
          notify(`⚠️ Upload Warning: ${uploadResult.error}`)
          // Fall back to preview if offline/unconfigured
          if (!uploadResult.url) {
            setIsUploading(false)
            return
          }
        }
        if (uploadResult.url) {
          finalPhotoUrl = uploadResult.url
        }
      }

      const assignedSportType = targetSport?.type || 'team'
      const assignedIsSoloOrDuo = assignedSportType === 'solo' || assignedSportType === 'duo' || targetSport?.name.toLowerCase() === 'chess' || isFfa

      const finalIsIcon = !assignedIsSoloOrDuo && isIcon
      const finalRole = role.trim() || (isFfa ? 'Contender' : isSolo ? 'Competitor' : assignedIsSoloOrDuo ? 'Competitor' : 'Athlete')
      const finalJerseyNumber = assignedIsSoloOrDuo ? 1 : Number(jerseyNumber) || 1
      const finalSportId = isDirectTeamless ? (targetSport?.id || activeSportId || null) : (selectedTeam?.sport_id || formSportId || null)
      const finalTeamId = isDirectTeamless ? null : teamId

      // 2. Perform DB Update or Insert
      if (isEditMode && initialPlayer && updatePlayer) {
        await updatePlayer(initialPlayer.id, {
          name: cleanName,
          team_id: finalTeamId,
          sport_id: finalSportId,
          department: department.trim() || 'Computer Science & Engineering',
          role: finalRole,
          jersey_number: finalJerseyNumber,
          is_icon: finalIsIcon,
          photo_url: finalPhotoUrl,
        })

        if (finalIsIcon && finalTeamId && setIconPlayer) {
          await setIconPlayer(finalTeamId, initialPlayer.id)
        }

        notify(`✅ Updated profile for ${cleanName}!`)
        if (onSubmitSuccess) {
          onSubmitSuccess({
            ...initialPlayer,
            name: cleanName,
            team_id: finalTeamId,
            sport_id: finalSportId,
            department: department.trim() || 'Computer Science & Engineering',
            role: finalRole,
            jersey_number: finalJerseyNumber,
            is_icon: finalIsIcon,
            photo_url: finalPhotoUrl,
          })
        }
      } else if (addPlayer) {
        await addPlayer({
          team_id: finalTeamId,
          sport_id: finalSportId,
          department: department.trim() || 'Computer Science & Engineering',
          name: cleanName,
          photo_url: finalPhotoUrl,
          role: finalRole,
          jersey_number: finalJerseyNumber,
          position_x: 50.0,
          position_y: 50.0,
          is_icon: finalIsIcon,
        })

        notify(`✅ Enrolled ${cleanName} directly into ${targetSport?.name || 'event'}!${finalIsIcon ? ' (Team Icon ⭐)' : ''}`)

        // Reset fields after successful create
        setName('')
        setRole('')
        setSelectedFile(null)
        setPreviewUrl(null)
        setPhotoUrl('')
        setIsIcon(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        if (onSubmitSuccess) {
          onSubmitSuccess({
            id: 'new',
            team_id: finalTeamId,
            sport_id: finalSportId,
            department: department.trim() || 'Computer Science & Engineering',
            name: cleanName,
            photo_url: finalPhotoUrl,
            role: finalRole,
            jersey_number: finalJerseyNumber,
            position_x: 50.0,
            position_y: 50.0,
            is_icon: finalIsIcon,
          })
        }
      }
    } catch (err: any) {
      console.error('Player save failed:', err)
      setUploadError(err?.message || 'Failed saving player profile.')
      notify(`❌ Error: ${err?.message || 'Save failed'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {uploadError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-tight">{uploadError}</span>
        </div>
      )}

      {/* Profile Photo Section with Instant Thumbnail Preview */}
      <div className="p-4 rounded-lg bg-slate-50 border border-[#E5E0D8] flex flex-col sm:flex-row items-center gap-4">
        {/* Instant Thumbnail Preview */}
        <div className="relative group shrink-0">
          <div
            className={`w-16 h-16 rounded-md overflow-hidden border flex items-center justify-center font-bold text-lg bg-white shadow-2xs ${
              isIcon ? 'border-amber-400 text-amber-800 ring-2 ring-amber-300/60' : 'border-slate-200 text-slate-400'
            }`}
          >
            {previewUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-slate-400" />
            )}
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-sm transition-colors"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* File Input and Info */}
        <div className="flex-1 space-y-1.5 text-center sm:text-left">
          <div className="flex items-center space-x-2 justify-center sm:justify-start">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Athlete Profile Photo
            </label>
            {selectedFile && (
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready to upload</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Upload a high-resolution PNG, JPG, or WebP photo to Supabase Storage (<code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded border border-blue-100">player-photos</code>).
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="adminPlayerPhotoInput"
              disabled={isUploading}
            />
            <label
              htmlFor="adminPlayerPhotoInput"
              className={`px-3.5 h-10 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium cursor-pointer flex items-center space-x-1.5 transition-colors shadow-2xs ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>{previewUrl ? 'Change Photo' : 'Select Image File'}</span>
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="px-2.5 h-10 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Attributes */}
      {isDirectTeamless && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span className="font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Direct {targetSport?.type === 'free_for_all' ? 'Free For All' : 'Solo'} Athlete Enrollment</span>
          </span>
          <span className="text-[11px] text-amber-800 font-medium">No team creation required</span>
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isTeamSport ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3`}>
        {/* Squad Selection OR Department Input */}
        {isDirectTeamless ? (
          <div>
            <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
              Department / Laboratory
            </label>
            <input
              type="text"
              placeholder="e.g. CS AI & Robotics Lab"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              disabled={isUploading}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
              {isDuo ? 'Assign Pair / Squad' : 'Assign to Team'}
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
              disabled={isUploading}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Athlete Name */}
        <div>
          <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
            {isDirectTeamless ? 'Contender / Athlete Name' : isDuo ? 'Pair Athlete Name' : 'Athlete Name'}
          </label>
          <input
            type="text"
            placeholder={isFfa ? 'e.g. Linus Torvalds' : isSolo ? 'e.g. Magnus Carlsen' : 'e.g. Alex Morgan'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isUploading}
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>

        {/* Role / Position */}
        <div>
          <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
            {isDirectTeamless ? 'Role / Title' : 'Role / Position'}
          </label>
          <input
            type="text"
            placeholder={isFfa ? 'e.g. Contender' : isSolo ? 'e.g. Candidate Master / Solo' : 'e.g. Centre Forward / Sweeper'}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={isUploading}
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>

        {/* Jersey Number (Team Sports only) */}
        {isTeamSport && (
          <div>
            <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
              Jersey Number
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(e.target.value === '' ? '' : Number(e.target.value))}
              required
              disabled={isUploading}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Icon Athlete Checkbox (Team Sports only) */}
      {isTeamSport && (
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            id={`playerFormIsIcon_${initialPlayer?.id || 'new'}`}
            checked={isIcon}
            onChange={(e) => setIsIcon(e.target.checked)}
            disabled={isUploading}
            className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
          <label
            htmlFor={`playerFormIsIcon_${initialPlayer?.id || 'new'}`}
            className="text-xs text-amber-800 font-medium flex items-center space-x-1.5 cursor-pointer select-none"
          >
            <span>⭐ Designate as Team Icon Athlete (1 Icon athlete per squad)</span>
          </label>
        </div>
      )}

      {/* Submit and Cancel Buttons */}
      <div className="flex items-center space-x-2 pt-2">
        <button
          type="submit"
          disabled={isUploading}
          className="px-5 h-11 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{selectedFile ? 'Uploading to Supabase Storage...' : 'Saving Profile...'}</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Save Athlete Profile' : '+ Enroll Athlete'}</span>
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 h-11 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors border border-slate-200 shadow-2xs"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default AdminPlayerForm
