import React from 'react';
import Graph from './Graph';

const maxGraphPoints = 16;

const byRange = (start, end) => pt => pt.timestamp > start && pt.timestamp < end;
const bySample = modTarget => (pt, index, list) => {
  return index === 0 ||
    index === list.length - 1 ||
    index % modTarget === 0;
};
const getModForSampling = data => Math.ceil(data.length / maxGraphPoints);
const sample = data => data.filter(bySample(getModForSampling(data)));

export default function Analytics({ data, start, end }) {
  const readings = data.map(raw => {
    const filteredReadings = raw.data.map(JSON.parse)
      .filter(byRange(start, end));
    return {
      id: raw.id,
      readings: sample(filteredReadings)
    };
  });
  return (
    <div>
      <Graph readings={readings} />
    </div>
  );
}
