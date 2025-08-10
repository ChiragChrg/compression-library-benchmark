import { gzip, ungzip } from "pako"
import { encode as encodeCbor, decode as decodeCbor } from "cbor2"
import { encode as encodeMsgPack, decode as decodeMsgPack } from "messagepack"
import { compressToUint8Array, decompressFromUint8Array } from "lz-string"
import { gunzipSync, gzipSync } from "fflate"

// #region Compression Libraries
/**
 * List of compression libraries with their names and links.
 * This is used to display the libraries in the UI and for benchmarking.
 */
export const compressionLibraries = [
    { name: 'FFLATE', link: 'https://www.npmjs.com/package/fflate' },
    { name: 'Pako', link: 'https://www.npmjs.com/package/pako' },
    { name: 'LZString', link: 'https://www.npmjs.com/package/lz-string' },
    { name: 'CBOR', link: 'https://www.npmjs.com/package/cbor2' },
    { name: 'MessagePack', link: 'https://www.npmjs.com/package/messagepack' },
] as const;

// Library name type for Mapping
export type TLibraryName = typeof compressionLibraries[number]['name'];
// #endregion Compression Libraries


// #region PAKO
/**
 * Compresses a string using Pako's gzip method.
 * @param payload - The object to compress.
 * @returns A Uint8Array containing the compressed data.
 */
export function pakoEncode(payload: object): Uint8Array {
    const compressed = gzip(JSON.stringify(payload));
    return compressed;
}

/**
 * Decompresses a string using Pako's ungzip method.
 * @param data - The Uint8Array containing the compressed data.
 * @returns The decompressed object.
 */
export function pakoDecode(data: Uint8Array): object {
    const decompressedStr = ungzip(data, { to: "string" });
    const parsed = JSON.parse(decompressedStr) as object;
    return parsed;
}
// #endregion PAKO

// #region CBOR
/**
 * Encodes a payload using CBOR.
 * @param payload - The object to encode.
 * @returns A Uint8Array containing the encoded data.
 */
export function cborEncode(payload: object): Uint8Array {
    const encoded = encodeCbor(payload);
    return encoded;
}

/**
 * Decodes a payload using CBOR.
 * @param data - The Uint8Array containing the encoded data.
 * @returns The decoded object.
 */
export function cborDecode(data: Uint8Array): object {
    const decoded = decodeCbor(data);
    return decoded as object;
}
// #endregion CBOR

// #region MESSAGEPACK
/**
 * Encodes a payload using MessagePack.
 * @param payload - The object to encode.
 * @returns A Uint8Array containing the encoded data.
 */
export function msgpackEncode(payload: object): Uint8Array {
    const encoded = encodeMsgPack(payload);
    return encoded;
}

/**
 * Decodes a payload using MessagePack.
 * @param data - The Uint8Array containing the encoded data.
 * @returns The decoded object.
 */
export function msgpackDecode(data: Uint8Array): object {
    const safeData = new Uint8Array(data);
    const decoded = decodeMsgPack(safeData);
    return decoded as object;
}
//#endregion MESSAGEPACK

// #region LZ-STRING
/**
 * Compresses a string using LZ-String.
 * @param payload - The object to compress.
 * @returns A Uint8Array containing the compressed data.
 */
export function lzStringEncode(payload: object): Uint8Array {
    const str = JSON.stringify(payload);
    const compressed = compressToUint8Array(str);
    return compressed;
}

/**
 * Decompresses a string using LZ-String.
 * @param data - The Uint8Array containing the compressed data.
 * @returns The decompressed object.
 */
export function lzStringDecode(data: Uint8Array): object {
    const decompressedStr = decompressFromUint8Array(data);
    const parsed = JSON.parse(decompressedStr) as object;
    return parsed;
}
//#endregion LZ-STRING

// #region FFLATE
/**
 * Compresses a string using FFLate's gzip.
 * @param payload - The object to compress.
 * @returns A Uint8Array containing the compressed data.
 */
export function fflateEncode(payload: object): Uint8Array {
    const str = JSON.stringify(payload);
    const compressed = gzipSync(new TextEncoder().encode(str));
    return compressed;
}

/**
 * Decompresses a string using FFLate's gunzip.
 * @param data - The Uint8Array containing the compressed data.
 * @returns The decompressed object.
 */
export function fflateDecode(data: Uint8Array): object {
    const decompressed = gunzipSync(data);
    const decompressedStr = new TextDecoder().decode(decompressed);
    const parsed = JSON.parse(decompressedStr) as object;
    return parsed;
}
// #endregion FFLATE