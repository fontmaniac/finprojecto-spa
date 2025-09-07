/* FM: Floating Navigation "Raft" with icons and active state */

import React from 'react';
import styles from './NavRaft.module.css';

/**
 * NavRaft items structure:
 * [
 *   {
 *     icon: ReactNode,       // Icon component to render (e.g. <FiSun />)
 *     label: string,         // Tooltip label for accessibility
 *     onClick: () => void,   // Handler for click interaction
 *     isActive?: boolean     // Optional flag to indicate active state
 *   },
 *   ...
 * ]
 */


export function NavRaft({ items }) {
    return (
        <div className={styles['nav-raft']}>
            {items.map((item, index) => (
                <button
                    key={index}
                    className={`${styles['nav-raft__icon']} ${item.isActive ? styles['nav-raft__icon--active'] : ''}`}
                    onClick={item.onClick}
                    title={item.label}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    );
}
