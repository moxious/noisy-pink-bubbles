import * as React from 'react';
import './App.css';
// import MusicCanvas from './components/MusicCanvas';
import Toolbar from './components/NPBToolbar';
import BouncingBalls from './model/worlds/BouncingBalls';
import Conductor from './sound/Conductor';
import Hummer from './sound/Hummer';

import Joyride from 'react-joyride';
import steps from './joyride-steps';

class App extends React.Component {
  constructor(props) {
    super(props);

    const conductor = new Conductor();

    this.state = {
      world: null,
      hummer: new Hummer(conductor),
      conductor,
    };
  }

  componenetWillMount() {
  }

  componentDidMount() {
    this.state.world = new BouncingBalls({ conductor: this.state.conductor });

    // Don't start by default.
    // this.state.hummer.start();

    this.state.conductor.coordinate(this.state.world);
    this.state.world.getRenderer().resize();

    window.addEventListener('dblclick', args => {
      console.log('double click ', args);
    })
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
        <div id="viewport">
        </div>
      </div>
    );
  }
}

export default App;
