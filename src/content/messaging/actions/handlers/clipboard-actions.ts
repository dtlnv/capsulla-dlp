export class ClipboardActionHandlers {
    public clearClipboard = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText('');
        } catch (error) {
            // Retry after 1.5 seconds
            setTimeout(async () => {
                try {
                    await navigator.clipboard.writeText('');
                } catch (retryError) {
                    console.log('Error clearing clipboard:', retryError);
                }
            }, 1500);
        }
    };

    public setClipboardText = async ({ text }: { text: string }): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            // Retry after 1.5 seconds
            setTimeout(async () => {
                try {
                    await navigator.clipboard.writeText(text);
                } catch (retryError) {
                    console.log('Error setting clipboard text:', retryError);
                }
            }, 1500);
        }
    };

    public getClipboardText = (): Promise<string> => {
        return new Promise(async (resolve) => {
            try {
                const text = await navigator.clipboard.readText();
                resolve(text);
            } catch (error) {
                // Retry after 1.5 seconds
                setTimeout(async () => {
                    try {
                        const text = await navigator.clipboard.readText();
                        resolve(text);
                    } catch (retryError) {
                        console.log('Error reading clipboard text:', retryError);
                    }
                }, 1500);
            }
        });
    };
}
