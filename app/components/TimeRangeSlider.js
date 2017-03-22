import React from 'react';
import Slider from 'rc-slider/lib/Slider';
import moment from 'moment';
import 'rc-slider/assets/index.css';

const numberOfTicks = 5;
const maxHours = 24 * 7;
const modForMarks = Math.ceil(maxHours / numberOfTicks);
const millisInHour = 1000 * 60 * 60;

const byAssigningTimeMarks = (memo, value, index) => {
  if (index === 0) {
    return memo;
  }
  const now = Date.now();
  const hours = index * modForMarks;
  const humanString = moment(now).to(now - millisInHour * hours, true);
  memo[hours] = `Past ${humanString.replace(/a\s/, '')}`;
  return memo;
}

export default function TimeRangeSlider({ onPastHoursChange }) {
  const marks = Array(numberOfTicks)
    .fill(0)
    .reduce(byAssigningTimeMarks, {});
  return <Slider marks={marks} max={maxHours} onChange={onPastHoursChange} />;
}
