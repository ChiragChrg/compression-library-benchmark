/**
 * Calculates the byte size of a given input and formats it as KB or MB.
 * @param input - The input to calculate size for, can be a string, Uint8Array, or object.
 * @returns A string representing the size in KB or MB.
 */
export const getSizeInKB = (input: string | Uint8Array | object): number => {
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

    return sizeInKB;
};

/**
 * Formats a size in KB to a human-readable string.
 * @param sizeInKB - The size in KB to format.
 * @returns A string representing the formatted size.
 */
export const getFormattedSize = (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
        return `${sizeInKB.toFixed(1)} KB`;
    } else {
        const sizeInMB = sizeInKB / 1024;
        return `${sizeInMB.toFixed(1)} MB`;
    }
}

/**
 * Calculates the compression ratio of a payload given its compressed size in KB.
 * @param payload - The original payload, can be a string, Uint8Array, or object.
 * @param compressedSizeInKB - The size of the compressed payload in KB.
 * @return The compression ratio as a number.
 */
export const calculateCompressionRatio = (payload: string | Uint8Array | object, compressedSizeInKB: number): number => {
    let originalSizeInKB: number;
    if (typeof payload === 'string') {
        originalSizeInKB = new TextEncoder().encode(payload).length / 1024;
    }
    else if (payload instanceof Uint8Array) {
        originalSizeInKB = payload.length / 1024;
    } else {
        originalSizeInKB = new TextEncoder().encode(JSON.stringify(payload)).length / 1024;
    }

    if (compressedSizeInKB === 0) {
        return 0;
    }
    return originalSizeInKB / compressedSizeInKB;
}