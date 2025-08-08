import { storageService } from '../services/storage-service';
import { actionService } from '../messaging/actions/action-service';
import { ServiceWorkerAction } from '@/types/actions';

async function setDefaultRules() {
    const getRules = await storageService.get('rules');

    if (getRules) {
        console.log('Rules already set, skipping...');
        return;
    }

    actionService.executeAction(ServiceWorkerAction.ResetRules);
}

chrome.runtime.onInstalled.addListener(() => {
    setDefaultRules();
});
