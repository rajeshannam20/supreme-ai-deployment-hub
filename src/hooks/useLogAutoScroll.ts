
import { useEffect, useRef } from 'react';

export function useLogAutoScroll(
  enabled: boolean,
  items: any[],
  scrollAreaRef: React.RefObject<HTMLDivElement>
) {
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (!enabled || !scrollAreaRef.current) return;
    
    const scrollElement = scrollAreaRef.current;
    
    // Check if user has scrolled up manually
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
      shouldScrollRef.current = isScrolledToBottom;
    };

    scrollElement.addEventListener('scroll', handleScroll);
    
    // Scroll to bottom if user hasn't scrolled up
    if (shouldScrollRef.current) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
    
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [items, enabled, scrollAreaRef]);
}
