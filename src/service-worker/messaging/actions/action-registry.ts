import { ClipboardActionHandlers } from './handlers/clipboard-actions';
import { FileUploadActionHandlers } from './handlers/file-upload-actions';
import { FileDownloadActionHandlers } from './handlers/file-download-actions';
import ConsoleLoggingService from '../../services/console-logging-service';
import { ServiceWorkerAction } from '@/types/actions';
import { StorageActionHandlers } from './handlers/storage-actions';


type ActionHandler = (...args: any[]) => any;

export class ServiceWorkerActionRegistry {
    private readonly handlers: Map<ServiceWorkerAction, ActionHandler> = new Map();
    private readonly clipboardHandlers: ClipboardActionHandlers;
    private readonly fileUploadHandlers: FileUploadActionHandlers;
    private readonly fileDownloadHandlers: FileDownloadActionHandlers;
    private readonly storageHandlers: StorageActionHandlers;

    constructor(logger: LoggingService = new ConsoleLoggingService()) {
        this.clipboardHandlers = new ClipboardActionHandlers(logger);
        this.fileUploadHandlers = new FileUploadActionHandlers(logger);
        this.fileDownloadHandlers = new FileDownloadActionHandlers(logger);
        this.storageHandlers = new StorageActionHandlers(logger);
        this.registerHandlers();
    }

    private registerHandlers(): void {
        // Clipboard actions
        this.handlers.set(ServiceWorkerAction.ClipboardCheck, this.clipboardHandlers.handleClipboardCheck);

        // File upload actions
        this.handlers.set(
            ServiceWorkerAction.GetUploadProhibitedFileTypes,
            this.fileUploadHandlers.handleGetUploadProhibitedFileTypes
        );
        this.handlers.set(ServiceWorkerAction.FileUploadBlocked, this.fileUploadHandlers.handleFileUploadBlocked);
        this.handlers.set(ServiceWorkerAction.FileUploadedSuccessfully, this.fileUploadHandlers.handleFileUploadedSuccessfully);

        // File download actions
        this.handlers.set(
            ServiceWorkerAction.GetDownloadProhibitedFileTypes,
            this.fileDownloadHandlers.handleGetDownloadProhibitedFileTypes
        );
        this.handlers.set(ServiceWorkerAction.FileDownloadBlocked, this.fileDownloadHandlers.handleFileDownloadBlocked);
        this.handlers.set(
            ServiceWorkerAction.FileDownloadedSuccessfully,
            this.fileDownloadHandlers.handleFileDownloadedSuccessfully
        );

        // Storage actions
        this.handlers.set(ServiceWorkerAction.GetStorageData, this.storageHandlers.getStorageData);
        this.handlers.set(ServiceWorkerAction.SaveStorageData, this.storageHandlers.saveStorageData);
        this.handlers.set(ServiceWorkerAction.ResetRules, this.storageHandlers.resetRules);
    }

    public async execute<R = any>(action: ServiceWorkerAction, data?: any): Promise<ActionResult<R>> {
        const handler = this.handlers.get(action);

        if (!handler) {
            const error = `Action handler not found: ${action}`;
            console.error(error);
            return { success: false, error };
        }

        try {
            const result = await handler(data);
            return result as ActionResult<R>;
        } catch (error) {
            const errorMessage = `Error executing action ${action}: ${error}`;
            console.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }
}
