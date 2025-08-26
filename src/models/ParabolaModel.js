// FM: Domain model and computation logic for parabola defined by y = ax^2 + bx + c

/**
 * @typedef {Object} ParabolaInputs
 * @property {number} a
 * @property {number} b
 * @property {number} c
 */

export function makeDefaultInputs() {
    return { a: 1, b: 0, c: 0 };
}

/**
 * @typedef {Object} ParabolaModel
 * @property {ParabolaInputs} inputs
 * @property {number} tipX
 * @property {number} tipY
 * @property {Array<{x: number, y: number}>} points
 * @property {number} viewBoxY
 * @property {number} scale
 * @property {number} width
 * @property {number} height
 * @property {Object} origin
 * @property {boolean} showOriginX
 * @property {boolean} showOriginY
 */

export function computeParabola(inputs) {
    console.log('Compute parabola with:', inputs);

    const { a, b, c } = inputs;
    const tipX = -b / (2 * a);
    const tipY = a * tipX ** 2 + b * tipX + c;

    const rangeX = 5;
    const step = 0.1;
    const points = [];

    for (let x = tipX - rangeX; x <= tipX + rangeX; x += step) {
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

    const originX = (0 - tipX + 5) * scale;
    const originY = height - (0 - viewBoxY) * scale;
    const showOriginX = originX >= 0 && originX <= width;
    const showOriginY = originY >= 0 && originY <= height;

    return {
        inputs,
        tipX,
        tipY,
        points,
        viewBoxY,
        scale,
        width,
        height,
        origin: { x: originX, y: originY },
        showOriginX,
        showOriginY
    };
}
