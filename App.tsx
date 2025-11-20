import React, { useState, useEffect } from 'react';
import { Manifest } from './types';
import { initialManifest } from './utils/manifestHelpers';
import { ManifestForm } from './components/ManifestForm';
import { IconGenerator } from './components/IconGenerator';
import { downloadPwaKit } from './utils/zipUtils';

const App: React.FC = () => {
  const [manifest, setManifest] = useState<Manifest>(initialManifest);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [generatedIconBase64, setGeneratedIconBase64] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for API key on mount
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySet(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleApiKeySelect = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySet(hasKey);
    } else {
      alert("AI Studio environment not detected. Please run in the correct environment.");
    }
  };

  const handleIconGenerated = (base64: string) => {
    setGeneratedIconBase64(base64);
  };

  const handleDownload = () => {
    if (!manifest.name || !manifest.short_name || !manifest.description) {
      alert("Please fill in the essential app details (Name, Short Name, Description).");
      return;
    }
    downloadPwaKit(manifest, generatedIconBase64);
  };

  if (!apiKeySet) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface rounded-2xl border border-slate-700 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 19.293l-2.829-2.829-2.828 2.828c-.78.78-2.047.78-2.828 0-.78-.78-.78-2.047 0-2.828l2.828-2.828-2.829-2.828 5.743-7.744A6 6 0 0120 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome to PWA Architect</h1>
          <p className="text-slate-400">
            To generate high-quality AI assets for your PWA, please select a valid Google Gemini API Key.
            Requires a paid project for Veo/Image 3 Pro models.
          </p>
          <button
            onClick={handleApiKeySelect}
            className="w-full py-3 px-4 bg-primary hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-primary/25"
          >
            Select API Key
          </button>
           <div className="text-xs text-slate-500">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">
              View billing documentation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-slate-200 pb-20">
      {/* Header */}
      <header className="bg-surface border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">P</span>
             </div>
             <h1 className="text-xl font-bold text-white tracking-tight">PWA Architect Pro</h1>
          </div>
          <button
            onClick={handleDownload}
            className="bg-white text-primary hover:bg-slate-100 px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download ZIP
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Manifest Details */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Manifest Configuration</h2>
              <ManifestForm manifest={manifest} onChange={setManifest} />
            </section>
          </div>

          {/* Right Column: AI Asset Generation */}
          <div className="space-y-8">
             <section>
              <h2 className="text-2xl font-bold text-white mb-6">Assets & Design</h2>
              <IconGenerator onIconGenerated={handleIconGenerated} />
            </section>

            {/* Preview Card */}
             <div className="bg-surface rounded-xl border border-slate-700 p-6">
               <h3 className="text-lg font-semibold text-white mb-4">Package Summary</h3>
               <ul className="space-y-3 text-sm text-slate-400">
                 <li className="flex items-center gap-2">
                   <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   Valid JSON Manifest
                 </li>
                 <li className="flex items-center gap-2">
                   {generatedIconBase64 ? (
                      <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600"></div>
                   )}
                   Generated Icons (192, 512)
                 </li>
                 <li className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-full border-2 border-slate-600"></div>
                   Screenshots (Pending)
                 </li>
               </ul>
               <button 
                 onClick={handleDownload}
                 className="w-full mt-6 bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                 Export Complete Package
               </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
