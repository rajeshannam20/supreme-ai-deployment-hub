
import { useEffect, useRef } from 'react';

export const useLogAutoScroll = (logs: string[], autoScroll: boolean) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current && autoScroll) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  return logsEndRef;
};
