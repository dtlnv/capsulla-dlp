import { useMemo } from 'react';
import MainLogo from '../options/MainLogo';

export default function Popup() {
    const openOptions = () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    };

    const version = useMemo(() => {
        try {
            return chrome?.runtime?.getManifest()?.version || 'Unknown';
        } catch {
            return 'Unknown';
        }
    }, []);

    return (
        <>
            <div className='spc-center'>
                <MainLogo />
            </div>
            <div className='spc-popup-container'>
                <p className='spc-description spc-center'>Manage your clipboard, download, and upload rules.</p>
                <button className='spc-button' onClick={openOptions}>
                    Options
                </button>
            </div>
            <span className='spc-version spc-center'>v{version}</span>
        </>
    );
}
