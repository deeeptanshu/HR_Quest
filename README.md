# HR Quest

[![Play Now](https://img.shields.io/badge/Play_Now-FFD700?style=for-the-badge)](https://hr-quest.vercel.app/)
[![Built with Phaser](https://img.shields.io/badge/Built_with-Phaser_3-8B0000?style=for-the-badge)](https://phaser.io)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge)](https://vuejs.org/)

A Pokemon-style RPG where you battle 20 real HR thought leaders by answering HR knowledge questions. Win the battle, capture the guest. Built for HR professionals who want to test what they know — or learn what they don't.

**Play at [hr-quest.vercel.app](https://hr-quest.vercel.app/)**

---

## What It Is

HR Quest puts you in an overworld map where HR legends roam as NPC characters. Walk up to one, trigger a battle, and answer 3 multiple-choice questions based on their area of expertise — psychological safety, pay transparency, AI in HR, performance management, and more.

Answer correctly and you earn XP. Answer wrong and you lose HP. Capture all 20 guests to complete the game.

The questions are written so that any HR professional can reason through them — you don't need to have watched a specific podcast or read a specific book. If you know your HR fundamentals, you can play.

---

## Guests

**Level 1 — The Legends**
Dave Ulrich, Patty McCord, Laszlo Bock, Josh Bersin, Amy Edmondson

**Level 2 — Culture & People**
Johnny C. Taylor Jr., Kim Scott, Marcus Buckingham, Jennifer Moss, Hannah Williams

**Level 3 — Talent & AI**
Adam Grant, Jim Link, Dan Shapero, Kyle Holm, Rich Safeer

**Level 4 — Operations & DEI**
Jathan Janove, Gad Levanon, Brian Reaves, Myrna Maysonet, Sejal Thakkar

---

## How to Play

- **Move** — Arrow keys or WASD
- **Battle** — Walk near a guest to trigger an encounter
- **Answer** — Choose A / B / C / D for each question
- **Win** — Get 2 of 3 questions right to capture the guest
- **Lose** — Drop to 0 HP and it's game over

Each correct answer earns XP. Level up to unlock new maps and face harder guests. A perfect battle (3/3 correct) gives bonus XP and heals HP.

---

## Battle Mechanics

| Rule | Detail |
|------|--------|
| Questions per battle | 3 |
| HP penalty per wrong answer | -10 HP |
| Starting HP | 100 |
| Game over | HP reaches 0 |
| Win condition | 2 or more correct answers |
| Perfect battle bonus | Double XP + HP restore |
| Levels | 4 |
| Total guests | 20 (5 per level) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Game engine | Phaser 3 |
| Frontend | Vue 3 |
| Build tool | Vite |
| Leaderboard | Supabase |
| Hosting | Vercel |
| Font | Press Start 2P |
| Icons | Iconify (pixelarticons) |

---

## Project Structure

```
HR_Quest/
├── public/
│   └── assets/
│       ├── avatars/          # 20 pixel art guest avatars (.webp)
│       ├── questions.json    # All 100 questions across 20 guests
│       └── GameLogo2.webp    # Game logo
├── src/
│   ├── components/
│   │   ├── BattleScreen.vue       # Battle UI and question flow
│   │   ├── BattleResult.vue       # Victory / defeat screen
│   │   ├── CollectionScreen.vue   # Captured guests gallery
│   │   ├── LeaderboardPanel.vue   # Global leaderboard
│   │   ├── ShareModal.vue         # LinkedIn share card
│   │   ├── EncounterDialog.vue    # Guest encounter prompt
│   │   ├── LevelComplete.vue      # Level up screen
│   │   └── GameOver.vue           # Game over screen
│   ├── game/
│   │   ├── scenes/
│   │   │   ├── MainMenu.js        # Title screen
│   │   │   └── Overworld.js       # Map and NPC movement
│   │   ├── StageConfig.js         # Guest tier and level config
│   │   ├── GuestTitles.js         # Guest names and titles
│   │   ├── GameState.js           # Save/load player state
│   │   └── assets.js              # Asset path constants
│   ├── lib/
│   │   └── supabase.js            # Supabase client setup
│   ├── services/
│   │   ├── leaderboard.js         # Local leaderboard fallback
│   │   └── supabase-leaderboard.js # Global leaderboard via Supabase
│   ├── App.vue                    # Root component and game layout
│   └── main.js                    # App entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Running Locally

**Prerequisites:** Node.js v16+

```bash
# Clone the repo
git clone https://github.com/deeeptanshu/HR_Quest.git
cd HR_Quest

# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at `http://localhost:8080`

```bash
# Production build
npm run build
```

---

## Environment Variables

To enable the global leaderboard, add these to your `.env` file or Vercel environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these, the game still works — the leaderboard falls back to local storage and scores are only visible to that browser session.

### Supabase Table Setup

Run this SQL in your Supabase project to create the leaderboard table:

```sql
CREATE TABLE leaderboard (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text UNIQUE NOT NULL,
  player_name text NOT NULL DEFAULT 'Player',
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  max_hp integer DEFAULT 100,
  captured integer DEFAULT 0,
  total integer DEFAULT 20,
  accuracy numeric DEFAULT 0,
  correct integer DEFAULT 0,
  wrong integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Public insert" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON leaderboard FOR UPDATE USING (true);
```

---

## Adding Questions

All questions live in `public/assets/questions.json`. Each guest has 5 questions.

```json
{
  "guest": "Guest Name",
  "category": "Topic Area",
  "questions": [
    {
      "question": "Short, clear question any HR professional can reason through?",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "explanation": "Why this answer is correct.",
      "difficulty": "Medium"
    }
  ]
}
```

**Question writing rules:**
- Keep questions under 120 characters
- Write questions that test HR knowledge through reasoning — not podcast-specific trivia
- Distribute correct answers evenly across A, B, C, D positions
- All 4 choices must be plausible — no obvious throwaway options

---

## Adding Guests

**1. Add questions** to `public/assets/questions.json` following the format above.

**2. Add the guest** to the appropriate tier in `src/game/StageConfig.js`:

```js
{
  tier: 5,
  guests: ["New Guest One", "New Guest Two", ...]
}
```

**3. Add their title** in `src/game/GuestTitles.js`:

```js
"New Guest One": "Their Title and Role"
```

**4. Add their avatar** — pixel art `.webp` file with transparent background to `public/assets/avatars/New-Guest-One_pixel_art.webp`

---

## Inspiration

Forked from [PokeLenny](https://github.com/hbshih/PokeLenny) by Ben Shih — a Pokemon-style RPG built around Lenny Rachitsky's product podcast. HR Quest adapts the same mechanics for the HR community, with an entirely new guest roster, question bank, branding, and Intervue sponsorship.

---

## Credits

- **Game concept and original codebase** — [Ben Shih](https://github.com/hbshih) (PokeLenny)
- **HR Quest adaptation** — [Deepanshu](https://github.com/deeeptanshu)
- **Inspired by** — SHRM HR Podcast episodes
- **Sponsored by** — [Intervue](https://intervue.io) — AI-powered technical interviews

---

## License

Fan-made educational project based on publicly available HR content. Guest names referenced for educational purposes. All guest names belong to their respective owners.

Game code © 2026 HR Quest. Built on the open-source PokeLenny codebase.
