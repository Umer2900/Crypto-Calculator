# Crypto Investment Toolkit

A Next.js crypto calculator app with strategy, tax, and futures tools.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Getting Started
1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

3. Open `http://localhost:3000`

## Scripts
- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run the production server
- `npm run lint` — run Next.js lint

## Project Structure
- `src/app/layout.tsx` — root layout
- `src/app/page.tsx` — main page UI
- `src/app/globals.css` — global styles (Tailwind import)
- `src/components/` — reusable UI components
- `src/utils/` — helper utilities
- `src/types.ts` — shared TypeScript types
- `public/` — static assets

## Notes
- The main UI is a client component (`src/app/page.tsx`) to support interactive tabs and inputs.
- Tailwind CSS is configured via `postcss.config.cjs` with `@tailwindcss/postcss`.
