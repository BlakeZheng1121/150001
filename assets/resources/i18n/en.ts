const win = window as any;

export const languages = {
    // Data
    loading: 'LOADING ANOTHER SCENE ASSETS...',
    quickSpinEnabled: 'Quick Spin Enabled',
    quickSpinDisabled: 'Quick Spin Disabled'
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
