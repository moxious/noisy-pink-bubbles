import Loop from './Loop';
import ChordProgression from './ChordProgression';

export default class Hummer extends Loop {
    constructor(conductor) {
        super(conductor);

        this.octave = 2;
        this.mode = 'tonic';
        this.cp = ChordProgression.I_IV_V('C', 'M');
        this.loopFrequency = '4n';
        conductor.register(this);

        console.log('Hummer CP ', this.cp);
    }

    setMode(mode) {
        this.mode = mode;
    }

    onConductorChange(changeType, newValue, conductor){
        if (changeType === 'tonic' || changeType === 'key') {
            console.log('Changing hummer progression');
            this.cp = ChordProgression.I_IV_V(conductor.getTonic(), conductor.getKey());
        }
    }

    play(time) {
        if (!this.conductor.muted) {
            const tonic = `${this.conductor.getTonic()}${this.octave}`;
            const nextInArpeggio = `${this.cp.getToneSet()[0]}${this.octave}`;

            let tone;

            if (this.mode === 'tonic') {
                tone = tonic;
            } else {
                tone = nextInArpeggio;
            }

            // console.log('Hummer play: ', tone, time);

            this.synth.triggerAttackRelease(tone, '16n', time);
            this.cp.advance();
        }
    }
}