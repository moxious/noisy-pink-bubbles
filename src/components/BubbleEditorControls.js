import * as React from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import EditMode from 'material-ui/svg-icons/editor/mode-edit';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { ToolbarGroup } from 'material-ui/Toolbar';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const VECTOR_UP = { x: 0, y: -0.5 };
const VECTOR_DOWN = { x: 0, y: 0.5 };
const VECTOR_LEFT = { x: -0.5, y: 0 };
const VECTOR_RIGHT = { x: 0.5, y: 0 };

export default class BubbleEditorControls extends React.Component {
    constructor(props) {
        super(props);

        this.tooltip = 'Change how elements are added';

        this.state = {
            app: props.app,
            openMenu: false,
            addMode: 'bubble',
            initialVector: VECTOR_DOWN,
        };
    }

    handleOnRequestChange = (value) => {
        this.setState({
            openMenu: value,
        });
    }

    changeAddMode(event, value) {
        console.log('ADD MODE', value);
        this.setState({ addMode: value });
        this.state.app.world.setAddMode(value);
    }

    changeInitialVector(event, vector) {
        console.log('Change initial vector', vector);
        this.setState({ initialVector: vector });
        this.state.app.world.setNewBodyVector(vector);
    }

    clear() {
        console.log('Clear All');
        this.state.app.world.removeAll();
    }

    render() {
        return (
            <div className="BubbleEditorControls">
                <IconMenu iconButtonElement={<IconButton tooltip={this.tooltip}><EditMode/></IconButton>}
                    open={this.state.openMenu}
                    onRequestChange={this.handleOnRequestChange}>
                    <MenuItem primaryText="Clicking the canvas adds a:"/>
                    <Divider />
                    <MenuItem>
                        <RadioButtonGroup 
                            onChange={(e, value) => this.changeAddMode(e, value)}
                            name="addType" 
                            defaultSelected={this.state.addMode}>
                            <RadioButton
                                value="bubble"
                                label="Tone Bubble"
                                styles={ { marginBottom: 16 } }
                            />
                            <RadioButton
                                value="bumper"
                                label="Bumper"
                                styles={ { marginBottom: 16 } }
                            />
                        </RadioButtonGroup>
                    </MenuItem>

                    <MenuItem primaryText="Clicking the canvas adds a:"/>
                    <Divider/>
                    <MenuItem>
                        <RadioButtonGroup 
                            onChange={(e, value) => this.changeInitialVector(e, value)}
                            name="addType" 
                            defaultSelected={this.state.initialVector}>
                            <RadioButton
                                value={ VECTOR_UP }
                                label="Up"/>
                            <RadioButton
                                value={ VECTOR_DOWN }
                                label="Down"/>
                            <RadioButton
                                value={ VECTOR_LEFT }
                                label="Left"/>
                            <RadioButton
                                value={ VECTOR_RIGHT }
                                label="Right"/>
                        </RadioButtonGroup>
                    </MenuItem>

                    <MenuItem primaryText="Clear Canvas"
                        onClick={(e) => this.clear(e)}
                    />
                </IconMenu>
            </div>
        );
    }
}