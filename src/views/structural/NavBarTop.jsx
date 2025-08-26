/* FM: Structural wrapper for top navbar content; parametrized with domain-specific input component */

import styles from './NavBarTop.module.css';

export function NavBarTop({ children }) {
    return (
        <div className={styles.top}>
            {children}
        </div>
    );
}
