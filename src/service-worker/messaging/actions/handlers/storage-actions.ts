import { storageService } from '@/service-worker/services/storage-service';
import defaultRules from '../../../../default-rules.json';

export class StorageActionHandlers {
    constructor(private logger: LoggingService) {}

    public getStorageData = (key: string): Promise<any> => {
        return storageService.get(key);
    };

    public saveStorageData = (key: string, data: any): Promise<void> => {
        return storageService.save(key, data);
    };

    public resetRules = (): void => {
        storageService.save('rules', defaultRules);
        console.log('Default rules set successfully');
    };
}
