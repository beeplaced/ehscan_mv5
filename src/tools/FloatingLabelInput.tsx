import React, { useState } from 'react';

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-container ">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(!!value)}
        className="floating-input _element"
      />
      <label className={`floating-label ${isFocused || value ? 'active' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
