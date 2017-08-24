import React from 'react';

import './app.scss';

const LANE_TOP_SPEED = 1000;
const CHANGE_INTERVAL = 25;
const LANE_SPEED_INCREASE_RATE = 13;
const LANE_SPEED_DECREASE_RATE = 15;

const pixelToMetres = (inputPx) => inputPx * 0.026458333 / 100;

const mpsToKmph = (inputMps) => inputMps * 18 / 5;

class App extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      increasingSpeed: false,
      decreasingSpeed: false,
      laneSpeed: 0,
      laneTop: 0,
      distanceCovered: 0,
      speedChangeInterval: undefined,
      topChangeInterval: undefined
    };
  }
  componentDidMount () {
    this.pixelContainer.focus();
    this.topChangeInterval = window.setInterval(() => this.setLaneTop(), CHANGE_INTERVAL);
  }
  setIncreasingSpeed (increasingSpeed) {
    this.setState({
      increasingSpeed
    });
  }
  setDecreasingSpeed (decreasingSpeed) {
    this.setState({
      decreasingSpeed
    });
  }
  addSpeed () {
    let {laneSpeed} = this.state;
    if (laneSpeed >= LANE_TOP_SPEED) {
      this.setIncreasingSpeed(false);
      window.clearInterval(this.speedChangeInterval);
      return;
    }
    laneSpeed += LANE_SPEED_INCREASE_RATE;
    this.setLaneSpeed(laneSpeed);
  }
  reduceSpeed () {
    let {laneSpeed} = this.state;
    if (laneSpeed <= 0) {
      this.setLaneSpeed(0);
      this.setDecreasingSpeed(false);
      window.clearInterval(this.speedChangeInterval);
      return;
    }
    laneSpeed -= LANE_SPEED_DECREASE_RATE;
    this.setLaneSpeed(laneSpeed);
  }
  setLaneSpeed (laneSpeed) {
    this.setState({
      laneSpeed
    });
  }
  setLaneTop () {
    let {laneTop, laneSpeed, distanceCovered} = this.state;
    if (laneSpeed === 0) {
      return;
    }
    let changePerTick = laneSpeed / CHANGE_INTERVAL;
    laneTop += changePerTick;
    distanceCovered += changePerTick;
    if (laneTop >= 500) {
      laneTop = 0;
    }
    this.setState({
      distanceCovered,
      laneTop
    });
  }
  onPedalDown (e) {
    if (e.key === 'ArrowUp') {
      let {laneSpeed, increasingSpeed, decreasingSpeed} = this.state;
      if (laneSpeed === LANE_TOP_SPEED) {
        this.setLaneTop();
        return;
      }
      if (decreasingSpeed) {
        window.clearInterval(this.speedChangeInterval);
        this.setDecreasingSpeed(false);
      }
      if (increasingSpeed) {
        return;
      } else {
        this.setIncreasingSpeed(true);
        this.speedChangeInterval = window.setInterval(() => this.addSpeed(), 100);
      }
    }
  }
  onPedalUp () {
    window.clearInterval(this.speedChangeInterval);
    this.setIncreasingSpeed(false);
    this.setDecreasingSpeed(true);
    this.speedChangeInterval = window.setInterval(() => this.reduceSpeed(), 33);
  }
  render () {
    let {laneSpeed, laneTop, distanceCovered} = this.state;
    return (
      <div
        tabIndex={0}
        ref={c => this.pixelContainer = c}
        id="pixel-run-container"
        onKeyDown={(e) => this.onPedalDown(e)}
        onKeyUp={() => this.onPedalUp()}>
        <div id="pixel-run-lane">
          <div style={{
              top: laneTop
            }} id="pixel-run-lane-mark"></div>
        </div>
        <div id="pixel"></div>
        <div id="pixel-lane-speed">{laneSpeed.toFixed(2)} px/s</div>
        <div id="pixel-lane-distance">{distanceCovered.toFixed(2)} px</div>
      </div>
    );
  }
}

export default App;
