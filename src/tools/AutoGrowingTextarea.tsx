import React, { useRef, useState, useEffect } from 'react';

interface AutoGrowingTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const AutoGrowingTextarea: React.FC<AutoGrowingTextareaProps> = ({ label, value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    setIsFocused(true)
    setHeight()
  };

  const setHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }

    useEffect(() => {
      setHeight()
  }, [value]); // Re-run when `value` changes

  return (
    <div className="textarea-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onFocus={adjustTextareaHeight}
        onBlur={adjustTextareaHeight}
        className="auto-growing-textarea _element"
        rows={1}
        spellCheck={false}
      />
      <label className={`textarea-label ${isFocused || value ? 'active' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default AutoGrowingTextarea;
