/* FM: Domain-specific input group for parabola parameters (a, b, c) */

import { useStagedModel } from '../../utils/useStagedModel';
import styles from './ParabolaInputs.module.css';

export function ParabolaInputs({ params, onInit }) {
    console.log('ParabolaInputs renders with params ', params);

    const { staged, updateKey, commit } = useStagedModel(params);

    const makeChangeHandler = (key) => (e) => { updateKey(key, +e.target.value); };
        
    return (
        <div className={styles.top}>
            <div className={styles.inputGroup}>
                <label htmlFor="a">a:</label>
                <input id="a" type="number" value={staged.a} onChange={makeChangeHandler('a')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="b">b:</label>
                <input id="b" type="number" value={staged.b} onChange={makeChangeHandler('b')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="c">c:</label>
                <input id="c" type="number" value={staged.c} onChange={makeChangeHandler('c')} />
            </div>
            <button className={styles.initButton} onClick={() => onInit(commit())}>Init</button>
        </div>    
    );
}
