import { Manifest } from '../types';

export const initialManifest: Manifest = {
  name: "",
  short_name: "",
  description: "",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#4F46E5",
  orientation: "any",
  scope: "/",
  icons: [],
  screenshots: [],
  categories: [],
  lang: "en",
  dir: "ltr",
  prefer_related_applications: false
};

export const PWABUILDER_CATEGORIES = [
  "books", "business", "education", "entertainment", "finance", "food", "games",
  "government", "health", "kids", "lifestyle", "magazines", "medical", "music",
  "navigation", "news", "personalization", "photo", "politics", "productivity",
  "security", "shopping", "social", "sports", "travel", "utilities", "weather"
];
