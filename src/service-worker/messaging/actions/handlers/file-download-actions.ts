import { storageService } from '@/service-worker/services/storage-service';
import { ServiceWorkerAction } from '@/types/actions';

export class FileDownloadActionHandlers {
    constructor(private logger: LoggingService) {}

    public handleFileDownloadedSuccessfully = (data: any): void => {
        this.logger.logAction(ServiceWorkerAction.FileDownloadedSuccessfully, {
            data,
        });
    };

    public handleFileDownloadBlocked = (data: any): ActionResult<void> => {
        this.logger.logAction(ServiceWorkerAction.FileDownloadBlocked, {
            data,
        });

        return { success: true };
    };

    public handleGetDownloadProhibitedFileTypes = async (): Promise<ActionResult<string[]>> => {
        try {
            const prohibitedTypes = ((await storageService.get('rules')) || {}).downloadRules || [];

            return {
                success: true,
                data: prohibitedTypes,
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to get prohibited download file types: ${error}`,
            };
        }
    };
}
