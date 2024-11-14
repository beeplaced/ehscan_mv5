import { useEffect, useRef, useState } from 'react';

type UseScrollListenerResult = {
  scrollRef: React.RefObject<HTMLDivElement>;
  isAtTop: boolean;
};

const useScrollListener = (): UseScrollListenerResult => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isListenerAdded = useRef(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = () => {
    console.log('s')
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      setIsAtTop(scrollTop === 0);
    }
  };

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
