import React, { useState, useRef, useEffect } from 'react';
import { getHazardColor } from '../data/levels.js';

interface SliderProps {
  min?: number; // Minimum value
  max?: number; // Maximum value
  value?: number; // Current value of the slider
  title?: String;
  step?: number; // Step value for increments
  onChange?: (value: number) => void; // Callback for value changes
}

const Slider: React.FC<SliderProps> = ({ min = 0, max = 5, value = min, title, step = 1, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { // Ensure the slider value is within the valid range
    if (value >= min && value <= max) {
      setSliderValue(value);
    }
  }, [value, min, max]);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      let touchX = e.touches[0].clientX - sliderRect.left;
      touchX = Math.max(0, Math.min(touchX, sliderRect.width));

      const newValue = Math.round((touchX / sliderRect.width) * (max - min) + min);
      const steppedValue = Math.round(newValue / step) * step; // Snap to step
      const boundedValue = Math.min(Math.max(steppedValue, min), max); // Ensure value stays within bounds

      setSliderValue(boundedValue);
      if (onChange) {
        onChange(boundedValue); // Call onChange with the new value
      }
    }
  };

  return (
    <>
    <div className='long-slider-wrapper _element'>
    <div className='long-slider-title'>{title}</div>
    <div className="slider-container" ref={sliderRef} onTouchMove={handleTouchMove}>
      <div className="slider-line"></div>
      <div
        className="slider-handle"
        style={{
          backgroundColor: getHazardColor(value).bck_color,
          left: `calc(${((sliderValue - min) / (max - min)) * 100}% + ${sliderValue === min ? '15px' : sliderValue === max ? '-15px' : '0px'})`
        }}
      >{value}</div>
    </div>
    </div>
    </>
  );
};

export default Slider;
