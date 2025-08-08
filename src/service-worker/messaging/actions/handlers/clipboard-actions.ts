import { storageService } from '@/service-worker/services/storage-service';
import { ServiceWorkerAction } from '@/types/actions';

type Pattern = {
    pattern: string;
    mask: string;
    react: ReactAction;
};

export class ClipboardActionHandlers {
    constructor(private logger: LoggingService) {}

    public handleClipboardCheck = async (originalText: string): Promise<ActionResult<PasteResult>> => {
        const getPatterns: Pattern[] = ((await storageService.get('rules')) || {}).clipboardRules || [];
        let safeText = originalText;
        let triggered = false;

        const masks: Set<string> = new Set();
        const reactions: Set<ReactAction> = new Set();

        getPatterns.forEach(({ pattern, mask, react }) => {
            const regex = new RegExp(pattern, 'g');
            if (regex.test(safeText)) {
                if (react === 'mask') {
                    safeText = safeText.replace(regex, mask);
                }
                triggered = true;
                masks.add(mask);
                reactions.add(react);
            }
        });

        if (triggered) {
            this.logger.logAction(ServiceWorkerAction.ClipboardCheck, {
                originalText,
                safeText,
                masks,
            });
        }

        let status: 'allowed' | 'blocked' | 'warned' = 'allowed';
        let pasteText: string | undefined = originalText;

        if (reactions.has('mask')) {
            pasteText = safeText; // Use masked text if masking is applied
        }

        if (reactions.has('warn')) {
            status = 'warned';
        }

        if (reactions.has('block')) {
            status = 'blocked';
            pasteText = ''; // Clear clipboard if blocked
        }

        return {
            success: true,
            data: {
                pasteText,
                masks: Array.from(masks),
                status,
            },
        };
    };
}
