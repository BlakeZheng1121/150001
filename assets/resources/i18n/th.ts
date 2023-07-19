const win = window as any;

export const languages = {
    // Data
    loading: 'กําลังเชื่อมต่อ...',
    quickSpinEnabled: 'เปิดอย่างรวดเร็ว',
    quickSpinDisabled: 'ปิดอย่างรวดเร็ว'
};

if (!win.languages) {
    win.languages = {};
}

win.languages.th = languages;
