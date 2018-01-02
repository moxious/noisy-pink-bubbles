import * as palette from 'google-palette';

const schemes = ['sequential', 'tol', 'qualitative'];

/**
 * Generate a variable sized, dynamic palette, following design principles from 
 * the google people.
 * https://www.npmjs.com/package/google-palette
 */
export default () => {
    const randScheme = schemes[Math.floor(Math.random() * schemes.length)];
    const p = palette([randScheme], Math.floor(Math.random() * 8) + 5);
    console.log('PALETTE ', p);
    return p.map(color => `#${color}`);
}