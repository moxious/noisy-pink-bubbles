import * as React from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import IconButton from 'material-ui/IconButton';
import EditMode from 'material-ui/svg-icons/editor/mode-edit';
import { ToolbarGroup } from 'material-ui/Toolbar';

export default class BubbleEditorControls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            app: props.app,
            openMenu: false,
        };
    }

    handleOnRequestChange = (value) => {
        this.setState({
            openMenu: value,
        });
    }

    render() {
        return (
            <ToolbarGroup>
                <IconMenu iconButtonElement={<IconButton tooltip="Edit"><EditMode/></IconButton>}
                    open={this.state.openMenu}
                    onRequestChange={this.handleOnRequestChange}>
                    <MenuItem primaryText="Foo" onClick={(e) => console.log('Foo')}/>
                </IconMenu>
            </ToolbarGroup>
        );
    }
}