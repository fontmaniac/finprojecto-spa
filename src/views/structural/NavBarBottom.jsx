/* FM: This is where the parameters to MainView's presentation are fine-tuned based on the selected "subcomponent" (of the view) */

import styles from './NavBarBottom.module.css';

export function NavBarBottom({ children }) {
    return (
        <div className={styles.bottom} >
            {children}
        </div>
    );
}

