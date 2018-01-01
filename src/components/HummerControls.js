import * as React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import SurroundSound from 'material-ui/svg-icons/av/surround-sound';
import IconButton from 'material-ui/IconButton';


// import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { ToolbarGroup } from 'material-ui/Toolbar';

export default class HummerControls extends React.Component {
    constructor(props) {
        super(props);

        // Contains world, conductor.
        this.state = {
            app: props.app,
            openMenu: false,
            tempo: props.app.conductor.getTempo(),
        };
    }

    start() { this.state.app.hummer.start(); }
    stop() { this.state.app.hummer.stop(); }

    adjustTempo(factor) {
        const tempo = this.state.app.conductor.getTempo() * factor;
        this.state.app.conductor.setTempo(Math.floor(tempo));
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
        console.log('Setting menu');
        this.setState({
            openMenu: true,
        });
    }


    handleTempoSlider = (event, value) => {
        this.setState({ tempo: value });
        this.state.app.conductor.setTempo(value);
    };

    render() {
        return (
            <ToolbarGroup>
                <IconMenu
                    iconButtonElement={<IconButton tooltip="Hummer"
                        tooltipPosition="top-center"><SurroundSound /></IconButton>}
                    onRequestChange={this.handleOnRequestChange}
                    open={this.state.openMenu}>
                    <MenuItem primaryText="Stop" onClick={(e) => this.stop(e)} />
                    <MenuItem primaryText="Start" onClick={(e) => this.start(e)} />
                    <Divider />
                    <Slider
                        min={5}
                        max={200}
                        step={5}
                        value={this.state.tempo}
                        onChange={this.handleTempoSlider}
                    />
                    <MenuItem primaryText="Faster" onClick={(e) => this.adjustTempo(1.2)} />
                    <MenuItem primaryText="Slower" onClick={(e) => this.adjustTempo(0.8)} />
                    <Divider />
                    <MenuItem primaryText="Arpeggiate" onClick={(e) => this.arpeggiate(e)} />
                    <MenuItem primaryText="Tonics" onClick={(e) => this.tonics(e)} />
                </IconMenu>
            </ToolbarGroup>
        );
    }
}
