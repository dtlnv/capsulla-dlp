import React, { useState, useMemo } from 'react';
import { COMMON_MIME_TYPES } from './_constants';

interface MimeRulesSectionProps {
    title: string;
    description: string;
    rules: string[];
    type: 'download' | 'upload';
    onAdd: (mime: string) => void;
    onDelete: (index: number) => void;
}

const SUGGESTION_BLUR_DELAY_MS = 150;

export default function MimeRulesSection({ title, description, rules, type, onAdd, onDelete }: MimeRulesSectionProps) {
    const [newMime, setNewMime] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    function handleAdd() {
        const trimmedMime = newMime.trim();
        if (!trimmedMime) return;

        if (rules.includes(trimmedMime)) {
            alert('This MIME type is already added');
            return;
        }

        onAdd(trimmedMime);
        setNewMime('');
        setShowSuggestions(false);
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }

    function handleSuggestionClick(mime: string) {
        setNewMime(mime);
        setShowSuggestions(false);
    }

    const commonMimes = COMMON_MIME_TYPES[type];
    const filteredSuggestions = useMemo(
        () => commonMimes.filter((mime) => !rules.includes(mime) && mime.toLowerCase().includes(newMime.toLowerCase())),
        [commonMimes, rules, newMime]
    );

    return (
        <section className='spc-rules-section'>
            <div className='spc-section-header'>
                <h2>{title}</h2>
                <p className='spc-section-description'>{description}</p>
            </div>

            <div className='spc-table-container'>
                <table className='spc-rules-table'>
                    <thead>
                        <tr>
                            <th>MIME Type</th>
                            <th className='spc-table-actions'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.length === 0 ? (
                            <tr>
                                <td colSpan={2} className='spc-empty-state'>
                                    <div className='spc-empty-content'>
                                        <span className='spc-empty-icon'>{type === 'download' ? '⬇️' : '⬆️'}</span>
                                        <p>No {type} rules defined</p>
                                        <small>Add MIME types to restrict {type} operations</small>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rules.map((mime, i) => (
                                <tr key={`${mime}-${i}`}>
                                    <td>
                                        <span className='spc-mime' title={mime} aria-label={`MIME type: ${mime}`}>
                                            {mime}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            onClick={() => onDelete(i)}
                                            className='spc-button spc-danger-outline'
                                            aria-label={`Delete ${mime} rule`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className='spc-add-mime-container'>
                <div className='spc-input-with-suggestions'>
                    <input
                        type='text'
                        placeholder={`e.g. ${type === 'download' ? 'application/json' : 'image/png'}`}
                        value={newMime}
                        onChange={(e) => {
                            setNewMime(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                        }}
                        onKeyDown={handleKeyPress}
                        onFocus={() => setShowSuggestions(newMime.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), SUGGESTION_BLUR_DELAY_MS)} // Small delay for click handling
                        className={`spc-input`}
                        aria-label={`Add new ${type} MIME type`}
                    />

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className='spc-suggestions'>
                            {filteredSuggestions.slice(0, 6).map((mime) => (
                                <button
                                    key={mime}
                                    type='button'
                                    className='spc-suggestion'
                                    onClick={() => handleSuggestionClick(mime)}
                                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                                >
                                    {mime}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button type='button' onClick={handleAdd} disabled={!newMime.trim()} className='spc-button spc-secondary'>
                    Add MIME
                </button>
            </div>
        </section>
    );
}
