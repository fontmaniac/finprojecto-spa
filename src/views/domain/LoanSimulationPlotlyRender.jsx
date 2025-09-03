/* FM: Visualisation of Loan Simulation (Slices) with Plotly */

import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useImperativeModel } from '../../utils/useImperativeModel';

export function LoanSimulationPlotlyRender({ slices, onSliceSelect }) {
    console.log('LoanSimulationPlotlyRender called');

    const render = (plotRef) => {
        if (!slices || slices.length === 0 || !plotRef.current) return;

        const sliceIndices = slices.map(slice => slice.sliceIndex);
        const loanBalances = slices.map(slice => slice.startLoanBalance);
        const offsetBalances = slices.map(slice => slice.startOffsetBalance);
        const totalRepaymentsToDate = slices.map(slice => slice.totalRepaymentsAtStart);
        const totalInterestToDate = slices.map(slice => slice.totalInterestAtStart);
        const interestCharges = slices.map(slice => slice.interestCharged);
        const repayments = slices.map(slice => slice.repayment);
        const extraRepayments = slices.map(slice => slice.extraRepayment);
        const offsetTopUps = slices.map(slice => slice.offsetTopUp);

        const data = [
            // Domain A
            {
                x: sliceIndices,
                y: loanBalances,
                type: 'bar',
                name: 'Start Loan Balance',
                marker: { color: 'rgba(245, 58, 16, 0.7)' },
                yaxis: 'y'
            },
            {
                x: sliceIndices,
                y: offsetBalances,
                type: 'bar',
                name: 'Start Offset Balance',
                marker: { color: 'rgba(6, 246, 98, 0.7)' },
                yaxis: 'y'
            },
            {
                x: sliceIndices,
                y: totalRepaymentsToDate,
                type: 'bar',
                name: 'Total Repayments To Date',
                marker: { color: 'rgba(201, 12, 62, 0.7)' },
                yaxis: 'y'
            },
            {
                x: sliceIndices,
                y: totalInterestToDate,
                type: 'bar',
                name: 'Total Interest To Date',
                marker: { color: 'rgba(246, 6, 238, 0.7)' },
                yaxis: 'y'
            },

            // Domain B
            {
                x: sliceIndices,
                y: interestCharges,
                type: 'bar',
                name: 'Interest Charged',
                marker: { color: 'rgba(83, 21, 216, 0.7)' },
                yaxis: 'y2'
            },
            {
                x: sliceIndices,
                y: repayments,
                type: 'bar',
                name: 'Repayment',
                marker: { color: '#ffff00' },
                yaxis: 'y2'
            },
            {
                x: sliceIndices,
                y: extraRepayments,
                type: 'bar',
                name: 'Extra Repayment',
                marker: { color: '#ff9500ff' },
                yaxis: 'y2'
            },
            {
                x: sliceIndices,
                y: offsetTopUps,
                type: 'bar',
                name: 'Offset Top-Up',
                marker: { color: '#09c03aff' },
                yaxis: 'y2'
            }

        ];

        const layout = {
            title: 'Loan Simulation Slices',
            barmode: 'group',
            xaxis: {
                title: 'Slice Index',
                tickmode: 'linear',
                tick0: 0,
                dtick: 12
            },
            yaxis: {
                title: 'Cumulative Balances ($)',
                domain: [0.35, 1], // Top half
                zeroline: false
            },
            yaxis2: {
                title: 'Per-Slice Deltas ($)',
                domain: [0, 0.3], // Bottom third
                anchor: 'x',
                zeroline: false
            },
            margin: { t: 40, l: 60, r: 30, b: 60 },
            hovermode: 'closest',
            dragmode: 'zoom',
            autosize: true
        };

        const config = {
            responsive: true,
            scrollZoom: true,
            displayModeBar: true,
            displaylogo: false
        };

        const handleClick = (event) => {
            const point = event.points?.[0];
            if (!point) return;

            const sliceIndex = point.x;
            const traceName = point.data.name;

            console.log('Clicked slice:', sliceIndex, 'Trace:', traceName);
            onSliceSelect(sliceIndex);
        };

        Plotly.newPlot(plotRef.current, data, layout, config).then((plotlyInstance) => {
            plotlyInstance.on('plotly_click', handleClick);
        });
    };

    const clean = (plotRef) => {
        if (plotRef.current) {
            Plotly.purge(plotRef.current);
        }
    };

    const [plotRef, component] = useImperativeModel(render, clean, [slices, onSliceSelect]);

    useEffect(() => {
        const handleResize = () => {
            if (plotRef.current) {
                Plotly.Plots.resize(plotRef.current);
            }
        };

        window.addEventListener('horizontalResize', handleResize);
        return () => {
            window.removeEventListener('horizontalResize', handleResize);
        };
    }, []);

    if (!slices || slices.length === 0) return null;

    console.log('LoanSimulationRender called with slices ', slices.length);

    return component();
}
