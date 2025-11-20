import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { Manifest } from '../types';

// Convert Base64 to Blob
const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// Resize image to specific dimensions
export const resizeImage = (
  base64Str: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Str}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      // Return base64 without prefix for zip
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl.split(',')[1]); 
    };
    img.onerror = (e) => reject(e);
  });
};

export const downloadPwaKit = async (manifest: Manifest, iconBase64: string | null) => {
  const zip = new JSZip();

  // 1. Add Manifest
  // Clean up manifest before saving
  const cleanManifest = { ...manifest };
  
  // Filter screenshots to remove empty entries
  if (cleanManifest.screenshots && Array.isArray(cleanManifest.screenshots)) {
    cleanManifest.screenshots = cleanManifest.screenshots.filter(s => s.src && s.src.trim() !== '');
  }

  // Ensure icons point to local files in the zip structure
  if (iconBase64) {
    cleanManifest.icons = [
      {
        src: "./icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "./icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
       {
        src: "./icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "./icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ];
  }

  zip.file("manifest.json", JSON.stringify(cleanManifest, null, 2));

  // 2. Process and Add Icons
  if (iconBase64) {
    const iconsFolder = zip.folder("icons");
    if (iconsFolder) {
      try {
        // Standard 192
        const icon192 = await resizeImage(iconBase64, 192, 192);
        iconsFolder.file("icon-192x192.png", icon192, { base64: true });

        // Standard 512
        const icon512 = await resizeImage(iconBase64, 512, 512);
        iconsFolder.file("icon-512x512.png", icon512, { base64: true });

        // Maskable (Using same image for MVP, ideally would verify safe zone)
        // In a real "perfect" app, we might add padding, but resizing is the MVP baseline
        iconsFolder.file("icon-maskable-192x192.png", icon192, { base64: true });
        iconsFolder.file("icon-maskable-512x512.png", icon512, { base64: true });

      } catch (err) {
        console.error("Error processing icons for zip", err);
        alert("There was an error processing the icons. The manifest will be saved without icon files.");
      }
    }
  }

  // 3. Generate and Download
  const content = await zip.generateAsync({ type: "blob" });
  
  // Robust saveAs handling: checks for default function or named property to support various module formats
  const saveAs = (FileSaver as any).saveAs || FileSaver;
  saveAs(content, `${manifest.short_name || 'pwa'}-kit.zip`);
};