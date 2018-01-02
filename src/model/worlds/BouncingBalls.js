import World from '../World';
import Physics from 'physicsjs';
import SimpleGridBumpers from './bumpers/SimpleGridBumpers';
import BodySound from '../../sound/BodySound';
import choosePalette from '../Palette';

// Maximum velocity in any given direction x or y.
// Bubbles won't be allowed to move faster than this, or animation goes haywire
// as speed exceed refresh rate.
const SPEED_LIMIT = 2;

/**
 * Bouncing Balls is a world populated by balls that collide with one another and produce
 * musical tones when they do.
 */
export default class BouncingBalls extends World {
    constructor({
        bodies = 7,
        conductor,
        canvasID = 'viewport',
    }) {
        super({ bodies, canvasID, conductor });

        const component = this;
        let attractor = null;

        const renderer = Physics.renderer('canvas', {
            el: canvasID,
            // meta: true,
        });

        // Assign a palette specific to the renderer since pixi
        // works differently
        component.palette = choosePalette(renderer);

        console.log('Renderer', renderer);
        const createdWorld = Physics(world => {
            // const el = document.getElementById(canvasID);
            // let viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight);
            // let viewportBounds = Physics.aabb(0, 0, el.width, el.height);
            let viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);

            // add the renderer
            world.add(renderer);

            // render on each step
            world.on('step', () => {
                /* Circular mask is necessary if sprites aren't circles.
                world.getBodies()
                    .filter(body => body.treatment === 'dynamic' && body.view)
                    .map(body => {
                        const mask = new window.PIXI.Graphics();
                        mask.beginFill(0xff0000);
                        mask.lineStyle(0);
                        mask.drawCircle(body.state.pos.x, body.state.pos.y, 20);
                        mask.endFill();                        
                        body.view.mask = mask;
                    });
                */
                world.render();
            });

            // Add sounds to everything new that gets added.
            world.on('add:body', data => component.assignBodySound(data.body));

            // constrain objects to these bounds
            var edgeBounce = Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 1,
                cof: 1,
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

            // add some fun interaction
            attractor = Physics.behavior('attractor', {
                order: 0,
                strength: .002,
            });

            world.on({
                'interact:poke': pos => this.poke(pos),
                'interact:move': pos => this.move(pos),
                'interact:release': pos => this.release(pos),
                'interact:grab': pos => this.grab(pos),
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
                world.getBodies()
                    // For any body moving faster than the max in X or Y...
                    .filter(body => (
                        Math.abs(body.state.vel.x) > SPEED_LIMIT ||
                        Math.abs(body.state.vel.y) > SPEED_LIMIT))
                    .map(body => {
                        // console.log('Speed limiting ', body.uid);
                        const absX = Math.min(Math.abs(body.state.vel.x), SPEED_LIMIT);
                        const absY = Math.min(Math.abs(body.state.vel.y), SPEED_LIMIT);

                        // Set its new velocity to the minimum of either its vel or the max.
                        return body.state.vel.set(body.state.vel.x > 0 ? absX : -absX,
                            body.state.vel.y > 0 ? absY : -absY);
                    });
                
                world.step(time);
            });
        });

        this.renderer = renderer;
        this.world = createdWorld;
        this.attractor = attractor;
        this.bumpers = new SimpleGridBumpers(this, this.renderer);
    }

    poke(pos) {
        // this.getPhysics().wakeUpAll();
        // this.attractor.position(pos);
        // this.getPhysics().add(this.attractor);

        if (pos.y <= 56) {
            // TODO: remove this dirty hack once I can figure out why the canvas
            // is eating all of the screen space.  Don't want to trigger event on
            // toolbar click.
            // console.log('Dirty hack');
            return;
        }

        const props = { x: pos.x, y: pos.y };
        console.log('Poke ', pos, ' in addMode ', this.addMode);
        if (this.addMode === 'bumper') {
            props.vx = 0;
            props.vy = 0;
            props.shape = 'rectangle';
            props.width = 40;
            props.height = 40;
            props.treatment = 'static';
            props.style = this.styleBumper();
            console.log('Bumper style ', props.style);
        } else {
            props.vx = this.initialVector.x;
            props.vy = this.initialVector.y;
            props.treatment = 'dynamic';
            props.style = this.styleBubble();
        }

        const newBody = this.makeBody(this.getPhysics(), this.renderer, props);
        this.getPhysics().add(newBody);
    }

    assignBodySound(body) {
        if (body.treatment === 'dynamic') {
            body.sounds = new BodySound(this.conductor, body);
        }

        return body;
    }

    move(pos) {
        // console.log('Move ', pos);
        this.attractor.position(pos);
    }

    release(pos) {
        console.log('Release ', pos);
        // this.getPhysics().wakeUpAll();
        this.getPhysics().remove(this.attractor);
    }

    grab(data) {
        // console.log('Grab: ', data);
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