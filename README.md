# Compression Library Benchmark 🚀

**Compression Library Benchmark** is an interactive web app to benchmark and compare popular JavaScript compression and serialization libraries. Instantly see how FFLATE, Pako, LZString, CBOR, and MessagePack stack up on speed and compression using either a built-in 1MB payload or your own files.

---

## ✨ Features

- ⚡ **One-Click Benchmarking:**  
  Instantly compare multiple libraries.

- 📦 **Flexible Payloads:**  
  Use the default 1MB JSON or upload your own text file.

- 📊 **Detailed Results Table:**  
  View original and compressed sizes (KB), encode/decode times (ms), total operation times, compression ratios, and size reduction—all side by side.

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
   git clone https://github.com/ChiragChrg/compression-library-benchmark.git
   cd compression-library-benchmark
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

---

## 📂 Project Structure

```
.
├── public/           # Static assets
├── src/              # Source code
│   ├── assets/       # Images and icons
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main app component
│   └── main.tsx      # Entry point
├── package.json      # Project metadata and scripts
├── vite.config.ts    # Vite configuration
└── README.md         # This file
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Whether you want to add new compression libraries, fix bugs, or improve the user experience, feel free to open an issue or submit a pull request.

**Want to add a new compression library?** Check out our detailed [Contributing Guide](CONTRIBUTING.md) for step-by-step instructions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
You are free to use, modify, and share this project, as long as you include the original copyright.

© 2025 [ChiragChrg](https://github.com/ChiragChrg) — All rights reserved under MIT.