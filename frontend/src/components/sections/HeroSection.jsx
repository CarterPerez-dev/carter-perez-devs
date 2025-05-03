import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';

const HeroSection = () => {
  const { playSound } = useAudio();
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Typewriter effect for subtitle
  const [subtitle, setSubtitle] = useState('');
  const fullSubtitle = 'CYBERSECURITY SPECIALIST | SYSTEM INTEGRATOR | FULL-STACK DEVELOPER';
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  
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
    
    // Cube parameters
    const cube = {
      size: Math.min(canvas.width, canvas.height) * 0.2,
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
  
  // Simulating image load with timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProfileImageLoaded(true);
    }, 500);
    
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
  
  // Set loaded state after a delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        <div className="hero-left">
          <motion.h1 
            className="hero-title" 
            variants={itemVariants}
            data-text="NEURAL INTERFACE"
          >
            <span className="title-main">NEURAL</span>
            <span className="title-accent">INTERFACE</span>
          </motion.h1>
          
          <motion.div 
            className="hero-subtitle" 
            variants={itemVariants}
          >
            {subtitle}
            <span className="blinking-cursor"></span>
          </motion.div>
          
          <motion.p 
            className="hero-description" 
            variants={itemVariants}
          >
            Welcome to my digital nexus. I craft secure systems, develop full-stack applications, and specialize in cybersecurity solutions. Navigate through my digital portfolio to discover my projects, skills, and experiences.
          </motion.p>
          
          <motion.div 
            className="hero-cta" 
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
          className="hero-right"
          variants={itemVariants}
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}
        >
          <div className="profile-container">
            <div className={`profile-image-container ${profileImageLoaded ? 'loaded' : ''}`}>
              <div className="profile-frame"></div>
              <div className="profile-hologram">
                <canvas 
                  ref={canvasRef} 
                  className="hologram-canvas"
                  aria-hidden="true"
                ></canvas>
              </div>
              <img 
                src="/assets/profile.png" 
                alt="Profile" 
                className="profile-image"
                onLoad={() => setProfileImageLoaded(true)}
              />
            </div>
            
            <div className="profile-data">
              <div className="data-row">
                <span className="data-label">STATUS</span>
                <span className="data-value">ONLINE</span>
              </div>
              <div className="data-row">
                <span className="data-label">CLASS</span>
                <span className="data-value">CYBERSECURITY</span>
              </div>
              <div className="data-row">
                <span className="data-label">LVL</span>
                <span className="data-value">42</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: var(--space-xxl) 0;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(20, 20, 20, 0.95));
          z-index: -1;
        }
        
        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(0, 255, 245, 0.05) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(255, 61, 61, 0.05) 0%, transparent 30%);
        }
        
        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: var(--container-lg);
          margin: 0 auto;
          width: 100%;
          padding: 0 var(--space-md);
          z-index: 1;
        }
        
        .hero-left {
          flex: 1;
          max-width: 600px;
          padding-right: var(--space-xl);
        }
        
        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: var(--space-md);
          line-height: 1.1;
          position: relative;
          display: inline-block;
        }
        
        .title-main {
          display: block;
          color: var(--text-primary);
        }
        
        .title-accent {
          display: block;
          color: var(--accent-cyan);
          text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
          position: relative;
        }
        
        .title-accent::before {
          content: 'INTERFACE';
          position: absolute;
          top: 0;
          left: 0;
          color: var(--accent-magenta);
          filter: blur(4px);
          opacity: 0.7;
          animation: title-glitch 5s infinite alternate;
        }
        
        .hero-subtitle {
          font-family: var(--font-mono);
          font-size: 1rem;
          margin-bottom: var(--space-lg);
          color: var(--text-secondary);
          letter-spacing: 1px;
        }
        
        .blinking-cursor {
          display: inline-block;
          width: 10px;
          height: 1rem;
          background-color: var(--accent-cyan);
          animation: blink 1s step-end infinite;
          margin-left: 2px;
          vertical-align: middle;
        }
        
        .hero-description {
          font-size: 1.1rem;
          margin-bottom: var(--space-xl);
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .hero-cta {
          display: flex;
          gap: var(--space-md);
        }
        
        .hero-right {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .profile-container {
          width: 100%;
          max-width: 400px;
          height: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .profile-image-container {
          width: 300px;
          height: 300px;
          border-radius: 10px;
          margin-bottom: var(--space-lg);
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          overflow: hidden;
        }
        
        .profile-image-container.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .profile-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid var(--accent-cyan);
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 255, 245, 0.3);
          z-index: 2;
          pointer-events: none;
        }
        
        .profile-frame::before,
        .profile-frame::after {
          content: '';
          position: absolute;
          background-color: var(--accent-cyan);
        }
        
        .profile-frame::before {
          top: 10px;
          right: 10px;
          width: 20px;
          height: 2px;
        }
        
        .profile-frame::after {
          top: 10px;
          right: 10px;
          width: 2px;
          height: 20px;
        }
        
        .profile-hologram {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .hologram-canvas {
          width: 100%;
          height: 100%;
        }
        
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: relative;
          z-index: 0;
          filter: contrast(1.1) saturate(0.8) brightness(0.9);
        }
        
        .profile-data {
          width: 80%;
          background-color: rgba(10, 10, 10, 0.8);
          border: 1px solid var(--accent-cyan);
          border-radius: 5px;
          padding: var(--space-md);
          font-family: var(--font-mono);
        }
        
        .data-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }
        
        .data-row:last-child {
          margin-bottom: 0;
        }
        
        .data-label {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }
        
        .data-value {
          color: var(--accent-cyan);
          font-weight: 500;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes title-glitch {
          0%, 100% {
            transform: translate(0);
            opacity: 0.7;
          }
          20% {
            transform: translate(-2px, 2px);
            opacity: 0.5;
          }
          40% {
            transform: translate(2px, -2px);
            opacity: 0.7;
          }
          60% {
            transform: translate(-2px, -2px);
            opacity: 0.5;
          }
          80% {
            transform: translate(2px, 2px);
            opacity: 0.7;
          }
        }
        
        /* Media queries */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 3.5rem;
          }
          
          .profile-image-container {
            width: 250px;
            height: 250px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-left {
            padding-right: 0;
            margin-bottom: var(--space-xl);
          }
          
          .hero-cta {
            justify-content: center;
          }
          
          .hero-title {
            font-size: 3rem;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 0.9rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .hero-cta {
            flex-direction: column;
            width: 100%;
          }
          
          .profile-image-container {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
