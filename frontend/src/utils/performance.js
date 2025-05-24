// src/utils/performance.js

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Creates a memoized version of a function that caches its results
 * @param {Function} func - The function to memoize
 * @returns {Function} - The memoized function
 */
export const memoize = (func) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  };
};

/**
 * Custom React.memo wrapper with additional options
 * @param {React.Component} Component - The component to memoize
 * @param {Function} propsAreEqual - Optional custom comparison function
 * @returns {React.Component} - The memoized component
 */
export const withMemo = (Component, propsAreEqual = null) => {
  if (propsAreEqual) {
    return React.memo(Component, propsAreEqual);
  }
  
  return React.memo(Component);
};

/**
 * Creates a memoized callback that only changes if dependencies change
 * Simplified version of React's useCallback hook for easier use
 * @param {Function} callback - The callback function
 * @param {Array} dependencies - Array of dependencies
 * @returns {Function} - The memoized callback
 */
export const createCallback = (callback, dependencies) => {
  let cachedCallback = callback;
  let cachedDependencies = dependencies || [];
  
  return (...args) => {
    const dependenciesChanged = !cachedDependencies.every(
      (dep, i) => dep === (dependencies || [])[i]
    );
    
    if (dependenciesChanged) {
      cachedCallback = callback;
      cachedDependencies = dependencies || [];
    }
    
    return cachedCallback(...args);
  };
};

/**
 * Check if the browser tab is visible
 * @returns {boolean} - Whether the tab is visible
 */
export const isTabVisible = () => {
  return !document.hidden;
};

/**
 * Detects if the user is on a low-end device
 * @returns {boolean} - Whether the device is low-end
 */
export const isLowEndDevice = () => {
  if ('deviceMemory' in navigator) {
    if (navigator.deviceMemory < 4) return true;
  }
  
  if ('hardwareConcurrency' in navigator) {
    if (navigator.hardwareConcurrency < 4) return true;
  }
  
  return false;
};

/**
 * Gets performance level from localStorage or calculates it
 * @returns {number} - Performance level from 1 (low) to 5 (high)
 */
export const getPerformanceLevel = () => {
  const storedPerformanceLevel = localStorage.getItem('performanceLevel');
  if (storedPerformanceLevel) {
    return parseInt(storedPerformanceLevel, 10);
  }
  
  let performanceLevel = 5; 
  
  if (isLowEndDevice()) {
    performanceLevel = 2;
  } else if ('deviceMemory' in navigator) {
    if (navigator.deviceMemory < 8) performanceLevel = 3;
    else if (navigator.deviceMemory < 4) performanceLevel = 2;
    else if (navigator.deviceMemory < 2) performanceLevel = 1;
  }
  
  localStorage.setItem('performanceLevel', performanceLevel.toString());
  
  return performanceLevel;
};
