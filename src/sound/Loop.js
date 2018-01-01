import * as Tone from 'tone';

export default class Loop {
    constructor(conductor) {
        this.conductor = conductor;
        this.synth = this.conductor.makeSynth();        
    }

    getSynth() {
        return this.synth;
    }

    play(time) {
        throw new Error('Subclass me');
    }

    start() {
        this.loop = new Tone.Loop(time => this.play(time), '16n');
        this.loop.start(this.startOn || '1m');
        Tone.Transport.start(0);
    }

    stop() {
        if (!this.loop) {
            throw new Error('Not started');
        }

        this.loop.stop(this.stopAt || '1m');
    }
}