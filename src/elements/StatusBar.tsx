import React, { useState, useEffect } from 'react';
import { getHazardRangeColor } from '../data/levels.js';

const StatusBar: React.FC<{ score: Record<string, number> }> = ({ score }) => {
  const [bar, setBar] = useState('');

  useEffect(() => {
    let gradient = '';
    const clrArr = Object.keys(score);
    let sumPerc = 0;
    const sum = Object.values(score).reduce((total, value) => total + value, 0);

    clrArr.forEach((key, i) => {
      const color = getHazardRangeColor(key).bck_color;
      const amount = score[key];
      const percentage = (amount / sum) * 100;
      sumPerc += percentage;
      const last = sumPerc - percentage;

      if (i === clrArr.length - 1) {
        gradient += `${color} ${last}% 100%`;
      } else {
        gradient += `${color} ${last}% ${sumPerc}%, `;
      }
    });

    setBar(gradient);
  }, [score]);

  return <div className="status-bar-simple" style={{ background: `linear-gradient(to right, ${bar})` }}></div>;
};

export default StatusBar;
