const win = window as any;

export const languages = {
    // Data
    loading: 'LOADING ANOTHER SCENE ASSETS...',
    jackpotUpgradeBet: 'ยอดเดิมพันสูงสุดสามารถ \nอัพเกรด',
    jackpotUpgradeBetRange: 'เดิมพัน , ถึง ',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.th = languages;
