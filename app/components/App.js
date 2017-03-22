import React, { Component } from 'react';
import TimeRangeSlider from './TimeRangeSlider';
import Analytics from './Analytics';

const millisInHour = 1000 * 60 * 60;
const byPastHours = hours => ({ start: Date.now() - millisInHour * hours, end: Date.now() });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: Date.now(),
      data: []
    };
    // We can gather more data later....
    fetch('/measurements/upstairs-temperature')
      .then(res => res.json())
      .then(rawData => {
        this.setState({
          data: rawData.map(JSON.parse),
        });
      });
  }
  render() {
    return (
      <div className="app container">
        <TimeRangeSlider
          onPastHoursChange={hours => this.setState(byPastHours(hours))}
        />
        <Analytics
          data={this.state.data}
          start={this.state.start}
          end={this.state.end}
        />
      </div>
    );
  }
}
