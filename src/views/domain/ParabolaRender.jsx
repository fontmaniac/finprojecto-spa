/* FM: Domain-specific SVG renderer for parabola defined by y = ax^2 + bx + c */

import { useState, useRef, useEffect, useLayoutEffect } from 'react';

export function ParabolaRender({ parabola, onSelect }) {

    const {
        points,
        circles,
        tipX,
        tipY,
        viewBoxY,
        scale,
        width,
        height,
        origin,
        showOriginX,
        showOriginY,
        bottomAnchor
    } = parabola;

    console.log('ParabolaRender called with param ', parabola);

    const svgRef = useRef(null);
    const [xPixelPerUnit, setXPixelPerUnit] = useState(parabola.scale); // fallback scale
    const [yPixelPerUnit, setYPixelPerUnit] = useState(parabola.scale); // fallback scale

    // useLayoutEffect(() => {
    //     console.log('ParabolaRender useLayoutEffect called');
    //     if (!svgRef.current) return;

    //     const rect = svgRef.current.getBoundingClientRect();
    //     console.log('ParabolaRender useLayoutEffect measured rect ', rect);

    //     if (rect && parabola.width) {
    //         const xppu = rect.width / parabola.width;
    //         console.log('X PixelPerUnit computed at ', xppu);
    //         setXPixelPerUnit(xppu);
    //     }

    //     if (rect && parabola.height) {
    //         const yppu = rect.height / parabola.height;
    //         console.log('Y PixelPerUnit computed at ', yppu);
    //         setYPixelPerUnit(yppu);
    //     }

    // }, [parabola.width, parabola.height]);


    useEffect(() => {
        const updateScale = () => {
            const svg = svgRef.current;
            const ctm = svg.getScreenCTM(); // returns DOMMatrix

            console.log('ParabolaRender updateScale called, ctm = ', ctm);

            const scaleX = ctm.a * parabola.scale; // ctm.a is horizontal scale(logical unit → pixels)
            const scaleY = ctm.d * parabola.scale; // ctm.d is vertical scale

            setXPixelPerUnit(scaleX);
            setYPixelPerUnit(scaleY);

            // if (rect && parabola.width) {
            //     const xppu = rect.width / parabola.width;
            //     console.log('X PixelPerUnit computed at ', xppu);
            //     setXPixelPerUnit(xppu);
            // }

            // if (rect && parabola.height) {
            //     const yppu = rect.height / parabola.height;
            //     console.log('Y PixelPerUnit computed at ', yppu);
            //     setYPixelPerUnit(yppu);
            // }
        };

        console.log('ParabolaRender useEffect called');

        const svg = svgRef.current;
        if (!svg) return;

        const observer = new ResizeObserver(() => updateScale());

        observer.observe(svg);        

        return () => observer.disconnect();
    }, [parabola.scale]);


    const svgPoints = points.map(p => {
        const px = (p.x - tipX + 5) * scale;
        const py = bottomAnchor
            ? height - (p.y - viewBoxY) * scale
            : (viewBoxY - p.y) * scale;

        return `${px},${py}`;
    }).join(' ');

    const [dragged, setDragged] = useState(null);

    const handlePointerDown = (e, c) => {
        e.stopPropagation();
        setDragged({ key: c.key, startX: e.clientX, startY: e.clientY, origX: c.x, origY: c.y });
    };

    const handlePointerMove = (e) => {
        if (!dragged) return;
        const dx = (e.clientX - dragged.startX) / xPixelPerUnit;
        const dy = (e.clientY - dragged.startY) / yPixelPerUnit;

        setDragged(prev => ({ ...prev, deltaX: dx, deltaY: dy }));

        // const newCircle = {
        //     ...parabola.circles.find(c => c.key === dragged.key),
        //     x: dragged.origX + dx,
        //     y: dragged.origY - dy, // invert Y due to SVG coord system
        // };

        // onSelect?.(newCircle);
    };

    const handlePointerUp = () => {
        if (dragged) {
            const finalX = dragged.origX + (dragged.deltaX ?? 0);
            const finalY = dragged.origY - (dragged.deltaY ?? 0); // invert Y

            const updated = {
                ...parabola.circles.find(c => c.key === dragged.key),
                x: finalX,
                y: finalY,
            };

            onSelect?.(updated);
        }
        setDragged(null);
    };

    // Attach listeners to SVG root
    const svgProps = {
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerLeave: handlePointerUp,
    };

    const svgCircles = circles.map((c) => {
        const isDragging = dragged?.key === c.key;

        const cx = isDragging
            ? (dragged.origX + (dragged.deltaX ?? 0) - parabola.tipX + 5) * parabola.scale
            : (c.x - parabola.tipX + 5) * parabola.scale;

        const cy = isDragging
            ? parabola.bottomAnchor
                ? parabola.height - (dragged.origY - (dragged.deltaY ?? 0) - parabola.viewBoxY) * parabola.scale
                : (parabola.viewBoxY - (dragged.origY - (dragged.deltaY ?? 0))) * parabola.scale
            : parabola.bottomAnchor
                ? parabola.height - (c.y - parabola.viewBoxY) * parabola.scale
                : (parabola.viewBoxY - c.y) * parabola.scale;

        const r = c.radius * parabola.scale;

        return (
            <circle
                key={c.key}
                cx={cx}
                cy={cy}
                r={r}
                fill={c.color}
                stroke="black"
                strokeWidth="0.5"
                onPointerDown={(e) => handlePointerDown(e, c)}
            />
        );
    });


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
        label("l1", (tipX - tipX + 5) * scale, 
            bottomAnchor
            ? height - (tipY - viewBoxY) * scale - 5
            : (viewBoxY - tipY) * scale - 5),

        label("l2", 0, height - 5, 'start'),
        label("l3", width, height - 5, 'end'),
        label("l4", origin.x, 10, 'middle'),
        label("l5", origin.x, height / 2, 'middle'),
        label("l6", origin.x, height - 10, 'middle'),
    ];

    return (
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} overflow="hidden" {...svgProps}>
            <polyline points={svgPoints} fill="none" stroke="blue" strokeWidth="2" />
            {svgCircles}
            {axisX}
            {axisY}
            {labels}
        </svg>
    );
}
