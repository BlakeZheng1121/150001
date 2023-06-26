const win = window as any;

export const languages = {
    // Data
    loading: '场景资源载入中...',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
