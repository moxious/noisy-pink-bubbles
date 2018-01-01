// import * as Tone from 'tone';
import * as Tonal from 'tonal';
import * as Tone from 'tone';
import BodySound from './BodySound';
import sampler from './SampleSynth';

const DEFAULT_ENVELOPE = {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.2,
    release: 0.9,
};

let singletonSampler = null;

export default class Conductor {
    constructor(props={}) {
        this.tonic = props.tonic || 'C';
        this.key = props.key || 'M';
        this.tempo = props.tempo || 50;
        this.octaves = props.octaves || ['3', '4', '5'];
        this.synth = props.synth || 'triangle';
        this.muted = props.muted || false;
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        this.listeners = [];
    }

    /**
     * Add a listener that wants to be notified of conductor changes.
     */
    register(listener) {
        if (this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
        }
    }

    /**
     * Remove a listener.
     */
    deregister(listener) {
        const idx = this.listeners.indexOf(listener);
        if (idx > -1) {
            this.listeners.splice(idx, 1);
        }
        return this.listeners;
    }

    notify(property) {
        this.listeners.forEach(listener => listener.onConductorChange(property, this[property], this));
    }

    mute(isMuted) {
        this.muted = isMuted;
        this.notify('muted');
        return this.muted;
    }

    setOctaves(octaves) {
        this.octaves = octaves;
        this.notify('octaves');
        return this.octaves;
    }

    getTonalChord() {
        return `${this.tonic}${this.key}`;
    }

    setSynth(synth) {
        if (synth) {
            this.synth = synth;
            this.notify('synth');
            return this.synth;
        } 

        return null;
    }

    makeSynth(envelope = DEFAULT_ENVELOPE) {
        const validTypes = ['pwm', 'square', 'triangle', 'sine', 'sawtooth'];
        const constructors = {
            // AM: Tone.AMSynth,
        };
        console.log('Making synth', this.synth);

        if (validTypes.indexOf(this.synth) > -1) {
            return new Tone.Synth({
                oscillator: {
                    type: this.synth,
                },
                envelope,
            }).toMaster();
        } else if (constructors[this.synth]) {
            return constructors[this.synth]().toMaster();
        }

        if (this.synth === 'sampler') {
            if (!singletonSampler) {
                singletonSampler = sampler();
            }
            return singletonSampler;
        }

        return new Tone.Synth().toMaster();
    }

    setChord(chord) {
        if (!chord) {
            console.error('Bad conductor chord', chord);
            return;
        }
        this.tonic = chord;
        this.notify('tonic');
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        console.log('CHORD: ', this.tones, ' for ', this.getTonalChord());
        return this.tones;
    }

    setTones(tones) {
        this.tones = tones;
        this.notify('tones');
        return this.tones;
    }

    randTone() {
        return this.tones[Math.floor(Math.random() * this.tones.length)] +
            this.octaves[Math.floor(Math.random() * this.octaves.length)];
    }

    setTempo(tempo) {
        if (!tempo || tempo < 2 || tempo > 250) { return; }
        console.log('Tempo: ', this.tempo, ' => ', tempo);
        this.tempo = tempo; 
        this.notify('tempo');
        // Set master synth tempo.
        Tone.Transport.bpm.value = this.tempo;

        return this.getTempo(); 
    }

    getTempo() { return this.tempo; }
    getTonic() { return this.tonic; }
    getKey() { return this.key; }

    setTonic(tonic) { 
        this.tonic = tonic;
        this.notify('tonic');
        return this.getTonic(); 
    }

    setKey(key) { 
        if (!key) {
            console.error('Bad conductor key', key);
            return;
        }

        this.key = key;
        this.notify('key');
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        console.log('KEY: ', this.tones, ' for ', this.getTonalChord());
        return this.getKey(); 
    }

    coordinate(world, replaceSynths = false) {
        world.getPhysics().getBodies().forEach(body => {
            if (body.sounds) {
                // console.log("coodinate/reassign");
                body.sounds.reassign(replaceSynths);
            } else {
                // console.log('coordinate/new');
                body.sounds = new BodySound(this, body);
            }
        });

        return true;
    }
}
