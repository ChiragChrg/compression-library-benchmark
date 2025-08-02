import { gzip, ungzip } from "pako"
import { encode as encodeCbor, decode as decodeCbor } from "cbor2"
import { encode as encodeMsgPack, decode as decodeMsgPack } from "messagepack"
import { compressToUint8Array, decompressFromUint8Array } from "lz-string"
import { gunzipSync, gzipSync } from "fflate"

// PAKO
/**
 * Compresses a string using Pako's gzip method.
 */
export function pakoEncode(payload: object): Uint8Array {
    const compressed = gzip(JSON.stringify(payload));
    console.log("Pako Compress", { payload, compressed });
    return compressed;
}

/**
 * Decompresses a string using Pako's ungzip method.
 */
export function pakoDecode(data: Uint8Array): object {
    const decompressedStr = ungzip(data, { to: "string" });
    const parsed = JSON.parse(decompressedStr);
    console.log("Pako Decompress", { data, decompressedStr, parsed });
    return parsed;
}

// CBOR
/**
 * Encodes a payload using CBOR.
 */
export function cborEncode(payload: object): Uint8Array {
    const encoded = encodeCbor(payload);
    console.log("CBOR Encode", { payload, encoded });
    return encoded;
}

/**
 * Decodes a payload using CBOR.
 */
export function cborDecode(data: Uint8Array): object {
    const decoded = decodeCbor(data) as object;
    console.log("CBOR Decode", { data, decoded });
    return decoded;
}

// MESSAGEPACK
/**
 * Encodes a payload using MessagePack.
 */
export function msgpackEncode(payload: object): Uint8Array {
    const encoded = encodeMsgPack(payload);
    console.log("MessagePack Encode", { payload, encoded });
    return encoded;
}

/**
 * Decodes a payload using MessagePack.
 */
export function msgpackDecode(data: Uint8Array): object {
    const decoded = decodeMsgPack(data) as object;
    console.log("MessagePack Decode", { data, decoded });
    return decoded;
}

// LZ-STRING
/**
 * Compresses a string using LZ-String.
 */
export function lzStringEncode(payload: object): Uint8Array {
    const str = JSON.stringify(payload);
    const compressed = compressToUint8Array(str);
    console.log("LZ-String Compress", { payload, str, compressed });
    return compressed;
}

/**
 * Decompresses a string using LZ-String.
 */
export function lzStringDecode(data: Uint8Array): object {
    const decompressedStr = decompressFromUint8Array(data);
    const parsed = JSON.parse(decompressedStr || '{}');
    console.log("LZ-String Decompress", { data, decompressedStr, parsed });
    return parsed;
}

// FFLATE
/**
 * Compresses a string using FFLate's gzip.
 */
export function fflateEncode(payload: object): Uint8Array {
    const str = JSON.stringify(payload);
    const compressed = gzipSync(new TextEncoder().encode(str));
    console.log("FFLate Compress", { payload, str, compressed });
    return compressed;
}

/**
 * Decompresses a string using FFLate's gunzip.
 */
export function fflateDecode(data: Uint8Array): object {
    const decompressed = gunzipSync(data);
    const decompressedStr = new TextDecoder().decode(decompressed);
    const parsed = JSON.parse(decompressedStr);
    console.log("FFLate Decompress", { data, decompressedStr, parsed });
    return parsed;
}

// Utils
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
