/* FM: Component for viewing/editing props of a Loan Slice using staged model */

import React, { useState, useEffect, useRef } from 'react';
import { useStagedModel } from '../../utils/useStagedModel';
import styles from './LoanSliceProps.module.css'; // optional styling
import { PeriodUnit } from '../../models/Definitions';
import { FrequencyDropDown as FrequencyDropDownImpl } from './FrequencyDropDown';

export function LoanSliceProps({ slice, onUpdate, onIndexChange, completeSlice }) {
    const { staged, update, commit, reset, isDirty } = useStagedModel(slice);
    console.log('LoanSliceProps "staged" = ', staged);


    const [derivedSlice, setDerivedSlice] = useState(staged);    
    const changedFieldsRef = useRef(new Set());

    useEffect(() => {
        console.log('useEffect: derivedSlice recompute commenced');
        const newDerived = completeSlice(staged);
        const changedFields = new Set();

        for (const key of Object.keys(newDerived)) {
            if (derivedSlice[key] !== newDerived[key]) {
                changedFields.add(key);
            }
        }

        changedFieldsRef.current = changedFields;
        setDerivedSlice(newDerived);
        console.log('useEffect: derivedSlice recomputed and set');
    }, [staged]);


    const handleFieldChange = (field) => (e) => {
        update(field, +e.target.value);
    };

    const handleUpdate = () => {
        const updated = commit();
        onUpdate(updated.sliceIndex, {
            repayment: updated.repayment,
            extraRepayment: updated.extraRepayment,
            offsetTopUp: updated.offsetTopUp,
            annualInterestRate: updated.annualInterestRate
        });
        reset(); // optional: clear dirty flag after update
    };

    const isReadOnly = (field) =>
        !['repayment', 'extraRepayment', 'offsetTopUp', 'annualInterestRate'].includes(field);

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
        roundingMode: 'ceil'
    });

    const formatCurrency = (num) =>
        num
        ? formatter.format(Math.ceil(num))
        : null;

    const FrequencyDropDown = () => { 
        return (<FrequencyDropDownImpl 
            value={staged.paymentFreqUnit}
            disabled={true}/>)
        };

    return (
        <div className={styles['loan-slice-grid']}>
            <label>Slice Index:</label>
            <div />
            <div className={styles['index-control']}>
                <button onClick={() => onIndexChange(staged.sliceIndex - 1)} disabled={isDirty}>{'<'}</button>
                <span>{staged.sliceIndex}</span>
                <button onClick={() => onIndexChange(staged.sliceIndex + 1)} disabled={isDirty}>{'>'}</button>
            </div>
            <div />

            <label>Start Loan Balance:</label>
            <div />
            <div>{formatCurrency(staged.startLoanBalance)}</div>
            <div />

            <label>Start Offset Balance:</label>
            <div />
            <div>{formatCurrency(staged.startOffsetBalance) ?? '—'}</div>
            <div />

            <label>Total Repayment (before):</label>
            <div />
            <div>{formatCurrency(staged.totalRepaymentsAtStart)}</div>
            <div />

            <label>Total Interest (before):</label>
            <div />
            <div>{formatCurrency(staged.totalInterestAtStart)}</div>
            <div />


            <label>Repayment:</label>
            <div />
            <input
                type="number"
                step="10"
                value={staged.repayment}
                onChange={handleFieldChange('repayment')}
                readOnly={isReadOnly('repayment')}
            />
            <FrequencyDropDown />

            <label>Extra Repayment:</label>
            <div />
            <input
                type="number"
                step="10"
                value={staged.extraRepayment}
                onChange={handleFieldChange('extraRepayment')}
                readOnly={isReadOnly('extraRepayment')}
            />
            <FrequencyDropDown />

            <label>Offset Top-Up:</label>
            <div />
            <input
                type="number"
                step="10"
                value={staged.offsetTopUp}
                onChange={handleFieldChange('offsetTopUp')}
                readOnly={isReadOnly('offsetTopUp')}
            />
            <FrequencyDropDown />

            <label>Annual Interest Rate:</label>
            <div />
            <input
                type="number"
                step="0.01"
                value={staged.annualInterestRate}
                onChange={handleFieldChange('annualInterestRate')}
                readOnly={isReadOnly('annualInterestRate')}
            />
            <div />

            <div /><div /><div /><div />
            <div /><div /><div /><div />

            <label>Period Interest Rate:</label>
            <div />
            <div>{staged.periodInterestRate.toFixed(4)}</div>
            <FrequencyDropDown />


            <label>Interest Charged:</label>
            <div />
            <div>{formatCurrency(derivedSlice.interestCharged) ?? '—'}</div>
            <div />

            <label>End Loan Balance:</label>
            <div />
            <div>{formatCurrency(derivedSlice.endLoanBalance) ?? '—'}</div>
            <div />

            <label>End Offset Balance:</label>
            <div />
            <div>{formatCurrency(derivedSlice.endOffsetBalance) ?? '—'}</div>
            <div />

            <label>Total Repayment (after):</label>
            <div />
            <div>{formatCurrency(derivedSlice.totalRepaymentsAtEnd)}</div>
            <div />

            <label>Total Interest (after):</label>
            <div />
            <div>{formatCurrency(derivedSlice.totalInterestAtEnd)}</div>
            <div />

            <div />
            <div />
            <div className={styles['button-row']}>
                <button onClick={handleUpdate} disabled={!isDirty}>Update</button>
                <button onClick={reset} disabled={!isDirty}>Reset</button>
            </div>
            <div />
        </div>
    );
}

