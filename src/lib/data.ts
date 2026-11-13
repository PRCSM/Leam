import { IMG } from "./images";

/* ------------------------------------------------------------------ */
/*  DEMO CONTENT                                                       */
/*  All creators, universes, quotes and numbers below are fictional    */
/*  sample data used to demonstrate the product. Photos are anonymous  */
/*  Unsplash-licensed images, not the people named here.               */
/* ------------------------------------------------------------------ */

export const CATEGORIES = [
  { slug: "music", name: "Music", blurb: "Listening sessions, studio diaries and late-night sets.", image: IMG.drumsWarm },
  { slug: "art", name: "Art", blurb: "Process streams, critiques and open studios.", image: IMG.womanLight },
  { slug: "fashion", name: "Fashion", blurb: "Drops, fittings and street-style walks.", image: IMG.womanStreet },
  { slug: "gaming", name: "Gaming", blurb: "Co-op nights, speedrun clinics and lore deep dives.", image: IMG.onAir },
  { slug: "film", name: "Film", blurb: "Watch-alongs, scripts in progress, director Q&As.", image: IMG.parisDusk },
  { slug: "design", name: "Design", blurb: "Live crits, type nerdery and portfolio reviews.", image: IMG.manGrid },
  { slug: "culture", name: "Culture", blurb: "Conversations about everything happening right now.", image: IMG.crowd },
  { slug: "education", name: "Education", blurb: "Cohorts, office hours and study rooms.", image: IMG.womanGlasses },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export type AccessMode = "public" | "private" | "ticketed" | "subscription" | "invite";

export const ACCESS_MODES: { id: AccessMode; label: string; detail: string; cta: string }[] = [
  { id: "public", label: "Public", detail: "Anyone can drop into rooms and read the chat.", cta: "Join free" },
  { id: "private", label: "Private", detail: "Members you approve. Requests land in your inbox.", cta: "Request access" },
  { id: "ticketed", label: "Ticketed", detail: "One-time tickets for a single room or a season.", cta: "Get a ticket · $12" },
  { id: "subscription", label: "Subscription", detail: "Monthly membership unlocks every room and the chat.", cta: "Subscribe · $9.99/mo" },
  { id: "invite", label: "Invite-only", detail: "Only people holding your invite link get in.", cta: "Enter invite code" },
];

export type Creator = {
  slug: string;
  name: string;
  handle: string;
  category: CategorySlug;
  role: string;
  location: string;
  priceCents: number;
  image: string;
  cover: string;
  bio: string;
  followers: number;
  members: number;
  universe: string;
};

export const CREATORS: Creator[] = [
  {
    slug: "amara-vale",
    name: "Amara Vale",
    handle: "@amaravale",
    category: "fashion",
    role: "Stylist & creative director",
    location: "London",
    priceCents: 999,
    image: IMG.womanRedHair,
    cover: IMG.womanStreet,
    bio: "Fittings, mood boards and the stories behind every look. Members get first access to sample sales and the Thursday styling room.",
    followers: 182_000,
    members: 2_410,
    universe: "behind-the-seams",
  },
  {
    slug: "theo-marsh",
    name: "Theo Marsh",
    handle: "@theomarsh",
    category: "music",
    role: "Producer & drummer",
    location: "Atlanta",
    priceCents: 3999,
    image: IMG.manJacket,
    cover: IMG.drumsWarm,
    bio: "Beat breakdowns, stem giveaways and a monthly listening party where members vote on what gets finished.",
    followers: 96_400,
    members: 1_180,
    universe: "late-night-stems",
  },
  {
    slug: "noor-elias",
    name: "Noor Elias",
    handle: "@noorelias",
    category: "art",
    role: "Painter",
    location: "Lisbon",
    priceCents: 600,
    image: IMG.womanLight,
    cover: IMG.womanCloak,
    bio: "Slow painting, live. Open studio every Sunday and a members-only critique circle once a month.",
    followers: 41_800,
    members: 870,
    universe: "open-studio",
  },
  {
    slug: "kai-okafor",
    name: "Kai Okafor",
    handle: "@kaiokafor",
    category: "culture",
    role: "Host & writer",
    location: "Lagos",
    priceCents: 999,
    image: IMG.manHat,
    cover: IMG.crowd,
    bio: "A weekly show about the culture — music, money and the internet — with listeners on stage every episode.",
    followers: 228_000,
    members: 5_320,
    universe: "culture-unfiltered",
  },
  {
    slug: "rhea-sol",
    name: "Rhea Sol",
    handle: "@rheasol",
    category: "film",
    role: "Director",
    location: "Paris",
    priceCents: 1500,
    image: IMG.womanBlack,
    cover: IMG.parisDusk,
    bio: "Script readings, dailies and director commentary for a feature film being made in public.",
    followers: 64_900,
    members: 1_540,
    universe: "dailies",
  },
  {
    slug: "jun-park",
    name: "Jun Park",
    handle: "@junpark",
    category: "design",
    role: "Type designer",
    location: "Seoul",
    priceCents: 800,
    image: IMG.manGlasses,
    cover: IMG.manGrid,
    bio: "Letterforms from sketch to release. Live crits and early font licences for members.",
    followers: 38_200,
    members: 640,
    universe: "glyph-club",
  },
  {
    slug: "maya-chen",
    name: "Maya Chen",
    handle: "@mayachen",
    category: "education",
    role: "Physics teacher",
    location: "Toronto",
    priceCents: 500,
    image: IMG.womanGlasses,
    cover: IMG.womanSitting,
    bio: "Study rooms, exam cram nights and the weirdest physics questions you can think of.",
    followers: 120_500,
    members: 3_900,
    universe: "study-hall",
  },
  {
    slug: "dex-romero",
    name: "Dex Romero",
    handle: "@dexromero",
    category: "gaming",
    role: "Speedrunner",
    location: "Mexico City",
    priceCents: 499,
    image: IMG.manDark,
    cover: IMG.onAir,
    bio: "Route planning, co-op nights and the occasional world-record attempt with chat on the line.",
    followers: 310_000,
    members: 7_100,
    universe: "any-percent",
  },
];

export type Tier = { id: string; name: string; priceCents: number; interval: "month" | "once"; perks: string[] };

export type Universe = {
  slug: string;
  title: string;
  creator: string;
  category: CategorySlug;
  access: AccessMode;
  tagline: string;
  description: string;
  schedule: string;
  since: number;
  cover: string;
  members: number;
  tiers: Tier[];
  rooms: string[];
};

const baseTiers = (price: number): Tier[] => [
  { id: "free", name: "Follower", priceCents: 0, interval: "month", perks: ["Public rooms", "Read-only chat"] },
  { id: "member", name: "Member", priceCents: price, interval: "month", perks: ["Every live room", "Full community chat", "Replays for 30 days"] },
  { id: "inner", name: "Inner circle", priceCents: price * 3, interval: "month", perks: ["Everything in Member", "Request to speak priority", "Monthly 1:1 room", "Merch drops first"] },
];

export const UNIVERSES: Universe[] = [
  {
    slug: "culture-unfiltered",
    title: "Behind the Scenes",
    creator: "kai-okafor",
    category: "culture",
    access: "subscription",
    tagline: "Culture Unfiltered",
    description: "Welcome to Behind the Scenes with Culture Unfiltered! This is my weekly show where we talk with the people shaping what's next — and you get on stage too.",
    schedule: "Every Mon, 10am",
    since: 2022,
    cover: IMG.crowd,
    members: 5_320,
    tiers: baseTiers(999),
    rooms: ["bts-monday", "listener-stage"],
  },
  {
    slug: "behind-the-seams",
    title: "Behind the Seams",
    creator: "amara-vale",
    category: "fashion",
    access: "subscription",
    tagline: "Fittings, sample sales & styling rooms",
    description: "A private studio for people who care how clothes are made. Fittings, archive pulls and Thursday styling rooms.",
    schedule: "Thursdays, 7pm",
    since: 2023,
    cover: IMG.womanStreet,
    members: 2_410,
    tiers: baseTiers(999),
    rooms: ["thursday-fit"],
  },
  {
    slug: "late-night-stems",
    title: "Late Night Stems",
    creator: "theo-marsh",
    category: "music",
    access: "subscription",
    tagline: "Beats get finished here",
    description: "Members vote on unfinished beats, download stems and join the monthly listening party.",
    schedule: "Fri, 11pm",
    since: 2021,
    cover: IMG.drumsWarm,
    members: 1_180,
    tiers: baseTiers(3999),
    rooms: ["listening-party"],
  },
  {
    slug: "open-studio",
    title: "Open Studio",
    creator: "noor-elias",
    category: "art",
    access: "public",
    tagline: "Slow painting, live",
    description: "Paint alongside Noor every Sunday. The critique circle is members-only.",
    schedule: "Sundays, 4pm",
    since: 2024,
    cover: IMG.womanCloak,
    members: 870,
    tiers: baseTiers(600),
    rooms: ["sunday-studio"],
  },
  {
    slug: "dailies",
    title: "Dailies",
    creator: "rhea-sol",
    category: "film",
    access: "ticketed",
    tagline: "A feature film, made in public",
    description: "Ticketed screenings of each week's dailies with director commentary and a live Q&A.",
    schedule: "Season 2 · weekly",
    since: 2024,
    cover: IMG.parisDusk,
    members: 1_540,
    tiers: [
      { id: "ticket", name: "Single screening", priceCents: 1200, interval: "once", perks: ["One live screening", "Q&A access"] },
      { id: "season", name: "Season pass", priceCents: 6000, interval: "once", perks: ["All 8 screenings", "Script PDFs", "Credits mention"] },
    ],
    rooms: ["dailies-screening"],
  },
  {
    slug: "glyph-club",
    title: "Glyph Club",
    creator: "jun-park",
    category: "design",
    access: "private",
    tagline: "Type, from sketch to release",
    description: "Live crits for type designers. Approval required so the room stays focused.",
    schedule: "Every other Wed",
    since: 2023,
    cover: IMG.manGrid,
    members: 640,
    tiers: baseTiers(800),
    rooms: ["crit-night"],
  },
  {
    slug: "study-hall",
    title: "Study Hall",
    creator: "maya-chen",
    category: "education",
    access: "public",
    tagline: "Physics, out loud",
    description: "Free study rooms every weeknight, with members-only exam cram sessions.",
    schedule: "Weeknights, 6pm",
    since: 2022,
    cover: IMG.womanSitting,
    members: 3_900,
    tiers: baseTiers(500),
    rooms: ["cram-night"],
  },
  {
    slug: "any-percent",
    title: "Any%",
    creator: "dex-romero",
    category: "gaming",
    access: "invite",
    tagline: "Route planning & record attempts",
    description: "An invite-only crew for runners. Bring a friend's code or apply for the next wave.",
    schedule: "Sat, 9pm",
    since: 2021,
    cover: IMG.onAir,
    members: 7_100,
    tiers: baseTiers(499),
    rooms: ["record-attempt"],
  },
];

export type Room = {
  id: string;
  title: string;
  universe: string;
  host: string;
  status: "live" | "scheduled";
  startsAt: string;
  viewers: number;
  image: string;
};

export const ROOMS: Room[] = [
  { id: "bts-monday", title: "Behind the Scenes — Ep. 112", universe: "culture-unfiltered", host: "kai-okafor", status: "live", startsAt: "Now", viewers: 72, image: IMG.manHat },
  { id: "listener-stage", title: "Listener stage: your hot takes", universe: "culture-unfiltered", host: "kai-okafor", status: "scheduled", startsAt: "Thu, 8pm", viewers: 0, image: IMG.crowd },
  { id: "thursday-fit", title: "Thursday styling room", universe: "behind-the-seams", host: "amara-vale", status: "live", startsAt: "Now", viewers: 214, image: IMG.womanRedHair },
  { id: "listening-party", title: "Listening party #31", universe: "late-night-stems", host: "theo-marsh", status: "scheduled", startsAt: "Fri, 11pm", viewers: 0, image: IMG.drums },
  { id: "sunday-studio", title: "Sunday studio: blues", universe: "open-studio", host: "noor-elias", status: "scheduled", startsAt: "Sun, 4pm", viewers: 0, image: IMG.womanLight },
  { id: "dailies-screening", title: "Dailies — week 6", universe: "dailies", host: "rhea-sol", status: "scheduled", startsAt: "Tue, 9pm", viewers: 0, image: IMG.parisDusk },
  { id: "crit-night", title: "Crit night: italics", universe: "glyph-club", host: "jun-park", status: "live", startsAt: "Now", viewers: 38, image: IMG.manGlasses },
  { id: "cram-night", title: "Cram night: waves & optics", universe: "study-hall", host: "maya-chen", status: "live", startsAt: "Now", viewers: 403, image: IMG.womanGlasses },
  { id: "record-attempt", title: "Record attempt (chat picks route)", universe: "any-percent", host: "dex-romero", status: "scheduled", startsAt: "Sat, 9pm", viewers: 0, image: IMG.manDark },
];

export const PEOPLE = [
  { id: "p1", name: "Chris", image: IMG.manJacket, role: "Host" },
  { id: "p2", name: "James", image: IMG.manGlasses, role: "Co-host" },
  { id: "p3", name: "Imani", image: IMG.womanBlack, role: "Speaker" },
  { id: "p4", name: "Erica", image: IMG.womanRedHair, role: "Speaker" },
  { id: "p5", name: "Alex", image: IMG.manDark, role: "Speaker" },
  { id: "p6", name: "CJ", image: IMG.manHat, role: "Listener" },
  { id: "p7", name: "Tess", image: IMG.womanLight, role: "Listener" },
  { id: "p8", name: "Max", image: IMG.manGrid, role: "Listener" },
] as const;

export type Person = (typeof PEOPLE)[number];

export type ChatMessage = { id: string; author: string; avatar: string; text: string; time: string; badge?: string; mine?: boolean };

export const SEED_CHAT: ChatMessage[] = [
  { id: "m1", author: "Mufeeza", avatar: IMG.womanBlack, text: "Today's show was fantastic!", time: "5:01pm", badge: "Member" },
  { id: "m2", author: "Mufeeza", avatar: IMG.womanBlack, text: "Let's do this more often", time: "5:02pm", badge: "Member" },
  { id: "m3", author: "Marcus", avatar: IMG.manJacket, text: "Totally", time: "5:03pm" },
  { id: "m4", author: "Marcus", avatar: IMG.manJacket, text: "It's great connecting", time: "5:03pm" },
  { id: "m5", author: "Lena", avatar: IMG.womanRedHair, text: "Does anyone know these creators? They'd be dope guests", time: "5:05pm", badge: "Inner circle" },
];

export const TESTIMONIALS = [
  {
    quote: "My audience finally has somewhere to go after the stream ends. The chat between shows is where the community actually formed.",
    name: "Kai Okafor",
    role: "Host, Culture Unfiltered",
    image: IMG.manHat,
  },
  {
    quote: "Tickets for single screenings meant people who'd never subscribe still came — and a third of them stayed for the season pass.",
    name: "Rhea Sol",
    role: "Director, Dailies",
    image: IMG.womanBlack,
  },
  {
    quote: "Keeping the crit room private changed everything. Two hundred people who care beats twenty thousand who scroll.",
    name: "Jun Park",
    role: "Type designer, Glyph Club",
    image: IMG.manGlasses,
  },
];

export const POSTS = [
  {
    slug: "the-top-one-percent",
    title: "Building for your top 1%",
    excerpt: "Why the most valuable people in your audience rarely show up in your analytics — and how to give them a room of their own.",
    date: "2026-10-28",
    readMins: 6,
    image: IMG.crowd,
    tag: "Community",
    body: [
      "Most creators measure success by reach. Reach is a fine number for brand deals, but it says almost nothing about who would show up on a Tuesday night to talk with you.",
      "The top 1% of an audience behaves differently. They comment early, they share without being asked, and they will pay for proximity long before they pay for content.",
      "A Universe is designed around that group: a predictable schedule of live rooms, a chat that keeps going between them, and access rules you control.",
      "Start small. Pick one recurring room, invite the twenty people you already recognise by name, and let the community decide what the second room should be.",
    ],
  },
  {
    slug: "tickets-vs-subscriptions",
    title: "Tickets or subscriptions?",
    excerpt: "Two pricing models, two very different relationships. A practical guide to choosing — or combining — both.",
    date: "2026-10-09",
    readMins: 8,
    image: IMG.parisDusk,
    tag: "Monetization",
    body: [
      "Subscriptions reward consistency. If you host every week, monthly membership is the cleanest promise you can make.",
      "Tickets reward moments. A premiere, a workshop, a one-off conversation with a guest — these are easier to sell individually.",
      "Many Universes combine them: a low monthly tier for the chat and replays, plus ticketed premium rooms that members get at a discount.",
    ],
  },
  {
    slug: "hosting-your-first-room",
    title: "Hosting your first live room",
    excerpt: "Lighting, pacing, and the art of bringing someone from the audience onto the stage.",
    date: "2026-09-17",
    readMins: 5,
    image: IMG.onAir,
    tag: "Live",
    body: [
      "Open with the room, not the topic. Greet people by name as they arrive — it sets the tone that this is a conversation.",
      "Invite one guest in advance and one from the audience on the spot. The contrast keeps energy high.",
      "End on time and leave the chat open. The best part of many rooms happens in the ten minutes after the stream stops.",
    ],
  },
  {
    slug: "light-in-a-rabbit-hole",
    title: "Light in a rabbit hole",
    excerpt: "Memberships, collectibles, gated access — a plain-language guide to the tools behind a Universe.",
    date: "2026-08-30",
    readMins: 7,
    image: IMG.cave,
    tag: "Guides",
    body: [
      "Access rules can be overwhelming. We think of them as keys: a subscription, a ticket, a merch order code, or a digital collectible can all open the same door.",
      "Use the simplest key your audience already understands. You can add others later without moving anyone.",
    ],
  },
];

export const MEMBERS = [
  { id: "u1", name: "Lena Ortiz", email: "lena@example.com", tier: "Inner circle", joined: "2024-02-11", status: "active", image: IMG.womanRedHair },
  { id: "u2", name: "Marcus Hill", email: "marcus@example.com", tier: "Member", joined: "2024-06-03", status: "active", image: IMG.manJacket },
  { id: "u3", name: "Mufeeza Rahman", email: "mufeeza@example.com", tier: "Member", joined: "2025-01-20", status: "active", image: IMG.womanBlack },
  { id: "u4", name: "Owen Brooks", email: "owen@example.com", tier: "Follower", joined: "2025-03-08", status: "muted", image: IMG.manDark },
  { id: "u5", name: "Tess Laurent", email: "tess@example.com", tier: "Member", joined: "2025-05-14", status: "active", image: IMG.womanLight },
  { id: "u6", name: "Ade Bello", email: "ade@example.com", tier: "Inner circle", joined: "2025-07-29", status: "active", image: IMG.manHat },
  { id: "u7", name: "Ines Moreau", email: "ines@example.com", tier: "Follower", joined: "2025-09-02", status: "pending", image: IMG.womanGlasses },
  { id: "u8", name: "Sam Wilder", email: "sam@example.com", tier: "Member", joined: "2025-10-19", status: "banned", image: IMG.manGrid },
];

export const REVENUE_SERIES = [
  { m: "May", subs: 18.2, tickets: 3.1, merch: 1.2 },
  { m: "Jun", subs: 19.4, tickets: 4.6, merch: 0.9 },
  { m: "Jul", subs: 21.0, tickets: 2.8, merch: 1.8 },
  { m: "Aug", subs: 22.7, tickets: 5.9, merch: 1.4 },
  { m: "Sep", subs: 24.1, tickets: 4.2, merch: 2.6 },
  { m: "Oct", subs: 26.3, tickets: 7.4, merch: 2.1 },
];

export const getCreator = (slug: string) => CREATORS.find((c) => c.slug === slug);
export const getUniverse = (slug: string) => UNIVERSES.find((u) => u.slug === slug);
export const getRoom = (id: string) => ROOMS.find((r) => r.id === id);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
