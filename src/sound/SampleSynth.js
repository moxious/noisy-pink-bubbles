import Tone from 'tone';

export default () => {
    return new Tone.Sampler({
        'A0' : 'BD-ER1-808ish1.wav',
        'C1' : 'BD-ER1-808ish2.wav',
        'D#1' : 'BD-ER1-808ish3.wav',
        'F#1' : 'BD-ER1-908-uhhhhhhh.wav',
        'A1' : 'BD-ER1-909iooo.wav',
        'C2' : 'BD-ER1-90sTrance.wav',
        'D#2' : 'BD-ER1-90sTrance2.wav',
        'F#2' : 'BD-ER1-90sTrance2longdecay.wav',
        'A2' : 'BD-ER1-CR8000ish.wav',
        'C3' : 'BD-ER1-CR8000ishMoreDecay.wav',
        'D#3' : 'BD-ER1-CR8000ishMostDecay.wav',
        'F#3' : 'BD-ER1-GoaKick.wav',
        'A3' : 'BD-ER1-GoaKickLongDecay.wav',
        'C4' : 'BD-ER1-Hotmix95.wav',
        'D#4' : 'BD-ER1-Hotmix95laser.wav',
        'F#4' : 'BD-ER1-Hotmix95trance.wav',
        'A4' : 'BD-ER1-LazerBD1.wav',
        'C5' : 'BD-ER1-LazerBD2.wav',
        'D#5' : 'BD-ER1-LazerBD3.wav',
        'F#5' : 'BD-ER1-LazerBD5.wav',
        'A5' : 'BD-ER1-Snuiter1.wav',
        'C6' : 'BD-ER1-Stump.wav',
        'D#6' : 'CLPZ-ER1-ClapClick.wav',
        'F#6' : 'CLPZ-ER1-ClapDoffel.wav',
        'A6' : 'CLPZ-ER1-ClapHaze.wav',
        'C7' : 'CLPZ-ER1-ClapHiFive.wav',
        'D#7' : 'CLPZ-ER1-ClapLow.wav',
        'F#7' : 'CLPZ-ER1-ClapLowest.wav',
        'A7' : 'CLPZ-ER1-ClapNeat.wav',
        'C8' : 'CLPZ-ER1-Clapnormal.wav'
    }, {
        'release' : 1,
        'baseUrl' : './KORGER1Samples/'
    }).toMaster();
};