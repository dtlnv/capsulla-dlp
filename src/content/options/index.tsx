import { createRoot } from 'react-dom/client';
import Options from './Options';

function initializeApp() {
    const container = document.getElementById('privacy-copilot-options-container');
    if (!container) {
        console.error('Privacy Copilot options container not found');
        return;
    }

    try {
        const root = createRoot(container);
        root.render(<Options />);
        console.info('Privacy Copilot options initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Privacy Copilot options:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
