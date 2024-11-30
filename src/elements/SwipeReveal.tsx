import { useState, useEffect, useRef } from "react";

import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');

const SwipeReveal = ({ index, actions, children, isSwipedOpen, setIsSwipedOpen, setOpen }) => {
  const swipeContainerRef = useRef<HTMLDivElement | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isFading, setIsFading] = useState(false); // Track the fade state
  const maxSwipe = -200//actions.length * 100; // Maximum swipe distance
  let startX = 0;
  let startY = 0;

  useEffect(() => {
  if (index !== isSwipedOpen) triggerFade(); //Fade out if other is opened
  }, [isSwipedOpen]); 

  const handleTouchStart = (e) => {
    if (isFading) return; // Prevent interaction during fade
    setIsSwiping(true);
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY; 
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isFading) return; // Prevent interaction during fade
    const currentX = e.touches[0].clientX;
    let deltaX = currentX - startX;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(e.touches[0].clientY - startY);

    if (isHorizontalSwipe){
    e.preventDefault(); // Prevent scroll
      if (deltaX <= maxSwipe) deltaX = maxSwipe
      //if (deltaX > 0) deltaX = 0
      setSwipeOffset(deltaX)
    }
  };

  const handleTouchEnd = () => {
    if (isFading) return;
    setIsSwiping(false);
  };

  const openFull = () => {
    setSwipeOffset(maxSwipe); // Fully reveal buttons
    setIsSwipedOpen(index);
    setOpen(true)
  }

  useEffect(() => {
    if (!isSwiping) {
      const midpoint = maxSwipe / 2;
      if (swipeOffset <= midpoint) {
        openFull()
      } else {
        triggerFade(); // Trigger fade to zero
      }
    }
  }, [isSwiping]); 

  const triggerFade = () => {
    setOpen(false);
    setIsFading(true);
    setSwipeOffset(0); // Start fading
    setTimeout(() => setIsFading(false), 300); // Duration of the fade (matches CSS)
  };

  useEffect(() => {
    const swipeContainer = swipeContainerRef.current;
    if (swipeContainer) {
      swipeContainer.addEventListener("touchstart", handleTouchStart, { passive: false });
      swipeContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
      swipeContainer.addEventListener("touchend", handleTouchEnd);

      return () => {
        swipeContainer.removeEventListener("touchstart", handleTouchStart);
        swipeContainer.removeEventListener("touchmove", handleTouchMove);
        swipeContainer.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, []);

  return (
    <div className="swipe-container" ref={swipeContainerRef}>
      <div className={`swipe-content ${isSwiping ? "" : "transition"} ${isFading ? "fading" : ""}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}>
        <div className="main-content">{children}</div>
        <div className="action-buttons">
          {actions.map((action, index) => (
            <div key={index}
              className={`action-button ${action.class}`}
              onClick={() => triggerFade()}>
              {action.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwipeReveal;
