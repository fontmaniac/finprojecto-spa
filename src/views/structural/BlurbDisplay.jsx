/* FM: Declarative wrapper for index.html blurb content */

import React, { useEffect, useState } from 'react';
import styles from './BlurbDisplay.module.css';

export function BlurbDisplay() {
    const [blurbHTML, setBlurbHTML] = useState('');

    useEffect(() => {
        const blurbElement = document.getElementById('preact-blurb');
        if (blurbElement) {
            setBlurbHTML(blurbElement.innerHTML);
            blurbElement.style.display = 'none'; // Hide original static content
        }
    }, []);

    return (
        <div
            className={styles.blurb}
            dangerouslySetInnerHTML={{ __html: blurbHTML }}
        />
    );
}
