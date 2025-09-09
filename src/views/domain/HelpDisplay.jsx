/* FM: Static help capsule for first-time visitors */

import React from 'react';
import layout from '../primitives/Layout.module.css';
import styles from './HelpDisplay.module.css';
import clsx from 'clsx';

export function HelpDisplay() {
    return (
        <div className={clsx(layout.fillContainer, styles.help)}>
            <ul>
                <li>Begin by entering your loan or mortgage terms in the input panel.</li>
                <li>Click <strong>Calculate</strong> to simulate repayment over time.</li>
                <li>Review the computed <em>Outcome</em> properties for the full repayment schedule.</li>
                <li>Select any slice to refine its parameters—changes affect only future slices.</li>
                <li>Switch to the <strong>Tabular View</strong> for a structured breakdown of all slices.</li>
                <li>Download the full simulation as a <code>.csv</code> file for external analysis.</li>
            </ul>
        </div>
    );
}
