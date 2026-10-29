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
| `RESEND_API_KEY` | **Required for contact form:** API key from [Resend](https://resend.com) |
| `CONTACT_TO_EMAIL` | Where contact submissions are delivered (default: `ryanoforikoree@gmail.com`) |
| `RESEND_FROM` | Sender address (must be allowed in Resend; see below) |

### Contact form email

The public contact form sends mail through **Resend**. Without `RESEND_API_KEY`, submissions return an error.

1. Create a free [Resend](https://resend.com) account and add an API key.
2. Set `RESEND_API_KEY` (and optionally `CONTACT_TO_EMAIL`) in `.env.local` and on Vercel.
3. **Testing:** Resend’s `onboarding@resend.dev` sender can only deliver to the email address on your Resend account until you verify a domain.
4. **Production:** Verify your domain in Resend, then set `RESEND_FROM` (e.g. `Ryan Portfolio <hello@yourdomain.com>`).

Reply-to is set to the visitor’s email so you can reply from Gmail directly.

## Admin (private)

Visit **`/admin`** (not linked on the public site). Sign in with `ADMIN_PASSWORD`.

- **Site content** tab: profile, hero, about, stats, services, skills, testimonials, contact copy (saved to [`data/site-content.json`](data/site-content.json)).
- **Projects** tab: add, edit, delete, or unpublish portfolio items ([`data/projects.json`](data/projects.json)).

If your password contains `$`, wrap it in quotes in `.env.local`, e.g. `ADMIN_PASSWORD="Me$$ipro204"`. Restart `npm run dev` after env changes.

On Vercel, set `BLOB_READ_WRITE_TOKEN` so admin saves persist.

**Required on Vercel for admin saves:** open your project → **Storage** → **Create Blob store** → connect it to this app. That adds `BLOB_READ_WRITE_TOKEN`. Also set `ADMIN_PASSWORD` and `SESSION_SECRET` (32+ characters) under **Settings → Environment Variables**, then redeploy. Without Blob, the live admin can load but every save fails because the server cannot write files.

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
