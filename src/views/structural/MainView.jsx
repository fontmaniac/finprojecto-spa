/* FM: Main View orchestrator; hosts domain render component */

import layout from '../primitives/Layout.module.css';
import styles from './MainView.module.css';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

export function MainView({ children, trigger, fallback }) {
    console.log('MainView rendered');

    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (trigger) {
            setShouldRender(true);
        } 
    }, [trigger]);

    return (
        <div className={clsx(layout.fillContainer, styles.main)}>
            {shouldRender ? children : fallback }
        </div>
    );
}
