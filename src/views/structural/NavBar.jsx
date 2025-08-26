/* FM: Container for navigation panes. */

import { NavBarTop } from './NavBarTop';
import { NavBarBottom } from './NavBarBottom';
import layout from '../primitives/Layout.module.css';
import styles from './NavBar.module.css';

export function NavBar({ children }) {
    return (
        <div className={`${layout.fillContainer} ${styles.navBar}`}>
            <NavBarTop> {children} </NavBarTop>
            <NavBarBottom />
        </div>
    );
}
