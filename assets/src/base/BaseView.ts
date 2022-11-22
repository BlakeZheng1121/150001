import { js } from 'cc';
import BaseUI from './BaseUI';
import { IBaseUI } from '../data/Inters';
import AppNode from '../core/AppNode';
export default abstract class BaseView extends BaseUI implements IBaseUI {
    private viewMsg: any = {};
    public initData(data?: any, mediatorName?: string, ...params: any): void {
        super.initData(data, params);
        mediatorName && this.initMediator(mediatorName);
    }

    public initMediator(className: string, mediatorName?: string) {
        this.viewMsg.mediatorName = mediatorName ? mediatorName : className;
        let cls = js.getClassByName(className);
        AppNode.registerMediator(new cls(mediatorName, this) as puremvc.IMediator, this);
    }

    protected onDestroy() {
        super.onDestroy();
        if (this.viewMsg.mediatorName) {
            let mediator = AppNode.removeMediator(this.viewMsg.mediatorName);
            mediator && mediator.setViewComponent(null);
        }
    }
}
