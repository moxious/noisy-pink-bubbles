import * as Tone from 'tone';
// import * as Tonal from 'tonal';
import _ from 'lodash';
import sampler from './SampleSynth';

const MUTE_INTERVAL = 500;

let singletonSampler = null;

export default class BodySound {
    constructor(conductor, body, synth) {
        this.conductor = conductor;
        this.body = body;

        this.envelope = {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.2,
            release: 0.9,
        };

        this.sounds = {
            tone: this.conductor.randTone(),
            synth: this.makeSynth(),
        };

        this.reassign(false);
    }

    reassign(replaceSynth) {
        // console.log('reassign ', this.sounds.synth, typeof this.sounds.synth);
        if (replaceSynth) {
            this.sounds.synth = this.makeSynth();
        }

        this.sounds.tone = this.conductor.randTone();
        return this.sounds;
    }

    play() {
        if (!_.get(this.sounds, 'synth') || !_.get(this.sounds, 'tone')) {
            console.log('Cannot play non-tonal body ', this.body);
            return;
        } else if (this.conductor.muted) {
            return;
        }

        const now = new Date().getTime();

        if (!this.sounds.lastPlayed) {
            // console.log('Playing ', this.tone);
            this.sounds.synth.triggerAttackRelease(this.sounds.tone, '16n');
            this.sounds.lastPlayed = now;
        } else {
            if (now - this.sounds.lastPlayed < MUTE_INTERVAL) {
                // console.log('Too soon');
                return;
            } else {
                // console.log('Playing secondary ', this.tone, 'through', this.synth);
                this.sounds.lastPlayed = now;
                this.sounds.synth.triggerAttackRelease(this.sounds.tone, '16n');
            }
        }
    }

    makeSynth() {
        const validTypes = ['pwm', 'square', 'triangle', 'sine', 'sawtooth'];
        const constructors = {
            // AM: Tone.AMSynth,
        };
        console.log('Making synth', this.conductor.synth);

        if (validTypes.indexOf(this.conductor.synth) > -1) {
            return new Tone.Synth({
                oscillator: {
                    type: this.conductor.synth,
                },
                envelope: this.envelope,
            }).toMaster();
        } else if (constructors[this.conductor.synth]) {
            return constructors[this.conductor.synth]().toMaster();
        }

        if (this.conductor.synth === 'sampler') {
            if (!singletonSampler) {
                singletonSampler = sampler();
            }
            return singletonSampler;
        }

        return new Tone.Synth().toMaster();
    }
}