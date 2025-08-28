/* FM: Domain-specific input group for editing a single circle's properties (x, y, radius, key) */

import { useStagedModel } from '../../utils/useStagedModel';
import styles from './ParabolaInputs.module.css'; // Reuse existing styles

export function CircleProps({ circleModel, onUpdate }) {
    console.log('CircleProps renders with circleModel ', circleModel);

    const { staged, update, commit, isDirty } = useStagedModel(circleModel);

    const makeChangeHandler = (key) => (e) => { update(key, +e.target.value); };

    return (
        <div className={styles.bottom}>
            <div className={styles.inputGroup}>
                <label htmlFor="key">key:</label>
                <input id="key" type="text" value={staged.key} readOnly />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="x">x:</label>
                <input id="x" type="number" value={staged.x} onChange={makeChangeHandler('x')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="y">y:</label>
                <input id="y" type="number" value={staged.y} onChange={makeChangeHandler('y')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="radius">radius:</label>
                <input id="radius" type="number" value={staged.radius} onChange={makeChangeHandler('radius')} />
            </div>
            <button className={styles.initButton} onClick={() => onUpdate(commit())} disabled={!isDirty}>Update</button>
        </div>
    );
}
