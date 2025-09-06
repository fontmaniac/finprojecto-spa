/* FM: Component for viewing/editing props of a Loan Slice using staged model */

import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useStagedModel } from '../../utils/useStagedModel';
import styles from './LoanSliceProps.module.css'; // optional styling
import { FrequencyDropDown as FrequencyDropDownImpl } from './FrequencyDropDown';

function Highlightable({ value, className }) {
    const [phase, setPhase] = useState(0);
    const prevRef = useRef(value);

    useEffect(() => {
        if (value !== prevRef.current) {
            prevRef.current = value;

            flushSync(() => {
                setPhase(1); // snap to yellow
            });

            requestAnimationFrame(() => {
                setPhase(2); // fade to transparent
                setTimeout(() => setPhase(0), 2000); // cleanup
            });
        }
    }, [value]);

    const getClass = (phase) => {
        if (phase === 1) return styles['highlight-phase-1'];
        if (phase === 2) return styles['highlight-phase-2'];
        return '';
    };

    const combinedClassName = `${getClass(phase)} ${className || ''}`.trim();

    return (
        <div className={combinedClassName}>
            {value}
        </div>
    );
}


export function LoanSliceProps({ slice, onUpdate, onIndexChange, completeSlice }) {
    const { staged, updateAll, commit, reset, isDirty } = useStagedModel(slice);
    console.log('LoanSliceProps "staged" = ', staged);

    const handleFieldChange = (field) => (e) => {
        updateAll(prev => {
            const updatedSlice = { ...prev, [field]: +e.target.value };
            console.log('handleFieldChange, updatedSlice', updatedSlice);
            const completedSlice = completeSlice(updatedSlice);
            console.log('handleFieldChange, completedSlice', updatedSlice);
            return completedSlice;
        });
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
            <Highlightable value={staged.repayment.toFixed(2)} className={styles['red-bordered']}/>
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
            <Highlightable value={staged.periodInterestRate.toFixed(4)} />
            <FrequencyDropDown />


            <label>Interest Charged:</label>
            <div />
            <Highlightable value={formatCurrency(staged.interestCharged) ?? '—'} />
            <div />

            <label>End Loan Balance:</label>
            <div />
            <Highlightable value={formatCurrency(staged.endLoanBalance) ?? '—'} />
            <div />

            <label>End Offset Balance:</label>
            <div />
            <Highlightable value={formatCurrency(staged.endOffsetBalance) ?? '—'} />
            <div />

            <label>Total Repayment (after):</label>
            <div />
            <Highlightable value={formatCurrency(staged.totalRepaymentsAtEnd)} />
            <div />

            <label>Total Interest (after):</label>
            <div />
            <Highlightable value={formatCurrency(staged.totalInterestAtEnd)} />
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

