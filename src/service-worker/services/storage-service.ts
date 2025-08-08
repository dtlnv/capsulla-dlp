export class StorageService {
    private static instance: StorageService;

    private constructor() {}

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    public async save(key: string, data: any): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: data }, () => {
                resolve();
            });
        });
    }

    public async get(key: string): Promise<any> {
        if (!key) {
            return null;
        }
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key]);
            });
        });
    }
}

export const storageService = StorageService.getInstance();
