import * as Tone from 'tone';

export default class Loop {
    constructor(conductor) {
        this.conductor = conductor;
        this.synth = this.conductor.makeSynth();
        this.started = false; 
    }

    getSynth() {
        return this.synth;
    }

    play(time) {
        throw new Error('Subclass me');
    }

    start() {
        if (this.started) {
            console.log('Not starting an already running loop');
            return;
        }

        this.started = true;
        this.loop = new Tone.Loop(time => this.play(time), this.loopFrequency || '4n');
        this.loop.start(this.startOn || '1m');
        Tone.Transport.start(0);
    }

    stop() {
        this.started = false;
        if (!this.loop) {
            throw new Error('Not started');
        }

        this.loop.stop(this.stopAt || '1m');
    }
}