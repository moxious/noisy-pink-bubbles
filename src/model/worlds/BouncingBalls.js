import World from '../World';
import Physics from 'physicsjs';
import shapes from '../shapes/';
import SimpleGridBumpers from './bumpers/SimpleGridBumpers';
// import PIXI from 'physicsjs/dist/renderers/pixi-renderer';

const SPEED_LIMIT = 0.5;

/**
 * Bouncing Balls is a world populated by balls that collide with one another and produce
 * musical tones when they do.
 */
export default class BouncingBalls extends World {
    constructor({
        bodies = 7,
        canvasID = 'viewport',
    }) {
        super({ bodies, canvasID });

        const component = this;

        const renderer = Physics.renderer('canvas', {
            el: canvasID,
        });

        const createdWorld = Physics(world => {
            const el = document.getElementById(canvasID);
            // let viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight);
            let viewportBounds = Physics.aabb(0, 0, el.width, el.height);

            // add the renderer
            world.add(renderer);

            // render on each step
            world.on('step', () => world.render());

            // constrain objects to these bounds
            var edgeBounce = Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 1.05,
                cof: 0.90,
            });

            // resize events
            window.addEventListener(
                'resize',
                () => {
                    // console.log('RESIZE', renderer.width, renderer.height);

                    if (component.bumpers) {
                        component.bumpers.reposition(renderer);
                    }

                    // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
                    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);

                    // update the boundaries
                    edgeBounce.setAABB(viewportBounds);
                }, true);

            for (let i = 0; i < bodies; i++) {
                world.add(component.makeBody(world, renderer));
            }

            world.add(Physics.body('convex-polygon', {
                x: 400,
                y: 200,
                vx: -0.02,
                vertices: shapes.octagon(),
                styles: {
                    fillStyle: component.palette[component.palette.length - 1],
                },
            }));

            // add some fun interaction
            const attractor = Physics.behavior('attractor', {
                order: 0,
                strength: .002,
            });

            world.on({
                'interact:poke': function (pos) {
                    // world.wakeUpAll();
                    // attractor.position(pos);
                    // world.add(attractor);
                },
                'interact:move': function (pos) {
                    attractor.position(pos);
                },
                'interact:release': function () {
                    world.wakeUpAll();
                    world.remove(attractor);
                },
            });

            // If extending a body and you want to handle its collision
            world.on('collisions:detected', (data) => component.collisionsDetected(data));

            // add things to the world
            world.add([
                Physics.behavior('interactive', { el: renderer.container }),
                Physics.behavior('body-collision-detection', { channel: 'collisions:detected' }),
                // Physics.behavior('newtonian', { strength: .1 }),
                Physics.behavior('sweep-prune'),
                Physics.behavior('body-impulse-response'),
                // Physics.behavior('constant-acceleration'),
                // Physics.integrator('improved-euler'),
                edgeBounce,
            ]);

            world.unpause();

            // subscribe to ticker to advance the simulation
            Physics.util.ticker.on((time) => {
                // const vectors = world.getBodies().map(body => Math.abs(body.state.vel.x) + Math.abs(body.state.vel.y)).sort().reverse();
                // const fastest = vectors[0];
                // const total = vectors.reduce((a, b) => a + b, 0);
                // console.log('Fastest vector: ', fastest, 'total', total);
                world.step(time);
            });
        });

        this.renderer = renderer;
        this.world = createdWorld;
        this.bumpers = new SimpleGridBumpers(this, this.renderer);
    }

    collisionsDetected(data) {
        let c;

        const playAnyWithSounds = list =>
            list.filter(item => item.sounds).forEach(item => item.sounds.play());

        for (let z = 0, l = data.collisions.length; z < l; z++) {
            c = data.collisions[z];

            if (!c.bodyA.sounds || !c.bodyB.sounds) {
                // Separate case of edge collision, or bumper collision.
                // Does the same thing, but be aware of this case.
                playAnyWithSounds([c.bodyA, c.bodyB]);
            } else {
                playAnyWithSounds([c.bodyA, c.bodyB]);
                // console.log('Collide: ', c.bodyA.label, 'with', c.bodyB.label);
            }
        }
    }
}