import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// City building component
const CityBuilding = ({ 
  position, 
  width = 1, 
  depth = 1, 
  height = 5, 
  color = '#00fff5',
  glowColor = '#00fff5',
  glowIntensity = 1,
  windowColor = '#ffffff',
  glitchIntensity = 0.2,
  pulseSpeed = 0.5
}) => {
  const buildingRef = useRef();
  const materialRef = useRef();
  const edgesRef = useRef();
  const [time, setTime] = useState(0);
  
  // Building geometry with dynamic windows
  const geometry = new THREE.BoxGeometry(width, height, depth);
  
  // Animate building
  useFrame((state, delta) => {
    if (!buildingRef.current || !materialRef.current) return;
    
    // Update time for animations
    setTime(prev => prev + delta);
    
    // Pulse glow effect
    const pulseValue = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
    materialRef.current.emissiveIntensity = glowIntensity * pulseValue;
    
    // Random glitch effect
    if (Math.random() < glitchIntensity * delta * 10) {
      const glitchDuration = 100 + Math.random() * 200;
      const glitchHeight = height * (0.95 + Math.random() * 0.1);
      
      buildingRef.current.scale.y = glitchHeight / height;
      
      setTimeout(() => {
        if (buildingRef.current) {
          buildingRef.current.scale.y = 1;
        }
      }, glitchDuration);
    }
    
    // Edges glow effect
    if (edgesRef.current) {
      edgesRef.current.material.opacity = 0.3 + pulseValue * 0.7;
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={buildingRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshPhongMaterial 
          ref={materialRef}
          color={color}
          emissive={glowColor}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.8}
          shininess={90}
        />
      </mesh>
      
      {/* Building edges */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={glowColor} transparent opacity={0.7} />
      </lineSegments>
      
      {/* Windows */}
      <Windows 
        width={width} 
        height={height} 
        depth={depth} 
        color={windowColor}
        time={time}
      />
    </group>
  );
};

// Building windows component
const Windows = ({ width, height, depth, color = '#ffffff', time = 0 }) => {
  const windowsRef = useRef();
  
  // Create window points
  const windowWidth = 0.1;
  const windowHeight = 0.15;
  const windowSpacingX = 0.3;
  const windowSpacingY = 0.5;
  const points = [];
  
  // Create window positions for front face
  for (let y = 0.5; y < height - 0.5; y += windowSpacingY) {
    for (let x = -width/2 + 0.3; x < width/2 - 0.3; x += windowSpacingX) {
      // Front face
      points.push(
        new THREE.Vector3(x, y, depth/2 + 0.01),
        new THREE.Vector3(x + windowWidth, y, depth/2 + 0.01),
        new THREE.Vector3(x + windowWidth, y + windowHeight, depth/2 + 0.01),
        new THREE.Vector3(x, y + windowHeight, depth/2 + 0.01)
      );
      
      // Back face
      points.push(
        new THREE.Vector3(x, y, -depth/2 - 0.01),
        new THREE.Vector3(x + windowWidth, y, -depth/2 - 0.01),
        new THREE.Vector3(x + windowWidth, y + windowHeight, -depth/2 - 0.01),
        new THREE.Vector3(x, y + windowHeight, -depth/2 - 0.01)
      );
    }
  }
  
  // Add windows on sides for wider buildings
  if (width > 1.5) {
    for (let y = 0.5; y < height - 0.5; y += windowSpacingY) {
      for (let z = -depth/2 + 0.3; z < depth/2 - 0.3; z += windowSpacingX) {
        // Left side
        points.push(
          new THREE.Vector3(-width/2 - 0.01, y, z),
          new THREE.Vector3(-width/2 - 0.01, y, z + windowWidth),
          new THREE.Vector3(-width/2 - 0.01, y + windowHeight, z + windowWidth),
          new THREE.Vector3(-width/2 - 0.01, y + windowHeight, z)
        );
        
        // Right side
        points.push(
          new THREE.Vector3(width/2 + 0.01, y, z),
          new THREE.Vector3(width/2 + 0.01, y, z + windowWidth),
          new THREE.Vector3(width/2 + 0.01, y + windowHeight, z + windowWidth),
          new THREE.Vector3(width/2 + 0.01, y + windowHeight, z)
        );
      }
    }
  }
  
  // Animate windows
  useFrame(() => {
    if (!windowsRef.current) return;
    
    // Random window flicker effect
    const windowVerts = windowsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < windowVerts.length; i += 12) {
      // Each window has 4 vertices, each with 3 coordinates (x,y,z)
      const isOn = Math.random() > 0.2;
      const flicker = isOn ? (0.8 + Math.sin(time * 2 + i) * 0.2) : 0;
      
      // Update opacity of all 4 vertices of this window
      for (let j = 0; j < 4; j++) {
        windowsRef.current.geometry.attributes.color.array[i/3 + j*3 + 0] = flicker;
        windowsRef.current.geometry.attributes.color.array[i/3 + j*3 + 1] = flicker;
        windowsRef.current.geometry.attributes.color.array[i/3 + j*3 + 2] = flicker;
      }
    }
    
    windowsRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  // Create colors array
  const colors = new Float32Array(points.length * 3);
  
  // Initial random window colors
  for (let i = 0; i < colors.length; i += 12) {
    const isOn = Math.random() > 0.3;
    const brightness = isOn ? 1 : 0;
    
    // Set color for all 4 vertices of this window
    for (let j = 0; j < 4; j++) {
      colors[i + j*3 + 0] = brightness;
      colors[i + j*3 + 1] = brightness;
      colors[i + j*3 + 2] = brightness;
    }
  }
  
  return (
    <points ref={windowsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={points.length}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        color={color}
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Ground grid component
const GroundGrid = ({ size = 100, divisions = 100, color = '#00fff5', glowColor = '#00fff5' }) => {
  const gridRef = useRef();
  
  useFrame((state, delta) => {
    if (!gridRef.current) return;
    
    // Animating grid
    gridRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });
  
  return (
    <gridHelper
      ref={gridRef}
      args={[size, divisions, color, color]}
      position={[0, -0.1, 0]}
      material={
        new THREE.LineBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.4
        })
      }
    />
  );
};

// Data stream effect
const DataStream = ({ count = 100, color = '#00fff5', speed = 1 }) => {
  const pointsRef = useRef();
  const [particles, setParticles] = useState([]);
  
  // Initialize particles
  useEffect(() => {
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          Math.random() * 50,
          (Math.random() - 0.5) * 100
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        size: 0.1 + Math.random() * 0.2,
        life: Math.random()
      });
    }
    
    setParticles(newParticles);
  }, [count]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current || particles.length === 0) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const sizes = pointsRef.current.geometry.attributes.size.array;
    
    let i = 0;
    
    particles.forEach((particle, idx) => {
      // Update position
      particle.position.add(
        particle.velocity.clone().multiplyScalar(delta * speed * 10)
      );
      
      // Increment life
      particle.life += delta * 0.2;
      if (particle.life > 1) particle.life = 0;
      
      // Calculate pulse
      const pulse = Math.sin(particle.life * Math.PI) * 0.5 + 0.5;
      
      // Update attributes
      positions[i*3] = particle.position.x;
      positions[i*3+1] = particle.position.y;
      positions[i*3+2] = particle.position.z;
      
      sizes[i] = particle.size * pulse;
      
      i++;
    });
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.length}
          array={new Float32Array(particles.length)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera controller
const CameraController = ({ enableZoom = true, enableRotate = true, autoRotate = true }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    if (controlsRef.current) {
      // Set initial camera position
      camera.position.set(15, 10, 15);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={5}
      maxDistance={50}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
    />
  );
};

// Main city scene component
const CityScene = ({ buildingCount = 20, citySize = 40 }) => {
  const { theme } = useTheme();
  const [buildings, setBuildings] = useState([]);
  
  // Primary color based on theme
  const primaryColor = theme === 'dark' ? '#00fff5' : '#4d4dff';
  const secondaryColor = '#ff3d3d';
  
  // Generate city buildings
  useEffect(() => {
    const newBuildings = [];
    
    // Create buildings
    for (let i = 0; i < buildingCount; i++) {
      const size = 1 + Math.random() * 2;
      const height = 2 + Math.random() * 15;
      
      // Ensure buildings don't overlap too much
      let tooClose = true;
      let attempts = 0;
      let position;
      
      while (tooClose && attempts < 100) {
        position = new THREE.Vector3(
          (Math.random() - 0.5) * citySize,
          height / 2,
          (Math.random() - 0.5) * citySize
        );
        
        tooClose = false;
        
        for (const existing of newBuildings) {
          const minDistance = (size + existing.size) * 0.8;
          const actualDistance = position.distanceTo(existing.position);
          
          if (actualDistance < minDistance) {
            tooClose = true;
            break;
          }
        }
        
        attempts++;
      }
      
      // If we couldn't find a spot after 100 attempts, skip this building
      if (attempts >= 100) continue;
      
      // Randomly assign colors
      const useSecondary = Math.random() > 0.7;
      
      newBuildings.push({
        position,
        width: size,
        depth: size,
        height,
        color: useSecondary ? secondaryColor : primaryColor,
        glowColor: useSecondary ? secondaryColor : primaryColor,
        glowIntensity: 0.2 + Math.random() * 0.3,
        glitchIntensity: 0.05 + Math.random() * 0.2,
        pulseSpeed: 0.2 + Math.random() * 0.8,
        size
      });
    }
    
    setBuildings(newBuildings);
  }, [buildingCount, citySize, primaryColor, secondaryColor]);
  
  return (
    <>
      {/* City ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.7} 
        castShadow 
      />
      
      {/* Ground grid */}
      <GroundGrid 
        size={citySize} 
        divisions={citySize} 
        color={primaryColor}
        glowColor={primaryColor}
      />
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <CityBuilding 
          key={index}
          position={building.position}
          width={building.width}
          depth={building.depth}
          height={building.height}
          color={building.color}
          glowColor={building.glowColor}
          glowIntensity={building.glowIntensity}
          glitchIntensity={building.glitchIntensity}
          pulseSpeed={building.pulseSpeed}
        />
      ))}
      
      {/* Data stream particles */}
      <DataStream 
        count={200} 
        color={primaryColor}
        speed={1}
      />
      
      {/* Camera controller */}
      <CameraController 
        enableZoom={true}
        enableRotate={true}
        autoRotate={true}
      />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={[theme === 'dark' ? '#000000' : '#ffffff', 10, 100]} />
    </>
  );
};

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
      className={`cyber-city ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
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
