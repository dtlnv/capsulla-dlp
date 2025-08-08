import { storageService } from '@/service-worker/services/storage-service';
import { ServiceWorkerAction } from '@/types/actions';

export class FileUploadActionHandlers {
    constructor(private logger: LoggingService) {}

    public handleFileUploadedSuccessfully = (data: FileUploadData): void => {
        const { fileTypes, files, type } = data;

        this.logger.logAction(ServiceWorkerAction.FileUploadedSuccessfully, {
            fileTypes,
            files,
            type,
        });
    };

    public handleFileUploadBlocked = (data: FileUploadData): ActionResult<void> => {
        const { fileTypes, files, type } = data;

        this.logger.logAction(ServiceWorkerAction.FileUploadBlocked, {
            fileTypes,
            files,
            type,
        });

        return { success: true };
    };

    public handleGetUploadProhibitedFileTypes = async (): Promise<ActionResult<string[]>> => {
        try {
            const prohibitedTypes = ((await storageService.get('rules')) || {}).uploadRules || [];

            return {
                success: true,
                data: prohibitedTypes,
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to get prohibited upload file types: ${error}`,
            };
        }
    };
}
