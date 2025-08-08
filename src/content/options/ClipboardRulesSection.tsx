import { REACT_ACTIONS } from './_constants';

interface ClipboardRulesSectionProps {
    rules: ClipboardRule[];
    onAdd: () => void;
    onUpdate: (index: number, field: keyof ClipboardRule, value: string) => void;
    onDelete: (index: number) => void;
}

export default function ClipboardRulesSection({ rules, onAdd, onUpdate, onDelete }: ClipboardRulesSectionProps) {
    function validatePattern(pattern: string): boolean {
        if (!pattern) return true; // Empty is valid
        try {
            new RegExp(pattern);
            return true;
        } catch {
            return false;
        }
    }

    return (
        <section className='spc-rules-section'>
            <div className='spc-section-header'>
                <h2>Clipboard Rules</h2>
                <p className='spc-section-description'>
                    Define patterns to detect sensitive data in clipboard content. Use regular expressions to match specific
                    patterns.
                </p>
            </div>

            <div className='spc-table-container'>
                <table className='spc-rules-table'>
                    <thead>
                        <tr>
                            <th>Mask Text</th>
                            <th>Regex Pattern</th>
                            <th>Action</th>
                            <th className='spc-table-actions'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.length === 0 ? (
                            <tr>
                                <td colSpan={4} className='spc-empty-state'>
                                    <div className='spc-empty-content'>
                                        <span className='spc-empty-icon'>📋</span>
                                        <p>No clipboard rules defined</p>
                                        <small>Add a rule to get started with clipboard protection</small>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rules.map((rule, idx) => {
                                const isValidPattern = validatePattern(rule.pattern);

                                return (
                                    <tr key={idx} className={!isValidPattern ? 'spc-invalid-row' : ''}>
                                        <td>
                                            <input
                                                type='text'
                                                value={rule.mask}
                                                onChange={(e) => onUpdate(idx, 'mask', e.target.value)}
                                                placeholder='[SENSITIVE DATA]'
                                                className='spc-input'
                                                aria-label={`Mask text for rule ${idx + 1}`}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <div className='spc-input-with-validation'>
                                                <input
                                                    type='text'
                                                    value={rule.pattern}
                                                    onChange={(e) => onUpdate(idx, 'pattern', e.target.value)}
                                                    placeholder='\\b\\d{4}-\\d{4}-\\d{4}-\\d{4}\\b'
                                                    className={`spc-input spc-pattern-input ${
                                                        !isValidPattern ? 'spc-invalid' : ''
                                                    }`}
                                                    aria-label={`Regex pattern for rule ${idx + 1}`}
                                                    title={
                                                        !isValidPattern
                                                            ? 'Invalid regex pattern'
                                                            : rule.pattern
                                                            ? `Pattern: ${rule.pattern}`
                                                            : 'Enter a regex pattern'
                                                    }
                                                    required
                                                />
                                                {!isValidPattern && rule.pattern && (
                                                    <span className='spc-validation-error' title='Invalid regex pattern'>
                                                        ⚠️
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                value={rule.react}
                                                onChange={(e) => onUpdate(idx, 'react', e.target.value)}
                                                className='spc-select'
                                                aria-label={`Action for rule ${idx + 1}`}
                                            >
                                                {REACT_ACTIONS.map((action) => (
                                                    <option key={action.value} value={action.value} title={action.description}>
                                                        {action.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                type='button'
                                                onClick={() => onDelete(idx)}
                                                className='spc-button spc-danger-outline'
                                                aria-label={`Delete rule ${idx + 1}`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className='spc-section-actions'>
                <button type='button' onClick={onAdd} className='spc-button spc-secondary'>
                    Add Clipboard Rule
                </button>
            </div>
        </section>
    );
}
