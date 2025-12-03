/**
 * Image Optimization Utilities
 * Provides helpers for Supabase Storage image transformations
 */

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  resize?: 'cover' | 'contain' | 'fill'
}

export const IMAGE_PRESETS = {
  THUMBNAIL: {
    width: 150,
    height: 150,
    quality: 80,
    format: 'webp' as const,
    resize: 'cover' as const,
  },
  CARD: {
    width: 400,
    height: 300,
    quality: 85,
    format: 'webp' as const,
    resize: 'cover' as const,
  },
  DETAIL: {
    width: 1200,
    height: 800,
    quality: 90,
    format: 'webp' as const,
    resize: 'contain' as const,
  },
  AVATAR: {
    width: 200,
    height: 200,
    quality: 85,
    format: 'webp' as const,
    resize: 'cover' as const,
  },
} as const

/**
 * Build Supabase Storage image transformation URL
 * 
 * Supabase supports image transformations via URL parameters:
 * https://supabase.com/docs/guides/storage/serving/image-transformations
 */
export function getOptimizedImageUrl(
  storageUrl: string,
  options: ImageTransformOptions = {}
): string {
  // If not a Supabase storage URL, return as-is
  if (!storageUrl.includes('supabase')) {
    return storageUrl
  }
  
  const url = new URL(storageUrl)
  const params = new URLSearchParams()
  
  if (options.width) {
    params.set('width', options.width.toString())
  }
  
  if (options.height) {
    params.set('height', options.height.toString())
  }
  
  if (options.quality) {
    params.set('quality', options.quality.toString())
  }
  
  if (options.format) {
    params.set('format', options.format)
  }
  
  if (options.resize) {
    params.set('resize', options.resize)
  }
  
  // Append transformation params to URL
  const transformParams = params.toString()
  if (transformParams) {
    url.search = transformParams
  }
  
  return url.toString()
}

/**
 * Get optimized image URL using a preset
 */
export function getPresetImageUrl(
  storageUrl: string,
  preset: keyof typeof IMAGE_PRESETS
): string {
  return getOptimizedImageUrl(storageUrl, IMAGE_PRESETS[preset])
}

/**
 * Transform array of image URLs to optimized versions
 */
export function optimizeImageArray(
  images: string[],
  options: ImageTransformOptions = IMAGE_PRESETS.CARD
): string[] {
  return images.map(url => getOptimizedImageUrl(url, options))
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  storageUrl: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  return widths
    .map(width => {
      const url = getOptimizedImageUrl(storageUrl, { width, format: 'webp' })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Get image dimensions from Supabase Storage metadata
 * This is a placeholder - actual implementation would query Supabase Storage API
 */
export async function getImageDimensions(
  storageUrl: string
): Promise<{ width: number; height: number } | null> {
  // In a real implementation, this would fetch metadata from Supabase Storage
  // For now, return null to indicate dimensions are unknown
  return null
}

/**
 * Validate image file type
 */
export function isValidImageType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
  return validTypes.includes(mimeType.toLowerCase())
}

/**
 * Validate image file size (in bytes)
 */
export function isValidImageSize(size: number, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}
