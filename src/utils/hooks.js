import { useState, useEffect } from 'react';

export const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const currentRef = ref;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(entry.isIntersecting);
        observer.disconnect();
      }
    }, options);

    if (currentRef.current) {
      observer.observe(currentRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
};
