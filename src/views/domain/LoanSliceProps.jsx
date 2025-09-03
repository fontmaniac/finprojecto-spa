/* FM: Component for viewing/editing props of a Loan Slice using staged model */

import React from 'react';
import { useStagedModel } from '../../utils/useStagedModel';
import styles from './LoanSliceProps.module.css'; // optional styling

export function LoanSliceProps({ slice, onUpdate, onIndexChange }) {
    console.log('LoanSliceProps rendered with slice ', slice);
    const { staged, update, commit, reset, isDirty } = useStagedModel(slice);
    console.log('LoanSliceProps "staged" = ', staged);

    if (!slice) return null;

    const handleFieldChange = (field) => (e) => {
        update(field, +e.target.value);
    };

    const handleUpdate = () => {
        const updated = commit();
        onUpdate(updated.sliceIndex, {
            repayment: updated.repayment,
            extraRepayment: updated.extraRepayment,
            offsetTopUp: updated.offsetTopUp,
        });
        reset(); // optional: clear dirty flag after update
    };

    const isReadOnly = (field) =>
        !['repayment', 'extraRepayment', 'offsetTopUp'].includes(field);

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
        roundingMode: 'ceil'
    });

    const formatCurrency = (num) =>
        num
        ? formatter.format(Math.ceil(num))
        : null;

    return (
        <div className={styles['loan-slice-grid']}>
            <label>Slice Index:</label>
            <div />
            <div className={styles['index-control']}>
                <button onClick={() => onIndexChange(staged.sliceIndex - 1)} disabled={isDirty}>{'<'}</button>
                <span>{staged.sliceIndex}</span>
                <button onClick={() => onIndexChange(staged.sliceIndex + 1)} disabled={isDirty}>{'>'}</button>
            </div>

            <label>Start Loan Balance:</label>
            <div />
            <div>{formatCurrency(staged.startLoanBalance)}</div>

            <label>Start Offset Balance:</label>
            <div />
            <div>{formatCurrency(staged.startOffsetBalance) ?? '—'}</div>

            <label>Repayment:</label>
            <div />
            <input
                type="number"
                step="10"
                value={staged.repayment}
                onChange={handleFieldChange('repayment')}
                readOnly={isReadOnly('repayment')}
            />

            <label>Extra Repayment:</label>
            <div />
            <input
                type="number"
                step="10"
                value={staged.extraRepayment}
                onChange={handleFieldChange('extraRepayment')}
                readOnly={isReadOnly('extraRepayment')}
            />

            <label>Offset Top-Up:</label>
            <div />
            <input
                type="number"
                step="10"
                value={staged.offsetTopUp}
                onChange={handleFieldChange('offsetTopUp')}
                readOnly={isReadOnly('offsetTopUp')}
            />

            <label>Period Interest Rate:</label>
            <div />
            <div>{staged.periodInterestRate.toFixed(4)}</div>

            <label>Interest Charged:</label>
            <div />
            <div>{formatCurrency(staged.interestCharged) ?? '—'}</div>

            <label>End Loan Balance:</label>
            <div />
            <div>{formatCurrency(staged.endLoanBalance) ?? '—'}</div>

            <label>End Offset Balance:</label>
            <div />
            <div>{formatCurrency(staged.endOffsetBalance) ?? '—'}</div>

            <div />
            <div />
            <div className={styles['button-row']}>
                <button onClick={handleUpdate} disabled={!isDirty}>Update</button>
                <button onClick={reset} disabled={!isDirty}>Reset</button>
            </div>
        </div>
    );
}

