export const AVATAR_EXTENSION = 'webp';
export const ELENA_AVATAR_PATH = `/assets/elena-front.${AVATAR_EXTENSION}`;
export const DEFAULT_AVATAR_PATH = '/assets/favicon.png';
export const MENU_LOGO_PATH = `GameLogo.${AVATAR_EXTENSION}`;
export const BATTLE_BACKGROUND_PATH = `/assets/battle-background.${AVATAR_EXTENSION}`;

export const AUDIO_TRACKS = {
    menu: { key: 'menu-music', path: 'audio/music/menu-theme.ogg' },
    overworld: { key: 'overworld-music', path: 'audio/music/overworld-theme.ogg' },
    desert: { key: 'desert-music', path: 'audio/music/desert-theme.mp3' },
    town: { key: 'town-music', path: 'audio/music/town-theme.ogg' },
    battle: { key: 'battle-music', path: 'audio/music/battle-theme.ogg' },
    battleIntense: { key: 'battle-music-intense', path: 'audio/music/battle-theme-intense.ogg' },
    bossBattle: { key: 'boss-battle-music', path: 'audio/music/boss-battle-theme.ogg' },
    victoryFanfare: { key: 'victory-fanfare', path: 'audio/music/victory-fanfare.ogg' },
    defeat: { key: 'defeat-music', path: 'audio/music/defeat-theme.ogg' }
};

const sanitizeGuestFileName = (value) => value
    .replace(/\s+/g, '-')
    .replace(/[&+,]/g, '-')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, 'a')
    .replace(/-+/g, '-');

const collaborationMappings = {
    'Keith Coleman & Jay Baxter': 'Keith Coleman',
    'Jake Knapp + John Zeratsky': 'Jake-Knapp-John-Zeratsky',
    'Melissa Perri + Denise Tilles': 'Melissa Perri',
    'Hamel Husain & Shreya Shankar': 'Hamel-Husain-Shreya-Shankar',
    'Aishwarya Naresh Reganti + Kiriti Badam': null,
    'Sriram and Aarthi': 'Sriram and Aarthi'
};

const specialMappings = {
    'Shreyas Doshi Live': 'Shreyas Doshi',
    'Yuhki Yamashata': 'Yuhki Yamashita',
    'Melissa': 'Melissa Perri',
    'Failure': 'Failure',
    'Dr. Fei Fei Li': 'Dr. Fei-Fei Li',
    'Gia Laudi': 'Georgiana Laudi',
    'Chip Conley': 'Chip Conley',
    'Cam Adams': 'Cameron Adams',
    'Benjamin Mann': 'Benjamin Mann',
    'Alex Hardimen': 'Alex Hardiman',
    'Phyl Terry': 'Phyl Terry',
    'Jeanne Grosser': 'Jeanne DeWitt Grosser',
    'Jess Lachs': 'Jessica Lachs',
    'Jason M Lemkin': 'Jason Lemkin',
    'Mike Maples Jr': 'Mike-Maples-Jr',
    'Gustav Söderström': 'Gustav-Soderstrom'
};

export function cleanGuestName(guestName) {
    return guestName
        .replace(/\s+\d+\.\d+$/, '')
        .replace(/_$/, '')
        .trim();
}

export function getGuestAvatarAssetPath(guestName, { leadingSlash = true } = {}) {
    if (!guestName) {
        return DEFAULT_AVATAR_PATH;
    }

    if (guestName.includes('Elena Verna')) {
        return leadingSlash ? ELENA_AVATAR_PATH : ELENA_AVATAR_PATH.slice(1);
    }

    for (const [collab, replacement] of Object.entries(collaborationMappings)) {
        if (!guestName.includes(collab)) {
            continue;
        }

        if (replacement === null) {
            return null;
        }

        const safeFileName = sanitizeGuestFileName(cleanGuestName(replacement));
        const path = `assets/avatars/${safeFileName}_pixel_art.${AVATAR_EXTENSION}`;
        return leadingSlash ? `/${path}` : path;
    }

    for (const [special, replacement] of Object.entries(specialMappings)) {
        if (guestName !== special && !guestName.includes(special)) {
            continue;
        }

        const safeFileName = sanitizeGuestFileName(cleanGuestName(replacement));
        const path = `assets/avatars/${safeFileName}_pixel_art.${AVATAR_EXTENSION}`;
        return leadingSlash ? `/${path}` : path;
    }

    const safeFileName = sanitizeGuestFileName(cleanGuestName(guestName));
    const path = `assets/avatars/${safeFileName}_pixel_art.${AVATAR_EXTENSION}`;
    return leadingSlash ? `/${path}` : path;
}
