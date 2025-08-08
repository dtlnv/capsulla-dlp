import { useCallback, useState } from 'react';

interface SaveButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function SaveButton({ onClick, disabled = false }: SaveButtonProps) {
    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(async () => {
        if (disabled || isLoading) return;

        try {
            setIsLoading(true);
            await onClick();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save:', error);
            // Could add error state here
        } finally {
            setIsLoading(false);
        }
    }, [onClick, disabled, isLoading]);

    const getButtonText = () => {
        if (isLoading) return 'Saving...';
        if (saved) return 'Saved!';
        return 'Save Changes';
    };

    const getButtonClass = () => {
        let className = 'spc-button spc-primary spc-save-button';
        if (saved) className += ' spc-success';
        if (disabled) className += ' spc-disabled';
        return className;
    };

    return (
        <button
            className={getButtonClass()}
            onClick={handleClick}
            disabled={disabled || isLoading}
            aria-label='Save changes to rules'
        >
            {getButtonText()}
        </button>
    );
}
