export { };

declare global {
    interface Navigator {
        getBattery?: () => Promise<{
            charging: boolean;
            chargingTime: number;
            dischargingTime: number;
            level: number;
        }>;

        activation?: {
            entry?: {
                url: string;
            };
        };

        currentEntry?: {
            url: string;
        };

        userAgentData?: {
            platform: string;
        };
    }
}
