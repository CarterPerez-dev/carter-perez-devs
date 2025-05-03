import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';

const ProjectsGrid = ({ fullPage = false }) => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState(null);
  const canvasRef = useRef(null);
  const projectsContainerRef = useRef(null);
  
  // Project data
  const projects = [
    {
      id: 1,
      title: 'ProxyAuthRequired.com',
      description: 'A centralized cybersecurity platform integrating AI-driven simulations and learning modules. Features include GRC Wizard for compliance questions, Log Analysis for real-time practice, and scenario-based exercises for incident response.',
      image: '/assets/projects/project1.jpg',
      categories: ['cybersecurity', 'ai', 'education'],
      technologies: ['React', 'Python', 'Flask', 'MongoDB', 'Docker'],
      link: 'https://github.com/username/proxyauthrequired',
      featured: true
    },
    {
      id: 2,
      title: 'CertsGamified',
      description: 'A gamified platform for certification preparation. Follow structured roadmaps to learn, practice, and master certifications like CompTIA. Earn XP, unlock badges, and track your progress.',
      image: '/assets/projects/project2.jpg',
      categories: ['education', 'web'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://github.com/username/certsgamified',
      featured: true
    },
    {
      id: 3,
      title: 'Cyber Labs',
      description: 'Hands-on labs for penetration testing and system hardening, providing practical training environments for cybersecurity enthusiasts.',
      image: '/assets/projects/project3.jpg',
      categories: ['cybersecurity', 'education'],
      technologies: ['Docker', 'Kali Linux', 'Python', 'Bash'],
      link: 'https://github.com/username/cyberlabs',
      featured: false
    },
    {
      id: 4,
      title: 'AutoApplication',
      description: 'An automated application bot for Indeed and LinkedIn, streamlining the job application process with web automation and scripting.',
      image: '/assets/projects/project4.jpg',
      categories: ['automation', 'web'],
      technologies: ['Python', 'Selenium', 'BeautifulSoup'],
      link: 'https://github.com/username/autoapplication',
      featured: false
    },
    {
      id: 5,
      title: 'Network Sentinel',
      description: 'A real-time network monitoring and intrusion detection system with customizable alerts and visual traffic analysis.',
      image: '/assets/projects/project5.jpg',
      categories: ['cybersecurity', 'networking'],
      technologies: ['Python', 'Flask', 'Socket.IO', 'D3.js'],
      link: 'https://github.com/username/networksentinel',
      featured: false
    },
    {
      id: 6,
      title: 'Quantum Crypto Sim',
      description: 'A quantum cryptography simulation tool that demonstrates key principles and protocols with interactive visualizations.',
      image: '/assets/projects/project6.jpg',
      categories: ['cryptography', 'education'],
      technologies: ['React', 'Three.js', 'Web Workers', 'TypeScript'],
      link: 'https://github.com/username/quantumcryptosim',
      featured: false
    }
  ];
  
  // Category filters
  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'cybersecurity', name: 'CYBERSECURITY' },
    { id: 'web', name: 'WEB DEV' },
    { id: 'ai', name: 'AI' },
    { id: 'education', name: 'EDUCATION' },
    { id: 'automation', name: 'AUTOMATION' },
    { id: 'networking', name: 'NETWORKING' },
    { id: 'cryptography', name: 'CRYPTOGRAPHY' }
  ];
  
  // Filter projects based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.categories.includes(activeFilter)
      );
      setFilteredProjects(filtered);
    }
  }, [activeFilter]);
  
  // Handle filter click
  const handleFilterClick = (categoryId) => {
    setActiveFilter(categoryId);
    playSound('click');
  };
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!projectsContainerRef.current) return;
      
      const rect = projectsContainerRef.current.getBoundingClientRect();
      
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
      });
    };
    
    const projectsContainer = projectsContainerRef.current;
    
    if (projectsContainer) {
      projectsContainer.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (projectsContainer) {
        projectsContainer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // Neural network visualization
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
    
    // Neural network parameters
    const nodes = [];
    const connections = [];
    
    // Create nodes
    const createNodes = () => {
      const nodeCount = 20; // Adjust based on performance
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 3 + 2,
          color: theme === 'dark' ? 
            `rgba(${Math.random() > 0.7 ? '255, 61, 61' : '0, 255, 245'}, ${0.5 + Math.random() * 0.5})` : 
            `rgba(${Math.random() > 0.7 ? '255, 61, 61' : '77, 77, 255'}, ${0.5 + Math.random() * 0.5})`
        });
      }
    };
    
    // Update neural network
    const updateNetwork = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update nodes
      nodes.forEach(node => {
        // Apply light mouse influence
        node.vx += mousePosition.x * 0.005;
        node.vy += mousePosition.y * 0.005;
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Apply slight friction
        node.vx *= 0.99;
        node.vy *= 0.99;
        
        // Keep within bounds
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -1;
        }
        
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -1;
        }
      });
      
      // Find connections between nodes
      connections.length = 0;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            connections.push({
              from: nodes[i],
              to: nodes[j],
              opacity: 1 - distance / 100
            });
          }
        }
      }
      
      // Draw connections
      connections.forEach(connection => {
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        
        const gradient = ctx.createLinearGradient(
          connection.from.x, connection.from.y,
          connection.to.x, connection.to.y
        );
        
        gradient.addColorStop(0, connection.from.color);
        gradient.addColorStop(1, connection.to.color);
        
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = connection.opacity * 0.7;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      
      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });
    };
    
    // Initialize and start animation
    createNodes();
    
    let animationId;
    const animate = () => {
      updateNetwork();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, mousePosition]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
    <section className={`projects-section ${fullPage ? 'full-page' : ''}`} id="projects">
      <canvas 
        ref={canvasRef} 
        className="projects-background"
        aria-hidden="true"
      ></canvas>
      
      <div className="container">
        {!fullPage && (
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>
        )}
        
        {fullPage && (
          <motion.h1 
            className="page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Project Portfolio
          </motion.h1>
        )}
        
        <motion.div 
          className="filter-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="filter-label">FILTER:</div>
          <div className="filter-options">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-option ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => handleFilterClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="projects-grid"
          ref={projectsContainerRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              className={`project-card ${
                hoveredProject === project.id ? 'hovered' : ''
              } ${project.featured ? 'featured' : ''}`}
              variants={itemVariants}
              onMouseEnter={() => {
                setHoveredProject(project.id);
                playSound('hover');
              }}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                transform: hoveredProject === project.id
                  ? `perspective(1000px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`
                  : 'perspective(1000px) rotateX(0) rotateY(0)',
                transition: 'transform 0.5s ease-out'
              }}
            >
              <div className="project-image-container">
                <div className="project-image-overlay"></div>
                <img 
                  src={project.image || `/assets/projects/default.jpg`} 
                  alt={project.title} 
                  className="project-image"
                />
                
                {project.featured && (
                  <div className="featured-badge">FEATURED</div>
                )}
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                
                <div className="project-categories">
                  {project.categories.map((category, idx) => (
                    <span key={idx} className="project-category">
                      {categories.find(c => c.id === category)?.name || category}
                    </span>
                  ))}
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-technologies">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="project-technology">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cyber-button cyber-button--small"
                    onClick={() => playSound('click')}
                  >
                    VIEW PROJECT
                  </a>
                </div>
              </div>
              
              <div className="project-card-decoration"></div>
            </motion.div>
          ))}
        </motion.div>
        
        {!fullPage && filteredProjects.length > 0 && (
          <motion.div 
            className="view-all-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              to="/projects" 
              className="cyber-button"
              onClick={() => playSound('click')}
            >
              VIEW ALL PROJECTS
            </Link>
          </motion.div>
        )}
        
        {filteredProjects.length === 0 && (
          <motion.div 
            className="no-projects"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="no-projects-message">
              <div className="no-projects-icon">!</div>
              <h3>NO PROJECTS FOUND</h3>
              <p>Try selecting a different category filter.</p>
            </div>
          </motion.div>
        )}
      </div>
      
      <style jsx>{`
        .projects-section {
          position: relative;
          padding: var(--space-xxl) 0;
          min-height: ${fullPage ? '100vh' : 'auto'};
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .projects-section.full-page {
          padding-top: calc(var(--header-height) + var(--space-xxl));
        }
        
        .projects-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        
        .section-title,
        .page-title {
          text-align: center;
          margin-bottom: var(--space-xl);
          color: var(--accent-cyan);
          position: relative;
          display: inline-block;
          width: 100%;
        }
        
        .page-title {
          font-size: 3rem;
        }
        
        .section-title::after,
        .page-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent-cyan),
            transparent
          );
        }
        
        .filter-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-xl);
          gap: var(--space-sm);
        }
        
        .filter-label {
          font-family: var(--font-mono);
          color: var(--text-secondary);
          margin-right: var(--space-sm);
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          justify-content: center;
        }
        
        .filter-option {
          padding: var(--space-xs) var(--space-sm);
          background-color: rgba(10, 10, 10, 0.5);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-sm);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          transition: all var(--transition-normal);
          cursor: none;
        }
        
        .filter-option:hover {
          color: var(--accent-cyan);
          border-color: var(--accent-cyan);
          background-color: rgba(0, 255, 245, 0.1);
          transform: translateY(-2px);
        }
        
        .filter-option.active {
          color: var(--bg-primary);
          background-color: var(--accent-cyan);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 255, 245, 0.3);
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
        }
        
        .project-card {
          position: relative;
          background-color: rgba(10, 10, 10, 0.7);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          border: 1px solid var(--border-primary);
          transition: all var(--transition-normal);
          height: 100%;
          display: flex;
          flex-direction: column;
          transform-style: preserve-3d;
        }
        
        .project-card.hovered {
          border-color: var(--accent-cyan);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 255, 245, 0.2);
          transform: perspective(1000px) scale(1.02);
        }
        
        .project-card.featured {
          grid-column: span 2;
        }
        
        .project-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }
        
        .project-card.hovered .project-image {
          transform: scale(1.05);
        }
        
        .project-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(10, 10, 10, 0.8) 100%
          );
          z-index: 1;
        }
        
        .featured-badge {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
          background-color: var(--accent-magenta);
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          z-index: 2;
        }
        
        .project-content {
          padding: var(--space-lg);
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .project-title {
          font-size: 1.5rem;
          margin-bottom: var(--space-sm);
          color: var(--accent-cyan);
        }
        
        .project-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          margin-bottom: var(--space-sm);
        }
        
        .project-category {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          background-color: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: var(--border-radius-sm);
          font-family: var(--font-mono);
        }
        
        .project-description {
          margin-bottom: var(--space-md);
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          flex: 1;
        }
        
        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        }
        
        .project-technology {
          font-size: 0.8rem;
          color: var(--accent-cyan);
          border: 1px solid var(--accent-cyan);
          padding: 2px 8px;
          border-radius: var(--border-radius-sm);
          font-family: var(--font-mono);
        }
        
        .project-links {
          display: flex;
          justify-content: flex-end;
        }
        
        .project-card-decoration {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50px;
          height: 50px;
          border-top: 1px solid var(--accent-cyan);
          border-left: 1px solid var(--accent-cyan);
          pointer-events: none;
          opacity: 0.6;
          transition: all var(--transition-normal);
        }
        
        .project-card.hovered .project-card-decoration {
          width: 70px;
          height: 70px;
          opacity: 1;
        }
        
        .view-all-container {
          display: flex;
          justify-content: center;
          margin-top: var(--space-xl);
        }
        
        .no-projects {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }
        
        .no-projects-message {
          text-align: center;
          padding: var(--space-xl);
          background-color: rgba(10, 10, 10, 0.7);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-md);
          max-width: 400px;
        }
        
        .no-projects-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          margin: 0 auto var(--space-md);
          background-color: rgba(255, 61, 61, 0.2);
          border: 2px solid var(--accent-magenta);
          border-radius: 50%;
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-magenta);
        }
        
        /* Light theme styles */
        .light-theme .project-card {
          background-color: rgba(245, 245, 245, 0.8);
        }
        
        .light-theme .project-image-overlay {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(245, 245, 245, 0.8) 100%
          );
        }
        
        .light-theme .project-card.hovered {
          border-color: var(--accent-blue);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 0 15px rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .project-card-decoration {
          border-color: var(--accent-blue);
        }
        
        .light-theme .project-technology {
          color: var(--accent-blue);
          border-color: var(--accent-blue);
        }
        
        .light-theme .filter-option:hover {
          color: var(--accent-blue);
          border-color: var(--accent-blue);
          background-color: rgba(77, 77, 255, 0.1);
        }
        
        .light-theme .filter-option.active {
          color: #fff;
          background-color: var(--accent-blue);
          border-color: var(--accent-blue);
          box-shadow: 0 0 10px rgba(77, 77, 255, 0.3);
        }
        
        /* Media queries */
        @media (max-width: 1200px) {
          .project-card.featured {
            grid-column: span 1;
          }
        }
        
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: var(--space-lg);
          }
          
          .filter-container {
            flex-direction: column;
            gap: var(--space-xs);
          }
          
          .filter-options {
            width: 100%;
            justify-content: center;
          }
          
          .project-content {
            padding: var(--space-md);
          }
          
          .project-title {
            font-size: 1.3rem;
          }
        }
        
        @media (max-width: 480px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-option {
            font-size: 0.7rem;
            padding: 4px 6px;
          }
          
          .page-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectsGrid;
