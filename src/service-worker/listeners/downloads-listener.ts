import contentRequest from '../messaging/content-request';
import { actionService } from '../messaging/actions/action-service';
import { ContentAction, ServiceWorkerAction } from '@/types/actions';

chrome.downloads.onCreated.addListener(async function (item) {
    const { data } = await actionService.executeAction(ServiceWorkerAction.GetDownloadProhibitedFileTypes);

    const isProhibited = data.includes(item.mime) || data.includes('*');

    if (isProhibited) {
        chrome.downloads.cancel(item.id, async () => {
            await actionService.executeAction(ServiceWorkerAction.FileDownloadBlocked, {
                fileType: item.mime,
                fileName: item.filename,
                fileSize: item.fileSize,
                finalUrl: item.finalUrl,
                referer: item.referrer,
            });

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.id) {
                contentRequest(tab.id, ContentAction.ShowNotification, {
                    message: `File download blocked due to restricted file type: ${data.includes('*') ? '*' : item.mime}.`,
                    type: 'error',
                });
            }
        });
    } else {
        await actionService.executeAction(ServiceWorkerAction.FileDownloadedSuccessfully, {
            fileType: item.mime,
            fileName: item.filename,
            fileSize: item.fileSize,
            finalUrl: item.finalUrl,
            referer: item.referrer,
        });
    }
});
