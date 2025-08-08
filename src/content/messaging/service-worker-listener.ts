import { ContentActionRegistry } from './actions';

const actionRegistry = new ContentActionRegistry();

/**
 * Listen for messages from service worker.
 */
const serviceWorkerListener: ListenerInterface = async (request, _sender, sendResponse): Promise<void> => {
    const { action, ...rest } = request;
    if (action) {
        const response: any = await actionRegistry.execute(action, rest);
        sendResponse(response);
    }
};

chrome.runtime.onMessage.addListener((...params) => {
    serviceWorkerListener(...params);
    return true; // required for async requests
});
