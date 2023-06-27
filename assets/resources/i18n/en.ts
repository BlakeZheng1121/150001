const win = window as any;

export const languages = {
    // Data
    loading: 'LOADING ANOTHER SCENE ASSETS...',
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
