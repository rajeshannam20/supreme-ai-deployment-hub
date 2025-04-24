
import { useEffect, useRef } from 'react';

export const useLogAutoScroll = (
  data: any[], 
  autoScroll: boolean
): React.RefObject<HTMLDivElement> => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data, autoScroll]);

  return endRef;
};

export default useLogAutoScroll;
