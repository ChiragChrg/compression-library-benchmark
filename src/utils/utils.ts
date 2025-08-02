import { gzip, ungzip } from "pako"
import { encode as encodeCbor, decode as decodeCbor } from "cbor2"
import { encode as encodeMsgPack, decode as decodeMsgPack } from "messagepack"
import { compressToUint8Array, decompressFromUint8Array } from "lz-string"
import { gunzipSync, gzipSync } from "fflate"

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
    const parsed = JSON.parse(decompressedStr);
    return parsed;
}

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
    const decoded = decodeCbor(data) as object;
    return decoded;
}

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
    const decoded = decodeMsgPack(data) as object;
    return decoded;
}

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
    const parsed = JSON.parse(decompressedStr || '{}');
    return parsed;
}

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
    const parsed = JSON.parse(decompressedStr);
    return parsed;
}


//#region Utility Functions
/**
 * Calculates the byte size of a given input and formats it as KB or MB.
 * @param input - The input to calculate size for, can be a string, Uint8Array, or object.
 * @returns A string representing the size in KB or MB.
 */
export const getByteSizeKB = (input: string | Uint8Array | object): string => {
    let bytes: Uint8Array;

    if (typeof input === 'string') {
        bytes = new TextEncoder().encode(input);
    } else if (input instanceof Uint8Array) {
        bytes = input;
    } else {
        // fallback for objects like decompressed payloads
        bytes = new TextEncoder().encode(JSON.stringify(input));
    }

    // Display size in KB or MB
    const sizeInKB = bytes.length / 1024;
    const sizeInMB = sizeInKB / 1024;
    if (sizeInMB >= 1) {
        return `${sizeInMB.toFixed(1)} MB`;
    }
    return `${sizeInKB.toFixed(1)} KB`;
};
