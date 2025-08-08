import { UIActionHandlers } from './handlers/ui-actions';
import { ClipboardActionHandlers } from './handlers/clipboard-actions';
import { SystemActionHandlers } from './handlers/system-actions';
import { ContentAction } from '@/types/actions';

export class ContentActionRegistry {
    private readonly handlers: Map<ContentAction, any> = new Map();
    private readonly uiHandlers: UIActionHandlers;
    private readonly clipboardHandlers: ClipboardActionHandlers;
    private readonly systemHandlers: SystemActionHandlers;

    constructor() {
        this.uiHandlers = new UIActionHandlers();
        this.clipboardHandlers = new ClipboardActionHandlers();
        this.systemHandlers = new SystemActionHandlers();
        this.registerHandlers();
    }

    private registerHandlers(): void {
        // UI Actions
        this.handlers.set(ContentAction.ShowNotification, this.uiHandlers.showNotification);

        // Clipboard Actions
        this.handlers.set(ContentAction.GetClipboardText, this.clipboardHandlers.getClipboardText);
        this.handlers.set(ContentAction.ClearClipboard, this.clipboardHandlers.clearClipboard);
        this.handlers.set(ContentAction.SetClipboardText, this.clipboardHandlers.setClipboardText);

        // System Actions
        this.handlers.set(ContentAction.SystemInfo, this.systemHandlers.systemInfo);
    }

    public async execute<R = any>(action: ContentAction, data?: any): Promise<ActionResult<R>> {
        const handler = this.handlers.get(action);

        if (!handler) {
            const error = `Action handler not found: ${action}`;
            console.error(error);
            return { success: false, error };
        }

        try {
            const result = await handler(data);
            return { success: true, data: result };
        } catch (error) {
            const errorMessage = `Error executing action ${action}: ${error}`;
            console.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    public getUIHandlers(): UIActionHandlers {
        return this.uiHandlers;
    }

    public getClipboardHandlers(): ClipboardActionHandlers {
        return this.clipboardHandlers;
    }

    public getSystemHandlers(): SystemActionHandlers {
        return this.systemHandlers;
    }
}
