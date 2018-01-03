import * as Tonal from 'tonal';
import * as Key from 'tonal-key';

export default class ChordProgression {
    static I_IV_V = (tonic, key) => {
        const k = (key === 'M' ? 'major' : 'minor');
        const chords = Key.chords(`${tonic} ${k}`);
        // console.log('I IV V FROM ', tonic, k, )
        return new ChordProgression([chords[0], chords[3], chords[4]]);
    };

    static i_VI_VII = (tonic) => {
        const chords = Key.chords(`${tonic} minor`);
        return new ChordProgression([chords[0], chords[5], chords[6]]);
    }

    static in(tonic, key) {
        if (key === 'M') {
            return ChordProgression.I_IV_V(tonic, key);
        }

        return ChordProgression.i_VI_VII(tonic, key);
    }

    /**
     * Create a new chord progression with a sequence of chords.
     * @param {*} chords e.g. ['C major', 'G major', 'A minor']
     */
    constructor(chords) {
        this.chords = chords;
        this.toneSets = this.chords.map(chord => Tonal.Chord.notes(chord));        
        this.index = -1;
        this.advance();
    }

    /**
     * Returns the active tone set
     * @returns array[string]
     */
    getToneSet() { 
        return this.activeSet;
    }

    /**
     * Move the active tone set to the next in the progression.
     * This moves circularly in a loop
     * @returns the active set.
     */
    advance() {
        this.index = this.index + 1;
        if (this.index >= this.toneSets.length) {
            this.index = 0;
        }

        this.activeSet = this.toneSets[this.index];
        return this.activeSet;
    }
};
