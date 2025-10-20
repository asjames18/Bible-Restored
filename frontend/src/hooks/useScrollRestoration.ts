import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
}

const scrollPositions = new Map<string, ScrollPosition>();

/**
 * Hook to save and restore scroll position on route changes
 */
export function useScrollRestoration() {
  const location = useLocation();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    const key = location.pathname + location.search;

    // Save current scroll position before unmounting
    return () => {
      scrollPositions.set(key, {
        x: window.scrollX,
        y: window.scrollY,
      });
    };
  }, [location]);

  useEffect(() => {
    const key = location.pathname + location.search;
    const savedPosition = scrollPositions.get(key);

    if (savedPosition && !isRestoringRef.current) {
      isRestoringRef.current = true;
      
      // Restore scroll position after a short delay to allow content to render
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: 'instant' as ScrollBehavior,
        });
        isRestoringRef.current = false;
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // Scroll to top for new routes
      window.scrollTo(0, 0);
    }
  }, [location]);
}

/**
 * Hook for smooth scroll to specific element
 */
export function useScrollToElement() {
  const scrollToElement = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  return scrollToElement;
}

/**
 * Hook for infinite scroll
 */
export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number;
    enabled?: boolean;
  } = {}
) {
  const { threshold = 300, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (scrollHeight - (scrollTop + clientHeight) < threshold) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, threshold, enabled]);
}

/**
 * Hook to detect scroll direction
 */
export function useScrollDirection() {
  const lastScrollY = useRef(0);
  const direction = useRef<'up' | 'down'>('down');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        direction.current = 'down';
      } else if (currentScrollY < lastScrollY.current) {
        direction.current = 'up';
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}

