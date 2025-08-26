/* FM: Container for navigation panes. */

import { NavBarTop } from './NavBarTop';
import { NavBarBottom } from './NavBarBottom';
import layout from '../primitives/Layout.module.css';
import styles from './NavBar.module.css';

export function NavBar({ topChild, bottomChild }) {
    return (
        <div className={`${layout.fillContainer} ${styles.navBar}`}>
            <NavBarTop>{topChild}</NavBarTop>
            <NavBarBottom>{bottomChild}</NavBarBottom>
        </div>
    );
}
