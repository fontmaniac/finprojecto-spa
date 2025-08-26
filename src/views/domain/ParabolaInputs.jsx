// FM: Domain-specific input group for parabola parameters (a, b, c)

import styles from './ParabolaInputs.module.css';

export function ParabolaInputs({ params, setParams, onInit }) {
    const makeChangeHandler = (key) => (e) => {
        setParams(prev => ({ ...prev, [key]: +e.target.value }));
    };
        
    return (
        <div className={styles.top}>
            <div className={styles.inputGroup}>
                <label htmlFor="a">a:</label>
                <input id="a" type="number" value={params.a} onChange={makeChangeHandler('a')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="b">b:</label>
                <input id="b" type="number" value={params.b} onChange={makeChangeHandler('b')} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="c">c:</label>
                <input id="c" type="number" value={params.c} onChange={makeChangeHandler('c')} />
            </div>
            <button className={styles.initButton} onClick={() => onInit(params)}>Init</button>
        </div>    
    );
}
