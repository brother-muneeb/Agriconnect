import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    if ((window as any).acInitAnimations) {
      const timer = setTimeout(() => {
        (window as any).acInitAnimations();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
