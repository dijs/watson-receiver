import React, { Component } from 'react';
import TimeRangeSlider from './TimeRangeSlider';
import Analytics from './Analytics';
import request from 'superagent';

export default class Cameras extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getInfo = this.getInfo.bind(this);
    this.renderCamera = this.renderCamera.bind(this);
  }
  componentDidMount() {
    setInterval(() => {
      this.forceUpdate();
    }, 5000);
  }
  getInfo(index) {
    this.setState({
      [`info-${index}`]: true,
    });
    request
      .get(`/snapshot-info/${index}`)
      .then(raw => {
        this.setState({
          [`info-${index}`]: raw.body,
        });
      })
      .catch(console.log);
  }
  renderInfo(info) {
    if (!info) {
      return <div className="info">No info yet (Tap Image)</div>;
    }
    if (info === true) {
      return <div className="info">Processing...</div>;
    }
    const confidentLabels = info.Labels
      .filter(label => label.Confidence > 80)
      .map(label => label.Name)
      .map(name => <span className="label">{name}</span>);
    if (confidentLabels.length === 0) {
      return <div className="info">No labels found.</div>;
    }
    return <div className="info">
      {confidentLabels}
    </div>
  }
  renderCamera(index) {
    return (
      <div className="camera">
        <img
          src={`/snapshot/${index}?time=${Date.now()}`}
          onClick={() => this.getInfo(index)}
        />
        {this.renderInfo(this.state[`info-${index}`])}
      </div>
    );
  }
  render() {
    return (
      <div className="cameras">
        {this.renderCamera(0)}
        {this.renderCamera(1)}
      </div>
    );
  }
}
