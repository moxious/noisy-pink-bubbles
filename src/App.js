import * as React from 'react';
import './App.css';
// import MusicCanvas from './components/MusicCanvas';
import Toolbar from './components/NPBToolbar';
import BouncingBalls from './model/worlds/BouncingBalls';
import Conductor from './sound/Conductor';
import BodySound from './sound/BodySound';
import Hummer from './sound/Hummer';

import Joyride from 'react-joyride';
import steps from './joyride-steps';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      world: null,
      hummer: null,
      conductor: new Conductor(),
    };
  }

  componenetWillMount() {
  }

  componentDidMount() {
    this.state.world = new BouncingBalls({ conductor: this.state.conductor });
    this.state.hummer = new Hummer(this.state.conductor);

    this.state.hummer.start();
    this.state.conductor.coordinate(this.state.world);
    this.state.world.getRenderer().resize();
  }

  joyrideCallback(e) {
    console.log('Joyride: ', e);
  }

  render() {
    return (
      <div className="App">
        <Joyride
          ref="joyride"
          steps={steps}
          run={true} // or some other boolean for when you want to start it
          autoStart={false}
          debug={true}
          callback={(e) => this.joyrideCallback(e)}
        />
        <Toolbar app={this.state} />
        <canvas id="viewport" width="1000" height="500" />
      </div>
    );
  }
}

export default App;
