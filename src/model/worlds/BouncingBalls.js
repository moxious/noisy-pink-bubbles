import World from '../World';
import Physics from 'physicsjs';

/**
 * Bouncing Balls is a world populated by balls that collide with one another and produce
 * musical tones when they do.
 */
export default class BouncingBalls extends World {
    constructor({
        bodies = 25,
        canvasID = 'viewport',
    }) {
        super({ bodies, canvasID });

        const component = this;

        const renderer = Physics.renderer('canvas', {
            el: canvasID,
        });

        const createdWorld = Physics(world => {
            const el = document.getElementById(canvasID);
            console.log('Canvas el is ', el.width, el.height);
            // let viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight);
            let viewportBounds = Physics.aabb(0, 0, el.width, el.height);

            console.log(viewportBounds);
           
            // add the renderer
            world.add(renderer);
            // render on each step
            world.on('step', function () {
                world.render();
            });

            // constrain objects to these bounds
            var edgeBounce = Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 0.99,
                cof: 0.8,
            });

            // resize events
            window.addEventListener(
                'resize',
                () => {
                    console.log('RESIZE', renderer.width, renderer.height);
                    
                    // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
                    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
                    
                    // update the boundaries
                    edgeBounce.setAABB(viewportBounds);
                }, true);

            for (let i = 0; i < bodies; i++) {
                world.add(component.makeBody(world, renderer));
            }

            // add some fun interaction
            const attractor = Physics.behavior('attractor', {
                order: 0,
                strength: .002,
            });

            world.on({
                'interact:poke': function (pos) {
                    world.wakeUpAll();
                    attractor.position(pos);
                    world.add(attractor);
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
            world.on('collisions:detected', (data) => {
                var c;
                for (let z = 0, l = data.collisions.length; z < l; z++) {
                    c = data.collisions[z];
                    if (!c.bodyA.label || !c.bodyB.label) {
                        // console.log('Edge collision for ', c.bodyA.label || c.bodyB.label);
                        // playBody(c.bodyA.tone ? c.bodyA : c.bodyB);
                    } else {
                        if (c.bodyB.sounds) {
                            c.bodyB.sounds.play();
                        }

                        if (c.bodyA.sounds) {
                            c.bodyA.sounds.play();
                        }

                        // console.log('Collide: ', c.bodyA.label, 'with', c.bodyB.label);
                    }
                }
            });

            Physics.body.mixin('collide', (other) => {
                if (other) {
                    // do some default action
                    console.log('Collide mixin called');
                }
                return true;
            });

            // add things to the world
            world.add([
                Physics.behavior('interactive', { el: renderer.container }),
                Physics.behavior('body-collision-detection', { channel: 'collisions:detected' }),
                Physics.behavior('newtonian', { strength: .001 }),
                Physics.behavior('sweep-prune'),
                Physics.behavior('body-impulse-response'),
                // Physics.integrator('improved-euler'),
                edgeBounce,
            ]);

            world.unpause();

            // subscribe to ticker to advance the simulation
            Physics.util.ticker.on((time) => world.step(time));
        });

        this.renderer = renderer;
        this.world = createdWorld;
    }    
}