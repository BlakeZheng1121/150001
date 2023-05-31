import { director } from 'cc';
import { BaseLocalized } from './BaseLocalized';
import { LocalizedSkeleton } from './LocalizedSkeleton';
import { LocalizedSprite } from './LocalizedSprite';

const _default = 'en';
export let _language = '';

export let ready: boolean = false;

/**
 * 初始化
 * @param lang
 */
export function init(lang: string) {
    _language = getSupportedLanguage(lang);
    ready = true;
    updateSceneRenderers();
}

export function getSupportedLanguage(lang: string) {
    if (win.languages) {
        if (win.languages[lang]) {
            return lang;
        } else {
            return _default;
        }
    }
    throw new Error('No Language Support');
}

/**
 * 翻译数据
 * @param key
 */
export function t(key: string) {
    const win: any = window;

    if (!win.languages) {
        return key;
    }
    const searcher = key.split('.');

    let data = win.languages[_language];
    for (let i = 0; i < searcher.length; i++) {
        data = data[searcher[i]];
        if (!data) {
            return '';
        }
    }
    return data || '';
}

export function updateSceneRenderers() {
    // very costly iterations
    const rootNodes = director.getScene()?.children;
    // walk all nodes with localize skeleton and update
    const allLocalizedSkeletons: any[] = [];
    for (let i = 0; i < rootNodes.length; ++i) {
        let skeletons = rootNodes[i].getComponentsInChildren('LocalizedSkeleton');
        Array.prototype.push.apply(allLocalizedSkeletons, skeletons);
    }
    for (let i = 0; i < allLocalizedSkeletons.length; ++i) {
        let skeletons = allLocalizedSkeletons[i];
        if (!skeletons.node.active) continue;
        skeletons.updateRenderer();
    }

    const allObjects = director.getScene().getComponentsInChildren(BaseLocalized);
    for (let i = 0; i < allObjects.length; ++i) {
        allObjects[i].updateRenderer();
    }
}

export function clearRef() {
    const allLocalizedSprites = director.getScene().getComponentsInChildren(LocalizedSprite);
    for (let i = 0; i < allLocalizedSprites.length; ++i) {
        let sprite = allLocalizedSprites[i];
        sprite.clearRef();
    }

    const allLocalizedSkeleton = director.getScene().getComponentsInChildren(LocalizedSkeleton);
    for (let i = 0; i < allLocalizedSkeleton.length; ++i) {
        let skeleton = allLocalizedSkeleton[i];
        skeleton.clearRef();
    }
}

// 供插件查询当前语言使用
const win = window as any;
win._languageData = {
    get language() {
        return _language;
    },
    init(lang: string) {
        init(lang);
    },
    getSupportedLanguage(lang: string) {
        return getSupportedLanguage(lang);
    },
    updateSceneRenderers() {
        updateSceneRenderers();
    },
    clearRef() {
        clearRef();
    }
};
