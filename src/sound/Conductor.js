// import * as Tone from 'tone';
import * as Tonal from 'tonal';
import * as Tone from 'tone';
import BodySound from './BodySound';
import sampler from './SampleSynth';
import ChordProgression from './ChordProgression';

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
        this.tempo = props.tempo || 110;
        this.octaves = props.octaves || ['4', '5', '6'];
        this.synth = props.synth || 'triangle';
        this.muted = props.muted || false;
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        this.listeners = [];
        this.progression = new ChordProgression(['C', 'F', 'Am', 'G'])
            // ChordProgression.in(this.tonic, this.key);

        // this.loopProgression();
    }

    loopProgression() {
        const beatsPerSecond = this.tempo / 60;  // tempo is bpm.
        console.log(this.tempo, 'BPM is', beatsPerSecond, 'per sec.');
        const scheduleChange = 4 / beatsPerSecond; // one measure, in seconds.

        console.log('Changing in ', scheduleChange, ' seconds');
        setTimeout(() => {
            const tones = this.progression.advance();
            this.setTonic(tones[0]);
            this.setTones(tones);
            
            console.log('Progression advance', tones);

            this.loopProgression();
        }, scheduleChange * 1000);
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
        
        // console.log('Making synth', this.synth);

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
        if (!tonic) {
            throw new Error('Bad conductor tonic');
        } else if (tonic === this.tonic) { return this.tonic; }

        this.tonic = tonic;
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        // this.progression = ChordProgression.in(this.tonic, this.key);
        this.notify('tonic');
        return this.getTonic(); 
    }

    setKey(key) { 
        if (!key) {
            console.error('Bad conductor key', key);
            return;
        } else if(key === this.key) { return this.key }

        this.key = key;
        this.notify('key');
        this.tones = Tonal.Chord.notes(this.getTonalChord());
        // this.progression = ChordProgression.in(this.tonic, this.key);
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
