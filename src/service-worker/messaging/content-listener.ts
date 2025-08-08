import { ServiceWorkerAction } from '@/types/actions';
import { actionService } from './actions/action-service';

/**
 * Receive and process requests from content scripts.
 */
async function contentListener(
    request: { action: ServiceWorkerAction; data: any },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
): Promise<void> {
    if (request.action) {
        try {
            const response: any = await actionService.executeAction(request.action, request.data);
            sendResponse(response);
        } catch (error) {
            console.error(`Error processing action ${request.action}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            sendResponse({ success: false, error: errorMessage });
        }
    }
}

/**
 * Listen for messages from content scripts.
 */
chrome.runtime.onMessage.addListener((...params) => {
    contentListener(...params);
    return true; // required for async requests
});
