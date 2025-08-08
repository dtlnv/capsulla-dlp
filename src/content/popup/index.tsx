import { createRoot } from 'react-dom/client';
import Popup from './Popup';

function initializeApp() {
    const container = document.getElementById('privacy-copilot-popup-container');
    if (!container) {
        console.error('Privacy Copilot popup container not found');
        return;
    }

    try {
        const root = createRoot(container);
        root.render(<Popup />);
        console.info('Privacy Copilot popup initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Privacy Copilot popup:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
