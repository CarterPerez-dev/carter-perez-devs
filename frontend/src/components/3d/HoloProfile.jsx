// frontend/src/components/3d/HoloProfile.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import styles from './HoloProfile.module.css';

// Import the HoloProfileScene component (unchanged)
import HoloProfileScene from './HoloProfileScene'; // This would be in a separate file

const HoloProfile = ({
  imageUrl = '/assets/profile.png',
  width = '300px',
  height = '300px',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = 1,
  intensity = 1.2,
  glitchIntensity = 0.3,
  color = null,
  showInfo = true,
  animate = true,
  onClick = null,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`${styles.holoProfile} ${className}`}
      style={{
        width,
        height,
        ...style
      }}
      {...props}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <HoloProfileScene
          imageUrl={imageUrl}
          rotation={rotation}
          position={position}
          scale={scale}
          intensity={intensity}
          glitchIntensity={glitchIntensity}
          color={color}
          showInfo={showInfo}
          animate={animate}
          onClick={onClick}
        />
      </Canvas>
    </div>
  );
};

HoloProfile.propTypes = {
  imageUrl: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rotation: PropTypes.array,
  position: PropTypes.array,
  scale: PropTypes.number,
  intensity: PropTypes.number,
  glitchIntensity: PropTypes.number,
  color: PropTypes.string,
  showInfo: PropTypes.bool,
  animate: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

export default HoloProfile;
