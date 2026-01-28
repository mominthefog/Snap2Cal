/**
 * Validation utilities for Snap2Cal
 */

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a string is a valid base64 data URL
 * @param {string} content - The content to validate
 * @returns {boolean} - True if valid base64 data URL format
 */
function isValidBase64DataUrl(content) {
  if (!content || typeof content !== 'string') return false;
  return /^data:[^;]+;base64,.+$/.test(content);
}

/**
 * Parse a base64 data URL into its components
 * @param {string} content - The base64 data URL
 * @returns {object|null} - Object with mediaType and data, or null if invalid
 */
function parseBase64DataUrl(content) {
  if (!content || typeof content !== 'string') return null;

  const matches = content.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return null;

  return {
    mediaType: matches[1],
    data: matches[2]
  };
}

/**
 * Validate supported image/document types for upload
 * @param {string} mimeType - The MIME type to check
 * @returns {boolean} - True if the type is supported
 */
function isSupportedFileType(mimeType) {
  const supported = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  return supported.includes(mimeType);
}

module.exports = {
  isValidEmail,
  isValidBase64DataUrl,
  parseBase64DataUrl,
  isSupportedFileType
};
