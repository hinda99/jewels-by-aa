export function formatImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();

  if (trimmed.includes('[link removed]')) return '';

  // Automatic Google Drive link transformer
  if (trimmed.includes('drive.google.com')) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  return trimmed;
}

export function isValidImageUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const formatted = formatImageUrl(url);
  if (!formatted || formatted.length < 5) return false;

  return (
    formatted.startsWith('http://') ||
    formatted.startsWith('https://') ||
    formatted.startsWith('/')
  );
}
