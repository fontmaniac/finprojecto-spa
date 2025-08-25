/* FM: Container for navigation panes. */

import { useState } from 'react';
import { NavBarTop } from './NavBarTop';
import { NavBarBottom } from './NavBarBottom';
import layout from '../primitives/Layout.module.css';
import styles from './NavBar.module.css';

export function NavBar({ onInit }) {
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const [c, setC] = useState(0);

    return (
        <div className={`${layout.fillContainer} ${styles.navBar}`}>
            <NavBarTop a={a} b={b} c={c} setA={setA} setB={setB} setC={setC} onInit={onInit} />
            <NavBarBottom />
        </div>
    );
}
