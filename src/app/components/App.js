import React, { Component } from 'react';
import TimeRangeSlider from './TimeRangeSlider';
import Analytics from './Analytics';
import Cameras from './Cameras';
import request from 'superagent';

const millisInHour = 1000 * 60 * 60;
const byPastHours = hours => ({ start: Date.now() - millisInHour * hours, end: Date.now() });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = byPastHours(24);
  }
  render() {
    if (this.props.data.length === 0) {
      return <div>Fetching data...</div>;
    }
    return (
      <div className="app container">
        <TimeRangeSlider
          onPastHoursChange={hours => this.setState(byPastHours(hours))}
        />
        <Analytics
          data={this.props.data}
          start={this.state.start}
          end={this.state.end}
        />
        <Cameras />
      </div>
    );
  }
}
