import styles from './NavBarTop.module.css';

export function NavBarTop({ a, b, c, setA, setB, setC, onInit }) {
    return (
        <div className={styles.top}>
            <div className={styles.inputGroup}>
                <label htmlFor="a">a:</label>
                <input id="a" type="number" value={a} onChange={e => setA(+e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="b">b:</label>
                <input id="b" type="number" value={b} onChange={e => setB(+e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="c">c:</label>
                <input id="c" type="number" value={c} onChange={e => setC(+e.target.value)} />
            </div>
            <button className={styles.initButton} onClick={() => onInit(a, b, c)}>Init</button>
        </div>
    );
}
