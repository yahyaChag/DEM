import { createClient } from './client'

export const uploadToAubergeMedia = async (file: File, path: string): Promise<string> => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .storage
    .from('auberge-media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Erreur lors du téléchargement: ${error.message}`)
  }

  return getPublicUrl(data.path)
}

export const deleteFromAubergeMedia = async (path: string): Promise<void> => {
  const supabase = createClient()
  const { error } = await supabase
    .storage
    .from('auberge-media')
    .remove([path])

  if (error) {
    throw new Error(`Erreur lors de la suppression: ${error.message}`)
  }
}

export const getPublicUrl = (path: string): string => {
  const supabase = createClient()
  const { data } = supabase
    .storage
    .from('auberge-media')
    .getPublicUrl(path)

  return data.publicUrl
}

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = new Date().getTime()
  const extension = originalName.split('.').pop()
  const cleanName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '_').toLowerCase()
  return `${cleanName}-${timestamp}.${extension}`
}
