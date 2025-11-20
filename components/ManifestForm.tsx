import React from 'react';
import { Manifest } from '../types';
import { PWABUILDER_CATEGORIES } from '../utils/manifestHelpers';

interface ManifestFormProps {
  manifest: Manifest;
  onChange: (updated: Manifest) => void;
}

export const ManifestForm: React.FC<ManifestFormProps> = ({ manifest, onChange }) => {
  
  const handleChange = (field: keyof Manifest, value: any) => {
    onChange({ ...manifest, [field]: value });
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
      </div>
    </div>
  );
};
