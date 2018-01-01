import * as Tonal from 'tonal';
import * as Key from 'tonal-key';

export default class ChordProgression {
    static I_IV_V = (tonic) => {
        const chords = Key.chords(`${tonic} major`);
        return new ChordProgression([chords[0], chords[3], chords[4]]);
    };

    constructor(chords) {
        this.chords = chords;
        this.toneSets = this.chords.map(chord => Tonal.Chord.notes(chord));        
        this.index = -1;
        this.advance();
    }

    getToneSet() { 
        return this.activeSet;
    }

    advance() {
        this.index = this.index + 1;
        if (this.index >= this.toneSets.length) {
            this.index = 0;
        }

        this.activeSet = this.toneSets[this.index];
        return this.activeSet;
    }
};
