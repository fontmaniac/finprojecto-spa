/* FM: Visualisation of Loan Simulation (Slices) with Plotly */

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useImperativeModel } from '../../utils/useImperativeModel';
import styles from './LoanSimulationPlotlyRender.module.css';

export function LoanSimulationPlotlyRender({ slices, selectedSliceIdx, onSliceSelect }) {
    console.log('LoanSimulationPlotlyRender called');

    function applyFlashingHighlightImpl() {
        if (!plotRef.current) return;

        const forTraceGroupPaths = (traceGroup, doThis) => {
            const pointGroups = traceGroup.querySelectorAll('.point');
            pointGroups.forEach((pointGroup) => {
                const path = pointGroup.querySelector('path');
                if (path) doThis(path);
            });
        };

        const traceGroups = plotRef.current.querySelectorAll('.trace.bars');
        traceGroups.forEach((traceGroup) => {
            forTraceGroupPaths(traceGroup, (path) => path.classList.remove(styles['flashing-highlight']));
        });

        console.log('traceGroups', traceGroups);

        const highlightA = traceGroups[0];
        console.log('highlightA', highlightA);
        if (highlightA) forTraceGroupPaths(highlightA, (path) => path.classList.add(styles['flashing-highlight']));
        const highlightB = traceGroups[6];
        console.log('highlightB', highlightB);
        if (highlightB) forTraceGroupPaths(highlightB, (path) => path.classList.add(styles['flashing-highlight']));
    }

    function applyFlashingHighlight() { 
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                applyFlashingHighlightImpl();
            })    
        })
    };


    const calcMaxDomain = (arrays) => slices.map((_, i) =>
        Math.max(...arrays.map(arr => arr[i])));

    const loanBalances = slices.map(slice => slice.startLoanBalance);
    const offsetBalances = slices.map(slice => slice.startOffsetBalance);
    const totalRepaymentsToDate = slices.map(slice => slice.totalRepaymentsAtStart);
    const totalInterestToDate = slices.map(slice => slice.totalInterestAtStart);

    const maxDomainA = calcMaxDomain([loanBalances, offsetBalances, totalRepaymentsToDate, totalInterestToDate]);

    const interestCharges = slices.map(slice => slice.interestCharged);
    const repayments = slices.map(slice => slice.repayment);
    const extraRepayments = slices.map(slice => slice.extraRepayment);
    const offsetTopUps = slices.map(slice => slice.offsetTopUp);

    const maxDomainB = calcMaxDomain([interestCharges, repayments, extraRepayments, offsetTopUps]);

    const render = (plotRef) => {
        if (!slices || slices.length === 0 || !plotRef.current) return;

        const sliceIndices = slices.map(slice => slice.sliceIndex);

        // Attention: The following is shared between Domain A and Domain B, as both consist of exactly four value-traces.
        // If this symmetry is broken, each domain needs its own definitions to maintain a consistent layout.
        const barWidth = 0.225;
        const interactivityBarWidth = 1.0;
        const highlightBarWidth = 1.1;
        const bargap = null;
        const bargroupgap = null;

        const makeInteractionTrace = (maxDomain, yaxis) => { return {
            x: sliceIndices,
            y: maxDomain,
            offset: -0.5,
            customdata: sliceIndices,
            type: 'bar',
            name: 'Click Capture Overlay',
            marker: { color: 'rgba(0,0,0,0)' },
            opacity: 0,
            hoverinfo: 'text',
            hovertext: sliceIndices.map(i => `Slice ${i}: Click to inspect`),
            width: interactivityBarWidth,
            yaxis: yaxis,
            showlegend: false
        }};

        const makeHighlightTrace = (maxDomain, yaxis) => { 
            const maxY = Math.max(...maxDomain);
            return {
                x: selectedSliceIdx != null ? [selectedSliceIdx] : [],
                y: selectedSliceIdx != null ? [maxY] : [],
                type: 'bar',
                name: 'Selected Slice Highlight',
                marker: { color: 'rgba(128,128,128,0.3)' },
                width: highlightBarWidth,
                yaxis: yaxis,
                hoverinfo: 'skip',
                showlegend: false,
                customdata: ['fake-cursor']
            };
        };

        const interactionTraceA = makeInteractionTrace(maxDomainA, 'y');
        const highlightTraceA = makeHighlightTrace(maxDomainA, 'y');

        const interactionTraceB = makeInteractionTrace(maxDomainB, 'y2');
        const highlightTraceB = makeHighlightTrace(maxDomainB, 'y2');

        const data = [
            highlightTraceA,
            interactionTraceA,
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
            highlightTraceB,
            interactionTraceB,
            {
                x: sliceIndices,
                y: interestCharges,
                offset: -0.45,
                type: 'bar',
                name: 'Interest Charged',
                marker: { color: 'rgba(83, 21, 216, 0.7)' },
                width: barWidth,
                yaxis: 'y2',
                hoverinfo: 'skip'
            },
            {
                x: sliceIndices,
                y: repayments,
                offset: -0.225,
                type: 'bar',
                name: 'Repayment',
                marker: { color: '#ffff00' },
                width: barWidth,
                yaxis: 'y2',
                hoverinfo: 'skip'
            },
            {
                x: sliceIndices,
                y: extraRepayments,
                offset: 0.0,
                type: 'bar',
                name: 'Extra Repayment',
                marker: { color: '#ff9500ff' },
                width: barWidth,
                yaxis: 'y2',
                hoverinfo: 'skip'
            },
            {
                x: sliceIndices,
                y: offsetTopUps,
                offset: +0.225,
                type: 'bar',
                name: 'Offset Top-Up',
                marker: { color: '#09c03aff' },
                width: barWidth,
                yaxis: 'y2',
                hoverinfo: 'skip'
            }
        ];

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

            if (selectedSliceIdx != null && selectedSliceIdx != undefined) applyFlashingHighlight();
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

        const maxYA = Math.max(...maxDomainA);

        Plotly.restyle(plotRef.current, {
            x: [[selectedSliceIdx]],
            y: [[maxYA]]
        }, [0]);

        const maxYB = Math.max(...maxDomainB);

        Plotly.restyle(plotRef.current, {
            x: [[selectedSliceIdx]],
            y: [[maxYB]]
        }, [6]);

        applyFlashingHighlight();        
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
