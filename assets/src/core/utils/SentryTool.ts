export class SentryTool {
    private static instance() {
        return window['Sentry'];
    }

    /** 初始化 */
    public static init(version: string) {
        try {
            this.instance()?.init({
                dsn: 'https://950dab570879da635122846f4eb166a2@o4506421333721088.ingest.us.sentry.io/4508554799808512',
                release: version
            });
        } catch (e) {}
    }

    /** 設定User */
    public static setUserID(id: string) {
        try {
            this.instance()?.setUser({
                id: id
            });
        } catch (e) {}
    }

    /** 加Log紀錄 */
    public static addLog(category: string, message: string) {
        try {
            this.instance()?.addBreadcrumb({
                category: category,
                message: message,
                level: 'log'
            });
        } catch (e) {}
    }

    public static captureException(error: Error) {
        try {
            this.instance()?.captureException(error);
        } catch (e) {}
    }
}
