# Compression Library Comparison 🚀

**Compression Library Comparison** is a interactive web app to benchmark and compare popular JavaScript compression and serialization libraries. Instantly see how FFLATE, Pako, LZString, CBOR, and MessagePack stack up on speed and compression using either a built-in 1MB payload or your own files.

---

## ✨ Features

- ⚡ **One-Click Benchmarking:**  
  Instantly compare multiple libraries.

- 📦 **Flexible Payloads:**  
  Use the default 1MB JSON or upload your own (JSON, TXT, JS, TS, JSX, TSX).

- 📊 **Detailed Results Table:**  
  View original, compressed, and decompressed sizes (KB), encode/decode times (ms), and total operation times-all side by side.

- 👀 **Live Payload Preview:**  
  See your loaded payload and its size before benchmarking.

---

## 🏆 Libraries Compared

| 🏷️ Library     | 🔎 Description                                |
|----------------|-----------------------------------------------|
| FFLATE         | Fast, efficient DEFLATE/GZIP                  |
| Pako           | Popular zlib port for browsers                |
| LZString       | Lightweight string compression                |
| CBOR           | Concise Binary Object Representation          |
| MessagePack    | Efficient binary serialization                |

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ChiragChrg/compression-library-comparison.git
   cd compression-library-comparison
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
