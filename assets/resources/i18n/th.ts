const win = window as any;

export const languages = {
    // Data
    loading: 'กําลังเชื่อมต่อ...',
    jackpotUpgradeBet: 'ยอดเดิมพันสูงสุดสามารถ อัพเกรด\n',
    jackpotUpgradeBetRange: 'เดิมพัน , ถึง ',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.th = languages;
