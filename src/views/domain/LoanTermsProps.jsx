/* FM: Component defining inputs UI for Loan Terms Sheet */

import React from 'react';
import { useStagedModel } from '../../utils/useStagedModel';
import { PeriodUnit } from '../../models/Definitions';
import styles from './LoanTermsProps.module.css';

export function LoanTermsProps({ initialTerms, onCalculate }) {
    console.log('LoanTermsProps rendered with terms ', initialTerms);

    const { staged, update, commit } = useStagedModel(initialTerms);
    const terms = staged;

    const units = Object.entries(PeriodUnit);

    const isReadOnly = (field) => terms.fieldToCalculate === field;

    const updateField = (field, value) => {
        update(field, value);
    };

    const selectFieldToCalculate = (field) => {
        update('fieldToCalculate', field);
    };

    const handleCalculate = () => {
        onCalculate(commit());
    };

    return (
        <div className={styles['loan-terms-grid']}>
            {/* Principal */}
            <label>Principal:</label>
            <input
                type="radio"
                checked={terms.fieldToCalculate === 'principalAmount'}
                onChange={() => selectFieldToCalculate('principalAmount')}
            />
            <input
                type="number"
                step="10000"
                value={terms.principalAmount ?? ''}
                onChange={(e) => updateField('principalAmount', +e.target.value)}
                readOnly={isReadOnly('principalAmount')}
            />
            <div />

            {/* Payment */}
            <label>Payment:</label>
            <input
                type="radio"
                checked={terms.fieldToCalculate === 'paymentAmount'}
                onChange={() => selectFieldToCalculate('paymentAmount')}
            />
            <input
                type="number"
                step="10"
                value={terms.paymentAmount ?? ''}
                onChange={(e) => updateField('paymentAmount', +e.target.value)}
                readOnly={isReadOnly('paymentAmount')}
            />
            <select
                value={terms.paymentFreqUnit}
                onChange={(e) => updateField('paymentFreqUnit', e.target.value)}
            >
                {units.map(([key, u]) => (
                    <option key={key} value={key}>{u.freqLabel}</option>
                ))}
            </select>

            {/* Interest Rate */}
            <label>Annual Percent Rate:</label>
            <div />
            <input
                type="number"
                step="0.01"
                value={terms.annualInterestRate ?? ''}
                onChange={(e) => updateField('annualInterestRate', +e.target.value)}
                readOnly={isReadOnly('annualInterestRate')}
            />
            <div />

            {/* Term Length */}
            <label>Term Length:</label>
            <input
                type="radio"
                checked={terms.fieldToCalculate === 'termLength'}
                onChange={() => selectFieldToCalculate('termLength')}
            />
            <input
                type="number"
                value={terms.termLength ?? ''}
                onChange={(e) => updateField('termLength', +e.target.value)}
                readOnly={isReadOnly('termLength')}
            />
            <select
                value={terms.termLengthUnit}
                onChange={(e) => updateField('termLengthUnit', e.target.value)}
            >
                {units.map(([key, u]) => (
                    <option key={key} value={key}>{u.plural}</option>
                ))}
            </select>

            {/* Normalized Term */}
            <label>Term Length (Norm):</label>
            <div />
            <input
                type="number"
                value={terms.termLengthNorm ?? ''}
                readOnly
            />
            <div />

            {/* Calculate Button */}
            <div /> 
            <div /> 
            <button onClick={handleCalculate}>Calculate</button>
            <div />
        </div>
    );
}
