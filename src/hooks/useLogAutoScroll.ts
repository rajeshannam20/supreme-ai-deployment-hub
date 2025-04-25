
import { useEffect, useRef } from 'react';

export const useLogAutoScroll = (logs: string[], autoScroll: boolean) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  return logsEndRef;
};

export default useLogAutoScroll;
