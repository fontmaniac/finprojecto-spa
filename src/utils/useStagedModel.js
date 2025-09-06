/* FM: Implementation of useStagedModel hook for "staged" way of editing / updating model props */

import { useState, useEffect } from 'react';

export function useStagedModel(initialModel) {
    const [staged, setStaged] = useState(initialModel);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setStaged(initialModel);
        setIsDirty(false);
    }, [initialModel]);

    const updateKey = (key, value) => {
        console.log('useStagedModel: updateKey called with', key, value);
        setStaged(prev => {
            const next = { ...prev, [key]: value };
            setIsDirty(true);
            return next;
        });
    };

    const updateAll = (update) => {
        console.log('useStagedModel: updateAll called');
        setStaged(prev => {
            const next = update(prev);
            setIsDirty(true);
            return next;
        });

    };

    const commit = () => staged;

    const reset = () => {
        setStaged(initialModel);
        setIsDirty(false);
    };

    return { staged, updateKey, updateAll, commit, reset, isDirty };
}
