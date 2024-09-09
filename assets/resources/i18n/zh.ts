const win = window as any;

export const languages = {
    // Data
    loading: '场景资源载入中...',
    quickSpinEnabled: '快速旋转开启',
    quickSpinDisabled: '快速旋转关闭',
    balance: '余 额',
    win: '赢 分',
    bet: '总投注',
    autospin: '自动旋转',
    autospinnumber: '自动旋转次数',
    betoption: '投注选项',
    autoStart: '自动开始:',
    quit: '退出',
    history: '历史',
    rules: '规则',
    sound: '声音',
    close: '关闭',
    jpBonusUpgrade: '彩金奖金升级',
    jackpotUpgradeBet: '提高投注可以升级',
    jackpotUpgradeBetRange: '投注 {0} 到 {1}'
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
