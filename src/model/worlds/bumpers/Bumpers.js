export default class Bumpers {
    constructor(component, renderer) {
        this.component = component;
        this.renderer = renderer;
        this.bumpers = [];
    }

    reposition() {
        throw new Error('Implement me');
    }

    isBumper(body) {
        return this.bumpers.indexOf(body) > -1;
    }    
}