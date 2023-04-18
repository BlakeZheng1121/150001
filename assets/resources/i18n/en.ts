const win = window as any;

export const languages = {
    // Data
    loading: 'LOADING ANOTHER SCENE ASSETS...',
    jackpotUpgradeBet: 'Increased your bet to upgrade\n',
    jackpotUpgradeBetRange: 'Bet , To ',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
