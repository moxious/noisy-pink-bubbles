import * as palette from 'google-palette';

const schemes = ['sequential', 
    ['tol', 'dv'],
    ['tol', 'sq'],
    ['tol', 'rainbow'],

    ['sequential', 'cbf', 'Blues'],
    ['sequential', 'cbf', 'Reds'],

    ['sequential', 'cbf', 'BuGn'],
    ['sequential', 'cbf', 'BuPu'],
    ['sequential', 'cbf', 'GnBu'],

    ['diverging', 'cbf', 'BrBG'],
    ['diverging', 'cbf', 'PRGn'],
    ['diverging', 'cbf', 'RdYlBu'],
    ['diverging', 'cbf', 'Spectral'],
];

/**
 * Generate a variable sized, dynamic palette, following design principles from 
 * the google people.
 * https://www.npmjs.com/package/google-palette
 */
export default () => {
    const randScheme = schemes[Math.floor(Math.random() * schemes.length)];
    const p = palette(randScheme, Math.floor(Math.random() * 8) + 5);
    if (!p) {
        throw new Error('Invalid palette ' + randScheme);
    }

    // console.log('Palette ', randScheme, p);
    return p.map(color => `0x${color}`);
}