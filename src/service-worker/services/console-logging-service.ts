import { ContentAction } from '@/types/actions';
import contentRequest from '../messaging/content-request';
import { storageService } from './storage-service';

// Logging service
export default class ConsoleLoggingService implements LoggingService {
    async logAction(action: string, details: Record<string, any>): Promise<void> {
        let systemInfo: SystemInfo | undefined;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
            systemInfo = await contentRequest(tab.id, ContentAction.SystemInfo);
        }

        const user = (await storageService.get('user')) || {};

        console.log(`--- ${action} ---`);
        console.log('Details:', details);

        if (user) {
            console.log('User Info:', user);
        } else {
            console.warn('No user info available.');
        }
        if (systemInfo) {
            console.log('System Info:', systemInfo);
        } else {
            console.warn('No system info available.');
        }
    }
}
