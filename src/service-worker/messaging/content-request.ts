/**
 * Send requests from the service worker to the content script.
 */
const contentRequest: ContentRequestInterface = (tabId, action, data) => {
    return new Promise((resolve, reject) => {
        if (!tabId || typeof tabId !== 'number') {
            return reject(new Error('Invalid tabId. It must be a number.'));
        }

        if (typeof action !== 'string') {
            return reject(new Error('Invalid action. It must be a valid ContentAction string.'));
        }

        try {
            chrome.tabs.sendMessage(tabId, { action, ...data }, (response) => {
                if (chrome.runtime.lastError) {
                    // return reject(new Error(chrome.runtime.lastError.message));
                    console.log('Error sending message to content script:', chrome.runtime.lastError.message);
                    return;
                }

                if (response && response?.error) {
                    // return reject(new Error(`Content script error: ${response.error}`));
                    console.log('Content script error:', response.error);
                    return;
                }

                if (response?.success === false) {
                    // return reject(new Error(`Action ${action} failed: ${response.error || 'Unknown error'}`));
                    console.log(`Action ${action} failed:`, response.error || 'Unknown error');
                    return;
                }

                resolve(response?.data);
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default contentRequest;
