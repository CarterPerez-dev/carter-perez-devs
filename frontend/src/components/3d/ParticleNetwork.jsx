import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';

const ParticleNetwork = ({ count = 3000, connections = true, speed = 0.2, size = 0.02 }) => {
  const { theme } = useTheme();
  const pointsRef = useRef();
  const linesRef = useRef();
  const { size: viewSize } = useThree();
  
  // Generate random points in 3D space
  const particlesPosition = useRef();
  const particlesTarget = useRef();
  const linePositions = useRef();
  
  // Setup initial particles
  useEffect(() => {
    particlesPosition.current = new Float32Array(count * 3);
    particlesTarget.current = new Float32Array(count * 3);
    linePositions.current = new Float32Array(count * 6 * 5); // For up to 5 connections per particle
    
    // Generate initial positions and target positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      particlesPosition.current[i3] = (Math.random() - 0.5) * 10;
      particlesPosition.current[i3 + 1] = (Math.random() - 0.5) * 10;
      particlesPosition.current[i3 + 2] = (Math.random() - 0.5) * 10;
      
      particlesTarget.current[i3] = particlesPosition.current[i3] + (Math.random() - 0.5) * 1;
      particlesTarget.current[i3 + 1] = particlesPosition.current[i3 + 1] + (Math.random() - 0.5) * 1;
      particlesTarget.current[i3 + 2] = particlesPosition.current[i3 + 2] + (Math.random() - 0.5) * 1;
    }
    
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPosition.current, 3)
      );
    }
  }, [count]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    // Update particles
    const positions = pointsRef.current.geometry.attributes.position.array;
    let lineIndex = 0;
    
    // First update positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Move towards target with easing
      positions[i3] += (particlesTarget.current[i3] - positions[i3]) * speed * delta;
      positions[i3 + 1] += (particlesTarget.current[i3 + 1] - positions[i3 + 1]) * speed * delta;
      positions[i3 + 2] += (particlesTarget.current[i3 + 2] - positions[i3 + 2]) * speed * delta;
      
      // If particle reached target, create a new target
      if (
        Math.abs(positions[i3] - particlesTarget.current[i3]) < 0.01 &&
        Math.abs(positions[i3 + 1] - particlesTarget.current[i3 + 1]) < 0.01 &&
        Math.abs(positions[i3 + 2] - particlesTarget.current[i3 + 2]) < 0.01
      ) {
        particlesTarget.current[i3] = positions[i3] + (Math.random() - 0.5) * 2;
        particlesTarget.current[i3 + 1] = positions[i3 + 1] + (Math.random() - 0.5) * 2;
        particlesTarget.current[i3 + 2] = positions[i3 + 2] + (Math.random() - 0.5) * 2;
      }
    }
    
    // Mark positions as needing update
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update connections if enabled
    if (connections) {
      const linesPositions = linesRef.current.geometry.attributes.position.array;
      lineIndex = 0;
      
      // Find closest particles to create connections
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const distances = [];
        
        // Calculate distances to all other particles
        for (let j = 0; j < count; j++) {
          if (i === j) continue;
          
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < 2) {
            distances.push({ index: j, distance });
          }
        }
        
        // Sort by distance and take closest 5
        distances.sort((a, b) => a.distance - b.distance);
        const connectCount = Math.min(5, distances.length);
        
        // Create lines for closest connections
        for (let k = 0; k < connectCount; k++) {
          const j = distances[k].index;
          const j3 = j * 3;
          
          // Start point of line (current particle)
          linesPositions[lineIndex++] = positions[i3];
          linesPositions[lineIndex++] = positions[i3 + 1];
          linesPositions[lineIndex++] = positions[i3 + 2];
          
          // End point of line (connected particle)
          linesPositions[lineIndex++] = positions[j3];
          linesPositions[lineIndex++] = positions[j3 + 1];
          linesPositions[lineIndex++] = positions[j3 + 2];
        }
      }
      
      // Fill the rest with empty lines
      while (lineIndex < linesPositions.length) {
        linesPositions[lineIndex++] = 0;
      }
      
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group>
      <Points ref={pointsRef} limit={count}>
        <PointMaterial
          transparent
          vertexColors
          size={size}
          sizeAttenuation={true}
          color={theme === 'dark' ? '#00fff5' : '#4d4dff'}
          depthWrite={false}
        />
      </Points>
      
      {connections && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={count * 6 * 5}
              array={linePositions.current}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color={theme === 'dark' ? '#00fff5' : '#4d4dff'}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
};

export default ParticleNetwork;
