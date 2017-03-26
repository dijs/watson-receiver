import React, { Component } from 'react';
import TimeRangeSlider from './TimeRangeSlider';
import Analytics from './Analytics';
import Cameras from './Cameras';
import request from 'superagent';
// import mockData from './mockData.json';

const millisInHour = 1000 * 60 * 60;
const byPastHours = hours => ({ start: Date.now() - millisInHour * hours, end: Date.now() });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      byPastHours(24),
      {
        data: [],
      }
    );
    // console.log(process.env);
    // setTimeout(() => {
    //   this.setState({
    //     data: mockData,
    //   });
    // }, 1000);
    request
      .get('/measurements')
      .then(raw => {
        this.setState({
          data: raw.body,
        });
      })
      .catch(console.log);
  }
  render() {
    if (this.state.data.length === 0) {
      return <div>Fetching data...</div>;
    }
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
        <Cameras />
      </div>
    );
  }
}
