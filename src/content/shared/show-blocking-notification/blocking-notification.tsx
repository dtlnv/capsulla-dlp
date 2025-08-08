import { useEffect, useRef, useCallback } from 'react';
import { Sparkles } from './sparkles';

const BLOCKING_NOTIFICATION_ID = 'privacy-copilot-blocking-notification';

export interface NotificationProps {
    text?: string;
    duration?: number;
    type?: 'error' | 'warning' | 'info' | string;
    onClose?: () => void;
}

export function BlockingNotification({
    text = 'This is a blocking notification',
    duration = 20000,
    type = 'error',
    onClose,
}: NotificationProps) {
    const timeoutRef = useRef<number | null>(null);

    const handleClose = useCallback(() => {
        const el = document.getElementById(BLOCKING_NOTIFICATION_ID);
        if (el) {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                onClose?.();
            }, 300);
        } else {
            onClose?.();
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, [onClose]);

    useEffect(() => {
        if (duration > 0) {
            timeoutRef.current = window.setTimeout(handleClose, duration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [duration, handleClose]);

    return (
        <>
            {type === 'error' && <Sparkles />}
            <div id={BLOCKING_NOTIFICATION_ID} className={`privacy-copilot-blocking-notification ${type}`} data-type={type}>
                <span className='privacy-copilot-notification-icon'>
                    {type === 'error' && '🚫'}
                    {type === 'warning' && '⚠️'}
                    {type === 'info' && 'ℹ️'}
                </span>
                <span className='privacy-copilot-notification-message'>{text}</span>
                <button className='privacy-copilot-close-btn' aria-label='Close notification' onClick={handleClose} type='button'>
                    ✕
                </button>
            </div>
        </>
    );
}
