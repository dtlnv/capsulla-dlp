// Types

type SystemInfo = {
    os?: string;
    userAgent?: string;
    entryUrl?: string;
    currentUrl?: string;
    documentTitle?: string;
    timestamp?: number;
    batteryInfo?: {
        charging: boolean;
        level: string;
    } | null;
};

interface ActionResponse {
    masks?: string[];
}

interface PasteResult extends ActionResponse {
    pasteText: string | undefined;
    status: 'allowed' | 'blocked' | 'warned';
}

type UploadedFile = {
    name: string;
    size: number;
    type: string;
};

interface FileUploadData {
    type: 'input' | 'drop';
    fileTypes: string[];
    files: UploadedFile[];
}

interface ActionResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

interface LoggingService {
    logAction(action: string, details: Record<string, any>): void;
}

interface ActionHandler<TData = any, TResult = any> {
    (data: TData, systemInfo: SystemInfo): Promise<ActionResult<TResult>> | ActionResult<TResult>;
}

interface ListenerInterface {
    (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): Promise<void>;
}

interface ServiceWorkerRequestInterface {
    (action: string, data?: any): Promise<any>;
}

interface ContentRequestInterface {
    (tabId: number, action: string, data?: any): Promise<any>;
}

type ReactAction = 'block' | 'warn' | 'mask' | 'allow';

interface ClipboardRule {
    mask: string;
    pattern: string;
    react: ReactAction;
}

interface RulesShape {
    clipboardRules?: ClipboardRule[];
    downloadRules?: string[];
    uploadRules?: string[];
    [key: string]: any;
}
