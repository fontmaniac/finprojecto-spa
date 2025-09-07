import React from 'react';
import layout from '../primitives/Layout.module.css';
import styles from './LoanSimulationTabularRender.module.css';
import { DataGrid } from 'react-data-grid';
import { Columns } from '../../models/LoanSimulationModel.js'

export function LoanSimulationTabularRender({ slices, selectedSliceIdx, onSliceSelect }) {
    console.log('LoanSimulationTabularRender rendered, slices', slices);

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
        roundingMode: 'ceil'
    });

    const formatCurrency = (num) =>
        typeof num === 'number' ? formatter.format(Math.ceil(num)) : '—';

    const rows = slices.map(slice => ({
        ...slice,
        sliceIndex: slice.sliceIndex,
        startLoanBalance: formatCurrency(slice.startLoanBalance),
        startOffsetBalance: formatCurrency(slice.startOffsetBalance),
        totalRepaymentsAtStart: formatCurrency(slice.totalRepaymentsAtStart),
        totalInterestAtStart: formatCurrency(slice.totalInterestAtStart),
        repayment: slice.repayment.toFixed(2),
        extraRepayment: slice.extraRepayment,
        offsetTopUp: slice.offsetTopUp,
        annualInterestRate: slice.annualInterestRate,
        periodInterestRate: slice.periodInterestRate?.toFixed(4),
        interestCharged: formatCurrency(slice.interestCharged),
        endLoanBalance: formatCurrency(slice.endLoanBalance),
        endOffsetBalance: formatCurrency(slice.endOffsetBalance),
        totalRepaymentsAtEnd: formatCurrency(slice.totalRepaymentsAtEnd),
        totalInterestAtEnd: formatCurrency(slice.totalInterestAtEnd),
        isModified: slice.isModified, // custom flag for styling
    }));

    const getRowStyle = (row) =>
        row.isModified ? styles['modified-row'] : 
        row.sliceIndex == selectedSliceIdx ? styles['selected-row'] : 
        '';

    return (
        <div className={layout['fillContainer']}>
            <DataGrid
                columns={Columns}
                rows={rows}
                rowClass={(row) => getRowStyle(row)}
                className={layout['fillContainerScrollable']}
                onRowClick={(row) => {
                    console.log('onRowClick', row);
                    onSliceSelect(row.sliceIndex); 
                }}
                onCellClick={(args) => {
                    console.log('onCellClick', args);
                    const { row } = args;
                    onSliceSelect(row.sliceIndex); 
                }}                
            />

        </div>
    );
}
