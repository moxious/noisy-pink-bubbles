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

        setInterval(() => this.repalette(), 5000);
    }

    repalette() {
        const p = choosePalette();

        console.log('REPALETTE old ', this.palette, ' new ', p);
        this.palette = p;

        this.getPhysics().getBodies().forEach(body => {
            const c = this.chooseColor();

            if (body.styles.fillStyle && c !== body.styles.fillStyle) {
                // console.log(body.view);
                body.view = undefined;
                console.log('WAS: ', body.styles.fillStyle, 'NOW', c);
                body.styles.fillStyle = c;
            }
        });

        // this.getRenderer().reset(this.getPhysics().getBodies());
    }

    chooseColor() {
        return this.palette[Math.floor(Math.random() * this.palette.length)]
    }

    makeBody(world, renderer) {
        const vert = Math.random() > 0.5;
        const neg = Math.random() > 0.5;

        let body = Physics.body('circle', {
            x: Math.random() * renderer.width,
            y: Math.random() * renderer.height,
            vx: vert ? 0 : Math.random() * 0.5 * (neg ? -1 : 1),
            vy: vert ? Math.random() * 0.5 : 0 * (neg ? -1 : 1),
            mass: Math.random() * 10,
            radius: 20,
            width: 30,
            height: 30,
            cof: 0,
            label: 'body-' + (++this.bodyCounter),
            restitution: 1,
            // treatment: 'kinematic',
            // treatment: Math.random() < 0.2 ? 'static' : 'dynamic',
            styles: {
                fillStyle: this.chooseColor(),
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