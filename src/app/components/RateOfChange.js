import React from 'react';

const millisInMinute = 60000;

export default function RateOfChange({ data }) {
  const first = data[0];
  const last = data[data.length - 1];
  const amountChanged = last.value - first.value;
  const millisPassed = last.timestamp - first.timestamp;
  const slope = Number(amountChanged / (millisPassed / millisInMinute)).toFixed(4);
  return <div className="rate">Temperature has {slope < 0 ? 'dropped' : 'risen'} {slope}°C per minute</div>;
}
