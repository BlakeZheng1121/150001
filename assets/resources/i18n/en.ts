const win = window as any;

export const languages = {
    // Data
    loading: 'LOADING ANOTHER SCENE ASSETS...',
    quickSpinEnabled: 'Quick Spin Enabled',
    quickSpinDisabled: 'Quick Spin Disabled',
    balance: 'BALANCE',
    win: 'WIN',
    bet: 'TOTAL BET',
    autospin: 'AUTO SPIN',
    autospinnumber: 'Number of Auto Spin',
    betoption: 'BET OPTIONS',
    autoStart: 'AUTO START IN:'
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
