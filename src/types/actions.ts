export enum ServiceWorkerAction {
    ClipboardCheck = 'clipboard-check',
    GetUploadProhibitedFileTypes = 'get-upload-prohibited-file-types',
    FileUploadBlocked = 'file-upload-blocked',
    FileUploadedSuccessfully = 'file-uploaded-successfully',
    FileDownloadedSuccessfully = 'file-downloaded-successfully',
    GetDownloadProhibitedFileTypes = 'get-download-prohibited-file-types',
    FileDownloadBlocked = 'file-download-blocked',
    GetStorageData = 'get-storage-data',
    SaveStorageData = 'save-storage-data',
    ResetRules = 'reset-rules',
}

export enum ContentAction {
    ClearClipboard = 'clearClipboard',
    GetClipboardText = 'getClipboardText',
    ShowNotification = 'showNotification',
    SystemInfo = 'systemInfo',
    SetClipboardText = 'setClipboardText',
}
