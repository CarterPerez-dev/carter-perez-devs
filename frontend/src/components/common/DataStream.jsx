// frontend/src/components/common/DataStream.jsx
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useDataStream } from '../../hooks/useDataStream';
import styles from './css/DataStream.module.css';

const DataStream = ({
  width = '100%',
  height = '100px',
  color = 'auto',
  density = 'medium',
  speed = 'medium',
  direction = 'right', // right, left, up, down
  mode = 'continuous', // continuous, wave, pulse
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Generate primary color based on theme if color is set to auto
  const primaryColor = color === 'auto'
    ? theme === 'dark' ? 'var(--accent-cyan)' : 'var(--accent-blue)'
    : color;
  
  // Secondary color for contrast effects
  const secondaryColor = theme === 'dark' ? 'var(--accent-magenta)' : 'var(--accent-magenta)';
  
  // Convert props to actual values
  const actualDensity = typeof density === 'string' 
    ? getDensityValue(density) 
    : density;
    
  const actualSpeed = typeof speed === 'string'
    ? getSpeedValue(speed)
    : speed;
  
  // Initialize data stream with useDataStream hook
  const { startStream, stopStream, updateStreamConfig } = useDataStream(canvasRef, {
    density: actualDensity,
    speed: actualSpeed,
    direction,
    mode,
    primaryColor,
    secondaryColor
  });
  
  // Set canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Start/stop data stream and update config when props change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      updateStreamConfig({
        density: actualDensity,
        speed: actualSpeed,
        direction,
        mode,
        primaryColor,
        secondaryColor
      });
      
      startStream();
    }
    
    return () => stopStream();
  }, [
    dimensions,
    actualDensity,
    actualSpeed,
    direction,
    mode,
    primaryColor,
    secondaryColor,
    startStream,
    stopStream,
    updateStreamConfig
  ]);
  
  return (
    <motion.div
      ref={containerRef}
      className={`${styles.dataStream} ${className}`}
      style={{
        width,
        height,
        ...style
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
      
      {children && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </motion.div>
  );
};

// Helper functions
function getDensityValue(density) {
  switch (density) {
    case 'low':
      return 30;
    case 'medium':
      return 70;
    case 'high':
      return 120;
    default:
      return 70;
  }
}

function getSpeedValue(speed) {
  switch (speed) {
    case 'slow':
      return 2;
    case 'medium':
      return 5;
    case 'fast':
      return 10;
    default:
      return 5;
  }
}

DataStream.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  density: PropTypes.oneOfType([
    PropTypes.oneOf(['low', 'medium', 'high']),
    PropTypes.number
  ]),
  speed: PropTypes.oneOfType([
    PropTypes.oneOf(['slow', 'medium', 'fast']),
    PropTypes.number
  ]),
  direction: PropTypes.oneOf(['right', 'left', 'up', 'down']),
  mode: PropTypes.oneOf(['continuous', 'wave', 'pulse']),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

export default DataStream;
