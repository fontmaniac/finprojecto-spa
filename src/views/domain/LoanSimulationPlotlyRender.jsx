/* FM: Visualisation of Loan Simulation (Slices) with Plotly */

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useImperativeModel } from '../../utils/useImperativeModel';
import styles from './LoanSimulationPlotlyRender.module.css';

export function LoanSimulationPlotlyRender({ slices, selectedSliceIdx, onSliceSelect }) {
    console.log('LoanSimulationPlotlyRender called');

    function applyFlashingHighlightImpl(plotRef) {
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

    function applyFlashingHighlight(plotRef) { 
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                applyFlashingHighlightImpl(plotRef);
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

        const modMarks = slices.filter(slice => slice.isModified).map(slice => slice.sliceIndex);
        const interestRates = slices.map(slice => slice.annualInterestRate);

        const makeModMarkTrace = (modMarks, maxDomain, yaxis, shape = 'diamond') => {
            const maxY = Math.max(...maxDomain);
            const yValues = modMarks.map(() => maxY * 1.05); // Slightly above max

            return {
                x: modMarks,
                y: yValues,
                mode: 'markers',
                type: 'scatter',
                marker: {
                    symbol: shape === 'diamond' ? 'diamond' : 'circle',
                    size: 10,
                    color: 'red'
                },
                yaxis: yaxis,
                hoverinfo: 'skip',
                name: 'Modified Slice Mark',
                showlegend: false
            };
        };


        // Attention: The following is shared between Domain A and Domain B, as both consist of exactly four value-traces.
        // If this symmetry is broken, each domain needs its own definitions to maintain a consistent layout.
        const barWidth = 0.225;
        const interactivityBarWidth = 1.0;
        const highlightBarWidth = 1.1;
        const bargap = null;
        const bargroupgap = null;

        const makeInteractionTrace = (maxDomain, yaxis) => { 
            function makeTooltip(slice) {
                const pad = (label, width = 22) => label.padEnd(width, ' ');
                const fmt = (num, decimals = 2) => typeof num === 'number' ? num.toFixed(decimals) : '—';
                const fmtRate = (rate) => typeof rate === 'number' ? `${(rate * 100).toFixed(2)}%` : '—';
                const fmtInt = (num) => typeof num === 'number' ? Math.round(num).toLocaleString() : '—';
                const arrow = (start, end) => `${fmtInt(start)} -> ${fmtInt(end)}`;

                return [
                    `Slice ${fmtInt(slice?.sliceIndex)}`,
                    '------------------------------',
                    `${pad('Interest:')}${fmt(slice?.interestCharged)} (@${fmtRate(slice?.annualInterestRate)} annually)`,
                    `${pad('Nominal Repayment:')}${fmt(slice?.repayment)}`,
                    `${pad('Extra Repayment:')}${fmt(slice?.extraRepayment)}`,
                    `${pad('Offset Top Up:')}${fmt(slice?.offsetTopUp)}`,
                    '------------------------------',
                    `${pad('Balance:')}${arrow(slice?.startLoanBalance, slice?.endLoanBalance)}`,
                    `${pad('Offset:')}${arrow(slice?.startOffsetBalance, slice?.endOffsetBalance)}`,
                    `${pad('Total Repayment:')}${arrow(slice?.totalRepaymentsAtStart, slice?.totalRepaymentsAtEnd)}`,
                    `${pad('Total Interest:')}${arrow(slice?.totalInterestAtStart, slice?.totalInterestAtEnd)}`,
                    '------------------------------',
                    'Click to Inspect'
                ].join('<br>');
            }

            return {
                x: sliceIndices,
                y: maxDomain,
                offset: -0.5,
                customdata: slices,
                type: 'bar',
                name: 'Click Capture Overlay',
                marker: { color: 'rgba(0,0,0,0)' },
                opacity: 0,
                text: slices.map(s => makeTooltip(s)),
                hoverinfo: 'text',
                hovertemplate: '%{text}<extra></extra>',
                width: interactivityBarWidth,
                yaxis: yaxis,
                showlegend: false
            };
        };

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

        const makeValueTrace = (y, offset, name, color, yaxis) => {
            return {
                x: sliceIndices,
                y: y,
                offset: offset,
                type: 'bar',
                name: name,
                marker: { color: color },
                width: barWidth,
                yaxis: yaxis,
                hoverinfo: 'skip'
            };
        };

        const modMarkTrace = makeModMarkTrace(modMarks, maxDomainB, 'y2', 'diamond');

        const interestRateTrace = {
            x: sliceIndices,
            y: interestRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Interest Rate',
            line: {
                color: '#ff0000',
                width: 2
            },
            marker: {
                size: 4,
                color: '#ff0000'
            },
            yaxis: 'y3',
            hoverinfo: 'skip'
        };


        const data = [
            highlightTraceA,
            interactionTraceA,
            makeValueTrace(loanBalances, -0.45, 'Start Loan Balance', 'rgba(245, 58, 16, 0.7)', 'y'),
            makeValueTrace(offsetBalances, -0.225, 'Start Offset Balance', 'rgba(6, 246, 98, 0.7)', 'y'),
            makeValueTrace(totalRepaymentsToDate, 0.0, 'Total Repayments To Date', 'rgba(201, 12, 62, 0.7)', 'y'),
            makeValueTrace(totalInterestToDate, +0.225, 'Total Interest To Date', 'rgba(246, 6, 238, 0.7)', 'y'),
            highlightTraceB,
            interactionTraceB,
            modMarkTrace,
            makeValueTrace(interestCharges, -0.45, 'Interest Charged', 'rgba(83, 21, 216, 0.7)', 'y2'),
            makeValueTrace(repayments, -0.225, 'Repayment', '#ffff00', 'y2'),
            makeValueTrace(extraRepayments, 0.0, 'Extra Repayment', '#ff9500ff', 'y2'),
            makeValueTrace(offsetTopUps, 0.225, 'Offset Top-Up', '#168634ff', 'y2'),
            interestRateTrace
        ];

        const layout = {
            title: 'Loan Simulation Slices',
            hoverlabel: {
                font: {
                    family: 'Courier New, monospace',
                    size: 12,
                    color: '#ffffff'
                }
            },
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
            yaxis3: {
                title: 'Annual Interest Rate (%)',
                overlaying: 'y2',
                side: 'right',
                showgrid: false,
                zeroline: false,
                tickformat: '.1f'
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

            const slice = point.customdata;
            if (slice === null && slice === undefined) return;
            onSliceSelect(slice.sliceIndex);
        };

        Plotly.newPlot(plotRef.current, data, layout, config).then((plotlyInstance) => {
            plotlyInstance.on('plotly_click', handleClick);

            if (selectedSliceIdx != null && selectedSliceIdx != undefined) applyFlashingHighlight(plotRef);
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

        applyFlashingHighlight(plotRef);        
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
