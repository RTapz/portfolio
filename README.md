# Creative portfolio

Single-page portfolio built with **Next.js**, **Tailwind CSS**, **Framer Motion**, **Lenis**, and a **React Three Fiber** interactive skills keyboard.

## Getting started

```bash
npm install
cp env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|----------|-------------|
| `ADMIN_PASSWORD` | Password for `/admin` (default dev: `admin` if unset) |
| `SESSION_SECRET` | Cookie encryption secret (32+ characters) |
| `BLOB_READ_WRITE_TOKEN` | Optional: store projects in Vercel Blob on deploy |

## Admin (private)

Visit **`/admin`** (not linked on the public site). Sign in with `ADMIN_PASSWORD`.

- **Site content** tab: profile, hero, about, stats, services, skills, testimonials, contact copy (saved to [`data/site-content.json`](data/site-content.json)).
- **Projects** tab: add, edit, delete, or unpublish portfolio items ([`data/projects.json`](data/projects.json)).

If your password contains `$`, wrap it in quotes in `.env.local`, e.g. `ADMIN_PASSWORD="Me$$ipro204"`. Restart `npm run dev` after env changes.

On Vercel, set `BLOB_READ_WRITE_TOKEN` so admin saves persist.

## Customize content

- **Skills keycaps:** [`content/skills.ts`](content/skills.ts) (keys, colors, descriptions, grid positions)
- **Sections:** [`components/sections/`](components/sections/)
- **Hero copy / nav:** [`components/sections/Hero.tsx`](components/sections/Hero.tsx), [`lib/constants.ts`](lib/constants.ts)

## Scripts

- `npm run dev` development server
- `npm run build` production build
- `npm run start` run production build locally

## Deploy

Deploy to [Vercel](https://vercel.com). Add the env vars above. Enable Vercel Blob if you use the admin UI in production.
