import React from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import moment from 'moment';
import capitalize from 'lodash/capitalize';

const millisInMinute = 60000;

const byTime = time => moment(time).format('h:mm a');
const byDegrees = value => `${Math.round(value)}°C`;

export default function Graph({ readings }) {
  const lines = readings.map(sensor => {
    return <VictoryLine
      data={sensor.readings}
      interpolation={'catmullRom'}
      x="timestamp"
      y="value"
      labels={capitalize(sensor.id.replace(/-/g, ' '))}
    />;
  });
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
    >
      <VictoryAxis tickFormat={byTime} />
      <VictoryAxis dependentAxis tickFormat={byDegrees} />
      {lines}
    </VictoryChart>
  );
}
