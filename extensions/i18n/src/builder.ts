import { IBuildPlugin } from "../@types/packages/builder/@types";


export function load() {
    
}

export function unload() {
    
}

export const configs: Record<string, IBuildPlugin> = {
    '*': {
        hooks: './hooks',
        options: {
            webTestOption: {
                label: 'webTestOption',
                default: false,
                render: {
                    ui: 'ui-checkbox'
                }
            }
        }
    },
};
