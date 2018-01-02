import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Physics from 'physicsjs';

import IconButton from 'material-ui/IconButton';
import SlowMotion from 'material-ui/svg-icons/av/slow-motion-video';
import VolumeMute from 'material-ui/svg-icons/av/volume-mute';
import VolumeUp from 'material-ui/svg-icons/av/volume-up';
import FastForward from 'material-ui/svg-icons/av/fast-forward';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import Pause from 'material-ui/svg-icons/av/pause';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';

// import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { ToolbarGroup } from 'material-ui/Toolbar';

export default class BouncingBallsControls extends React.Component {
    constructor(props) {
        super(props);

        // Contains world, conductor.
        this.state = {
            app: props.app,
            chord: "C",
            key: "M",
            synth: "AM",
            paused: false,
            muted: false,
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

        const scaledVec = Physics.vector((x === 0 ? 0.1 : x), (y === 0 ? 0.1 : y));

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
            this.setState({ paused: false });
            return phys.unpause();
        }

        this.setState({ paused: true });
        return phys.pause();
    }

    toggleMute() {
        if (this.state.muted) {
            this.setState({ muted: false });
            this.state.app.conductor.mute(false);
        } else {
            this.state.app.conductor.mute(true);
            this.setState({ muted: true });
        }
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

    addBody(incr) {
        if (incr > 0) {
            return this.state.app.world.addBody(this.state.app.conductor);
        }
        
        return this.state.app.world.removeBody();
    }

    render() {
        return (
            <ToolbarGroup>
            <ToolbarGroup>
                <IconButton
                    tooltip="Pause/Unpause"
                    onClick={(e) => this.togglePause(e)}
                >
                    { this.state.paused ? <PlayArrow/> : <Pause/> }
                </IconButton>

                <IconButton 
                    tooltip="Mute/Unmute" 
                    disabled={this.state.paused} 
                    onClick={(e) => this.toggleMute(e)}>
                    { this.state.muted ? <VolumeUp/> : <VolumeMute/>}
                </IconButton>

                <IconButton disabled={this.state.paused} tooltip="Speed Up" onClick={(e) => this.excite(0.3, 1)}><FastForward/></IconButton>
                <IconButton disabled={this.state.paused} tooltip="Slow Down" onClick={(e) => this.excite(0.3, -11)}><SlowMotion/></IconButton>                

                <IconButton disabled={this.state.paused} tooltip="Add Ball" onClick={(e) => this.addBody(1)}><AddCircle/></IconButton>
                <IconButton disabled={this.state.paused} tooltip="Remove Ball" onClick={(e) => this.addBody(-1)}><RemoveCircle/></IconButton>
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
                    <MenuItem value='AM' primaryText='Synth: Basic'/>
                    <MenuItem value='pwm' primaryText='Synth: pwm'/>
                    <MenuItem value='square' primaryText='Synth: square'/>
                    <MenuItem value='triangle' primaryText='Synth: triangle'/>
                    <MenuItem value='sine' primaryText='Synth: Sine'/>
                    <MenuItem value='sawtooth' primaryText='Synth: Sawtooth'/>
                </SelectField>
            </ToolbarGroup>
            </ToolbarGroup>
        );
    }
}
