import { _decorator, js } from 'cc';
import BaseView from './BaseView';
const { ccclass } = _decorator;

@ccclass('BaseScene')
export class BaseScene extends BaseView {
    /**
     * 該組件第一次啟用時，可指定對應的 Mediator 類別和自定義註冊的名稱。
     * 當 mediatorClassName 和 mediatorName 沒有定義時，會自行組裝對應的類別名稱，並且以該類別名稱作為註冊 Mediator 的名稱。
     * @param mediatorClassName Mediator 對應的類別名稱
     * @param mediatorName Mediator 的註冊名稱
     */
    protected onLoad(mediatorClassName?: string, mediatorName?: string) {
        const className = js.getClassName(this);
        const MediatorClassName = mediatorClassName ? mediatorClassName : `${className}Mediator`;
        super.initMediator(MediatorClassName, mediatorName);
    }

    protected onDestroy() {
        super.onDestroy();
    }
}
