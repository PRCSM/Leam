# Leam — creator communities, memberships & live rooms

A Next.js (App Router) build of the Leam marketing site and product demo. The homepage recreates the reference screenshot, then expands into a full set of pages, a creator dashboard and a live-room interface.

```bash
npm install
cp .env.example .env.local   # optional — everything runs without it
npm run dev                  # http://localhost:3000
npm run build && npm start
```

Stack: Next.js 15 · React 19 · TypeScript · Tailwind CSS (tokens) · GSAP + ScrollTrigger · Lenis · lucide-react · next/image.

---

## What's real and what's demo

| Area | Status |
|---|---|
| All 25 routes, navigation, 404, error & loading states, sitemap, robots, OG image | Real |
| Search / filtering (Universes, creators, members) | Real (client-side over sample data) |
| Contact form → `POST /api/contact` | Real server validation. **No email provider is connected**, and the response says so (`delivered: false`) |
| LiveKit token route `POST /api/rooms/token` | Real HS256 token minting once `LIVEKIT_*` env vars are set. Returns 503 until then |
| Live rooms (video, audience, request-to-speak, reactions) | **Demo**: simulated locally and labelled "Simulated stream". Camera preview uses your own camera, stays on your device and is never sent anywhere |
| Chat, joins, follows, dashboard edits | **Demo**: stored in `localStorage` (`leam-demo:*` keys) |
| Sign-in / sign-up | **Demo**: creates a local session only, labelled in the form |
| Memberships / tickets | **Demo**: the modal stops at a step that says checkout isn't connected. Nothing is charged, and no payment is ever shown as completed |
| "Get the app" | Beta waitlist form (stored locally), because the apps aren't public |
| Creators, quotes and metrics | Fictional sample data, labelled where shown |

### Going to production
- **Auth:** replace `useDemoSession` (`src/lib/demo-store.ts`) with your provider (Auth.js, Clerk, Supabase…), then protect `/dashboard` in `middleware.ts`.
- **Payments:** hand off from `MembershipModal` (`src/components/cards/PhoneModals.tsx`) to a hosted checkout. Grant access only from the provider's webhook.
- **Real-time rooms:** set `LIVEKIT_URL`, `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`. Before going live, finish the TODO in `src/app/api/rooms/token/route.ts`: check the caller's session and membership, and give publish rights only to hosts and approved speakers. Then connect `livekit-client` inside `LiveRoom.tsx`. `/rooms/[roomId]` already passes `liveConfigured` from the server.
- **Data:** `src/lib/data.ts` is the single sample-data module. Swap it for your database queries.

---

## Structure

```
src/
  app/                    routes (server components unless interactive)
    page.tsx              homepage: reference sections first, then the expansion
    dashboard/            creator dashboard (layout + 5 pages)
    api/                  contact + LiveKit token route handlers
  components/
    home/                 Hero, VideoModal, Sections (server), Interactive (client)
    cards/                the four phone mockups + their modals
    room/                 LiveRoom + ChatPanel
    motion/               SmoothScroll (Lenis + scrollbar), Cursor, MotionDirector, SplitLines
    pages/                shared page parts (PageHero, cards, forms, legal)
    dashboard/            shell, charts, local store
    layout/ ui/
  lib/                    data, images, gsap setup, demo store, loader, LiveKit token
  styles/                 site, home, phones, pages, room, dashboard CSS
```

## Design system

Design tokens live as CSS custom properties in `src/app/globals.css` and are mirrored in `tailwind.config.ts`. Background `#050505`, raised `#111111`, card `#1A1A1A`, text `#F7F7F5` / `#A4A4A4`, hairline `rgba(255,255,255,.12)`, warm `#E7D5A0`, spark `#F7E967`, live `#FF6D38`. Type: Geist via `next/font`.

Component styling is hand-written CSS in `src/styles/*` (organised by surface). Tailwind is installed and themed with the same tokens, so you can use utilities in new code. The phone mockups size their type with container-query units, so they scale like real screenshots at any card width.

## Motion

- **Hero:** a GSAP timeline in `Hero.tsx` (curtain → photo settle → nav → eyebrow → masked headline → sparkle → rule → copy → video button).
- **Everything else** is declarative. Add data attributes to any server-rendered markup and `MotionDirector` wires them to ScrollTrigger as they enter the DOM:
  `data-reveal`, `data-reveal-stagger`, `data-split` (use `<SplitLines>`), `data-parallax="0.1"`, `data-zoom`, `data-count="1200"`, `data-line`.
- **Scrolling:** Lenis runs only on fine-pointer devices and is synced to GSAP's ticker. Touch devices keep native scrolling. The custom scrollbar has a draggable thumb and supports clicking the track.
- **Cursor:** add `data-cursor="view|join|watch|drag|explore"` to any element to get a label. It's off on touch devices.
- **Reduced motion:** with `prefers-reduced-motion`, there's no Lenis and no custom cursor, everything is shown immediately, and CSS animations are disabled.

## Photography

Images are free Unsplash-License photos, served through `unsplash.com/photos/<id>/download` with a custom `next/image` loader (`src/lib/image-loader.ts`) that asks for the exact width each image needs. The people pictured are anonymous subjects. **They are not the fictional creators** and do not endorse Leam. Replace them with your own licensed creator photography before launch. IDs are listed in `src/lib/images.ts`.

## Build verification note

This project was written in an environment where npm installs were blocked, so `next build` has **not** been run yet. Every page was bundled and run in headless Chrome at 1440px and 390px. The checks covered every route, the 404 handling, the modals, chat, membership flow, live-room request-to-speak, filters, form validation and every dashboard page, with no runtime errors. Run `npm run typecheck && npm run build` after installing and fix anything they report.
