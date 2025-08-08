import { useState, useEffect, useCallback, useMemo } from 'react';
import serviceWorkerRequest from '../messaging/service-worker-request';
import { ServiceWorkerAction } from '@/types/actions';
import MainLogo from './MainLogo';
import SaveButton from './SaveButton';
import { DEFAULT_RULES } from './_constants';
import ClipboardRulesSection from './ClipboardRulesSection';
import MimeRulesSection from './MimeRulesSection';

type TabType = 'clipboard' | 'download' | 'upload';

interface RulesManagerProps {
    rules: RulesShape;
    updateRules: (newRules: RulesShape) => void;
}

export default function RulesManager({ rules = DEFAULT_RULES, updateRules }: RulesManagerProps) {
    const [local, setLocal] = useState<RulesShape>(DEFAULT_RULES);
    const [activeTab, setActiveTab] = useState<TabType>('clipboard');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Sync incoming props to local state
    useEffect(() => {
        const safeRules: RulesShape = {
            clipboardRules: Array.isArray(rules.clipboardRules) ? rules.clipboardRules : [],
            downloadRules: Array.isArray(rules.downloadRules) ? rules.downloadRules : [],
            uploadRules: Array.isArray(rules.uploadRules) ? rules.uploadRules : [],
        };
        setLocal(safeRules);
        setHasUnsavedChanges(false);
    }, [rules]);

    // Check for unsaved changes
    useEffect(() => {
        const hasChanges = JSON.stringify(local) !== JSON.stringify(rules);
        setHasUnsavedChanges(hasChanges);
    }, [local, rules]);

    const updateLocalState = useCallback((newLocal: RulesShape) => {
        setLocal(newLocal);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            await updateRules(local);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to save rules:', error);
            throw error; // Let SaveButton handle the error
        }
    }, [local, updateRules]);

    // Clipboard rules handlers
    const addClipboardRule = useCallback(() => {
        const newRule: ClipboardRule = { mask: '', pattern: '', react: 'warn' };
        updateLocalState({
            ...local,
            clipboardRules: [...(local.clipboardRules || []), newRule],
        });
    }, [local, updateLocalState]);

    const updateClipboardRule = useCallback(
        (index: number, field: keyof ClipboardRule, value: string) => {
            const updated = (local.clipboardRules ?? []).map((r, i) => (i === index ? { ...r, [field]: value } : r));
            updateLocalState({ ...local, clipboardRules: updated });
        },
        [local, updateLocalState]
    );

    const deleteClipboardRule = useCallback(
        (index: number) => {
            const updated = (local.clipboardRules ?? []).filter((_, i) => i !== index);
            updateLocalState({ ...local, clipboardRules: updated });
        },
        [local, updateLocalState]
    );

    // MIME type handlers
    const addMimeType = useCallback(
        (section: 'downloadRules' | 'uploadRules', mime: string) => {
            if (!mime.trim() || local[section]?.includes(mime)) return;

            const updatedList = [...(local[section] || []), mime];
            updateLocalState({ ...local, [section]: updatedList });
        },
        [local, updateLocalState]
    );

    const deleteMimeType = useCallback(
        (section: 'downloadRules' | 'uploadRules', index: number) => {
            const filtered = (local[section] || []).filter((_, i) => i !== index);
            updateLocalState({ ...local, [section]: filtered });
        },
        [local, updateLocalState]
    );

    const handleResetRules = useCallback(async () => {
        if (!confirm('Are you sure you want to reset all rules to defaults? This action cannot be undone.')) {
            return;
        }

        try {
            serviceWorkerRequest(ServiceWorkerAction.ResetRules);
            window.location.reload();
        } catch (error) {
            console.error('Failed to reset rules:', error);
            alert('Failed to reset rules. Please try again.');
        }
    }, []);

    const tabConfig = useMemo(
        () => [
            { id: 'clipboard' as TabType, label: 'Clipboard Rules' },
            { id: 'download' as TabType, label: 'Download Rules' },
            { id: 'upload' as TabType, label: 'Upload Rules' },
        ],
        []
    );

    const version = useMemo(() => {
        try {
            return chrome?.runtime?.getManifest()?.version || 'Unknown';
        } catch {
            return 'Unknown';
        }
    }, []);

    return (
        <div className='capsulla-pc-options-container'>
            <header className='capsulla-pc-header'>
                <MainLogo />

                <nav className='capsulla-pc-tabs' role='tablist'>
                    {tabConfig.map((tab) => (
                        <button
                            key={tab.id}
                            className={`capsulla-pc-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            role='tab'
                            aria-selected={activeTab === tab.id}
                            aria-controls={`${tab.id}-panel`}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className='capsulla-pc-header-actions'>
                    <SaveButton onClick={handleSave} disabled={!hasUnsavedChanges} />
                    {hasUnsavedChanges && (
                        <span className='spc-unsaved-indicator' aria-label='You have unsaved changes'>
                            <span className='spc-unsaved-dot'>●</span>
                            Unsaved changes
                        </span>
                    )}
                </div>
            </header>

            <main className='capsulla-pc-rules-manager'>
                <div
                    id='clipboard-panel'
                    className={activeTab === 'clipboard' ? '' : 'hidden'}
                    role='tabpanel'
                    aria-labelledby='clipboard-tab'
                >
                    <ClipboardRulesSection
                        rules={local.clipboardRules || []}
                        onAdd={addClipboardRule}
                        onUpdate={updateClipboardRule}
                        onDelete={deleteClipboardRule}
                    />
                </div>

                <div
                    id='download-panel'
                    className={activeTab === 'download' ? '' : 'hidden'}
                    role='tabpanel'
                    aria-labelledby='download-tab'
                >
                    <MimeRulesSection
                        title='Download Rules'
                        description='Block or restrict downloads based on MIME type'
                        rules={local.downloadRules || []}
                        type='download'
                        onAdd={(mime) => addMimeType('downloadRules', mime)}
                        onDelete={(index) => deleteMimeType('downloadRules', index)}
                    />
                </div>

                <div
                    id='upload-panel'
                    className={activeTab === 'upload' ? '' : 'hidden'}
                    role='tabpanel'
                    aria-labelledby='upload-tab'
                >
                    <MimeRulesSection
                        title='Upload Rules'
                        description='Block or restrict uploads based on MIME type'
                        rules={local.uploadRules || []}
                        type='upload'
                        onAdd={(mime) => addMimeType('uploadRules', mime)}
                        onDelete={(index) => deleteMimeType('uploadRules', index)}
                    />
                </div>
            </main>

            <footer className='capsulla-pc-footer'>
                <div className='spc-footer-actions'>
                    <button onClick={handleResetRules} className='spc-button spc-danger' aria-label='Reset all rules to defaults'>
                        Reset to Defaults
                    </button>
                </div>

                <div className='spc-footer-info'>
                    <span className='spc-version'>Capsulla v{version}</span>
                </div>
            </footer>
        </div>
    );
}
