import Physics from 'physicsjs';
import choosePalette from './Palette';
import BodySound from '../sound/BodySound';

/**
 * A world is an abstract physics container full of bodies and interactions.
 * It's up to the subclass to define what kind of bodies and interactions.
 */
export default class World {
    constructor(props) {
        this.palette = choosePalette();
        this.bodyCounter = 0;

        setInterval(() => this.repalette(), 5000);
    }

    repalette() {
        const p = choosePalette();

        // console.log('REPALETTE old ', this.palette, ' new ', p);
        this.palette = p;

        this.getPhysics().getBodies().forEach(body => {
            const c = (body.treatment === 'static' ? this.staticColor() : this.chooseColor());

            if (body.styles.fillStyle && c !== body.styles.fillStyle) {
                // Deep magic; force renderer to re-assign.  Just plugging in a new
                // color doesn't work because the view is dynamically generated PNG.
                body.view = undefined;
                // console.log('WAS: ', body.styles.fillStyle, 'NOW', c);
                body.styles.fillStyle = c;
            }
        });

        // this.getRenderer().reset(this.getPhysics().getBodies());
    }

    staticColor() {
        return this.palette[this.palette.length - 1];
    }

    chooseColor() {
        return this.palette[Math.floor(Math.random() * this.palette.length)]
    }

    makeBody(world, renderer, opts = {}) {
        const neg = Math.random() > 0.5;

        const numberDefault = (value, fallback) =>
            isNaN(value) ? fallback : value;

        let body = Physics.body(opts.shape || 'circle', {
            x: numberDefault(opts.x, Math.random() * renderer.width),
            y: numberDefault(opts.y, 0),
            vx: numberDefault(opts.vx, (Math.random() * 0.5 * (neg ? -1 : 1))),
            vy: numberDefault(opts.vy, (Math.random() * 0.5 * (neg ? -1 : 1))),
            mass: opts.mass || 0.1, // cannot be zero.
            radius: numberDefault(opts.radius, 20),
            width: numberDefault(opts.width, 30),
            height: numberDefault(opts.height, 30),
            cof: numberDefault(opts.cof, 0.7),
            label: opts.label || 'body-' + (++this.bodyCounter),
            restitution: numberDefault(opts.restitution, 1),
            treatment: opts.treatment || 'dynamic',
            styles: opts.styles || {
                fillStyle: this.chooseColor(),
                angleIndicator: '#000000',
            }
        });

        return body;
    }

    getPhysics() {
        return this.world;
    }

    countBodies() {
        return this.getPhysics().getBodies().length;
    }

    addBody(conductor) {
        const body = this.makeBody(this.getPhysics(), this.renderer);
        body.sounds = new BodySound(conductor, body);
        this.getPhysics().add(body);
    }

    removeBody() {
        let candidate = null;
        const bodies = this.getPhysics().getBodies();

        for (let i=0; i<bodies.length; i++) {
            if (this.bumpers && this.bumpers.isBumper(bodies[i])) {
                continue;
            }

            candidate = bodies[i];
            break;
        }

        this.getPhysics().remove(candidate);
    }

    getRenderer() {
        return this.renderer;
    }
}