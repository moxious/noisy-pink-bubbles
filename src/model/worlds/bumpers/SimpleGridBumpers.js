import Physics from 'physicsjs';
import Bumpers from './Bumpers';

/**
 * A set of bumper objects within a world (always static)
 */
export default class SimpleGridBumpers extends Bumpers {
    constructor(component, renderer) {
        super(component, renderer);
        this.reposition(renderer);
    }

    reposition(renderer) {
        if (!renderer) {
            throw new Error('Cannot reposition bumpers without a renderer');
        }

        this.component.getPhysics().remove(this.bumpers);
        this.bumpers = [];

        const bumperCoords = [
            [renderer.width * 0.25, renderer.height * 0.25],
            [renderer.width * 0.25, renderer.height * 0.50],
            [renderer.width * 0.25, renderer.height * 0.75],

            [renderer.width * 0.50, renderer.height * 0.25],
            [renderer.width * 0.50, renderer.height * 0.50],
            [renderer.width * 0.50, renderer.height * 0.75],

            [renderer.width * 0.75, renderer.height * 0.25],
            [renderer.width * 0.75, renderer.height * 0.50],
            [renderer.width * 0.75, renderer.height * 0.75],
        ];

        for (let i=0; i<bumperCoords.length; i++) {
            const x = bumperCoords[i][0];
            const y = bumperCoords[i][1];

            console.log('BUMPER ', x, y);
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