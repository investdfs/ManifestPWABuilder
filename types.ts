export interface Manifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  orientation: 'any' | 'natural' | 'landscape' | 'portrait';
  scope: string;
  icons: Icon[];
  screenshots: Screenshot[];
  categories: string[];
  iarc_rating_id?: string;
  related_applications?: RelatedApplication[];
  prefer_related_applications?: boolean;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
}

export interface Icon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
}

export interface Screenshot {
  src: string;
  sizes?: string;
  type?: string;
  form_factor?: 'wide' | 'narrow';
  label?: string;
}

export interface RelatedApplication {
  platform: string;
  url: string;
  id?: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

// Augment window for AI Studio with proper interface definition
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}