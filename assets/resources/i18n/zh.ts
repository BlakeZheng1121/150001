const win = window as any;

export const languages = {
    // Data
    loading: '场景资源载入中...',
    jackpotUpgradeBet: '   提高投注可以升级\n',
    jackpotUpgradeBetRange: '投注 , 到 ',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
