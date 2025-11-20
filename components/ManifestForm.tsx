import React from 'react';
import { Manifest, Screenshot } from '../types';
import { PWABUILDER_CATEGORIES } from '../utils/manifestHelpers';

interface ManifestFormProps {
  manifest: Manifest;
  onChange: (updated: Manifest) => void;
}

export const ManifestForm: React.FC<ManifestFormProps> = ({ manifest, onChange }) => {
  
  const handleChange = (field: keyof Manifest, value: any) => {
    onChange({ ...manifest, [field]: value });
  };

  const handleScreenshotChange = (index: number, field: keyof Screenshot, value: any) => {
    const newScreenshots = [...manifest.screenshots];
    newScreenshots[index] = { ...newScreenshots[index], [field]: value };
    handleChange('screenshots', newScreenshots);
  };

  const addScreenshot = () => {
    const newScreenshot: Screenshot = {
      src: '',
      form_factor: 'narrow',
      label: '',
      type: 'image/png'
    };
    handleChange('screenshots', [...manifest.screenshots, newScreenshot]);
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = manifest.screenshots.filter((_, i) => i !== index);
    handleChange('screenshots', newScreenshots);
  };

  // Validation helpers
  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isImageUrl = (url: string) => {
    if (!url) return true;
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-700 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700 bg-slate-900/50">
        <h2 className="text-xl font-semibold text-white">App Details</h2>
        <p className="text-slate-400 text-sm mt-1">Essential information for PWA Builder compliance.</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">App Name *</label>
            <input
              type="text"
              value={manifest.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="My Awesome PWA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Short Name *</label>
            <input
              type="text"
              value={manifest.short_name}
              onChange={(e) => handleChange('short_name', e.target.value)}
              maxLength={12}
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="MyPWA"
            />
            <p className="text-xs text-slate-500 mt-1">Max 12 chars recommended.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
          <textarea
            value={manifest.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            placeholder="Explain what your app does..."
          />
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start URL</label>
            <input
              type="text"
              value={manifest.start_url}
              onChange={(e) => handleChange('start_url', e.target.value)}
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Display Mode</label>
            <select
              value={manifest.display}
              onChange={(e) => handleChange('display', e.target.value)}
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="standalone">Standalone (Recommended)</option>
              <option value="fullscreen">Fullscreen</option>
              <option value="minimal-ui">Minimal UI</option>
              <option value="browser">Browser</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
             <select
              value={manifest.categories[0] || ''}
              onChange={(e) => handleChange('categories', [e.target.value])}
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a category</option>
              {PWABUILDER_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Theme Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={manifest.theme_color}
                onChange={(e) => handleChange('theme_color', e.target.value)}
                className="h-10 w-10 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={manifest.theme_color}
                onChange={(e) => handleChange('theme_color', e.target.value)}
                className="flex-1 bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white uppercase"
              />
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={manifest.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="h-10 w-10 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={manifest.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="flex-1 bg-dark border border-slate-600 rounded-lg px-4 py-2 text-white uppercase"
              />
            </div>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Screenshots</h3>
              <p className="text-xs text-slate-400">Add URLs for your app screenshots (required for store listing)</p>
            </div>
            <button
              onClick={addScreenshot}
              className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Screenshot
            </button>
          </div>
          
          <div className="space-y-4">
            {manifest.screenshots.map((screenshot, index) => {
               const validUrl = isValidUrl(screenshot.src);
               const validImage = isImageUrl(screenshot.src);
               
               return (
              <div key={index} className="bg-dark/50 border border-slate-700 p-4 rounded-lg relative group">
                 <button
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove Screenshot"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-6">
                    <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={screenshot.src}
                      onChange={(e) => handleScreenshotChange(index, 'src', e.target.value)}
                      placeholder="https://example.com/screenshot1.png"
                      className={`w-full bg-dark border rounded text-sm px-3 py-1.5 text-white focus:ring-1 focus:outline-none transition-colors ${
                        !validUrl 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : (!validImage 
                              ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500' 
                              : 'border-slate-600 focus:border-primary focus:ring-primary')
                      }`}
                    />
                    {!validUrl && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Invalid URL format
                      </p>
                    )}
                    {validUrl && !validImage && screenshot.src && (
                       <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Should end in .png, .jpg, or .webp
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-400 mb-1">Label</label>
                    <input
                      type="text"
                      value={screenshot.label || ''}
                      onChange={(e) => handleScreenshotChange(index, 'label', e.target.value)}
                      placeholder="Home Screen"
                      className="w-full bg-dark border border-slate-600 rounded text-sm px-3 py-1.5 text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-400 mb-1">Form Factor</label>
                    <select
                      value={screenshot.form_factor || 'narrow'}
                      onChange={(e) => handleScreenshotChange(index, 'form_factor', e.target.value)}
                      className="w-full bg-dark border border-slate-600 rounded text-sm px-3 py-1.5 text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                    >
                      <option value="narrow">Narrow (Mobile)</option>
                      <option value="wide">Wide (Desktop)</option>
                    </select>
                  </div>
                </div>
              </div>
            )})}
            {manifest.screenshots.length === 0 && (
              <div className="text-center py-8 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm">
                No screenshots added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};