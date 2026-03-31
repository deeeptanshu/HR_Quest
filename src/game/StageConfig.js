/**
 * StageConfig.js — HR Quest RPG
 * Defines opponents per stage (up to 5 per tier for 20 guests across 4 tiers)
 * All names must match exactly the "guest" field in questions.json
 */

export const STAGE_CONFIG = [
  // Tier 1 — Legendary HR Thinkers
  [
    "Dave Ulrich",
    "Patty McCord",
    "Laszlo Bock",
    "Josh Bersin",
    "Amy Edmondson"
  ],

  // Tier 2 — HR Culture & People Leaders
  [
    "Johnny C. Taylor Jr.",
    "Kim Scott",
    "Marcus Buckingham",
    "Jennifer Moss",
    "Hannah Williams"
  ],

  // Tier 3 — Talent, AI & Organizational Science
  [
    "Adam Grant",
    "Jim Link",
    "Dan Shapero",
    "Kyle Holm",
    "Rich Safeer"
  ],

  // Tier 4 — Performance, DEI & Employee Relations
  [
    "Jathan Janove",
    "Gad Levanon",
    "Brian Reaves",
    "Myrna Maysonet",
    "Sejal Thakkar"
  ]
];

export const STAGE_NAME_ALIASES = {
  "Johnny C. Taylor Jr.": "Johnny Taylor"
};

export function getStageOpponents(stageNumber) {
  const index = stageNumber - 1;
  if (index < 0 || index >= STAGE_CONFIG.length) {
    console.warn(`Invalid stage number: ${stageNumber}`);
    return [];
  }
  return STAGE_CONFIG[index];
}

export function getTotalStages() {
  return STAGE_CONFIG.length;
}

export function getGuestTier(guestName) {
  for (let tierIndex = 0; tierIndex < STAGE_CONFIG.length; tierIndex++) {
    if (STAGE_CONFIG[tierIndex].includes(guestName)) {
      return tierIndex + 1;
    }
  }
  console.warn(`Guest "${guestName}" not found in StageConfig`);
  return 1;
}
