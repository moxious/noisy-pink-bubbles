import Physics from 'physicsjs';
import choosePalette from './Palette';
import BodySound from '../sound/BodySound';
import Emoji from './Emoji';
import _ from 'lodash';

const NON_EMOJI_PERCENT = 1;

/**
 * A world is an abstract physics container full of bodies and interactions.
 * It's up to the subclass to define what kind of bodies and interactions.
 */
export default class World {
    constructor(props) {
        if (!props || !props.conductor) {
            throw new Error('All worlds must be created with a conductor');
        }

        this.conductor = props.conductor;
        this.palette = choosePalette();
        this.bodyCounter = 0;
        this.addMode = 'bubble';
        this.initialVector = { x: 0, y: 0.5 };
        setInterval(() => this.repalette(), 5000);
    }

    repalette() {
        const p = choosePalette();

        // console.log('REPALETTE old ', this.palette, ' new ', p);
        this.palette = p;

        this.getPhysics().getBodies().forEach(body => {
            // Deep magic; force renderer to re-assign.
            // When using the PIXI renderer, you must remove the
            // view sprite from the stage.  When using canvas
            // renderer, it's enough to mark view undefined.
            if (this.getRenderer().stage) {
                this.getRenderer().stage.removeChild(body.view);
            } 
            body.view = undefined;

            if (body.treatment === 'static') {
                this.styleBumper(body);
            } else {
                if (Math.random() < NON_EMOJI_PERCENT || !this.getRenderer().createDisplay) {
                    this.styleBubble(body);
                } else {
                    body.view = this.getRenderer().createDisplay('sprite', {
                        texture: Emoji.random(),
                        anchor: { x: 0.5, y: 0.5 },
                    });
                }
            }
        });

        // this.getRenderer().reset(this.getPhysics().getBodies());
    }

    setNewBodyVector(vector) {
        if (!vector || isNaN(vector.x) || isNaN(vector.y)) {
            throw new Error('Bad initial vector', vector);
        }

        this.initialVector = vector;
    }

    setAddMode(mode) {
        this.addMode = mode;
        console.log('Modified addMOde to ', mode);
        return this.addMode;
    }

    staticColor() {
        return this.palette[this.palette.length - 1];
    }

    styleBumper(body) {
        const styles = {
            lineWidth: 2,
            strokeStyle: '#000000',
            fillStyle: this.palette[this.palette.length - 1],
        };

        if (body) {
            body.styles = styles;
            return body;
        }

        return styles;
    }

    styleBubble(body) {
        const colorIdx = Math.floor(Math.random() * this.palette.length);
        // Pick a "far away" color in the palette for border contrast.
        const borderIdx = (colorIdx + (this.palette.length / 2)) % this.palette.length;
        const angleIdx = (colorIdx + 1) % this.palette.length;
        
        const styles = {
            lineWidth: 2,
            strokeStyle: this.palette[borderIdx],
            fillStyle: this.palette[colorIdx],
            angleIndictor: this.palette[angleIdx],
        };

        if (body) {
            body.styles = styles;
            return body;
        }

        return styles;
    }

    chooseColor() {
        return this.palette[Math.floor(Math.random() * this.palette.length)]
    }

    makeBody(world, renderer, opts = {}) {
        const neg = Math.random() > 0.5;

        const numberDefault = (value, fallback) =>
            isNaN(value) ? fallback : value;

        const s = {};
        if (Math.random() < NON_EMOJI_PERCENT || renderer.createDisplay) {
            console.log('Canvas style bubble');
            s.styles = opts.styles || this.styleBubble();
        } else {            
            s.view = renderer.createDisplay('sprite', {
                texture: Emoji.random(),
                anchor: { x: 0.5, y: 0.5 },
            });
        }

        const bodyProps = _.merge({
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
        }, s);

        console.log('Bodyprops', bodyProps);

        return Physics.body(opts.shape || 'circle', bodyProps);
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

    removeAll() {
        const bodies = this.getPhysics().getBodies();
        this.getPhysics().remove(bodies);
    }

    removeBody() {
        let candidate = null;
        const bodies = this.getPhysics().getBodies();

        for (let i=0; i<bodies.length; i++) {
            if (this.bumpers && this.bumpers.isBumper(bodies[i])) {
                continue;
            }

            if (bodies[i].treatment === 'static') {
                // User-added bumper, don't remove.
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