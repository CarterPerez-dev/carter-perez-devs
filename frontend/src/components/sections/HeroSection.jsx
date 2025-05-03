import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const { playSound } = useAudio();
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Typewriter effect for subtitle
  const [subtitle, setSubtitle] = useState('');
  const fullSubtitle = 'CYBERSECURITY SPECIALIST | SYSTEM INTEGRATOR | FULL-STACK DEVELOPER';
  
  // Holographic cube animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();
    
    // Cube parameters - increased size by 30%
    const cube = {
      size: Math.min(canvas.width, canvas.height) * 0.26, // Increased from 0.2
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      position: { x: canvas.width / 2, y: canvas.height / 2, z: 0 },
      vertices: [],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0], // Bottom face
        [4, 5], [5, 6], [6, 7], [7, 4], // Top face
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
      ],
      calculateVertices: function() {
        const s = this.size / 2;
        
        // Define the 8 vertices of the cube
        return [
          // Bottom face
          { x: -s, y: -s, z: -s },
          { x: s, y: -s, z: -s },
          { x: s, y: -s, z: s },
          { x: -s, y: -s, z: s },
          // Top face
          { x: -s, y: s, z: -s },
          { x: s, y: s, z: -s },
          { x: s, y: s, z: s },
          { x: -s, y: s, z: s }
        ];
      }
    };
    
    // Initialize vertices
    cube.vertices = cube.calculateVertices();
    
    // Project 3D point to 2D
    const project = (point) => {
      const focalLength = 300;
      const scale = focalLength / (focalLength + point.z + cube.position.z);
      
      return {
        x: point.x * scale + cube.position.x,
        y: point.y * scale + cube.position.y
      };
    };
    
    // Rotate point around X axis
    const rotateX = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
      };
    };
    
    // Rotate point around Y axis
    const rotateY = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos
      };
    };
    
    // Rotate point around Z axis
    const rotateZ = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
        z: point.z
      };
    };
    
    // Animation loop
    let animationId;
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update rotations
      cube.rotationX += 0.005;
      cube.rotationY += 0.007;
      cube.rotationZ += 0.003;
      
      // Calculate rotated and projected vertices
      const rotatedVertices = cube.vertices.map(vertex => {
        let rotated = { ...vertex };
        rotated = rotateX(rotated, cube.rotationX);
        rotated = rotateY(rotated, cube.rotationY);
        rotated = rotateZ(rotated, cube.rotationZ);
        
        return rotated;
      });
      
      const projectedVertices = rotatedVertices.map(vertex => project(vertex));
      
      // Draw edges
      ctx.strokeStyle = 'rgba(0, 255, 245, 0.5)';
      ctx.lineWidth = 2;
      
      for (const [i, j] of cube.edges) {
        const v1 = projectedVertices[i];
        const v2 = projectedVertices[j];
        
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
      }
      
      // Draw vertices
      ctx.fillStyle = 'rgba(255, 61, 61, 0.7)';
      
      for (const vertex of projectedVertices) {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw holographic effect
      ctx.strokeStyle = 'rgba(0, 255, 245, 0.2)';
      ctx.beginPath();
      
      for (let i = 0; i < projectedVertices.length; i++) {
        const v1 = projectedVertices[i];
        const v2 = projectedVertices[(i + 1) % projectedVertices.length];
        
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
      }
      
      ctx.stroke();
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Typewriter effect
  useEffect(() => {
    if (subtitle === fullSubtitle) return;
    
    const timeoutId = setTimeout(() => {
      setSubtitle(fullSubtitle.substring(0, subtitle.length + 1));
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [subtitle, fullSubtitle]);
  
  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Set loaded state after a delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground}></div>
      
      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        <div className={styles.heroLeft}>
          <motion.h1 
            className={styles.heroTitle} 
            variants={itemVariants}
            data-text="NEURAL INTERFACE"
          >
            <span className={styles.titleMain}>NEURAL</span>
            <span className={styles.titleAccent}>INTERFACE</span>
          </motion.h1>
          
          <motion.div 
            className={styles.heroSubtitle} 
            variants={itemVariants}
          >
            {subtitle}
            <span className={styles.blinkingCursor}></span>
          </motion.div>
          
          <motion.p 
            className={styles.heroDescription} 
            variants={itemVariants}
          >
            Welcome to my digital nexus. I craft secure systems, develop full-stack applications, and specialize in cybersecurity solutions. Navigate through my digital portfolio to discover my projects, skills, and experiences.
          </motion.p>
          
          <motion.div 
            className={styles.heroCta} 
            variants={itemVariants}
          >
            <Link 
              to="/projects" 
              className="cyber-button"
              onClick={() => playSound('click')}
            >
              VIEW PROJECTS
            </Link>
            
            <Link 
              to="/contact" 
              className="cyber-button cyber-button--magenta"
              onClick={() => playSound('click')}
            >
              CONNECT
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className={styles.heroRight}
          variants={itemVariants}
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}
        >
          <div className={styles.hologramContainer}>
            <div className={styles.hologramFrame}></div>
            <canvas 
              ref={canvasRef} 
              className={styles.hologramCanvas}
              aria-hidden="true"
            ></canvas>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
