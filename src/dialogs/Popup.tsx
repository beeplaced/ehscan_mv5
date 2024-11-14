import { useEffect, useState } from 'react';

const Popup = ({ isOpen, onClose, type }) => {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      // Clear the timer if the popup is closed manually before 5 seconds
      return () => clearTimeout(timer);
    } else if (isVisible) {
      // Start fade-out transition before removing from DOM
      setTimeout(() => setIsVisible(false), 300); // Matches CSS transition duration
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;


const content = () => {
  if (type === 'savedTask') {
    return <>A re-evaluation task has been created. Please check back shortly to view the updated results.</>;
  }
  return <>default</>;
};

  return (
    <div className={`popup-overlay ${isOpen ? 'fade-in' : 'fade-out'}`}>
      <div className="popup-content">
        <div className='popup-content-text'>{content()}</div>
        <div className='popup-content-close _t' onClick={onClose}>ok</div>
        </div>
    </div>
  );
};

export default Popup;
