/* FM: Container for navigation panes. */

import layout from '../primitives/Layout.module.css';
import styles from './NavBar.module.css';
import React from 'react';

/* FM: Generic pane for NavBar sections */

export function NavBarPane({ children }) {
    return (
        <div className={styles.navBarPane}>
            {children}
        </div>
    );
}

export function NavBar({ children }) {
    return (
        <div className={`${layout.fillContainer} ${styles.navBar}`}>
            {React.Children.map(children, (child, i) => (
                <NavBarPane key={i}>{child}</NavBarPane>
            ))}
        </div>
    );
}

