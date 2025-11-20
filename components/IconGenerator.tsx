import React, { useState } from 'react';
import { ImageSize } from '../types';
import { generateAppIcon } from '../services/geminiService';

interface IconGeneratorProps {
  onIconGenerated: (base64: string) => void;
}

export const IconGenerator: React.FC<IconGeneratorProps> = ({ onIconGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateAppIcon(prompt, size);
      setGeneratedImage(result.base64);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (generatedImage) {
      onIconGenerated(generatedImage);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          AI Icon Generator
        </h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-mono">Gemini 3 Pro</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Icon Description</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A futuristic rocket ship, minimalistic, gradient blue background"
            className="w-full bg-dark border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Generation Size</label>
          <div className="grid grid-cols-3 gap-3">
            {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  size === s 
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-surface' 
                    : 'bg-dark text-slate-400 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating High-Res Icon...
            </>
          ) : (
            'Generate Icon'
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {generatedImage && (
        <div className="animate-fade-in pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-3">Preview ({size})</p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img 
                src={`data:image/png;base64,${generatedImage}`} 
                alt="Generated Icon" 
                className="w-48 h-48 rounded-2xl shadow-2xl border border-slate-600 object-cover"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
            
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 bg-secondary hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Use This Icon
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
