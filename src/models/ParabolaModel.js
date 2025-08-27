/* FM: Domain model and computation logic for parabola defined by y = ax^2 + bx + c */

/**
 * @typedef {Object} ParabolaInputs
 * @property {number} a
 * @property {number} b
 * @property {number} c
 */

/**
 * @typedef {Object} Circle
 * @property {string} key
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 * @property {string} color
 */

/**
 * @typedef {Object} ParabolaModel
 * @property {ParabolaInputs} inputs
 * @property {number} tipX
 * @property {number} tipY
 * @property {Array<{x: number, y: number}>} points
 * @property {Array<Circle>} circles
 * @property {number} viewBoxY
 * @property {number} scale
 * @property {number} width
 * @property {number} height
 * @property {Object} origin
 * @property {boolean} showOriginX
 * @property {boolean} showOriginY
 * @property {boolean} bottomAnchor
 */

export function makeDefaultCircle() {
    return { key: 'dummy', x: 0, y: 0, radius: 1, color: '#000000' };
}

export function makeDefaultInputs() {
    return { a: 1, b: 0, c: 0 };
}

export function updateCircle(parabola, circle) {
    return {...parabola, circles: [...parabola.circles.filter(c => c.key != circle.key), {...circle}] }
}

export function computeParabola(inputs) {
    console.log('Compute parabola with:', inputs);

    const { a, b, c } = inputs;
    const tipX = -b / (2 * a);
    const tipY = a * tipX ** 2 + b * tipX + c;

    const rangeX = 5;
    const step = 0.1;
    const points = [];
    const circles = [];

    for (let x = tipX - rangeX; x <= tipX + rangeX; x += step) {
        const y = a * x ** 2 + b * x + c;
        points.push({ x, y });
    }

    let circleIndex = 0;
    for (let x = tipX - rangeX; x <= tipX + rangeX; x += 0.5) {
        const y = a * x ** 2 + b * x + c;
        circles.push({
            key: `circle-${circleIndex++}`,
            x,
            y,
            radius: 1,
            color: 'red'
        });
    }

    const yMin = Math.min(...points.map(p => p.y));
    const yMax = Math.max(...points.map(p => p.y));
    const padY = 1;
    const bottomAnchor = a > 0;
    const viewBoxY = bottomAnchor ? yMin - padY : yMax + padY;

    const scale = 20;
    const width = 10 * scale;
    const height = 10 * scale;

    const originX = (0 - tipX + 5) * scale;
    const originY = height - (0 - viewBoxY) * scale;
    const showOriginX = originX >= 0 && originX <= width;
    const showOriginY = originY >= 0 && originY <= height;

    return {
        inputs,
        tipX,
        tipY,
        points,
        circles,
        viewBoxY,
        scale,
        width,
        height,
        origin: { x: originX, y: originY },
        showOriginX,
        showOriginY,
        bottomAnchor
    };
}
