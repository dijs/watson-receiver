import React from 'react';
import { VictoryLine, VictoryChart, VictoryGroup, VictoryAxis, VictoryTheme, VictoryLegend } from 'victory';
import moment from 'moment';
import capitalize from 'lodash/capitalize';

const millisInMinute = 60000;

const byTime = time => {
  const t = moment(time);
  if (moment().diff(t, 'days') >= 1) {
    return t.fromNow(true)
      .replace(/days?/, 'd')
      .replace(/a/, '1');
  }
  return t.format('h a');
}
const byDegrees = value => `${Math.round(value)}°C`;

export default function Graph({ readings }) {
  const lines = readings.map(sensor => {
    return <VictoryLine
      key={sensor.id}
      data={sensor.readings}
      interpolation={'catmullRom'}
      x="timestamp"
      y="value"
    />;
  });
  const legendData = readings.map(sensor => {
    return {
      name: capitalize(sensor.id.replace(/-/g, ' ')),
    };
  });
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
    >
      <VictoryAxis tickFormat={byTime} />
      <VictoryAxis dependentAxis tickFormat={byDegrees} />
      <VictoryGroup colorScale={'heatmap'}>
        {lines}
      </VictoryGroup>
      <VictoryLegend
        colorScale={'heatmap'}
        data={legendData}
        orientation="horizontal"
      />
    </VictoryChart>
  );
}
