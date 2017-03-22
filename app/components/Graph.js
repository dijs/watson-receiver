import React from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import moment from 'moment';

const millisInMinute = 60000;

const byTime = time => moment(time).format('h:mm a');
const byDegrees = value => `${Math.round(value)}°C`;

export default function RateOfChange({ data }) {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
    >
      <VictoryAxis tickFormat={byTime} />
      <VictoryAxis dependentAxis tickFormat={byDegrees} />
      <VictoryLine
        data={data}
        interpolation={'catmullRom'}
        x="timestamp"
        y="value"
      />
    </VictoryChart>
  );
}
