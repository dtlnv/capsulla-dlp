import { ContentAction, ServiceWorkerAction } from '@/types/actions';
import { actionService } from '../messaging/actions/action-service';
import contentRequest from '../messaging/content-request';

const lastClipboardDataByTab: Record<number, string | undefined> = {};

async function tabsListener(activeInfo: chrome.tabs.TabActiveInfo): Promise<void> {
    const clipboardData = await contentRequest(activeInfo.tabId, ContentAction.GetClipboardText);

    // Only show notification if clipboard data has changed for this tab
    if (lastClipboardDataByTab[activeInfo.tabId] === clipboardData) {
        return;
    }

    lastClipboardDataByTab[activeInfo.tabId] = clipboardData;

    const { data } = await actionService.executeAction(ServiceWorkerAction.ClipboardCheck, clipboardData);

    await contentRequest(activeInfo.tabId, ContentAction.SetClipboardText, {
        text: data.pasteText,
    });

    if (data.status === 'warned' || data.status === 'blocked') {
        let type = 'warning';
        let message = `Clipboard contains sensitive data: ${data.masks.join(', ')}. `;

        if (data.status === 'blocked') {
            message += 'Your clipboard has been cleared to protect your privacy.';
            type = 'error';

            await contentRequest(activeInfo.tabId, ContentAction.ClearClipboard);
        }

        await contentRequest(activeInfo.tabId, ContentAction.ShowNotification, {
            message,
            type,
        });
    }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    await tabsListener(activeInfo);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        await tabsListener({ tabId } as chrome.tabs.TabActiveInfo);
    }
});

chrome.tabs.onCreated.addListener(async (tab) => {
    if (tab.active) {
        await tabsListener({ tabId: tab.id } as chrome.tabs.TabActiveInfo);
    }
});
