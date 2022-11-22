export class SoundData {
    obj?: any;
    name: string;
    path?: string;
    category: string = SoundCategory.NONE;
    id?: number;
    loop: boolean = false;
    seek: number = 0;
    delay?: Array<number>;
    volume: Array<number>;
    iVol?: number = 0;
    fadeState?: string = FadeState.NONE;
    fadeInDuration?: Array<number>;
    iFadeIn?: number = 0;
    fadeOutDuration?: Array<number>;
    iFadeOut?: number = 0;
    fadeCustomeDuration?: Array<number>;
    iFadeCustome?: number = 0;
}

export let SoundCategory = {
    /**
     * 不屬於任何類別
     */
    NONE: 'NONE',
    SE: 'SE',
    BGM: 'BGM'
};

export let FadeState = {
    NONE: 'NONE',
    READY: 'READY',
    IN: 'IN',
    OUT: 'OUT',
    CUSTOME: 'CUSTOME'
};
