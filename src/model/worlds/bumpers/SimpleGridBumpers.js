import Physics from 'physicsjs';
import Bumpers from './Bumpers';
import shapes from '../../shapes/';

/**
 * A set of bumper objects within a world (always static)
 */
export default class SimpleGridBumpers extends Bumpers {
    constructor(component, renderer, mass=1) {
        super(component, renderer);
        this.mass = mass;
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

            this.bumpers.push(Physics.body('convex-polygon', {
                x,
                y,
                mass: this.mass,
                vx: 0, 
                vy: 0,
                width: 30,
                height: 30,
                vertices: shapes.random(),
                treatment: 'static',
                styles: {
                    fillStyle: this.component.palette[this.component.palette.length - 1],
                }
            }));
        }

        this.component.getPhysics().add(this.bumpers);
    }
}