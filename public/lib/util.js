export const SERVER_URL = location.protocol + "//" + (location.hostname === "localhost" ? location.hostname + ":80" : "floof-router.glitch.me");

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function lerpAngle(a, b, t) {
    const CS = (1 - t) * Math.cos(a) + t * Math.cos(b);
    const SN = (1 - t) * Math.sin(a) + t * Math.sin(b);
    return Math.atan2(SN, CS);
}

export function shakeElement(element) {
    element.classList.add("shake");
    setTimeout(element.classList.remove.bind(element.classList, "shake"), 500);
}

export const colors = {
    "common": "#7EEF6D",
    "uncommon": "#FFE65D",
    "rare": "#455FCF",
    "epic": "#7633CB",
    "legendary": "#C13328",
    "mythic": "#1ED2CB",
    "ultra": "#ff2b75",
    "super": "#2affa3",
    "ancient": "#ff7b29",
    "omega": "#d966e8",
    "???": "#333333",
    "unique": "#FFFFFF",
    "account": "#7EEF6D",
    "absorb": "#895adc",
    "skillTree": "#dc5a5a",
    "inventory": "#5a9edb",
    "settings": "#C8C8C8",
    "crafting": "#DB9D5A",
    "mobGallery": "#DBD64A",
    "team1": "#00B2E1",
    "team2": "#F14E54",
    // RENDER COLORS
    white: "#FFFFFF",
    peach: "#FFF0B7",
    cumWhite: "#ffffC9",
    black: "#000000",
    rosePink: "#FC93C5",
    irisPurple: "#CD75DE",
    pollenGold: "#FEE86B",
    peaGreen: "#8CC05B",
    sandGold: "#DDC758",
    grapePurple: "#C973D8",
    leafGreen: "#3AB54A",
    uraniumLime: "#66BB2A",
    honeyGold: "#F5D230",
    hornet: "#FED263",
    lightningTeal: "#00FFFF",
    rockGray: "#7B727C",
    stingerBlack: "#222222",
    lighterBlack: "#353535",
    cactusGreen: "#39C660",
    cactusLightGreen: "#75D68F",
    bubbleGrey: "#B8B8B8",
    playerYellow: "#FFE763",
    scorpionBrown: "#C69A2D",
    diepSquare: "#ffe46b",
    diepTriangle: "#fc7676",
    diepPentagon: "#768cfc",
    ladybugRed: "#EB4034",
    evilLadybugRed: "#962921",
    shinyLadybugGold: "#ebeb34",
    hellMobColor: "#AA1C1D",
    beeYellow: "#FFE763",
    pincer: "#2a2a2a",
    antHole: "#A8711E",
    ants: "#555555",
    fireAnt: "#a82a01",
    termite: "#d3a35b",
    wasp: "#9f4627",
    jellyfish: "#EFEFEF",
    spider: "#4f412e",
    darkGreen: "#118240",
    beetlePurple: "#915db0",
    roach: "#9D4F23",
    roachHead: "#6C3419",
    fireFlyLight: "#EFDECC",
    sand: "#E1C85D",
    jelly: "#D5B5D3",
    orange: "#F1BC48",
    starfish: "#AA403F",
    book: "#c28043",
    bookSpine: "#c28043"
};

export function formatLargeNumber(number) {
    if (number < 1000) return number;
    if (number < 1000000) return (number / 1000).toFixed(1) + "k";
    if (number < 1000000000) return (number / 1000000).toFixed(1) + "m";
    return (number / 1000000000).toFixed(1) + "b";
}

const threshold = .65;

export function getDropRarity(mobRarity, highestPlayerRarity) {
    const maxRarity = Math.min(9, Math.min(mobRarity, highestPlayerRarity + 1));
    const minRarity = Math.max(0, maxRarity - 2);

    if (minRarity > maxRarity) {
        return minRarity;
    }

    let rarity = minRarity;
    const myThreshold = Math.pow(threshold, maxRarity);

    for (let i = minRarity; i < maxRarity; i++) {
        if (Math.random() < myThreshold) {
            rarity++;
        }
    }

    return rarity;
}

export function testCaseDrops(mobRarity, highestPlayerRarity, count) {
    const results = [];

    for (let i = 0; i < count; i++) {
        const rarity = getDropRarity(mobRarity, highestPlayerRarity);
        results[rarity] = (results[rarity] || 0) + 1;
    }

    return results.map(c => (c / count * 100).toFixed(2));
}

export function angleDiff(a, b) {
    const diff = a - b;
    return Math.atan2(Math.sin(diff), Math.cos(diff));
}

export function quickDiff(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
}

export function xpForLevel(level) {
    return Math.pow(level, 2.35) + Math.exp(level / 25);
}

export const options = {
    showDebug: false,
    hideGrid: false,
    rigidInterpolation: false,
    mouseMovement: false,
    hideEntityUI: false,
    useTileBackground: false,
    fancyGraphics: false,
    showHitboxes: true
};