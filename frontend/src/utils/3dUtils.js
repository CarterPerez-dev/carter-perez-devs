/**
 * 3D Utility functions
 * Helper functions for Three.js and 3D effects in the portfolio
 */

import * as THREE from 'three';

/**
 * Create a cyberpunk city skyline geometry
 * @param {number} buildings - Number of buildings to generate
 * @param {number} width - Width of the city
 * @param {number} depth - Depth of the city
 * @returns {THREE.Group} - Group containing all building meshes
 */
export const createCyberpunkCity = (buildings = 50, width = 100, depth = 100) => {
  const city = new THREE.Group();
  
  const gridHelper = new THREE.GridHelper(
    Math.max(width, depth), 
    Math.max(width, depth) / 5,
    0x00fff5,
    0x00fff5
  );
  gridHelper.position.y = 0;
  gridHelper.material.opacity = 0.3;
  gridHelper.material.transparent = true;
  city.add(gridHelper);
  
  for (let i = 0; i < buildings; i++) {
    const buildingWidth = 2 + Math.random() * 5;
    const buildingDepth = 2 + Math.random() * 5;
    const buildingHeight = 5 + Math.random() * 40;
    
    const posX = (Math.random() - 0.5) * width;
    const posZ = (Math.random() - 0.5) * depth;
    
    const geometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
    
    const hasNeon = Math.random() > 0.7;
    
    const material = new THREE.MeshPhongMaterial({
      color: 0x111111,
      emissive: hasNeon ? new THREE.Color(0x00fff5) : null,
      emissiveIntensity: hasNeon ? 0.5 : 0,
      flatShading: true
    });
    
    const building = new THREE.Mesh(geometry, material);
    building.position.set(posX, buildingHeight / 2, posZ);
    
    // Some buildings have neon edges
    if (hasNeon) {
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(0x00fff5),
        linewidth: 1
      });
      const wireframe = new THREE.LineSegments(edges, edgeMaterial);
      building.add(wireframe);
    }
    
    // Add windows
    addBuildingWindows(building, buildingWidth, buildingHeight, buildingDepth);
    
    city.add(building);
  }
  
  return city;
};

/**
 * Add illuminated windows to building
 * @param {THREE.Mesh} building - Building mesh
 * @param {number} width - Building width
 * @param {number} height - Building height
 * @param {number} depth - Building depth
 */
const addBuildingWindows = (building, width, height, depth) => {
  // Window parameters
  const windowSize = 0.2;
  const windowSpacingX = windowSize * 2;
  const windowSpacingY = windowSize * 2;
  
  // Window geometry and material
  const windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, 0.1);
  
  // Create windows for each side of the building
  for (let side = 0; side < 4; side++) {
    // Determine position offset based on which side
    let xOffset = 0;
    let zOffset = 0;
    let rotation = 0;
    
    switch (side) {
      case 0: // Front
        zOffset = depth / 2;
        break;
      case 1: // Right
        xOffset = width / 2;
        rotation = Math.PI / 2;
        break;
      case 2: // Back
        zOffset = -depth / 2;
        break;
      case 3: // Left
        xOffset = -width / 2;
        rotation = Math.PI / 2;
        break;
    }
    
    // Calculate available space for windows
    const availableWidth = side % 2 === 0 ? width : depth;
    const windowColumns = Math.floor((availableWidth - windowSize) / windowSpacingX);
    const windowRows = Math.floor((height - windowSize) / windowSpacingY);
    
    // Generate random windows
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowColumns; col++) {
        // Random chance for window to be lit
        if (Math.random() > 0.5) continue;
        
        // Calculate window position
        let windowX = -availableWidth / 2 + windowSize / 2 + col * windowSpacingX + windowSpacingX / 2;
        const windowY = -height / 2 + windowSize / 2 + row * windowSpacingY + windowSpacingY / 2;
        
        // Create window with random color
        const isNeon = Math.random() > 0.8;
        const windowColor = isNeon ? 
          new THREE.Color(0x00fff5) : 
          new THREE.Color(0xffff00).multiplyScalar(0.5 + Math.random() * 0.5);
        
        const windowMaterial = new THREE.MeshBasicMaterial({
          color: windowColor,
          transparent: true,
          opacity: 0.7 + Math.random() * 0.3
        });
        
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        
        // Position window based on side
        if (side % 2 === 0) {
          windowMesh.position.set(windowX, windowY, zOffset);
        } else {
          windowMesh.position.set(xOffset, windowY, windowX);
          windowMesh.rotation.y = rotation;
        }
        
        building.add(windowMesh);
      }
    }
  }
};

/**
 * Create flying data particles effect
 * @param {number} count - Number of particles
 * @param {number} range - Movement range
 * @returns {Object} - Particles data for Three.js
 */
export const createDataParticles = (count = 1000, range = 100) => {
  // Create geometry for particles
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count * 3);
  
  // Generate random particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Random position within range
    positions[i3] = (Math.random() - 0.5) * range;
    positions[i3 + 1] = (Math.random() - 0.5) * range;
    positions[i3 + 2] = (Math.random() - 0.5) * range;
    
    // Random velocities
    velocities[i3] = (Math.random() - 0.5) * 0.2;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
    
    // Random colors (cyan or magenta theme)
    const useAltColor = Math.random() > 0.8;
    
    if (useAltColor) {
      // Magenta theme
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.2;
      colors[i3 + 2] = 0.5;
    } else {
      // Cyan theme
      colors[i3] = 0.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 0.96;
    }
    
    // Random sizes
    sizes[i] = 0.5 + Math.random() * 2.5;
  }
  
  // Set attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Material for particles
  const material = new THREE.PointsMaterial({
    size: 1,
    transparent: true,
    opacity: 0.7,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  
  // Create points mesh
  const points = new THREE.Points(geometry, material);
  
  // Return data needed for animation updates
  return {
    mesh: points,
    velocities: velocities,
    update: (delta) => {
      const positions = points.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Update position based on velocity
        positions[i3] += velocities[i3] * delta;
        positions[i3 + 1] += velocities[i3 + 1] * delta;
        positions[i3 + 2] += velocities[i3 + 2] * delta;
        
        // Wrap around if out of bounds
        if (Math.abs(positions[i3]) > range / 2) {
          positions[i3] *= -0.9;
        }
        if (Math.abs(positions[i3 + 1]) > range / 2) {
          positions[i3 + 1] *= -0.9;
        }
        if (Math.abs(positions[i3 + 2]) > range / 2) {
          positions[i3 + 2] *= -0.9;
        }
      }
      
      points.geometry.attributes.position.needsUpdate = true;
    }
  };
};

/**
 * Create a holographic shader material
 * @param {string} color - Base color for hologram (hex)
 * @param {number} opacity - Base opacity
 * @param {number} fresnelIntensity - Fresnel effect intensity
 * @returns {THREE.ShaderMaterial} - Holographic material
 */
export const createHolographicMaterial = (color = '#00fff5', opacity = 0.5, fresnelIntensity = 1.0) => {
  // Convert hex color to RGB array
  const threeColor = new THREE.Color(color);
  const colorArray = [threeColor.r, threeColor.g, threeColor.b];
  
  // Vertex shader with fresnel effect
  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  // Fragment shader with scan lines and noise
  const fragmentShader = `
    uniform vec3 color;
    uniform float opacity;
    uniform float fresnelIntensity;
    uniform float time;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // Random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      // Fresnel effect (opacity based on view angle)
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = fresnelIntensity * pow(1.0 - dot(viewDirection, vNormal), 3.0);
      
      // Scan line effect
      float scanLine = step(0.5, fract(vPosition.y * 20.0 + time * 2.0));
      scanLine = mix(0.8, 1.0, scanLine);
      
      // Edge glow
      float edge = 1.0 - dot(vNormal, viewDirection);
      edge = pow(edge, 3.0) * 2.0;
      
      // Random noise
      float noise = random(vUv + vec2(time * 0.01, 0.0)) * 0.1;
      
      // Combine effects
      float alpha = opacity * (fresnel + edge) * scanLine + noise;
      
      // Output color
      gl_FragColor = vec4(color, alpha);
    }
  `;
  
  // Create shader material
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: colorArray },
      opacity: { value: opacity },
      fresnelIntensity: { value: fresnelIntensity },
      time: { value: 0.0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
};

/**
 * Setup lighting for cyberpunk scene
 * @param {THREE.Scene} scene - Three.js scene
 */
export const setupCyberpunkLighting = (scene) => {
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x111111, 0.2);
  scene.add(ambientLight);
  
  // Main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
  mainLight.position.set(20, 40, 20);
  mainLight.castShadow = true;
  
  // Configure shadow properties
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.camera.near = 1;
  mainLight.shadow.camera.far = 100;
  mainLight.shadow.camera.left = -30;
  mainLight.shadow.camer
