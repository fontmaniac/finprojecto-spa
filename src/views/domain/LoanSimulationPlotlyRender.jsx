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
        const interestCharges = slices.map(slice => slice.interestCharged);
        const repayments = slices.map(slice => slice.repayment);
        const extraRepayments = slices.map(slice => slice.extraRepayment);

        const data = [
            {
                x: sliceIndices,
                y: loanBalances,
                type: 'bar',
                name: 'Start Loan Balance',
                marker: { color: 'rgba(245, 58, 16, 0.7)' }
            },
            {
                x: sliceIndices,
                y: offsetBalances,
                type: 'bar',
                name: 'Start Offset Balance',
                marker: { color: 'rgba(6, 246, 98, 0.7)' }
            },
            {
                x: sliceIndices,
                y: interestCharges,
                type: 'bar',
                name: 'Interest Charged',
                marker: { color: 'rgba(83, 21, 216, 0.7)' }
            },
            {
                x: sliceIndices,
                y: repayments,
                type: 'bar',
                name: 'Repayment',
                marker: { color: '#ffff00' }
            },
            {
                x: sliceIndices,
                y: extraRepayments,
                type: 'bar',
                name: 'Extra Repayment',
                marker: { color: '#ff9500ff' }
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
                title: 'Balance ($)',
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
