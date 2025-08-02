import { useCallback, useState } from 'react';
import './App.css';
import {
  pakoEncode,
  pakoDecode,
  cborEncode,
  cborDecode,
  msgpackEncode,
  msgpackDecode,
  getByteSizeKB,
  lzStringEncode,
  lzStringDecode,
  fflateEncode,
  fflateDecode,
} from './utils/utils';
import { payloadContent } from './utils/payload';
import GithubIcon from './assets/github.svg';

// Initial library data for the comparison
const initialLibraryData = [
  { name: 'FFLATE', link: 'https://www.npmjs.com/package/fflate' },
  { name: 'Pako', link: 'https://www.npmjs.com/package/pako' },
  { name: 'LZString', link: 'https://www.npmjs.com/package/lz-string' },
  { name: 'CBOR', link: 'https://www.npmjs.com/package/cbor2' },
  { name: 'MessagePack', link: 'https://www.npmjs.com/package/messagepack' },
] as const;

type LibraryName = typeof initialLibraryData[number]['name'];

/**
 * Mapping of library names to their encode/decode functions.
 */
const libraryMap: Record<LibraryName, {
  encode: (data: object) => Uint8Array | Promise<Uint8Array>;
  decode: (data: Uint8Array) => object | Promise<object>;
}> = {
  FFLATE: {
    encode: fflateEncode,
    decode: fflateDecode
  },
  Pako: {
    encode: pakoEncode,
    decode: pakoDecode,
  },
  LZString: {
    encode: lzStringEncode,
    decode: lzStringDecode
  },
  CBOR: {
    encode: cborEncode,
    decode: cborDecode,
  },
  MessagePack: {
    encode: msgpackEncode,
    decode: msgpackDecode,
  },
};

function App() {
  const [payload, setPayload] = useState<object | undefined>(undefined);
  const [benchmarkResults, setBenchmarkResults] = useState<{
    name: string;
    link?: string;
    originalSize: string;
    compressedSize: string;
    decompressedSize: string;
    encodeTime: string;
    decodeTime: string;
    totalTime: string;
  }[]>([]);

  // Load default payload on mount
  const loadDefaultPayload = useCallback(() => {
    setPayload(payloadContent);
  }, []);

  // Upload custom payload
  const uploadCustomPayload = useCallback(() => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json, .txt, .js, .ts, .jsx, .tsx';
    fileInput.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            if (file.name.endsWith('.json')) {
              // Parse as JSON
              const parsedPayload = JSON.parse(content);
              setPayload(parsedPayload);
            } else {
              // Wrap the content in object
              setPayload({ content });
            }
          } catch {
            alert('Error parsing JSON file. Please ensure it is valid JSON.');
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }, []);


  // Start comparison
  const startComparison = useCallback(async () => {
    if (!payload) {
      alert('Please load a payload first.');
      return;
    }

    const results = [];

    for (const { name, link } of initialLibraryData) {
      const { encode, decode } = libraryMap[name];

      try {
        const startEncode = performance.now();

        const encoded = await encode(payload);
        const encodeTime = performance.now() - startEncode;

        const startDecode = performance.now();
        const decoded = await decode(encoded);
        const decodeTime = performance.now() - startDecode;

        const originalSize = getByteSizeKB(payload);
        const compressedSize = getByteSizeKB(encoded);
        const decompressedSize = getByteSizeKB(decoded);

        const totalTime = encodeTime + decodeTime;

        results.push({
          name,
          link,
          encodeTime: encodeTime.toFixed(1),
          originalSize: originalSize,
          compressedSize: compressedSize,
          decompressedSize: decompressedSize,
          decodeTime: decodeTime.toFixed(1),
          totalTime: totalTime.toFixed(1),
        });
      } catch (err) {
        console.error(`Error benchmarking ${name}:`, err);
        results.push({
          name,
          link,
          encodeTime: "0 ms",
          originalSize: "0 KB",
          compressedSize: "0 KB",
          decompressedSize: "0 KB",
          decodeTime: "0 ms",
          totalTime: "0 ms",
        });
      }
    }

    setBenchmarkResults(results);
  }, [payload]);

  // Reset payload
  const resetPayload = useCallback(() => {
    setPayload(undefined);
    setBenchmarkResults([]);
  }, []);

  return (
    <main className='relative flex flex-col w-full h-screen'>
      <header className='flex justify-between items-center w-full px-10 py-6 border-b border-white/50'>
        <h1 className='text-4xl font-bold'>📊 Compression Library Benchmark</h1>
        <a href='https://github.com/ChiragChrg/compression-library-benchmark' target='_blank' title='GitHub Repo'>
          <img src={GithubIcon} alt="GitHub" className='w-10' />
        </a>
      </header>

      <div className="w-full h-full max-h-[90%] flex items-center justify-center gap-8 p-5">
        {/* Table Comparison Section */}
        <section className='w-full h-full max-w-[48%] flex flex-col justify-start items-center gap-10'>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
              <button onClick={loadDefaultPayload} className='bg-blue-900 px-4 py-2 rounded cursor-pointer'>📥 Load Default Payload (1MB)</button>
              <button onClick={uploadCustomPayload} className='bg-yellow-900 px-4 py-2 rounded cursor-pointer'>📂 Upload Custom Payload</button>
            </div>

            <div className="flex gap-4">
              <button onClick={startComparison} className='bg-green-800 px-4 py-2 rounded cursor-pointer'>🚀 Start Comparison</button>
              <button onClick={resetPayload} className='bg-gray-700 px-4 py-2 rounded cursor-pointer'>🔃 Reset</button>
            </div>
          </div>

          <table className='w-full'>
            <thead>
              <tr>
                <th className="border border-white px-4 py-2">Library</th>
                <th className="border border-white px-4 py-2">Original Size</th>
                <th className="border border-white px-4 py-2">Compressed Size</th>
                <th className="border border-white px-4 py-2">Decompressed Size</th>
                <th className="border border-white px-4 py-2">Encode Time</th>
                <th className="border border-white px-4 py-2">Decode Time</th>
                <th className="border border-white px-4 py-2">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkResults.length > 0 ?
                benchmarkResults.map((lib) => (
                  <tr key={lib.name}>
                    <td className="border border-white px-4 py-2">
                      <a href={lib.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline">
                        {lib.name}
                      </a>
                    </td>
                    <td className="border border-white px-4 py-2">{lib.originalSize}</td>
                    <td className="border border-white px-4 py-2">{lib.compressedSize}</td>
                    <td className="border border-white px-4 py-2">{lib.decompressedSize}</td>
                    <td className="border border-white px-4 py-2">{lib.encodeTime} ms</td>
                    <td className="border border-white px-4 py-2">{lib.decodeTime} ms</td>
                    <td className="border border-white px-4 py-2">{lib.totalTime} ms</td>
                  </tr>
                ))
                :
                initialLibraryData.map((lib) => (
                  <tr key={lib.name}>
                    <td className="border border-white px-4 py-2">
                      <a href={lib.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline">
                        {lib.name}
                      </a>
                    </td>
                    <td className="border border-white px-4 py-2">-</td>
                    <td className="border border-white px-4 py-2">-</td>
                    <td className="border border-white px-4 py-2">-</td>
                    <td className="border border-white px-4 py-2">-</td>
                    <td className="border border-white px-4 py-2">-</td>
                    <td className="border border-white px-4 py-2">-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>

        <div className="w-0.5 h-full bg-white/50"></div>

        {/* Payload Preview Section */}
        <section className='w-full h-full max-w-[48%] flex flex-col justify-center items-center gap-10'>
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-medium">Payload Preview</h2>
            <p>Payload Size: <strong>{getByteSizeKB(JSON.stringify(payload))}</strong></p>
          </div>

          <div className="bg-slate-900 w-full h-full overflow-y-auto p-4 rounded">
            <pre className="text-sm">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </section>
      </div>


    </main>
  );
}

export default App;
