// import pako from "pako";

// /**
//  * Compresses a string and returns a buffer suitable for storage.
//  * @param {string} input - The string to compress.
//  * @returns {Buffer} - The compressed string as a buffer.
//  */
// export function compressString(input: string): Buffer {
//   const compressed = pako.deflate(input);
//   return Buffer.from(compressed);
// }

// /**
//  * Decompresses a buffer and returns the original string.
//  * @param {Buffer} input - The buffer to decompress.
//  * @returns {string} - The decompressed string.
//  */
// export function decompressString(input: Buffer): string {
//   const decompressed = pako.inflate(input, { to: "string" });
//   return decompressed;
// }

// const pako = require('pako');

// // Step 1: Original string
// const str = "abcd";

// // Step 2: Compress the string
// const compressed = pako.deflate(str);
// console.log("Compressed (Uint8Array):", compressed);

// // Step 3: Convert the compressed Uint8Array to a Buffer
// const compressedBuffer = Buffer.from(compressed);
// console.log("Compressed Buffer:", compressedBuffer);

// // Step 4: Decompress the buffer
// const decompressed = pako.inflate(compressedBuffer);
// console.log("Decompressed (Uint8Array):", decompressed);

// // Step 5: Convert the decompressed Uint8Array back to a string
// const decompressedStr = new TextDecoder().decode(decompressed);
// console.log("Decompressed String:", decompressedStr);

// // Step 6: Additional checks to verify the integrity of conversions
// const compressedBufferBase64 = compressedBuffer.toString('base64');
// const decompressedBufferBase64 = Buffer.from(decompressed).toString('base64');
// console.log({ compressedBufferBase64, decompressedBufferBase64 });

// // Step 7: Convert string to Uint8Array and back (Optional for validation)
// const str2Uint8Array = new TextEncoder().encode(str);
// console.log("Original String to Uint8Array:", str2Uint8Array);

// const uint8ArrayToStr = new TextDecoder().decode(str2Uint8Array);
// console.log("Uint8Array back to String:", uint8ArrayToStr);

const pako = require('pako');

/**
 * Compresses a string and converts it to a buffer.
 * @param {string} input - The string to compress.
 * @returns {Buffer} - The compressed string as a buffer.
 */
export function compressStringToBuffer(input: string) {
  // Compress the string
  const compressed = pako.deflate(input);
  const compressedBuffer = Buffer.from(compressed);
  return compressedBuffer;
}

export function compressStringToUint8Array(input: string) {
  const compressed = pako.deflate(input);
  const compressedUint8Array = new Uint8Array(compressed);
  return compressedUint8Array;
}

/**
 * Decompresses a buffer back to the original string.
 * @param {Buffer} buffer - The buffer to decompress.
 * @returns {string} - The decompressed original string.
 */
export function decompressBufferToString(buffer: Buffer) {
  // Convert the buffer to Uint8Array
  const compressedUint8Array = new Uint8Array(buffer);
  // Decompress the Uint8Array back to the original string
  const decompressed = pako.inflate(compressedUint8Array, { to: 'string' });
  return decompressed;
}

export function buffer2Uint8Array(buffer: Buffer) {
  return new Uint8Array(buffer);
}

export function decompressUint8ArrayToString(string: any) {
  const decompressed = pako.inflate(string, { to: 'string' });
  return decompressed;
}

// // Example usage:
// const originalString = "This is a large string that needs to be compressed.";

// // Compress the string to a buffer
// const compressedBuffer = compressStringToBuffer(originalString);
// console.log("Compressed Buffer:", compressedBuffer);

// // Decompress the buffer back to the original string
// const decompressedString = decompressBufferToString(compressedBuffer);
// console.log("Decompressed String:", decompressedString);
