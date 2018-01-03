import * as React from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import SurroundSound from 'material-ui/svg-icons/av/surround-sound';
import IconButton from 'material-ui/IconButton';
import VolumeMute from 'material-ui/svg-icons/av/volume-mute';
import VolumeUp from 'material-ui/svg-icons/av/volume-up';

import './HummerControls.css';

export default class HummerControls extends React.Component {
    constructor(props) {
        super(props);

        // Contains world, conductor.
        this.state = {
            app: props.app,
            openMenu: false,
            tempo: props.app.conductor.getTempo(),
            started: props.app.hummer.isRunning(),
            tempoLabel: `Tempo: ${props.app.conductor.getTempo()} BPM`,
        };

        props.app.conductor.register(this);
    }

    /** Notify us of conductor changes so we can update state. */
    onConductorChange(property, value, conductor) {
        if (property === 'tempo') {
            this.setState({
                tempo: value,
                tempoLabel: `Tempo: ${this.state.app.conductor.getTempo()} BPM`,
            });
            // console.log('State sync to conductor tempo ', value);
        }
    }

    arpeggiate() { 
        this.state.app.hummer.setMode('arpeggiate');
    }

    tonics() { 
        this.state.app.hummer.setMode('tonic');
    }

    handleOnRequestChange = (value) => {
        this.setState({
            openMenu: value,
        });
    }

    handleOpenMenu() {
        // console.log('Setting menu');
        this.setState({
            openMenu: true,
        });
    }

    handleTempoSlider = (event, value) => {
        // console.log('Tempo slider: ', value, 'against present ', this.state.tempo,
        //     'and conductor', this.state.app.conductor.getTempo());
        this.setState({ 
            tempo: value,
            tempoLabel: `Tempo: ${this.state.app.conductor.getTempo()} BPM`,
        });
        this.state.app.conductor.setTempo(value);
    };

    toggleHummer() {
        if (this.state.started) {
            this.state.app.hummer.stop();
        } else {
            this.state.app.hummer.start();
        }

        this.setState({ started: !this.state.started });
    }

    render() {
        return (
            <div className="HummerControls">
            {/* <ToolbarGroup> */}
                <IconMenu
                    iconButtonElement={<IconButton tooltip="Hummer"
                        tooltipPosition="top-center"><SurroundSound /></IconButton>}
                    onRequestChange={this.handleOnRequestChange}
                    open={this.state.openMenu}>
                    <MenuItem>
                        <Checkbox
                            checkedIcon={<VolumeMute />}
                            uncheckedIcon={<VolumeUp />}
                            onClick={(e) => this.toggleHummer(e) }
                            checked={this.state.started}
                            label={ this.state.started ? "Mute Bass" : "Enable Bass" }/>
                    </MenuItem>
                    <Divider />
                    <MenuItem primaryText={ this.state.tempoLabel }/>
                    <Slider className="tempo-slider"
                        min={5}
                        max={200}
                        step={5}
                        value={this.state.tempo}
                        onChange={this.handleTempoSlider}
                    />
                    <Divider />
                    <MenuItem primaryText="Arpeggiate" onClick={(e) => this.arpeggiate(e)} />
                    <MenuItem primaryText="Tonics" onClick={(e) => this.tonics(e)} />
                </IconMenu>
            {/* </ToolbarGroup> */}
            </div>
        );
    }
}
