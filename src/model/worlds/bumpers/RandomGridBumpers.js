import Physics from 'physicsjs';
import Bumpers from './Bumpers';

/**
 * A set of bumper objects within a world (always static)
 */
export default class RandomGridBumpers extends Bumpers {
    constructor(component, renderer, count=7) {
        super(component, renderer);
        this.bumpers = [];
        this.count = count;
        const world = component.getPhysics();

        this.reposition(renderer);
    }

    reposition(renderer) {
        if (!renderer) {
            throw new Error('Cannot reposition bumpers without a renderer');
        }

        const bumperCoords = [];
        this.component.getPhysics().remove(this.bumpers);
        this.bumpers = [];

        // const bumperCoords = [
        //     [renderer.width * 0.25, renderer.height * 0.25],
        //     [renderer.width * 0.25, renderer.height * 0.50],
        //     [renderer.width * 0.25, renderer.height * 0.75],

        //     [renderer.width * 0.50, renderer.height * 0.25],
        //     [renderer.width * 0.50, renderer.height * 0.50],
        //     [renderer.width * 0.50, renderer.height * 0.75],

        //     [renderer.width * 0.75, renderer.height * 0.25],
        //     [renderer.width * 0.75, renderer.height * 0.50],
        //     [renderer.width * 0.75, renderer.height * 0.75],
        // ];

        const coord = (i, constraint) => {
            const divisions = this.count + 1;

            if (Math.random() >= 0.5) {
                return constraint * ((i + 1) * (1 / divisions));
            }

            const r = this.count - (i + 1);

            return constraint * ((r + 1) * (1 / divisions));
        }

        for (let i=0; i<this.count; i++) {
            const x = coord(i, renderer.width);
            const y = coord(this.count - (i + 1), renderer.height);

            this.bumpers.push(Physics.body('rectangle', {
                x,
                y,
                mass: -10,
                vx: 0, vy: 0,
                width: 30,
                height: 30,
                treatment: 'static',
                styles: {
                    fillStyle: this.component.palette[this.component.palette.length - 1],
                }
            }));
        }

        this.component.getPhysics().add(this.bumpers);
    }
}