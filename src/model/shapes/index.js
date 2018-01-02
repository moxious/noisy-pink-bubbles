import _ from 'lodash';
const DEFAULT_SCALE = 20;

const shapeRegistry = {
    octagon: (scale = DEFAULT_SCALE) => ([
        { x: 1 * scale, y: 0 * scale },
        { x: 2 * scale, y: 0 * scale },
        { x: 3 * scale, y: 1 * scale },
        { x: 3 * scale, y: 2 * scale },
        { x: 2 * scale, y: 3 * scale },
        { x: 1 * scale, y: 3 * scale },
        { x: 0 * scale, y: 2 * scale },
        { x: 0 * scale, y: 1 * scale },
    ]),

    triangle: (scale = DEFAULT_SCALE) => ([
        { x: 2 * scale, y: 0 * scale },
        { x: 0 * scale, y: 2 * scale },
        { x: 4 * scale, y: 2 * scale },
    ]),

    hexagon: (scale = DEFAULT_SCALE) => ([
        // https://www.redblobgames.com/grids/hexagons/
        { x: 0 * scale * 3, y: 1 * scale * 3 },
        { x: 0.25 * scale * 3, y: 0.5 * scale * 3},
        { x: 0.75 * scale * 3, y: 0.5 * scale * 3 },
        { x: 1 * scale * 3,  y: 1 * scale * 3 },
        { x: 0.75 * scale * 3, y: 1.5 * scale * 3 },
        { x: 0.25 * scale * 3, y: 1.5 * scale * 3 },
    ]),

    square: (scale = DEFAULT_SCALE) => ([
        { x: 0 * scale, y: 0 * scale },
        { x: 2 * scale, y: 0 * scale },
        { x: 2 * scale, y: 2 * scale },
        { x: 0 * scale, y: 2 * scale },
    ]),
};

export default _.merge({}, shapeRegistry, {
    random: (scale) => {
        const shapes = Object.keys(shapeRegistry);

        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return shapeRegistry[shape](scale);
    },
});