/* FM: Component defining inputs UI for Loan Terms Sheet */

import React from 'react';
import { useStagedModel } from '../../utils/useStagedModel';
import styles from './LoanTermsProps.module.css';
import { FrequencyDropDown } from './FrequencyDropDown';

export function LoanTermsProps({ initialTerms, onCalculate }) {
    console.log('LoanTermsProps rendered with terms ', initialTerms);

    const { staged, update, commit } = useStagedModel(initialTerms);
    const terms = staged;

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
            <FrequencyDropDown value={terms.paymentFreqUnit} disabled={false} onChange={(e) => updateField('paymentFreqUnit', e.target.value)} />

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
            <FrequencyDropDown value={terms.termLengthUnit} labelProp={'plural'} disabled={false} onChange={(e) => updateField('termLengthUnit', e.target.value)} />

            {/* Normalized Term */}
            <label>Term Length (Norm):</label>
            <div />
            <input
                type="number"
                value={terms.termLengthNorm ?? ''}
                readOnly
            />
            <div />

            <div /><div /><div /><div />
            <div /><div /><div /><div />

            {/* Initial Offset Amount*/}
            <label>Initial Offset:</label>
            <div />
            <input
                type="number"
                step="10000"
                value={terms.initialOffsetAmount ?? ''}
                onChange={(e) => updateField('initialOffsetAmount', +e.target.value)}
            />
            <div />

            {/* Regular Offset Top-Up:*/}
            <label>Offset Top-up:</label>
            <div />
            <input
                type="number"
                step="10"
                value={terms.offsetTopUpAmount ?? ''}
                onChange={(e) => updateField('offsetTopUpAmount', +e.target.value)}
            />
            <FrequencyDropDown disabled={true} value={terms.paymentFreqUnit} />

            {/* Regular Extra Repayments:*/}
            <label>Extra Repayment:</label>
            <div />
            <input
                type="number"
                step="10"
                value={terms.extraRepaymentAmount ?? ''}
                onChange={(e) => updateField('extraRepaymentAmount', +e.target.value)}
            />
            <FrequencyDropDown disabled={true} value={terms.paymentFreqUnit} />

            {/* Calculate Button */}
            <div /> 
            <div /> 
            <button onClick={handleCalculate}>Calculate</button>
            <div />
        </div>
    );
}
