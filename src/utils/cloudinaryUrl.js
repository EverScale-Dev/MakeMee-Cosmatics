/**
 * Cloudinary URL transformation utility
 * Transforms Cloudinary URLs to include optimization parameters
 */

/**
 * Transform a Cloudinary URL to include optimization parameters
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @param {number} options.width - Desired width (optional)
 * @param {number} options.height - Desired height (optional)
 * @param {string} options.quality - Quality setting: 'auto', 'auto:low', 'auto:eco', 'auto:good', 'auto:best' (default: 'auto')
 * @param {string} options.format - Format: 'auto', 'webp', 'avif', etc. (default: 'auto')
 * @param {string} options.crop - Crop mode: 'fill', 'fit', 'scale', 'thumb' (default: 'fill')
 * @returns {string} Optimized Cloudinary URL
 */
export function optimizeImage(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) return url;

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Build transformation string
  const transforms = [`f_${format}`, `q_${quality}`];

  if (width) {
    transforms.push(`w_${width}`);
  }
  if (height) {
    transforms.push(`h_${height}`);
  }
  if (width || height) {
    transforms.push(`c_${crop}`);
  }

  const transformString = transforms.join(',');

  // Insert transformation after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Get optimized thumbnail URL
 * @param {string} url - Original Cloudinary URL
 * @param {number} size - Thumbnail size (default: 150)
 */
export function getThumbnail(url, size = 150) {
  return optimizeImage(url, {
    width: size,
    height: size,
    crop: 'thumb'
  });
}

/**
 * Get responsive image srcset for different screen sizes
 * @param {string} url - Original Cloudinary URL
 * @param {number[]} widths - Array of widths for srcset (default: [320, 640, 960, 1280])
 */
export function getSrcSet(url, widths = [320, 640, 960, 1280]) {
  if (!url || !url.includes('res.cloudinary.com')) return '';

  return widths
    .map(w => `${optimizeImage(url, { width: w })} ${w}w`)
    .join(', ');
}

export default { optimizeImage, getThumbnail, getSrcSet };
