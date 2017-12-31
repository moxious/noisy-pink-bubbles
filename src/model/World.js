import Physics from 'physicsjs';
import choosePalette from './Palette';

/**
 * A world is an abstract physics container full of bodies and interactions.
 * It's up to the subclass to define what kind of bodies and interactions.
 */
export default class World {
    constructor(props) {
        this.palette = choosePalette();
        this.bodyCounter = 0;
    }

    makeBody(world, renderer) {
        let body = Physics.body('circle', {
            x: Math.random() * renderer.width,
            y: Math.random() * renderer.height,
            vx: Math.random() * 0.5,
            vy: Math.random() * 0.5,
            mass: Math.random() * 5,
            radius: 30,
            label: 'body-' + (++this.bodyCounter),
            styles: {
                fillStyle: this.palette[Math.floor(Math.random() * this.palette.length)],
                angleIndicator: '#000000',
            }
        });

        return body;
    }

    getPhysics() {
        return this.world;
    }

    getRenderer() {
        return this.renderer;
    }
}