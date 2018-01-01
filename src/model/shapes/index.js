export default {
    octagon: (scale = 20) => ([
        { x: 1 * scale, y: 0 * scale },
        { x: 2 * scale, y: 0 * scale },
        { x: 3 * scale, y: 1 * scale },
        { x: 3 * scale, y: 2 * scale },
        { x: 2 * scale, y: 3 * scale },
        { x: 1 * scale, y: 3 * scale },
        { x: 0 * scale, y: 2 * scale },
        { x: 0 * scale, y: 1 * scale },
    ]),
};
