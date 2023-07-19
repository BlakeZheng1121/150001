const win = window as any;

export const languages = {
    // Data
    loading: '场景资源载入中...',
    quickSpinEnabled: '快速旋转开启',
    quickSpinDisabled: '快速旋转关闭'
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
