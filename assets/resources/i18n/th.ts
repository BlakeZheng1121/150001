const win = window as any;

export const languages = {
    // Data
    loading: 'กําลังเชื่อมต่อ...',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.th = languages;
