export class GoogleAnalyticsUtil {
    /** 送出ga數據 */
    public static setClickEvent(eventName: string, category: string, label: string, value?: string) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('event', eventName, {
            event_category: category,
            event_label: label,
            event_value: value
        });
    }

    public static registerGA(userId: string) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('config', 'G-QDXR1Q1JS9', {
            user_id: userId
        });
    }
    // 註冊SIT或DEV環境的GA
    public static registerGAForTest(userId: string) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('config', 'G-YEETF8HY22', {
            user_id: userId
        });
    }

    public static setGAEvent(event: string, data: any) {
        GoogleAnalyticsUtil.setClickEvent(event, data.event_category, data.event_label, data.value);
    }
}

export class GA_Category {
    // 玩家每次旋轉使用的速度模式
    public static SPIN_SPEED_MODE = 'spinSpeedMode';
}