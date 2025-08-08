import { createRoot, Root } from 'react-dom/client';
import { BlockingNotification, NotificationProps } from './blocking-notification';

let activeNotification: { root: Root; container: HTMLElement } | null = null;

export default function showNotification(props: NotificationProps): void {
    // Cleanup previous notification if it exists
    if (activeNotification) {
        try {
            activeNotification.root.unmount();
            activeNotification.container.remove();
        } catch (error) {
            console.warn('Error cleaning up previous notification:', error);
        }
        activeNotification = null;
    }

    const container = document.createElement('div');
    container.id = 'privacy-copilot-notification-container';

    document.body.appendChild(container);

    const cleanup = () => {
        try {
            if (activeNotification) {
                activeNotification.root.unmount();
                activeNotification.container.remove();
                activeNotification = null;
            }
        } catch (error) {
            console.warn('Error during cleanup:', error);
        }
    };

    try {
        const root = createRoot(container);
        activeNotification = { root, container };

        root.render(<BlockingNotification {...props} onClose={cleanup} />);
    } catch (error) {
        console.error('Error rendering notification:', error);
        cleanup();
    }
}
