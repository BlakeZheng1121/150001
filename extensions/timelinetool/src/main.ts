//@ts-ignore
import packageJSON from '../package.json';
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    async openScene() {
        let uuid: string = (await Editor.Message.request('asset-db', 'query-uuid', 'db://assets/scenes/TimelineToolScene.scene')) ?? '';
        if (uuid == '') {
            let info = await Editor.Message.request(
                'asset-db',
                'copy-asset',
                'db://timelinetool/scenes/TimelineToolScene.scene',
                'db://assets/scenes/TimelineToolScene.scene',
                { overwrite: false, rename: true }
            );
            uuid = info?.uuid ?? '';
        }
        await Editor.Message.request('scene', 'open-scene', uuid);
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function() { };

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function() { };
