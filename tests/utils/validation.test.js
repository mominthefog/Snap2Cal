const {
  isValidEmail,
  isValidBase64DataUrl,
  parseBase64DataUrl,
  isSupportedFileType
} = require('../../src/utils/validation');

describe('Validation utilities', () => {
  describe('isValidEmail', () => {
    test('accepts valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidBase64DataUrl', () => {
    test('accepts valid data URLs', () => {
      expect(isValidBase64DataUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
      expect(isValidBase64DataUrl('data:application/pdf;base64,JVBERi0=')).toBe(true);
      expect(isValidBase64DataUrl('data:image/jpeg;base64,/9j/4AAQ=')).toBe(true);
    });

    test('rejects invalid data URLs', () => {
      expect(isValidBase64DataUrl('not-a-data-url')).toBe(false);
      expect(isValidBase64DataUrl('data:image/png;iVBORw0KGgo=')).toBe(false); // missing base64
      expect(isValidBase64DataUrl('data:;base64,abc')).toBe(false); // missing mime type
      expect(isValidBase64DataUrl('')).toBe(false);
      expect(isValidBase64DataUrl(null)).toBe(false);
    });
  });

  describe('parseBase64DataUrl', () => {
    test('correctly parses valid data URLs', () => {
      const result = parseBase64DataUrl('data:image/png;base64,iVBORw0KGgo=');
      expect(result).toEqual({
        mediaType: 'image/png',
        data: 'iVBORw0KGgo='
      });
    });

    test('returns null for invalid data URLs', () => {
      expect(parseBase64DataUrl('not-valid')).toBeNull();
      expect(parseBase64DataUrl('')).toBeNull();
      expect(parseBase64DataUrl(null)).toBeNull();
    });
  });

  describe('isSupportedFileType', () => {
    test('accepts supported file types', () => {
      expect(isSupportedFileType('image/png')).toBe(true);
      expect(isSupportedFileType('image/jpeg')).toBe(true);
      expect(isSupportedFileType('image/gif')).toBe(true);
      expect(isSupportedFileType('image/webp')).toBe(true);
      expect(isSupportedFileType('application/pdf')).toBe(true);
    });

    test('rejects unsupported file types', () => {
      expect(isSupportedFileType('image/bmp')).toBe(false);
      expect(isSupportedFileType('application/json')).toBe(false);
      expect(isSupportedFileType('text/plain')).toBe(false);
      expect(isSupportedFileType('')).toBe(false);
    });
  });
});
