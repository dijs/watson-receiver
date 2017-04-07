import React from 'react';
import capitalize from 'lodash/capitalize';

const byDegrees = value => `${Math.round(value)}°C`;

export default function GraphInfo({ readings }) {
  const infos = readings.map(sensor => {
    const measurements = sensor.readings.map(reading => reading.value);
    const total = measurements.reduce((sum, n) => sum + n, 0);
    const latest = measurements[measurements.length - 1];
    const max = Math.max(...measurements);
    const min = Math.min(...measurements);
    const average = total / measurements.length;
    const name = capitalize(sensor.id.replace(/-/g, ' '));
    return (
      <div className="graph-info">
        <h3 className="title">{name}</h3>
        <div className="info-type">
          <span className="name">Latest</span>
          <span className="value">{byDegrees(latest)}</span>
        </div>
        <div className="info-type">
          <span className="name">Max</span>
          <span className="value">{byDegrees(max)}</span>
        </div>
        <div className="info-type">
          <span className="name">Min</span>
          <span className="value">{byDegrees(min)}</span>
        </div>
        <div className="info-type">
          <span className="name">Average</span>
          <span className="value">{byDegrees(average)}</span>
        </div>
      </div>
    );
  });
  return (
    <div>
      {infos}
    </div>
  );
}
