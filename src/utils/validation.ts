/**
 * Validates if a string is a properly formatted URL
 */
export const validateURL = (url: string): { valid: boolean; message?: string } => {
  if (!url || url.trim() === '') {
    return { valid: false, message: 'URL cannot be empty' };
  }
  
  try {
    new URL(url);
    return { valid: true };
  } catch (e) {
    return { valid: false, message: 'Please enter a valid URL (e.g., https://example.com/sitemap.xml)' };
  }
};

/**
 * Validates a robots.txt path format
 */
export const validatePath = (path: string): { valid: boolean; message?: string } => {
  if (!path || path.trim() === '') {
    return { valid: false, message: 'Path cannot be empty' };
  }
  
  // Basic path validation
  if (!path.startsWith('/') && path !== '*') {
    return { valid: false, message: 'Path should start with / (e.g., /blog/)' };
  }
  
  // Security validation to prevent XSS
  if (path.includes('<') || path.includes('>') || path.includes('script')) {
    return { valid: false, message: 'Path contains invalid characters' };
  }
  
  return { valid: true };
};

/**
 * Validates a robots.txt comment
 */
export const validateComment = (comment?: string): { valid: boolean; message?: string } => {
  if (!comment) {
    return { valid: true }; // Comments are optional
  }
  
  if (comment.length > 200) {
    return { valid: false, message: 'Comment must be less than 200 characters' };
  }
  
  // Security validation to prevent XSS
  if (comment.includes('<') || comment.includes('>') || comment.includes('script')) {
    return { valid: false, message: 'Comment contains invalid characters' };
  }
  
  return { valid: true };
}; 