import React from 'react';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

const maxHours = 24 * 8;

export default function TimeRangeSlider({ onPastHoursChange }) {
  const marks = {
    24: 'Past day',
    [24 * 3]: 'Past 3 days',
    [24 * 7]: 'Past week',
  };
  return <Slider defaultValue={24} marks={marks} max={maxHours} onChange={onPastHoursChange} />;
}
