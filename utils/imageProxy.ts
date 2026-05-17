// FahrProfi Image Proxy
// Routes all images through our CF Worker:
//   - Real images: fetched from Google Cloud + cached to R2
//   - Missing images: topic SVG placeholder (always renders something)

export const IMG_WORKER = 'https://fahrprofi-img.hguencavdi.workers.dev';

export function getImageUrl(questionId: string, imageUrl?: string, topic?: string): string {
  // If the question has a real image URL → route through proxy (cached in R2)
  if (imageUrl && imageUrl.trim().length > 0) {
    return `${IMG_WORKER}/img/${questionId}.png`;
  }
  // No image → return topic-specific SVG placeholder
  const t = (topic || 'default').toLowerCase();
  return `${IMG_WORKER}/placeholder/${t}`;
}
