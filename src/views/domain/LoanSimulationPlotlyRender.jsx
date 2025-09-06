/* FM: Visualisation of Loan Simulation (Slices) with Plotly */

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useImperativeModel } from '../../utils/useImperativeModel';
import styles from './LoanSimulationPlotlyRender.module.css';

export function LoanSimulationPlotlyRender({ slices, selectedSliceIdx, onSliceSelect }) {
    console.log('LoanSimulationPlotlyRender called');

    function applyFlashingHighlight() {
        if (!plotRef.current) return;

        const traceGroups = plotRef.current.querySelectorAll('.trace.bars');
        traceGroups.forEach((traceGroup) => {
            const pointGroups = traceGroup.querySelectorAll('.point');
            pointGroups.forEach((pointGroup) => {
                const path = pointGroup.querySelector('path');
                if (path) path.classList.remove(styles['flashing-highlight']);
            });
        });

        // Assuming highlight trace is the last one (or use index if known)
        const highlightTraceGroup = traceGroups[0];
        if (!highlightTraceGroup) return;

        const highlightPoints = highlightTraceGroup.querySelectorAll('.point');
        highlightPoints.forEach((pointGroup) => {
            const path = pointGroup.querySelector('path');
            if (path) path.classList.add(styles['flashing-highlight']);
        });
    }

    const render = (plotRef) => {
        if (!slices || slices.length === 0 || !plotRef.current) return;

        const sliceIndices = slices.map(slice => slice.sliceIndex);

        const calcMaxDomain = (arrays) => slices.map((_, i) =>
            Math.max(...arrays.map(arr => arr[i])));

        const loanBalances = slices.map(slice => slice.startLoanBalance);
        const offsetBalances = slices.map(slice => slice.startOffsetBalance);
        const totalRepaymentsToDate = slices.map(slice => slice.totalRepaymentsAtStart);
        const totalInterestToDate = slices.map(slice => slice.totalInterestAtStart);

        const maxDomainA = calcMaxDomain([loanBalances, offsetBalances, totalRepaymentsToDate, totalInterestToDate]);
        const barWidth = 0.225;
        const interactivityBarWidth = 1.0;
        const highlightBarWidth = 1.1;
        const bargap = null;
        const bargroupgap = null;


        const interactionOverlayTrace = {
            x: sliceIndices,
            y: maxDomainA,
            offset: -0.5,
            customdata: sliceIndices,
            type: 'bar',
            name: 'Click Capture Overlay',
            marker: { color: 'rgba(0,0,0,0)' },
            opacity: 0,
            hoverinfo: 'text',
            hovertext: sliceIndices.map(i => `Slice ${i}: Click to inspect`),
            width: interactivityBarWidth,
            yaxis: 'y',
            showlegend: false
        };

        const interestCharges = slices.map(slice => slice.interestCharged);
        const repayments = slices.map(slice => slice.repayment);
        const extraRepayments = slices.map(slice => slice.extraRepayment);
        const offsetTopUps = slices.map(slice => slice.offsetTopUp);

        const data = [
            interactionOverlayTrace,
            {
                x: sliceIndices,
                y: loanBalances,
                offset: -0.45,
                type: 'bar',
                name: 'Start Loan Balance',
                marker: { color: 'rgba(245, 58, 16, 0.7)' },
                width: barWidth,
                yaxis: 'y',
                hoverinfo: 'skip'
            },
            {
                x: sliceIndices,
                y: offsetBalances,
                offset: -0.225,
                type: 'bar',
                name: 'Start Offset Balance',
                marker: { color: 'rgba(6, 246, 98, 0.7)' },
                width: barWidth,
                yaxis: 'y',
                hoverinfo: 'skip'
            },
            {
                x: sliceIndices,
                y: totalRepaymentsToDate,
                offset: +0,
                type: 'bar',
                name: 'Total Repayments To Date',
                marker: { color: 'rgba(201, 12, 62, 0.7)' },
                width: barWidth,
                yaxis: 'y',
                hoverinfo: 'skip'
            },
            {
                x: sliceIndices,
                y: totalInterestToDate,
                offset: +0.225,
                type: 'bar',
                name: 'Total Interest To Date',
                marker: { color: 'rgba(246, 6, 238, 0.7)' },
                width: barWidth,
                yaxis: 'y',
                hoverinfo: 'skip'
            },
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

        // Inject highlight trace
        const maxY = Math.max(...maxDomainA);
        const highlightTrace = {
            x: selectedSliceIdx != null ? [selectedSliceIdx] : [],
            y: selectedSliceIdx != null ? [maxY] : [],
            type: 'bar',
            name: 'Selected Slice Highlight',
            marker: { color: 'rgba(128,128,128,0.3)' },
            width: highlightBarWidth,
            yaxis: 'y',
            hoverinfo: 'skip',
            showlegend: false,
            customdata: ['fake-cursor']
        };

        data.unshift(highlightTrace);

        const layout = {
            title: 'Loan Simulation Slices',
            barmode: 'group',
            bargap: bargap,
            bargroupgap: bargroupgap,
            xaxis: {
                title: 'Slice Index',
                tickmode: 'linear',
                tick0: 0,
                dtick: 12
            },
            yaxis: {
                title: 'Cumulative Balances ($)',
                domain: [0.35, 1],
                zeroline: false
            },
            yaxis2: {
                title: 'Per-Slice Deltas ($)',
                domain: [0, 0.3],
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

            const sliceIndex = point.customdata;
            if (sliceIndex === null && sliceIndex === undefined) return;
            onSliceSelect(sliceIndex);
        };

        Plotly.newPlot(plotRef.current, data, layout, config).then((plotlyInstance) => {
            plotlyInstance.on('plotly_click', handleClick);

            setTimeout(applyFlashingHighlight, 50);
        });
    };

    const clean = (plotRef) => {
        if (plotRef.current) {
            Plotly.purge(plotRef.current);
        }
    };

    const [plotRef, component] = useImperativeModel(render, clean, [slices, onSliceSelect]);

    useEffect(() => {
        if (!plotRef.current || selectedSliceIdx == null) return;

        const maxY = Math.max(
            ...slices.map((_, i) =>
                Math.max(
                    slices[i].startLoanBalance,
                    slices[i].startOffsetBalance,
                    slices[i].totalRepaymentsAtStart,
                    slices[i].totalInterestAtStart
                )
            )
        );

        Plotly.restyle(plotRef.current, {
            x: [[selectedSliceIdx]],
            y: [[maxY]]
        }, [0]);

        setTimeout(applyFlashingHighlight, 50);        
    }, [selectedSliceIdx, slices]);

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
