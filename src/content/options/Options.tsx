import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/service-worker/services/storage-service';
import { DEFAULT_RULES } from './_constants';
import RulesManager from './RulesManager';

export default function Options() {
    const [settings, setSettings] = useState<RulesShape>(DEFAULT_RULES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const savedSettings = await storageService.get('rules');

            if (savedSettings && typeof savedSettings === 'object') {
                // Validate and sanitize the loaded settings
                const validatedSettings: RulesShape = {
                    clipboardRules: Array.isArray(savedSettings.clipboardRules) ? savedSettings.clipboardRules : [],
                    downloadRules: Array.isArray(savedSettings.downloadRules) ? savedSettings.downloadRules : [],
                    uploadRules: Array.isArray(savedSettings.uploadRules) ? savedSettings.uploadRules : [],
                };
                setSettings(validatedSettings);
            } else {
                console.info('No saved settings found, using defaults');
                setSettings(DEFAULT_RULES);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setError('Failed to load settings. Using defaults.');
            setSettings(DEFAULT_RULES);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateRules = useCallback(async (newRules: RulesShape): Promise<void> => {
        try {
            // Validate rules before saving
            const validatedRules: RulesShape = {
                clipboardRules: Array.isArray(newRules.clipboardRules) ? newRules.clipboardRules : [],
                downloadRules: Array.isArray(newRules.downloadRules) ? newRules.downloadRules : [],
                uploadRules: Array.isArray(newRules.uploadRules) ? newRules.uploadRules : [],
            };

            await storageService.save('rules', validatedRules);
            setSettings(validatedRules);
            console.info('Rules saved successfully');
        } catch (err) {
            console.error('Failed to save rules:', err);
            throw new Error('Failed to save settings. Please try again.');
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    if (isLoading) {
        return (
            <div className='spc-loading-container'>
                <div className='spc-loading-spinner' aria-label='Loading settings' />
                <p>Loading settings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='spc-error-container'>
                <div className='spc-error-icon'>⚠️</div>
                <p className='spc-error-message'>{error}</p>
                <button onClick={fetchSettings} className='spc-button spc-secondary'>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className='capsulla-pc-options-container'>
            <RulesManager rules={settings} updateRules={updateRules} />
        </div>
    );
}
