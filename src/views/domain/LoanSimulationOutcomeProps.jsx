/* FM: Component displaying computed Loan Simulation Outcome */

import React from 'react';
import styles from './LoanSimulationOutcomeProps.module.css';
import { PeriodUnit } from '../../models/Definitions.js' ;

export function LoanSimulationOutcomeProps({ outcome }) {
    console.log('LoanSimulationOutcomeProps rendered with outcome ', outcome);

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
        roundingMode: 'ceil' 
    });

    const formatCurrency = (num) => 
        num 
        ? formatter.format(Math.ceil(num))
        : null;

    const frequencyPerYear = PeriodUnit[outcome.paymentFreqUnit]?.perYear ?? 12;
    const periodVerb = PeriodUnit[outcome.paymentFreqUnit]?.plural ?? 'months';

    const toYears = (num) => {
        return (num / frequencyPerYear).toFixed(2);
    };

    const toText = (num) => {
        return num  
            ? num + ' ' + periodVerb + ' (' + toYears(num) + ' years)'
            : null;
    }

    const totalRepayments = toText(outcome.totalRepayments);
    const offsetMatchPoint = toText(outcome.offsetMatchPoint);

    return (
        <div className={styles['loan-outcome-grid']}>
            {/* Total Repayments */}
            <label>Total Repayments:</label>
            <div />
            <input
                type="text"
                value={totalRepayments ?? ''}
                readOnly
            />

            {/* Total Repayment Amount */}
            <label>Total Repayment Amount:</label>
            <div />
            <input
                type="text"
                value={formatCurrency(outcome.totalRepaymentAmount) ?? ''}
                readOnly
            />

            {/* Total Interest Charged */}
            <label>Total Interest Charged:</label>
            <div />
            <input
                type="text"
                value={formatCurrency(outcome.totalInterestCharged) ?? ''}
                readOnly
            />

            {/* Offset Match Point */}
            <label>Offset Match Point:</label>
            <div />
            <input
                type="text"
                value={offsetMatchPoint ?? ''}
                readOnly
            />

            {/* Future fields can be added here */}
        </div>
    );
}
