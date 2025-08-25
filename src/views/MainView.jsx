import layout from '../components/Layout.module.css';
import styles from './MainView.module.css';

export function MainView() {
    return (
        <div className={`${layout.fillContainer} ${styles.main}`}>
            {/* Content goes here */}
        </div>
    );
}
