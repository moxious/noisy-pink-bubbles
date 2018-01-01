// import * as Tone from 'tone';
import * as Tonal from 'tonal';
import BodySound from './BodySound';
import ChordProgression from './ChordProgression';

export default class Conductor {
    constructor() {
        this.tonic = 'C'
        this.key = 'M';
        this.octaves = ['2', '3', '4', '5'];
        this.synth = 'triangle';
        this.muted = false;
        this.tones = Tonal.Chord.notes(this.getTonalChord());        
    }

    setOctaves(octaves) {
        this.octaves = octaves;
        return this.octaves;
    }

    getTonalChord() {
        return `${this.tonic}${this.key}`;
    }

    setSynth(synth) {
        if (synth) {
            this.synth = synth;
            return this.synth;
        } 

        return null;
    }

    setChord(chord) {
        if (!chord) {
            console.error('Bad conductor chord', chord);
            return;
        }
        this.tonic = chord;
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        console.log('CHORD: ', this.tones, ' for ', this.getTonalChord());
        return this.tones;
    }

    setTones(tones) {
        this.tones = tones;
        return this.tones;
    }

    randTone() {
        return this.tones[Math.floor(Math.random() * this.tones.length)] +
            this.octaves[Math.floor(Math.random() * this.octaves.length)];
    }

    getTonic() { return this.tonic; }
    getKey() { return this.key; }

    setTonic(tonic) { this.tonic = tonic; return this.getTonic(); }
    setKey(key) { 
        if (!key) {
            console.error('Bad conductor key', key);
            return;
        }
        this.key = key;
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        console.log('KEY: ', this.tones, ' for ', this.getTonalChord());
        return this.getKey(); 
    }

    coordinate(world, replaceSynths = false) {
        world.getPhysics().getBodies().forEach(body => {
            if (body.sounds) {
                console.log("coodinate/reassign");
                body.sounds.reassign(replaceSynths);
            } else {
                console.log('coordinate/new');
                body.sounds = new BodySound(this, body);
            }
        });

        return true;
    }
}
