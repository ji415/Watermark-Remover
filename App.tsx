import React, { useState, useCallback } from 'react';
import { Eraser, Download, Trash2, Wand2, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ComparisonSlider from './components/ComparisonSlider';
import { removeWatermark, fileToGenerativePart } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setStatus(AppState.IDLE);
      setError(null);
      setProcessedImage(null);
      setOriginalFile(file);
      
      // Create preview immediately
      const base64 = await fileToGenerativePart(file);
      setOriginalImage(`data:${file.type};base64,${base64}`);
    } catch (e) {
      setError("Failed to load image preview.");
    }
  }, []);

  const handleProcess = async () => {
    if (!originalFile) return;

    setStatus(AppState.PROCESSING);
    setError(null);

    try {
      const result = await removeWatermark(originalFile, customPrompt);
      setProcessedImage(result);
      setStatus(AppState.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Something went wrong while processing the image.");
      setStatus(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppState.IDLE);
    setOriginalImage(null);
    setOriginalFile(null);
    setProcessedImage(null);
    setError(null);
    setCustomPrompt("");
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `cleaned-${originalFile?.name || 'image.png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl flex flex-col gap-8">
        
        {/* Hero Section */}
        {status === AppState.IDLE && !originalImage && (
          <div className="text-center py-16 space-y-6 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Remove Watermarks <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Using AI Magic
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Upload your image and let our Gemini-powered AI instantly remove watermarks, 
              logos, and text overlays while preserving the background quality.
            </p>
            <Dropzone onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Workspace */}
        {originalImage && (
          <div className="flex flex-col lg:flex-row gap-8 items-start animate-slideUp">
            
            {/* Sidebar Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Image Info Card */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-blue-400" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Custom Instructions (Optional)
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., Remove the logo in the bottom right corner..."
                      className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      disabled={status === AppState.PROCESSING}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Leave empty for auto-detection of all watermarks.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                     {status === AppState.ERROR && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm mb-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      onClick={handleProcess}
                      disabled={status === AppState.PROCESSING || status === AppState.SUCCESS}
                      className={`
                        w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all
                        ${status === AppState.PROCESSING 
                          ? 'bg-blue-600/50 cursor-not-allowed text-blue-100' 
                          : status === AppState.SUCCESS
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
                        }
                      `}
                    >
                      {status === AppState.PROCESSING ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : status === AppState.SUCCESS ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Done
                        </>
                      ) : (
                        <>
                          <Eraser className="w-5 h-5" />
                          Remove Watermark
                        </>
                      )}
                    </button>

                    {status === AppState.SUCCESS && (
                      <button
                        onClick={handleDownload}
                        className="w-full py-3 px-4 rounded-lg font-semibold bg-slate-700 text-white hover:bg-slate-600 transition-all flex items-center justify-center gap-2 border border-slate-600"
                      >
                        <Download className="w-5 h-5" />
                        Download Clean Image
                      </button>
                    )}

                    <button
                      onClick={handleReset}
                      className="w-full py-3 px-4 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      {status === AppState.SUCCESS ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      {status === AppState.SUCCESS ? "Start Over" : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Preview Area */}
            <div className="w-full lg:w-2/3">
              {status === AppState.SUCCESS && processedImage ? (
                <div className="animate-fadeIn">
                   <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">Result</h2>
                      <span className="text-sm text-slate-400">Drag slider to compare</span>
                   </div>
                   <ComparisonSlider original={originalImage} processed={processedImage} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white">Original Image</h2>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50 shadow-2xl aspect-video flex items-center justify-center">
                    <img 
                      src={originalImage} 
                      alt="Original Upload" 
                      className="max-w-full max-h-[60vh] object-contain shadow-lg"
                    />
                    {status === AppState.PROCESSING && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fadeIn z-10">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-slate-600 rounded-full"></div>
                          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-blue-200 font-medium animate-pulse">Removing artifacts...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <footer className="w-full border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;
