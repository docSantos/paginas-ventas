'use client'

import { useEffect } from 'react'

export function ErudaProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const script = document.createElement('script');
      script.src = '//cdn.jsdelivr.net/npm/eruda';
      document.body.appendChild(script);
      script.onload = () => {
        // @ts-ignore
        window.eruda?.init();
      };
    }
  }, []);
  
  return null;
}
