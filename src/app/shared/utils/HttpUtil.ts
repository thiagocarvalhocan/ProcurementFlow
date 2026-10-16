export default class HttpUtil {
    static getQueryParams(obj: {}) {
        const filteredPayload: any = Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value != null)
        );
        return new URLSearchParams(filteredPayload).toString();
    }
}