import { useEffect } from 'react';

export const useCyberCursor = () => {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      document.body.style.cursor = 'auto';
      return;
    }
    

    const cursor = document.createElement('div');
    cursor.className = 'cyber-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cyber-cursor-dot';
    document.body.appendChild(cursorDot);
    

    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    

    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    cursorX = targetX;
    cursorY = targetY;
    

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    

    const throttle = (func, limit) => {
      let lastFunc;
      let lastRan;
      return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    };

    const handleMouseMove = throttle((e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, 10); 
    

    const updateCursorPosition = () => {

      cursorX += (targetX - cursorX) * 0.2;
      cursorY += (targetY - cursorY) * 0.2;
      

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      
      requestAnimationFrame(updateCursorPosition);
    };
    

    let animationFrame = requestAnimationFrame(updateCursorPosition);
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      
      if (isInteractive) {
        cursor.classList.add('expand');
      }
    };
    
    const handleMouseOut = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      
      if (isInteractive) {
        cursor.classList.remove('expand');
      }
    };
    

    document.body.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.body.addEventListener('mouseout', handleMouseOut, { passive: true });
    

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        animationFrame = requestAnimationFrame(updateCursorPosition);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    

    cursor.style.display = 'block';
    cursor.style.opacity = '1';
    cursorDot.style.display = 'block';
    cursorDot.style.opacity = '1';
    

    document.body.style.cursor = 'none';
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      cancelAnimationFrame(animationFrame);
      
      if (cursor && cursor.parentNode) {
        document.body.removeChild(cursor);
      }
      
      if (cursorDot && cursorDot.parentNode) {
        document.body.removeChild(cursorDot);
      }
      

      document.body.style.cursor = 'auto';
    };
  }, []);
};

export default useCyberCursor;
