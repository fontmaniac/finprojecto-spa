/* FM: Visualisation of Loan Simulation (Slices) with Plotly */

import React, { useRef, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min';

export function LoanSimulationPlotlyRender({ slices }) {

    const plotRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (plotRef.current && plotRef.current.el) {
                const plotElement = plotRef.current.el;
                if (plotElement) {
                    Plotly.Plots.resize(plotElement);
                }
            }
        };

        // Subscribe to your custom resize event
        window.addEventListener('horizontalResize', handleResize);

        return () => {
            window.removeEventListener('horizontalResize', handleResize);
        };
    }, []);


    if (!slices || slices.length === 0) return null;

    console.log('LoanSimulationRender called with slices ', slices.length);

    const sliceIndices = slices.map(slice => slice.sliceIndex);
    const loanBalances = slices.map(slice => slice.startLoanBalance);
    const offsetBalances = slices.map(slice => slice.startOffsetBalance);
    const interestCharges = slices.map(slice => slice.interestCharged);

    return (
        <Plot ref={plotRef}
            data={[
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
                }

            ]}
            layout={{
                title: 'Loan Simulation Slices',
                barmode: 'group',
                xaxis: {
                    // automargin: true,
                    // tickangle: -45,
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
            }}
            config={{
                responsive: true,
                scrollZoom: true,
                displayModeBar: true,
                displaylogo: false
            }}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
