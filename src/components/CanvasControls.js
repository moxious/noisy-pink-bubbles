import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Physics from 'physicsjs';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

class CanvasControls extends React.Component {
    constructor(props) {
        super(props);

        // Contains world, conductor.
        this.state = {
            app: props.app,
            chord: "C",
            key: "M",
            synth: "AM",
            toggleLabel: 'Pause',
            paused: false,
        };

        console.log('CanvasControls state ', this.state);
    }

    componentDidMount() {
        document.addEventListener('keypress', e => this.handleKeyPress(e), false);

        this.state.app.conductor.setSynth(this.state.synth);
        this.state.app.conductor.setKey(this.state.key);
        this.state.app.conductor.setChord(this.state.chord);
    }

    handleKeyPress(e) {
        if (!e.key) {
            return;
        }

        const button = e.key;
        console.log('KEYPRESS', button);

        var valid = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        if (valid.indexOf(button.toLowerCase()) > -1) {
            this.setState({ chord: button.toUpperCase() });
            this.state.app.conductor.setTonic(this.state.chord);

            if (button === button.toLowerCase()) {
                this.state.app.conductor.setKey('m');
                this.setState({ key: 'm' });
            } else {
                this.state.app.conductor.setKey('M');
                this.setState({ key: 'M' });
            }

            this.state.app.conductor.coordinate(this.state.app.world);
        } else if (button === '7') {
            const currentKey = this.state.key;
            if (currentKey.endsWith('7')) {
                this.setState({
                    key: this.state.key.substring(0, 1)
                });
            } else {
                this.setState({
                    key: `${this.state.key}7`,
                });
            }

            console.log('Conductor key ', this.state.key);
            this.state.app.conductor.setKey(this.state.key);
            this.state.app.conductor.coordinate(this.state.app.world);
        }
    }

    exciteBody(body, factor, direction=1) {
        const x = (body.state.vel.x * factor * direction);
        const y = (body.state.vel.y * factor * direction);

        const scaledVec = Physics.vector(x, y);
        // console.log('Velocity: ', 
        //     [body.state.vel.x, body.state.vel.y],
        //     [scaledVec.x, scaledVec.y]);
        return body.accelerate(scaledVec);    
    }

    excite(factor, direction=1) {
        return this.state.app.world.getPhysics().getBodies().map(body => this.exciteBody(body, factor, direction));
    }

    togglePause() {
        console.log('Toggle pause world is ', this.state);
        const phys = this.state.app.world.getPhysics();

        if (phys.isPaused()) {
            this.setState({ toggleLabel: 'Pause', paused: false });
            return phys.unpause();
        }

        this.setState({ toggleLabel: 'Unpause', paused: true });
        return phys.pause();
    }

    downwarp() {
        this.state.app.world.getPhysics().warp(0.02);
    }

    upwarp() {
        this.state.app.world.getPhysics().warp(2);
    }

    changeChord(event, index, value) {
        console.log("Chord", value);
        this.setState({ chord: value });
        this.state.app.conductor.setChord(value);
        this.state.app.conductor.coordinate(this.state.app.world);
    }

    changeSynth(event, index, value) {
        console.log('Change synth', value);
        this.state.app.conductor.setSynth(value);
        this.setState({ synth: value });
        this.state.app.conductor.coordinate(this.state.app.world, true);
    }

    changeKey(event, index, value) {
        console.log("Key", event, index, value);
        this.setState({ key: value });
        // this.state.key = value;
        this.state.app.conductor.setKey(this.state.key);
        this.state.app.conductor.coordinate(this.state.app.world);
    }

    render() {
        return (
            
            <Card className="CanvasControls">
                <CardHeader title="Controls"/>

                <CardText>Use the controls below to alter music</CardText>

                <CardActions>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton label={this.state.toggleLabel} onClick={(e) => this.togglePause(e)} />
                            <RaisedButton disabled={this.state.paused} label='Downwarp' onClick={(e) => this.downwarp(e)} />
                            <RaisedButton disabled={this.state.paused} label='Upwarp' onClick={(e) => this.upwarp(e)} />
                            <RaisedButton disabled={this.state.paused} label='Excite' onClick={(e) => this.excite(0.3, 1)} />
                            <RaisedButton disabled={this.state.paused} label='Calm' onClick={(e) => this.excite(0.3, -1)} />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <SelectField value={this.state.chord}
                                onChange={(e, i, v) => this.changeChord(e, i, v)}>
                                <MenuItem value='A' primaryText='A'/>
                                <MenuItem value='Bb' primaryText='A#/Bb'/>
                                <MenuItem value='B' primaryText='B'/>
                                <MenuItem value='C' primaryText='C'/>
                                <MenuItem value='Db' primaryText='C#/Db'/>
                                <MenuItem value='D' primaryText='D'/>
                                <MenuItem value='Eb' primaryText='D#/Eb'/>
                                <MenuItem value='E' primaryText='E'/>
                                <MenuItem value='F' primaryText='F'/>
                                <MenuItem value='Gb' primaryText='F#/Gb'/>
                                <MenuItem value='G' primaryText='G'/>
                                <MenuItem value='Ab' primaryText='G#/Ab'/>
                            </SelectField>
                            <SelectField value={this.state.key}
                                onChange={(e, i, v) => this.changeKey(e, i, v)}>
                                <MenuItem value="M" primaryText="Major"/>
                                <MenuItem value="m" primaryText="Minor"/>
                                <MenuItem value="M7" primaryText="Major7"/>
                                <MenuItem value="m7" primaryText="Minor7"/>
                            </SelectField>
                            <SelectField value={this.state.synth}
                                onChange={(e, i, v) => this.changeSynth(e, i, v)}>
                                <MenuItem value='AM' primaryText='Basic'/>
                                <MenuItem value='pwm' primaryText='pwm'/>
                                <MenuItem value='square' primaryText='square'/>
                                <MenuItem value='triangle' primaryText='triangle'/>
                                <MenuItem value='sine' primaryText='Sine'/>
                                <MenuItem value='sawtooth' primaryText='Sawtooth'/>
                            </SelectField>
                        </ToolbarGroup>
                    </Toolbar>
                </CardActions>
            </Card>
        );
    }
}

export default CanvasControls;
