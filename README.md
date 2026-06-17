# Akash & Madhavi — Wedding Invitation

Indian wedding invitation website for Akash and Madhavi, built with Vite, React, Tailwind CSS, and Framer Motion.

## Events

- **3 July 2026** — Mehndi
- **4 July 2026** — Haldi & Puja Matkor
- **5 July 2026** — Wedding

## Development

```bash
npm install
npm run dev
```

Edit copy and venues in [`src/data/wedding.ts`](src/data/wedding.ts).

## Deploy (Vercel)

```bash
npm run build
npx vercel
```

Or import this repository in Vercel. Use these settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Assets

Images are in `public/assets/`.

## Indexing

The site is configured not to be indexed:

- `public/robots.txt` blocks crawlers.
- `index.html` includes a `noindex` robots meta tag.
- `vercel.json` sends an `X-Robots-Tag` header.
