import * as React from 'react';
import BouncingBallsControls from './BouncingBallsControls';
import { Toolbar } from 'material-ui/Toolbar';

export default class NPBToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            app: props.app,
        };
    }

    render() {
        return (
            <Toolbar>
                <BouncingBallsControls app={this.state.app}/>
            </Toolbar>
        );
    }
}