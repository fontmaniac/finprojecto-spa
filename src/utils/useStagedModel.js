import { useState, useEffect } from 'react';

export function useStagedModel(initialModel) {
    const [staged, setStaged] = useState(initialModel);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setStaged(initialModel);
        setIsDirty(false);
    }, [initialModel]);

    const update = (key, value) => {
        setStaged(prev => {
            const next = { ...prev, [key]: value };
            setIsDirty(true);
            return next;
        });
    };

    const commit = () => staged;

    const reset = () => {
        setStaged(initialModel);
        setIsDirty(false);
    };

    return { staged, update, commit, reset, isDirty };
}
