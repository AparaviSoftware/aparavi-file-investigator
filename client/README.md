# Epstein Files Chatbot

A React + TypeScript + Vite + Tailwind CSS chatbot interface.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
epstein-files-chatbot/
├── src/
│   ├── assets/                    # Image and static assets
│   │   └── aparavi-logo.png       # Aparavi logo (replace with your own)
│   ├── App.tsx                    # Main App component
│   ├── EpsteinFilesChatbot.tsx    # Chatbot UI component
│   ├── index.css                  # Tailwind CSS imports
│   ├── main.tsx                   # React entry point
│   └── vite-env.d.ts              # TypeScript image declarations
├── index.html                     # HTML template
├── package.json                   # Dependencies & scripts
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # TypeScript Node configuration
└── vite.config.ts                 # Vite configuration
```

## Adding Images

Place your images in `src/assets/` and import them in your components:

```tsx
// Import image
import myLogo from './assets/my-logo.png';

// Use in JSX
<img src={myLogo} alt="My Logo" className="h-8 w-auto" />
```

Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`

## Dependencies

- **React 18** - UI library
- **Vite 5** - Build tool
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Utility-first CSS
- **Lucide React** - Icon library

## Features

- Clean chatbot interface
- Suggested questions
- Query counter (10 queries limit)
- Responsive design
- Aparavi branding
