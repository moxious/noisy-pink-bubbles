import * as Tonal from 'tonal';
import * as Tone from 'tone';
import Loop from './Loop';
import ChordProgression from './ChordProgression';

export default class Hummer extends Loop {
    constructor(conductor) {
        super(conductor);
        
        this.cp = ChordProgression.I_IV_V('C', 'M');
        conductor.register(this);

        console.log('Hummer CP ', this.cp);
    }

    onConductorChange(changeType, newValue, conductor){
        if (changeType === 'tonic' || changeType === 'key') {
            console.log('Changing hummer progression');
            this.cp = ChordProgression.I_IV_V(conductor.getTonic(), conductor.getKey());
        }
    }

    play(time) {
        if (!this.conductor.muted) {
            const tone = `${this.cp.getToneSet()[0]}2`;
            console.log('Hummer play: ', tone, time);
            this.synth.triggerAttackRelease(tone, '16n', time);
            this.cp.advance();
        }
    }
}