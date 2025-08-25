/* FM: Obviously, the Main View of the application. Supposed to host a representation generated from parameters specified in NavBar. */

import layout from '../components/Layout.module.css';
import styles from './MainView.module.css';
import React, { useState, useEffect } from 'react';

export function MainView({ a, b, c, trigger }) {
    const [svgContent, setSvgContent] = useState(null);

    const generateGraph = () => {
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX ** 2 + b * vertexX + c;

        const rangeX = 5;
        const step = 0.1;
        const points = [];

        for (let x = vertexX - rangeX; x <= vertexX + rangeX; x += step) {
            const y = a * x ** 2 + b * x + c;
            points.push({ x, y });
        }

        const yMin = Math.min(...points.map(p => p.y));
        const yMax = Math.max(...points.map(p => p.y));
        const padY = 1;
        const viewBoxY = a > 0 ? yMin - padY : yMax + padY;

        const scale = 20;
        const width = 10 * scale;
        const height = 10 * scale;

        const svgPoints = points.map(p => {
            const px = (p.x - vertexX + 5) * scale;
            const py = height - (p.y - viewBoxY) * scale;
            return `${px},${py}`;
        }).join(' ');

        const originX = (0 - vertexX + 5) * scale;
        const originY = height - (0 - viewBoxY) * scale;
        const showOriginX = originX >= 0 && originX <= width;
        const showOriginY = originY >= 0 && originY <= height;

        const axisX = showOriginY
            ? <line x1="0" y1={originY} x2={width} y2={originY} stroke="gray" />
            : <line x1="0" y1={height} x2={width} y2={height} stroke="gray" />;
        const axisY = showOriginX
            ? <line x1={originX} y1="0" x2={originX} y2={height} stroke="gray" />
            : <line x1="0" y1="0" x2="0" y2={height} stroke="gray" />;

        const label = (x, y, anchor = 'middle') => (
            <text x={x} y={y} fontSize="10" textAnchor={anchor} fill="black">
                ({(x / scale - 5 + vertexX).toFixed(1)}, {(viewBoxY + (height - y) / scale).toFixed(1)})
            </text>
        );

        const labels = [
            label((vertexX - vertexX + 5) * scale, height - (vertexY - viewBoxY) * scale - 5),
            label(0, height - 5, 'start'),
            label(width, height - 5, 'end'),
            label(originX, 10, 'middle'),
            label(originX, height / 2, 'middle'),
            label(originX, height - 10, 'middle'),
        ];

        setSvgContent(
            <svg preserveAspectRatio="none" width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} overflow="hidden">
                <polyline points={svgPoints} fill="none" stroke="blue" strokeWidth="2" />
                {axisX}
                {axisY}
                {labels}
            </svg>
        );
    };

    useEffect(() => {
        if (trigger) generateGraph();
    }, [trigger, a, b, c]);

    return (
        <div className={`${layout.fillContainer} ${styles.main}`}>
            {svgContent || <p>Press "init" to generate graph</p>}
        </div>
    );
}


