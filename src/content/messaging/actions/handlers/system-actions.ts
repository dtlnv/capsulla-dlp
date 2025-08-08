export class SystemActionHandlers {
    public systemInfo = async (): Promise<SystemInfo> => {
        const batteryInfo = await this.getBatteryInfo();

        return {
            os: window.navigator?.userAgentData?.platform || navigator.platform,
            userAgent: navigator.userAgent,
            entryUrl: window.navigator?.activation?.entry?.url || window.location.href,
            currentUrl: window.navigator?.currentEntry?.url || window.location.href,
            documentTitle: document.title,
            timestamp: Date.now(),
            batteryInfo,
        };
    };

    private async getBatteryInfo() {
        try {
            const battery = await navigator?.getBattery?.();
            return battery
                ? {
                      charging: battery.charging,
                      level: battery.level * 100 + '%',
                  }
                : null;
        } catch {
            return null;
        }
    }
}
