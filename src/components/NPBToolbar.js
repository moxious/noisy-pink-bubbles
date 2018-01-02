import * as React from 'react';
import BouncingBallsControls from './BouncingBallsControls';
import HummerControls from './HummerControls';
import BubbleEditorControls from './BubbleEditorControls';
import { Toolbar } from 'material-ui/Toolbar';
import './NPBToolbar.css';

export default class NPBToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            app: props.app,
        };
    }

    render() {
        return (
            <Toolbar className="NPBToolbar">
                <HummerControls app={this.state.app}/>
                {/* <BubbleEditorControls app={this.state.app}/> */}
                <BouncingBallsControls app={this.state.app}/>
            </Toolbar>
        );
    }
}