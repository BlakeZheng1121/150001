"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    async openScene() {
        var _a, _b;
        let uuid = (_a = (await Editor.Message.request('asset-db', 'query-uuid', 'db://assets/scenes/TimelineToolScene.scene'))) !== null && _a !== void 0 ? _a : '';
        if (uuid == '') {
            let info = await Editor.Message.request('asset-db', 'copy-asset', 'db://timelinetool/scenes/TimelineToolScene.scene', 'db://assets/scenes/TimelineToolScene.scene', { overwrite: false, rename: true });
            uuid = (_b = info === null || info === void 0 ? void 0 : info.uuid) !== null && _b !== void 0 ? _b : '';
        }
        await Editor.Message.request('scene', 'open-scene', uuid);
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () { };
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () { };
exports.unload = unload;
