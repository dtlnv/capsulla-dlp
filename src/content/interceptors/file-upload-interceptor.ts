import { ServiceWorkerAction } from '@/types/actions';
import serviceWorkerRequest from '../messaging/service-worker-request';
import cancelEvent from '../shared/cancel-event/cancel-event';
import showNotification from '../shared/show-blocking-notification';

class FileUploadInterceptor {
    private prohibitedTypes: string[] = [];

    constructor() {
        this.init();
    }

    // Attaches the event listeners for file uploads.
    public attach() {
        window.addEventListener('change', this.uploadFileListener, true);
        document.addEventListener('drop', this.dropListener, true);
        document.addEventListener('dragenter', this.cancelUploadInIframe, true);
    }

    // Get the prohibited file types from the service worker or cache.
    private async init() {
        try {
            const fileTypes = await serviceWorkerRequest(ServiceWorkerAction.GetUploadProhibitedFileTypes);
            if (fileTypes) {
                this.prohibitedTypes = fileTypes;
                console.log('Fetched prohibited file types:', this.prohibitedTypes);
            } else {
                console.error('Failed to fetch prohibited file types');
            }
        } catch (error) {
            console.error('Error fetching prohibited file types:', error);
        }
    }

    /**
     * Checks if the uploaded files are of prohibited types.
     * If any file is of a prohibited type, it cancels the event, clears the input,
     * and alerts the user about the blocked upload.
     * @param e Event
     * @param files
     */
    private checkFileUpload(e: Event, files: FileList | null, type: 'input' | 'drop'): void {
        if (!files || files.length === 0) return;
        this.init(); // Ensure we have the latest prohibited types

        const prohibitedTypes: string[] = this.prohibitedTypes.length ? this.prohibitedTypes : [];
        const fileArray = Array.from(files);

        const unsafeFiles = fileArray.filter((file) => prohibitedTypes.includes(file.type));
        const safeFiles = fileArray.length - unsafeFiles.length;

        if (unsafeFiles.length > 0 || prohibitedTypes.includes('*')) {
            if (e.type === 'drop') {
                this.dispatchDropEvent(e as DragEvent);
            }

            cancelEvent(e);

            if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
                e.target.value = '';
            }

            let fileTypes = new Set(unsafeFiles.map((file) => file.type));

            if (prohibitedTypes.includes('*')) {
                fileTypes = new Set(['*']);
            }

            showNotification({
                text: `File upload blocked due to restricted file type: ${Array.from(fileTypes).join(', ')}.`,
                type: 'error',
            });

            // Send a request to the service worker to handle the blocked file upload.
            serviceWorkerRequest(ServiceWorkerAction.FileUploadBlocked, {
                type,
                fileTypes: unsafeFiles.map((file) => file.type),
                files: unsafeFiles.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                })),
            });
        } else if (safeFiles > 0) {
            serviceWorkerRequest(ServiceWorkerAction.FileUploadedSuccessfully, {
                type,
                fileTypes: fileArray.map((file) => file.type),
                files: fileArray.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                })),
            });
        }
    }

    // Listens for file input changes and checks the uploaded files.
    protected uploadFileListener = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'file') {
            this.checkFileUpload(e, (target as HTMLInputElement).files, 'input');
        }
    };

    // Listens for drag-and-drop events and checks the uploaded files.
    protected dropListener = (e: DragEvent) => {
        const dt = e.dataTransfer;
        if (!dt || !dt.files || dt.files.length === 0) return;

        this.checkFileUpload(e, dt.files, 'drop');
    };

    // Reloads the iframe when a CustomEvent is sent to it.
    // The main purpose is to override the behavior of loading files into an iframe, such as in ProtonMail.
    protected cancelUploadInIframe = (e: Event) => {
        if (e instanceof CustomEvent && e.target instanceof HTMLIFrameElement) {
            e.target.contentWindow?.location.reload();
        }
    };

    private dispatchDropEvent(e: DragEvent): void {
        const dropEvent = new DragEvent('drop', {
            ...e,
            bubbles: true,
            cancelable: true,
            composed: true,
            dataTransfer: new DataTransfer(),
        });
        document.dispatchEvent(dropEvent);
    }
}

const fileUploadInterceptor = new FileUploadInterceptor();
fileUploadInterceptor.attach();
