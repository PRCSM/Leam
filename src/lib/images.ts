/**
 * Curated photography. Every id is a free photo published under the Unsplash
 * License (https://unsplash.com/license). The people pictured are anonymous
 * models/subjects — they are NOT the fictional creators named in demo data and
 * do not endorse Leam. Swap for your own licensed creator photography in prod.
 */
const u = (id: string) => `https://unsplash.com/photos/${id}/download`;

export const IMG = {
  // Hero & atmosphere
  heroLight: u("tiMNyeHEkYI"), // hand reaching through golden smoke toward light (Liana S)
  heroDancer: u("zPuyJ-YPfiQ"), // hands raised before a warm-lit stage
  crowd: u("SBOMeuksUnM"), // crowd, hands in the air
  cave: u("UwzalTDCpT4"), // figure in cave under a light beam
  caveTorch: u("HZ7VEe7Ni1s"), // skylight cave
  parisDusk: u("2UEvftbxdX0"),

  // Portraits
  womanRedHair: u("5ZD1lA83CBs"),
  womanBlack: u("d-K86L5uwnE"),
  womanChair: u("fPL9FxOCUHo"),
  womanCloak: u("r5GGBvj2fRI"),
  womanGlasses: u("0-lUyG5g4uI"),
  womanLight: u("Z9NByYWQfEM"),
  womanSitting: u("3dL0mzyUS6M"),
  womanStreet: u("7LkuRIaeO80"),
  manDark: u("h9nTXLAIFDs"),
  manJacket: u("1qsGJD4BF7I"),
  manHat: u("6p8ngTH1bUI"),
  manGrid: u("UdpSX8yRuwc"),
  manGlasses: u("sJXF_n7HDxs"),
  manSilhouette: u("dLij9K4ObYY"),

  // Studios & sessions
  drums: u("-oNIU5-r3uY"),
  drumsWarm: u("vGccYBGgQsY"),
  mixer: u("yxzl9lnxSNA"),
  onAir: u("RRVyc2AyD4I"),
} as const;

export type ImageKey = keyof typeof IMG;
