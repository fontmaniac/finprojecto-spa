/* FM: Domain-specific input group for editing a single circle's properties (x, y, radius, key) */

import { useState } from 'react';
import styles from './ParabolaInputs.module.css'; // Reuse existing styles

export function CircleProps({ circleModel, onUpdate }) {
    const [myCircleModel, setCircleModel] = useState(circleModel);

    const makeChangeHandler = (key) => (e) => {
        setCircleModel(prev => ({ ...prev, [key]: +e.target.value }));
    };

    return (
        <div className={styles.bottom}>
            <div className={styles.inputGroup}>
                <label htmlFor="key">key:</label>
                <input id="key" type="text" value={myCircleModel.key} readOnly />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="x">x:</label>
                <input id="x" type="number" value={myCircleModel.x} onChange={makeChangeHandler('x')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="y">y:</label>
                <input id="y" type="number" value={myCircleModel.y} onChange={makeChangeHandler('y')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="radius">radius:</label>
                <input id="radius" type="number" value={myCircleModel.radius} onChange={makeChangeHandler('radius')} />
            </div>
            <button className={styles.initButton} onClick={() => onUpdate(myCircleModel)}>Update</button>
        </div>
    );
}
