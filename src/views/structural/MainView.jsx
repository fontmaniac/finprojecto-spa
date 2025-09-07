/* FM: Main View orchestrator; hosts domain render component */

import layout from '../primitives/Layout.module.css';
import styles from './MainView.module.css';
import React, { useState, useEffect } from 'react';

export function MainView({ children, trigger }) {
    console.log('MainView rendered');

    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (trigger) setShouldRender(true);
    }, [trigger]);

    return (
        <div className={`${layout.fillContainer} ${styles.main}`}>
            {shouldRender
                ? children
                : <p>Press "Calculate" to generate graph</p>}
        </div>
    );
}
