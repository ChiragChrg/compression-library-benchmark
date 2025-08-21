# Contributing to Compression Library Benchmark 🤝

Thank you for your interest in contributing to **Compression Library Benchmark**! We welcome contributions that help expand the comparison with new compression libraries, improve the codebase, or enhance the user experience.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/ChiragChrg/compression-library-benchmark.git
   cd compression-library-benchmark
   ```
3. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```
4. **Create a new branch:**
   ```bash
   git checkout -b feature/add-new-library
   ```

---

## 📦 Adding a New Compression Library

To add a new compression library to the benchmark, follow these steps:

### 1. 📋 Prerequisites

- The library should be available on npm
- It should support both compression/encoding and decompression/decoding
- It should work in browser environments (or have a browser-compatible version)

### 2. 🔧 Installation

Add the library to the project dependencies:

```bash
npm install your-compression-library
# or
bun add your-compression-library
```

### 3. 📝 Implementation Steps

#### Step 1: Add to Library List

Add your library to the [`compressionLibraries`](src/utils/libraries.ts) array in [`src/utils/libraries.ts`](src/utils/libraries.ts):

```typescript
export const compressionLibraries = [
    // ...existing libraries...
    { name: 'YourLibrary', link: 'https://www.npmjs.com/package/your-compression-library' },
] as const;
```

#### Step 2: Add Library Functions

Create encode and decode functions in [`src/utils/libraries.ts`](src/utils/libraries.ts):

```typescript
// Import the library
import { compress, decompress } from 'your-compression-library';

// Add functions at the end of the file
// #region YOUR-LIBRARY-NAME
/**
 * Compresses an object using YourLibraryName.
 * @param payload - The object to compress.
 * @returns A Uint8Array containing the compressed data.
 */
export function yourLibraryEncode(payload: object): Uint8Array {
    const jsonString = JSON.stringify(payload);
    const compressed = compress(jsonString); // Adjust based on library API
    
    // Ensure return type is Uint8Array
    if (compressed instanceof Uint8Array) {
        return compressed;
    }
    
    // Convert if necessary (example for string output)
    return new TextEncoder().encode(compressed);
}

/**
 * Decompresses data using YourLibraryName.
 * @param data - The Uint8Array containing the compressed data.
 * @returns The decompressed object.
 */
export function yourLibraryDecode(data: Uint8Array): object {
    const decompressed = decompress(data); // Adjust based on library API
    
    // Convert back to string if necessary
    const jsonString = typeof decompressed === 'string' 
        ? decompressed 
        : new TextDecoder().decode(decompressed);
        
    const parsed = JSON.parse(jsonString) as object;
    return parsed;
}
// #endregion YOUR-LIBRARY-NAME
```

#### Step 3: Update App Component

In [`src/App.tsx`](src/App.tsx):

1. **Add imports:**
```typescript
import {
  // ...existing imports...
  yourLibraryEncode,
  yourLibraryDecode,
} from './utils/libraries';
```

2. **Add to library map:**
```typescript
const libraryMap: TLibrary = {
  // ...existing mappings...
  YourLibrary: {
    encode: yourLibraryEncode,
    decode: yourLibraryDecode,
  },
};
```

### 4. 🧪 Testing

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Test your implementation:**
   - Load the default payload
   - Run the benchmark
   - Verify your library appears in results
   - Check that compression/decompression works correctly

3. **Run linting:**
   ```bash
   npm run lint
   ```

---

## 🔍 Common Implementation Patterns

### Handle Different Data Types

```typescript
// For libraries that work with strings
export function stringBasedEncode(data: object): Uint8Array {
    const jsonString = JSON.stringify(data);
    const compressed = yourCompressionFunction(jsonString);
    return new TextEncoder().encode(compressed);
}

// For libraries that work with buffers
export function bufferBasedEncode(data: object): Uint8Array {
    const jsonString = JSON.stringify(data);
    const buffer = Buffer.from(jsonString, 'utf8');
    const compressed = yourCompressionFunction(buffer);
    return new Uint8Array(compressed);
}

// For async libraries (if needed)
export async function asyncEncode(data: object): Promise<Uint8Array> {
    const jsonString = JSON.stringify(data);
    const compressed = await yourAsyncCompressionFunction(jsonString);
    return new Uint8Array(compressed);
}
```

### Error Handling

Always wrap your encode/decode functions with proper error handling:

```typescript
export function safeEncode(data: object): Uint8Array {
    try {
        const jsonString = JSON.stringify(data);
        const compressed = yourCompressionFunction(jsonString);
        return new Uint8Array(compressed);
    } catch (error) {
        console.error('Encoding failed:', error);
        throw new Error(`YourLibrary encoding failed: ${error.message}`);
    }
}
```

---

## 📋 Pull Request Guidelines

1. **Ensure your code passes linting:**
   ```bash
   npm run lint
   ```

2. **Test thoroughly:**
   - Test with default payload
   - Test with custom JSON files
   - Test with large payloads
   - Verify error handling

3. **Update documentation:**
   - Add your library to the README.md comparison table
   - Include any special notes about the library

4. **Commit with clear messages:**
   ```bash
   git add .
   git commit -m "feat: add YourLibrary compression support"
   git push origin feature/add-new-library
   ```

5. **Create a pull request** with:
   - Clear description of the library added
   - Any special considerations or limitations
   - Test results/screenshots if applicable

---

## 🐛 Bug Reports & Feature Requests

- **Bug Reports:** Use the GitHub issue tracker with the "bug" label
- **Feature Requests:** Use the GitHub issue tracker with the "enhancement" label
- **Questions:** Use GitHub Discussions or open an issue with the "question" label

---

## 📋 Code Style

- Follow existing TypeScript conventions
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions focused and single-purpose
- Use async/await for asynchronous operations

---

## 🏆 Library Requirements Checklist

Before submitting a new library, ensure:

- [ ] Library is actively maintained
- [ ] Works in browser environments
- [ ] Supports both compression and decompression
- [ ] Has reasonable performance characteristics
- [ ] Is available on npm
- [ ] Encode function returns `Uint8Array`
- [ ] Decode function returns `object`
- [ ] Both functions handle errors gracefully
- [ ] Library is added to `compressionLibraries` array in [`src/utils/libraries.ts`](src/utils/libraries.ts)
- [ ] Library functions are exported from [`src/utils/libraries.ts`](src/utils/libraries.ts)
- [ ] Library is added to `libraryMap` in [`src/App.tsx`](src/App.tsx)
- [ ] Library is added to comparison table in README
- [ ] All tests pass

---

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

## 🙏 Thank You

Your contributions help make this tool better for everyone! If you have questions, don't hesitate to open an issue or reach out.

© 2025 [ChiragChrg](https://github.com/ChiragChrg) — All rights reserved under MIT.