import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBX, useTexture, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useGlitch } from '../../hooks/useGlitch';

const HoloProfile = ({ 
  imageUrl = '/assets/profile.png', 
  rotation = [0, 0, 0], 
  position = [0, 0, 0],
  scale = 1,
  intensity = 1.2,
  glitchIntensity = 0.3,
  color = null,
  showInfo = true,
  animate = true,
  onClick = null
}) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const infoRef = useRef();
  const { theme } = useTheme();
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [rotation_, setRotation] = useState(rotation);
  const [infoVisible, setInfoVisible] = useState(false);
  
  // Generate color based on theme if not provided
  const profileColor = color || (theme === 'dark' ? '#00fff5' : '#4d4dff');
  
  // Initialize texture
  const texture = useTexture(imageUrl);
  
  // Apply glitch effect
  const { startGlitch, stopGlitch } = useGlitch(meshRef, {
    intensity: glitchIntensity * 10,
    duration: 400,
    continuousGlitch: false
  });
  
  // Handle hover
  const handlePointerOver = () => {
    if (!hovered) {
      setHovered(true);
      startGlitch();
      if (showInfo) setInfoVisible(true);
    }
  };
  
  const handlePointerOut = () => {
    if (hovered) {
      setHovered(false);
      if (showInfo) setInfoVisible(false);
    }
  };
  
  // Handle click
  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(!clicked);
    startGlitch();
    
    if (onClick) onClick();
  };
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Rotate based on animation state
    if (animate) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    // Pulse glow effect
    if (glowRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      glowRef.current.material.opacity = pulse * (hovered ? 0.8 : 0.4);
      glowRef.current.scale.set(
        1 + pulse * 0.05, 
        1 + pulse * 0.05, 
        1 + pulse * 0.05
      );
    }
    
    // Update info panel position
    if (infoRef.current && infoVisible) {
      infoRef.current.lookAt(state.camera.position);
    }
  });
  
  // Load profile image as texture on plane geometry
  return (
    <group position={position} scale={scale} rotation={rotation_}>
      {/* Main profile mesh */}
      <mesh 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={0.9}
          side={THREE.DoubleSide}
        />
        
        {/* Grid overlay */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1, 1, 32, 32]} />
          <meshBasicMaterial 
            color={profileColor}
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial 
          color={profileColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Holographic scan line */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1, 0.01]} />
        <meshBasicMaterial 
          color={profileColor}
          transparent
          opacity={0.7}
        >
          <animated 
            attach="opacity" 
            position={[0, 0, 0.02]}
            factor={0.7} 
            speed={1}
          />
        </meshBasicMaterial>
      </mesh>
      
      {/* Info panel that appears on hover */}
      {showInfo && infoVisible && (
        <group ref={infoRef} position={[0.7, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.6, 0.3]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.7}
            />
          </mesh>
          
          <Text
            position={[0, 0.08, 0.01]}
            fontSize={0.04}
            color={profileColor}
            anchorX="center"
            anchorY="middle"
            font="/assets/fonts/Orbitron-Bold.ttf"
          >
            CARTER RUSH PEREZ
          </Text>
          
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.025}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/assets/fonts/Rajdhani-Regular.ttf"
          >
            SYSTEM INTEGRATION TECHNICIAN
          </Text>
          
          <Text
            position={[0, -0.08, 0.01]}
            fontSize={0.02}
            color={profileColor}
            anchorX="center"
            anchorY="middle"
            font="/assets/fonts/Fira_Code_Regular.ttf"
          >
            CYBERSECURITY SPECIALIST
          </Text>
        </group>
      )}
      
      {/* Decorative elements */}
      <mesh position={[-0.52, -0.52, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.05, 0.01]} />
        <meshBasicMaterial color={profileColor} />
      </mesh>
      
      <mesh position={[0.52, 0.52, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.05, 0.01]} />
        <meshBasicMaterial color={profileColor} />
      </mesh>
    </group>
  );
};

export default HoloProfile;
