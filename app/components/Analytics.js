import React from 'react';
import RateOfChange from './RateOfChange';
import Graph from './Graph';

const maxGraphPoints = 16;

const byRange = (start, end) => pt => pt.timestamp > start && pt.timestamp < end;
const bySample = modTarget => (pt, index) => index !== 0 && index % modTarget === 0;

export default function Analytics({ data, start, end }) {
  const modForSplitting = Math.ceil(data.length / maxGraphPoints);
  const conciseData = data
    .filter(byRange(start, end))
    .filter(bySample(modForSplitting));
  if (conciseData.length === 0) {
    return <div>No data for that time range</div>;
  }
  return (
    <div>
      <Graph data={conciseData} />
      <RateOfChange data={conciseData} />
    </div>
  );
}
