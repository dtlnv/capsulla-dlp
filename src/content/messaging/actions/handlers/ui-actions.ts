import showNotification from '@/content/shared/show-blocking-notification';

export class UIActionHandlers {
    public showNotification = ({ message, duration, type }: { message: string; duration?: number; type?: string }): void => {
        showNotification({
            text: message,
            duration,
            type,
        });
    };
}
