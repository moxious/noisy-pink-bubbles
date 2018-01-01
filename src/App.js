import * as React from 'react';
import './App.css';
// import MusicCanvas from './components/MusicCanvas';
import Toolbar from './components/NPBToolbar';
import BouncingBalls from './model/worlds/BouncingBalls';
import Conductor from './sound/Conductor';
import BodySound from './sound/BodySound';
import Hummer from './sound/Hummer';
// const logo = require('./logo.svg');

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
    this.state.world = new BouncingBalls({ });
    this.state.hummer = new Hummer(this.state.conductor);

    this.state.hummer.start();

    this.state.world.getPhysics().getBodies().forEach(body => {
      body.sounds = new BodySound(this.state.conductor, body);
    });

    this.state.conductor.coordinate(this.state.world);

    this.state.world.getRenderer().resize();
  }

  render() {
    return (
      <div className="App">
        <Toolbar app={this.state} />
        <canvas id="viewport" width="1000" height="500"/>
      </div>
    );
  }
}

export default App;
