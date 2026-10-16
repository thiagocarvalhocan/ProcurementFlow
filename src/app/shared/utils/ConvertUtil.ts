export default class ConvertUtil {
    static convertObjectToFormData(jsonObject: any): FormData {
        const formData = new FormData();

        const appendFormData = (data: any, rootKey: string) => {
            if (data === null || data === undefined) {
                return;
            }
            if (data instanceof File) {
                formData.append(`${rootKey}`, data, data.name);
            } else if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    appendFormData(item, `${rootKey}[${index}]`);
                });
            } else if (data !== null && typeof data === 'object') {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        appendFormData(data[key], `${rootKey}.${key}`);
                    }
                }
            } else {
                formData.append(rootKey, data);
            }
        };

        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                appendFormData(jsonObject[key], key);
            }
        }

        return formData;
    }
}