const pako = require('pako');

/**
 * Compresses a string and converts it to a buffer.
 * @param {string} input - The string to compress.
 * @returns {Buffer} - The compressed string as a buffer.
 */
export function compressString_U8arr(input: string) {
  const compressed = pako.deflate(input);
  return compressed;
}

/**
 * Decompresses a buffer back to the original string.
 * @param {Buffer} buffer - The buffer to decompress.
 * @returns {string} - The decompressed original string.
 */
export function decompressString_U8arr(string: any) {
  const decompressed = pako.inflate(string, { to: 'string' });
  return decompressed;
}
