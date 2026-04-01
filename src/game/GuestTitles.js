/**
 * Guest Titles/Companies Mapping — HR Quest RPG
 * Maps guest names to their professional titles shown in battle screen
 */

export const GUEST_TITLES = {
  "Dave Ulrich": "Father of Modern HR",
  "Patty McCord": "Former Chief Talent Officer, Netflix",
  "Laszlo Bock": "Former SVP People Ops, Google",
  "Josh Bersin": "Global HR Industry Analyst",
  "Amy Edmondson": "Professor, Harvard Business School",
  "Johnny C. Taylor Jr.": "President & CEO, SHRM",
  "Kim Scott": "Author, Radical Candor",
  "Marcus Buckingham": "Author & Strengths Researcher",
  "Jennifer Moss": "Author, The Burnout Epidemic",
  "Hannah Williams": "Pay Transparency Advocate",
  "Adam Grant": "Organizational Psychologist, Wharton",
  "Jim Link": "CHRO, SHRM",
  "Dan Shapero": "COO, LinkedIn",
  "Kyle Holm": "VP of Total Rewards",
  "Rich Safeer": "Chief Health Officer",
  "Jathan Janove": "HR Attorney & Coach",
  "Gad Levanon": "Labor Economist",
  "Brian Reaves": "Chief Belonging Officer",
  "Myrna Maysonet": "Employee Relations Expert",
  "Sejal Thakkar": "Chief Civility Officer"
};

export function getGuestTitle(guestName) {
  return GUEST_TITLES[guestName] || '';
}
