// frontend/src/components/3d/CyberCity.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import styles from './css/CyberCity.module.css';


import CityScene from './CityScene'; 

// Main CyberCity component
const CyberCity = ({
  width = '100%',
  height = '400px',
  buildingCount = 20,
  citySize = 40,
  enableZoom = true,
  enableRotate = true,
  autoRotate = true,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`${styles.cyberCity} ${className}`}
      style={{
        width,
        height,
        ...style
      }}
      {...props}
    >
      <Canvas
        shadows
        camera={{ position: [15, 10, 15], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <CityScene 
          buildingCount={buildingCount} 
          citySize={citySize} 
          enableZoom={enableZoom}
          enableRotate={enableRotate}
          autoRotate={autoRotate}
        />
      </Canvas>
    </div>
  );
};

CyberCity.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buildingCount: PropTypes.number,
  citySize: PropTypes.number,
  enableZoom: PropTypes.bool,
  enableRotate: PropTypes.bool,
  autoRotate: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

export default CyberCity;
