import _ from 'lodash';

const MUTE_INTERVAL = 500;

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
            synth: this.conductor.makeSynth(),
        };

        this.reassign(false);
    }

    reassign(replaceSynth) {
        // console.log('reassign ', this.sounds.synth, typeof this.sounds.synth);
        if (replaceSynth) {
            this.sounds.synth = this.conductor.makeSynth();
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
            this.sounds.synth.triggerAttackRelease(this.sounds.tone, '32n');
            this.sounds.lastPlayed = now;
        } else {
            if (now - this.sounds.lastPlayed < MUTE_INTERVAL) {
                // console.log('Too soon');
                return;
            } else {
                // console.log('Playing secondary ', this.tone, 'through', this.synth);
                this.sounds.lastPlayed = now;
                this.sounds.synth.triggerAttackRelease(this.sounds.tone, '32n');
            }
        }
    }
}