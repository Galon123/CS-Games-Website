import { supabase, isSupabaseConfigured } from './supabase'

export interface UploadResult {
  url?: string
  filePath?: string
  error?: string
}

/**
 * Uploads an image file to the 'player-photos' bucket in Supabase Storage.
 *
 * @param file - The File object selected by the user (accepts images).
 * @param playerId - Optional player id used to create a semantic path prefix.
 * @returns An object containing the generated public URL or an error message.
 */
export async function uploadPlayerPhoto(
  file: File,
  playerId?: string
): Promise<UploadResult> {
  if (!file) {
    return { error: 'No file provided' }
  }

  // Sanitize file extension
  const rawExt = file.name.split('.').pop() || 'jpg'
  const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const cleanId = (playerId || 'new_' + Math.random().toString(36).substring(2, 9))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
  const timestamp = Date.now()
  const filePath = `players/${cleanId}-${timestamp}.${fileExt}`

  // Check if Supabase client is configured
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('⚠️ Supabase not configured. Using temporary browser preview URL.')
    const localUrl = URL.createObjectURL(file)
    return { url: localUrl, filePath }
  }

  try {
    // Upload image file with upsert enabled
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('player-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg',
      })

    if (uploadError) {
      console.error('❌ Supabase storage upload error:', uploadError)
      return {
        error: `Storage upload failed: ${uploadError.message}. Make sure the "player-photos" bucket exists with public read access.`,
      }
    }

    // Retrieve public URL from Supabase Storage
    const { data: urlData } = supabase.storage
      .from('player-photos')
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return { error: 'Failed to retrieve public URL after upload.' }
    }

    console.log('✅ Supabase storage upload succeeded:', urlData.publicUrl)
    return {
      url: urlData.publicUrl,
      filePath: uploadData?.path || filePath,
    }
  } catch (err: any) {
    console.error('❌ Unexpected exception during storage upload:', err)
    return { error: err?.message || 'Unexpected upload failure.' }
  }
}
