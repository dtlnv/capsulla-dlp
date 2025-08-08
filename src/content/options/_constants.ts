export const DEFAULT_RULES: RulesShape = {
    clipboardRules: [],
    downloadRules: [],
    uploadRules: [],
};

export const REACT_ACTIONS: { value: ReactAction; label: string; description: string }[] = [
    { value: 'block', label: 'Block', description: 'Completely prevent the action' },
    { value: 'warn', label: 'Warn', description: 'Show warning but allow action' },
    { value: 'mask', label: 'Mask', description: 'Replace sensitive data with mask' },
    { value: 'allow', label: 'Allow', description: 'Allow action without restrictions' },
];

export const COMMON_MIME_TYPES = {
    download: [
        'application/pdf',
        'application/json',
        'application/zip',
        'application/x-zip-compressed',
        'text/csv',
        'text/plain',
        'image/png',
        'image/jpeg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    upload: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'text/csv',
        'application/json',
        'video/mp4',
        'audio/mpeg',
    ],
};
