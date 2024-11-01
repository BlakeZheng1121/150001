export class SentryTool {
    private static instance() {
        return window['Sentry'];
    }

    /** 初始化 */
    public static init(version: string) {
        try {
            this.instance()?.init({
                dsn: 'https://9664881a10044c3fa0022ce339195bd9@o4506308307910656.ingest.us.sentry.io/4508220949200896',
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
