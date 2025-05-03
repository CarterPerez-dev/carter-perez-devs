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
  const projectsContainerRef = useRef(null);
  
  // Project data with your specified projects
  const projects = [
    {
      id: 1,
      title: 'CertGames.com',
      description: 'A gamified platform for certification preparation. Follow structured roadmaps to learn, practice, and master certifications like CompTIA. Earn XP, unlock badges, and track your progress.',
      image: '/assets/projects/certgames.jpg',
      categories: ['cybersecurity', 'education'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://certgames.com',
      featured: true
    },
    {
      id: 2,
      title: 'Flask-Honeypot',
      description: 'A lightweight honeypot system built with Flask. Detects and logs potential cyber attacks while presenting convincing decoy services to attackers. Helps identify common attack vectors and malicious IP addresses.',
      image: '/assets/projects/honeypot.jpg',
      categories: ['cybersecurity'],
      technologies: ['Python', 'Flask', 'Docker', 'SQLite'],
      link: 'https://github.com/username/flask-honeypot',
      featured: false
    },
    {
      id: 3,
      title: 'Cyberpunk Portfolio',
      description: 'A futuristic, cyberpunk-themed portfolio website with interactive elements and holographic UI. Features include 3D elements, glitch effects, and a custom terminal interface.',
      image: '/assets/projects/portfolio.jpg',
      categories: ['web dev'],
      technologies: ['React', 'Three.js', 'CSS3', 'Framer Motion'],
      link: 'https://github.com/username/cyberpunk-portfolio',
      featured: false
    },
    {
      id: 4,
      title: 'AngelaCLI',
      description: 'An AI-powered command line tool that assists with coding tasks. Integrates with your development workflow to provide context-aware suggestions, refactoring tips, and code generation.',
      image: '/assets/projects/angela-cli.jpg',
      categories: ['ai'],
      technologies: ['Python', 'OpenAI API', 'TensorFlow', 'Click'],
      link: 'https://github.com/username/angela-cli',
      featured: false
    },
    // Blog placeholders
    {
      id: 5,
      title: 'Understanding Zero Trust Architecture',
      description: 'An in-depth exploration of Zero Trust security principles and implementation strategies for modern organizations. Learn how to implement "never trust, always verify" in your infrastructure.',
      image: '/assets/blogs/zerotrust.jpg',
      categories: ['blogs', 'cybersecurity'],
      date: 'April 15, 2025',
      link: '/blog/zero-trust',
      featured: false,
      isBlog: true
    },
    {
      id: 6,
      title: 'The Future of Web Development in 2025',
      description: 'Exploring emerging web technologies and development paradigms that will shape the industry in the coming year. From WebAssembly to Edge Computing and AI-assisted coding.',
      image: '/assets/blogs/webdev2025.jpg',
      categories: ['blogs', 'web dev'],
      date: 'March 22, 2025',
      link: '/blog/web-development-trends',
      featured: false,
      isBlog: true
    },
    {
      id: 7,
      title: 'Practical Applications of LLMs in Education',
      description: 'How Large Language Models are transforming educational methodologies and creating new opportunities for personalized learning experiences. Case studies and implementation strategies.',
      image: '/assets/blogs/ai-education.jpg',
      categories: ['blogs', 'ai', 'education'],
      date: 'February 8, 2025',
      link: '/blog/llms-education',
      featured: false,
      isBlog: true
    }
  ];
  
  // Category filters - updated as requested
  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'cybersecurity', name: 'CYBERSECURITY' },
    { id: 'web dev', name: 'WEB DEV' },
    { id: 'ai', name: 'AI' },
    { id: 'education', name: 'EDUCATION' },
    { id: 'blogs', name: 'BLOGS' }
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
  
  // Handle mouse movement for mild parallax effect (simplified to reduce glitchiness)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!projectsContainerRef.current) return;
      
      const rect = projectsContainerRef.current.getBoundingClientRect();
      
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 0.5, // Reduced factor to minimize effect
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 0.5  // Reduced factor to minimize effect
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
      transition: { type: 'spring', stiffness: 50, damping: 10 } // More stable animation
    }
  };
  
  return (
    <section className={`projects-section ${fullPage ? 'full-page' : ''}`} id="projects">
      <div className="projects-background"></div>
      
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
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              className={`project-card ${
                hoveredProject === project.id ? 'hovered' : ''
              } ${project.featured ? 'featured' : ''} ${project.isBlog ? 'blog-card' : ''}`}
              variants={itemVariants}
              onMouseEnter={() => {
                setHoveredProject(project.id);
                playSound('hover');
              }}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                transform: hoveredProject === project.id
                  ? `translateY(-8px)`
                  : 'translateY(0)'
              }}
            >
              <div className="project-image-container">
                <div className="project-image-overlay"></div>
                <img 
                  src={project.image || `/assets/projects/default.jpg`} 
                  alt={project.title} 
                  className="project-image"
                  loading="lazy"
                />
                
                {project.featured && (
                  <div className="featured-badge">FEATURED</div>
                )}
                
                {project.isBlog && (
                  <div className="blog-badge">BLOG</div>
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
                
                {project.isBlog && (
                  <div className="blog-date">{project.date}</div>
                )}
                
                <p className="project-description">{project.description}</p>
                
                {!project.isBlog && (
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="project-technology">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="project-links">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cyber-button cyber-button--small"
                    onClick={() => playSound('click')}
                  >
                    {project.isBlog ? 'READ POST' : 'VIEW PROJECT'}
                  </a>
                </div>
              </div>
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
          background-color: rgba(5, 5, 5, 0.3);
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
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .project-card.hovered {
          border-color: var(--accent-cyan);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 255, 245, 0.2);
        }
        
        .project-card.featured {
          grid-column: span 2;
        }
        
        .project-card.blog-card {
          border-color: var(--accent-magenta);
        }
        
        .project-card.blog-card.hovered {
          border-color: var(--accent-magenta);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 61, 61, 0.2);
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
          transition: transform 0.5s ease;
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
          background-color: var(--accent-cyan);
          color: var(--bg-primary);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          z-index: 2;
          font-weight: bold;
        }
        
        .blog-badge {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
          background-color: var(--accent-magenta);
          color: var(--bg-primary);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          z-index: 2;
          font-weight: bold;
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
        
        .blog-card .project-title {
          color: var(--accent-magenta);
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
        
        .blog-date {
          font-size: 0.8rem;
          color: var(--accent-magenta);
          font-family: var(--font-mono);
          margin-bottom: var(--space-sm);
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
        
        .blog-card .project-technology {
          color: var(--accent-magenta);
          border-color: var(--accent-magenta);
        }
        
        .project-links {
          display: flex;
          justify-content: flex-end;
        }
        
        /* Better hover effect - replacing the corner element */
        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s ease;
        }
        
        .project-card.hovered::before {
          transform: scaleX(1);
        }
        
        .project-card.blog-card::before {
          background: linear-gradient(90deg, transparent, var(--accent-magenta), transparent);
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
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 0 15px rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .project-card::before {
          background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
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
