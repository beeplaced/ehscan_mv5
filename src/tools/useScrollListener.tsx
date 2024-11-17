import { useEffect, useRef, useState } from 'react';

type UseScrollListenerResult = {
  scrollRef: React.RefObject<HTMLDivElement>;
  isAtTop: boolean;
  scrollDown: boolean
};

const useScrollListener = ({ scrollDown = false, scrollDownTrigger }): UseScrollListenerResult => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isListenerAdded = useRef(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      setIsAtTop(scrollTop === 0);
    }
  };

    if (scrollDown){
      const [isFirstRender, setIsFirstRender] = useState(true);
      useEffect(() => { // Set initial scroll position before component becomes visible
      if (isFirstRender) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.style.visibility = 'hidden';
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              scrollRef.current.style.visibility = 'visible';
            }
            setIsFirstRender(false);
          }, 200);
        });
      } else if (scrollRef.current) {
        scrollRef.current.style.visibility = 'hidden';
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        scrollRef.current.style.visibility = 'visible';
      }
    }, [isFirstRender, scrollDownTrigger]);
  }

  useEffect(() => {
    if (scrollRef.current && !isListenerAdded.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      isListenerAdded.current = true;
      return () => {
        if (scrollRef.current) {
          //scrollRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, []);

  return { scrollRef, isAtTop };
};

export default useScrollListener;
