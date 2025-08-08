/**
 * Send requests to the service worker.
 */
const serviceWorkerRequest: ServiceWorkerRequestInterface = async (action, data): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage({ action, data }, (response: ActionResult) => {
                if (response?.success) {
                    resolve(response.data);
                } else {
                    reject(response?.error ?? 'Unknown error');
                }
            });
        } catch (e) {
            // Reload the page only if the extension context is invalidated
            if ((e as any)?.message?.includes('Extension context invalidated')) {
                window.location.reload();
            }
            reject(e);
        }
    });
};

export default serviceWorkerRequest;
