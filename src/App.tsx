import { useCallback, useState } from 'react';
import { payloadContent } from './utils/payload';
import GithubIcon from './assets/github.svg';
import './App.css';

// Import compression libraries
import {
  pakoEncode,
  pakoDecode,
  cborEncode,
  cborDecode,
  msgpackEncode,
  msgpackDecode,
  lzStringEncode,
  lzStringDecode,
  fflateEncode,
  fflateDecode,

  type TLibraryName,
  compressionLibraries
} from './utils/libraries';

// Import utility functions
import {
  getSizeInKB,
  calculateCompressionRatio,
  getFormattedSize
} from './utils/utils';



// #region Types
type TBestScore = {
  compressedSize: string;
  encodeTime: number;
  decodeTime: number;
  totalTime: number;
  compressionRatio: number;
  sizeReduction: number;
}

type TBenchmarkResult = {
  name: string;
  link?: string;
  originalSize: string;
  compressedSize: string;
  encodeTime: number;
  decodeTime: number;
  totalTime: number;
  compressionRatio: number;
  sizeReduction: number;
}

type TLibrary = Record<TLibraryName, {
  encode: (data: object) => Uint8Array | Promise<Uint8Array>;
  decode: (data: Uint8Array) => object | Promise<object>;
}>;
// #endregion Types


//#region Setup Libraries
/**
 * Mapping of library names to their encode/decode functions.
 */
const libraryMap: TLibrary = {
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
//#endregion Setup Libraries


/**
 * Main App component.
 * Handles state management, user interactions, and rendering of the UI.
 */
function App() {
  //#region State Management
  const [payload, setPayload] = useState<object | undefined>(undefined);
  const [bestScore, setBestScore] = useState<TBestScore | undefined>(undefined)
  const [benchmarkResults, setBenchmarkResults] = useState<TBenchmarkResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //#region Handlers
  // Load default payload on mount
  const loadDefaultPayload = useCallback(() => {
    setPayload(payloadContent);
  }, []);

  // Upload custom payload
  const uploadCustomPayload = useCallback(() => {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = ".txt,.json,.csv,.log,.md,.js,.ts,.jsx,.tsx,.html,.xml,.yml,.yaml,.ini,.conf,.css,.scss,.less,.toml,.rtf,.bat,.sh,.py,.java,.c,.cpp,.h,.hpp,.php,.rb,.pl,.go,.swift,.rs,.dart,.sql,.ps1,.properties,.cfg,.env,.tex,.adoc,.textile,.rst,.mak,.makefile";

    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            if (file.name.endsWith('.json')) {
              // Parse as JSON
              const parsedPayload = JSON.parse(content) as object;
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
  const startComparison = async () => {
    if (!payload) {
      alert('Please load a payload first.');
      return;
    }
    setIsLoading(true);

    // Add a small delay to simulate loading
    await new Promise(resolve => setTimeout(resolve, 50));

    const results = [];

    for (const { name, link } of compressionLibraries) {
      const { encode, decode } = libraryMap[name];

      try {
        // Measure Encoding time
        const startEncode = performance.now();
        const encoded = await encode(payload);
        const encodeTime = performance.now() - startEncode;

        // Measure Decoding time
        const startDecode = performance.now();
        await decode(encoded);
        const decodeTime = performance.now() - startDecode;

        const totalTime = encodeTime + decodeTime;

        // Calculate sizes
        const originalSize = getSizeInKB(payload);
        const compressedSize = getSizeInKB(encoded);

        // Calculate compression ratio and size reduction
        const compressionRatio = calculateCompressionRatio(payload, compressedSize);
        const sizeReduction = (1 - (compressedSize / originalSize)) * 100;

        results.push({
          name,
          link,
          originalSize: getFormattedSize(originalSize),
          compressedSize: getFormattedSize(compressedSize),
          encodeTime: encodeTime,
          decodeTime: decodeTime,
          totalTime: totalTime,
          compressionRatio: compressionRatio,
          sizeReduction: sizeReduction
        });
      } catch (err) {
        console.error(`Error benchmarking ${name}:`, err);
        results.push({
          name,
          link,
          originalSize: "0 KB",
          compressedSize: "0 KB",
          encodeTime: 0,
          decodeTime: 0,
          totalTime: 0,
          compressionRatio: 0,
          sizeReduction: 0,
        });
      }
    }

    // Find the best scores
    const newBestScore: TBestScore = results.reduce((best, current) => {
      return {
        compressedSize: parseFloat(current.compressedSize) < parseFloat(best.compressedSize) ? current.compressedSize : best.compressedSize,
        encodeTime: current.encodeTime < best.encodeTime ? current.encodeTime : best.encodeTime,
        decodeTime: current.decodeTime < best.decodeTime ? current.decodeTime : best.decodeTime,
        totalTime: current.totalTime < best.totalTime ? current.totalTime : best.totalTime,
        compressionRatio: current.compressionRatio > best.compressionRatio ? current.compressionRatio : best.compressionRatio,
        sizeReduction: current.sizeReduction > best.sizeReduction ? current.sizeReduction : best.sizeReduction
      };
    }, {
      compressedSize: 'Infinity',
      encodeTime: Infinity,
      decodeTime: Infinity,
      totalTime: Infinity,
      compressionRatio: 0,
      sizeReduction: 0,
    });

    setIsLoading(false);
    setBestScore(newBestScore);
    setBenchmarkResults(results);
  };

  // Reset payload
  const resetPayload = useCallback(() => {
    setPayload(undefined);
    setBenchmarkResults([]);
  }, []);

  //#region Render
  // Best Score Style
  const bestScoreStyle: React.CSSProperties = {
    color: '#16a34a',
    fontWeight: 'bold',
  };

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
        <section className='w-full h-full max-w-[70%] flex flex-col justify-start items-center gap-10'>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
              <button onClick={loadDefaultPayload} className='bg-blue-900 px-4 py-2 rounded cursor-pointer'>📥 Load Default Payload (1MB)</button>
              <button onClick={uploadCustomPayload} className='bg-yellow-900 px-4 py-2 rounded cursor-pointer'>📂 Upload Custom Payload</button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { void startComparison(); }}
                disabled={isLoading || !payload}
                className='bg-green-800 px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? '🔄 Benchmarking...' : '🚀 Start Benchmark'}
              </button>
              <button
                onClick={resetPayload}
                disabled={!payload}
                className='bg-gray-700 px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>🔃 Reset</button>
            </div>
          </div>

          <table className='w-full'>
            <thead>
              <tr>
                <th className="border border-white px-4 py-2 bg-slate-900">Library</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Original Size</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Compressed Size</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Encode Time</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Decode Time</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Total Time</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Compression Ratio</th>
                <th className="border border-white px-4 py-2 bg-slate-900">Size Reduction</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkResults.length > 0 ?
                benchmarkResults.map((lib) => {
                  const isBest = {
                    encodeTime: bestScore?.encodeTime === lib.encodeTime,
                    decodeTime: bestScore?.decodeTime === lib.decodeTime,
                    totalTime: bestScore?.totalTime === lib.totalTime,
                    compressedSize: bestScore?.compressedSize === lib.compressedSize,
                    compressionRatio: bestScore?.compressionRatio === lib.compressionRatio,
                    sizeReduction: bestScore?.sizeReduction === lib.sizeReduction,
                  }

                  return (
                    <tr key={lib.name}>
                      <td className="border border-white px-4 py-2">
                        <a href={lib.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline">
                          {lib.name}
                        </a>
                      </td>
                      <td className="border border-white px-4 py-2">
                        {lib.originalSize}
                      </td>
                      <td
                        style={isBest.compressedSize ? bestScoreStyle : {}}
                        className="border border-white px-4 py-2">
                        {lib.compressedSize}
                      </td>
                      <td
                        style={isBest.encodeTime ? bestScoreStyle : {}}
                        className="border border-white px-4 py-2">
                        {lib.encodeTime.toFixed(1)} ms
                      </td>
                      <td
                        style={isBest.decodeTime ? bestScoreStyle : {}}
                        className="border border-white px-4 py-2">
                        {lib.decodeTime.toFixed(1)} ms
                      </td>
                      <td
                        style={isBest.totalTime ? bestScoreStyle : {}}
                        className="border border-white px-4 py-2">
                        {lib.totalTime.toFixed(1)} ms
                      </td>
                      <td
                        style={isBest.compressionRatio ? bestScoreStyle : {}}
                        className="border border-white px-4 py-2">
                        {lib.compressionRatio.toFixed(2)} : 1
                      </td>
                      <td
                        style={isBest.sizeReduction ? bestScoreStyle : {}}
                        className="border border-white px-4 py-2">
                        {lib.sizeReduction.toFixed(1)} %
                      </td>
                    </tr>
                  )
                })
                :
                compressionLibraries.map((lib) => (
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
                    <td className="border border-white px-4 py-2">-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>

        <div className="w-0.5 h-full bg-white/50"></div>

        {/* Payload Preview Section */}
        <section className='w-full h-full max-w-[30%] flex flex-col justify-center items-center gap-10'>
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-medium">Payload Preview</h2>
            <p>Payload Size: <strong>{getFormattedSize(getSizeInKB(JSON.stringify(payload)))}</strong></p>
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
