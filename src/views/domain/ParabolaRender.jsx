// FM: Domain-specific SVG renderer for parabola defined by y = ax^2 + bx + c

export function ParabolaRender({ parabola }) {
    const {
        points,
        tipX,
        tipY,
        viewBoxY,
        scale,
        width,
        height,
        origin,
        showOriginX,
        showOriginY
    } = parabola;

    console.log('ParabolaRender called with param ', parabola);

    const svgPoints = points.map(p => {
        const px = (p.x - tipX + 5) * scale;
        const py = height - (p.y - viewBoxY) * scale;
        return `${px},${py}`;
    }).join(' ');

    const axisX = showOriginY
        ? <line x1="0" y1={origin.y} x2={width} y2={origin.y} stroke="gray" />
        : <line x1="0" y1={height} x2={width} y2={height} stroke="gray" />;
    const axisY = showOriginX
        ? <line x1={origin.x} y1="0" x2={origin.x} y2={height} stroke="gray" />
        : <line x1="0" y1="0" x2="0" y2={height} stroke="gray" />;

    const label = (key, x, y, anchor = 'middle') => (
        <text key={key} x={x} y={y} fontSize="10" textAnchor={anchor} fill="black">
            ({(x / scale - 5 + tipX).toFixed(1)}, {(viewBoxY + (height - y) / scale).toFixed(1)})
        </text>
    );

    const labels = [
        label("l1", (tipX - tipX + 5) * scale, height - (tipY - viewBoxY) * scale - 5),
        label("l2", 0, height - 5, 'start'),
        label("l3", width, height - 5, 'end'),
        label("l4", origin.x, 10, 'middle'),
        label("l5", origin.x, height / 2, 'middle'),
        label("l6", origin.x, height - 10, 'middle'),
    ];

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} overflow="hidden">
            <polyline points={svgPoints} fill="none" stroke="blue" strokeWidth="2" />
            {axisX}
            {axisY}
            {labels}
        </svg>
    );
}
