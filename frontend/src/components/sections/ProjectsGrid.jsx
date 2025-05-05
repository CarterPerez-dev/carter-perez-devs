// frontend/src/components/sections/ProjectsGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';
import styles from './ProjectsGrid.module.css';

// Import images properly
import certgames from './images/ios.png';
import flask from './images/11.png';
import blog2 from './images/14.png';
import blog3 from './images/15.png';
import blog1 from './images/4.png';
import cyber from './images/5.png';
import angela from './images/8.png';

const ProjectsGrid = ({ fullPage = false }) => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState(null);
  const projectsContainerRef = useRef(null);
  

  const projects = [
    {
      id: 1,
      title: 'CertGames.com',
      description: 'A gamified platform for certification preparation. Follow structured roadmaps to learn, practice, and master certifications like CompTIA. Earn XP, unlock badges, and track your progress.',
      image: certgames, 
      categories: ['cybersecurity', 'education'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://certgames.com',
      featured: true
    },
    {
      id: 2,
      title: 'Flask-Honeypot',
      description: 'A lightweight honeypot system built with Flask. Detects and logs potential cyber attacks while presenting convincing decoy services to attackers. Helps identify common attack vectors and malicious IP addresses.',
      image: flask,
      categories: ['cybersecurity'],
      technologies: ['Python', 'Flask', 'Docker', 'SQLite'],
      link: 'https://github.com/CarterPerez-dev/flask-honeypot',
      featured: false
    },
    {
      id: 3,
      title: 'Portfolio',
      description: 'A futuristic themed portfolio website with interactive elements and holographic UI. Features include 3D elements, glitch effects, and a custom terminal interface.',
      image: cyber,
      categories: ['web dev'],
      technologies: ['React', 'Three.js', 'CSS3', 'Framer Motion'],
      link: 'https://github.com/CarterPerez-dev/carter-perez-devs',
      featured: false
    },
    {
      id: 4,
      title: 'AngelaCLI',
      description: 'An AI-powered command line tool that assists with coding tasks. Integrates with your development workflow to provide context-aware suggestions, refactoring tips, and code generation.',
      image: angela,
      categories: ['ai'],
      technologies: ['Python', 'OpenAI API', 'TensorFlow', 'Click'],
      link: 'https://github.com/CarterPerez-dev/angela-cli',
      featured: false
    },
    {
      id: 5,
      title: 'How My Career Growth Led to Enhancing Customer Experience',
      description: 'Certifications have a unique way of shaping not only the knowledge we carry but also the way we approach challenges. As an Integration Technician at SealingTech, earning professional CompTIA certifications such as the A+, Network+, Security+, Network+, CySa+, Pentest+, and CASP+ have placed me on a learning path which has become the catalyst for personal….',
      image: blog1, 
      categories: ['blogs', 'cybersecurity'],
      date: 'April 15, 2025',
      link: 'https://www.sealingtech.com/2025/02/03/how-my-career-growth-led-to-enhancing-customer-experience/',
      featured: false,
      isBlog: true
    },
    {
      id: 6,
      title: 'Building Custom Solutions with Quality at the Core',
      description: 'As a System Integration Technician at SealingTech, my team and I are responsible for building custom defense systems that are not only powerful but also tailored to the unique needs of our customers. From selecting the right hardware specifications to configuring the complex systems into a carry-on compliant Cyber-Fly-Away Kit, we focus on optimizing performance,…',
      image: blog2,
      categories: ['blogs', 'web dev'],
      date: 'March 22, 2025',
      link: 'https://www.sealingtech.com/2024/10/03/building-custom-solutions-with-quality-at-the-core/',
      featured: false,
      isBlog: true
    },
    {
      id: 7,
      title: 'Top 10 Tips to Pass the CompTIA Security+ Exam on Your First Try',
      description: 'The CompTIA Security+ certification is one of the most sought-after entry-level cybersecurity certifications. With over 900,000 Security+ certified professionals worldwide, this certification validates the baseline skills necessary to perform core security functions and serves as a springboard for more advanced cybersecurity roles...',
      image: blog3, 
      categories: ['blogs', 'ai', 'education'],
      date: 'February 8, 2025',
      link: 'https://certgames.com/blog/comptia-security-plus-exam-tips',
      featured: false,
      isBlog: true
    }
  ];
  
  // Category filters
  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'cybersecurity', name: 'CYBERSECURITY' },
    { id: 'web dev', name: 'WEB DEV' },
    { id: 'ai', name: 'AI' },
    { id: 'education', name: 'EDUCATION' },
    { id: 'blogs', name: 'BLOGS' }
  ];
  
  // Populate filtered projects on initial load
  useEffect(() => {
    setFilteredProjects([...projects]);
  }, []);
  
  // Filter projects based on active filter - FIXED logic for filtering issues
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects([...projects]);
    } else {
      // More robust filtering with some debug logging
      console.log(`Filtering by category: ${activeFilter}`);
      const filtered = projects.filter(project => {
        const hasCategory = project.categories.some(category => 
          category.toLowerCase() === activeFilter.toLowerCase()
        );
        console.log(`Project "${project.title}" has categories: ${project.categories.join(', ')} - matches filter: ${hasCategory}`);
        return hasCategory;
      });
      console.log(`Found ${filtered.length} matching projects`);
      setFilteredProjects(filtered);
    }
  }, [activeFilter]);
  
  // Handle filter click
  const handleFilterClick = (categoryId) => {
    setActiveFilter(categoryId);
    playSound('click');
  };
  
  // Handle mouse movement for mild parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!projectsContainerRef.current) return;
      
      const rect = projectsContainerRef.current.getBoundingClientRect();
      
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 0.5,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 0.5
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
      transition: { type: 'spring', stiffness: 50, damping: 10 }
    }
  };
  
  return (
    <section 
      className={`${styles.projectsSection} ${fullPage ? styles.fullPage : ''}`} 
      id="projects"
    >
      <div className={styles.projectsBackground}></div>
      
      <div className="container">
        {!fullPage && (
          <motion.h2 
            className={styles.sectionTitle}
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
            className={styles.pageTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Project Portfolio
          </motion.h1>
        )}
        
        <motion.div 
          className={styles.filterContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.filterLabel}>FILTER:</div>
          <div className={styles.filterOptions}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.filterOption} ${activeFilter === category.id ? styles.active : ''}`}
                onClick={() => handleFilterClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.projectsGrid}
          ref={projectsContainerRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeFilter} 
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div 
                key={project.id}
                className={`
                  ${styles.projectCard}
                  ${hoveredProject === project.id ? styles.hovered : ''}
                  ${project.featured ? styles.featured : ''}
                  ${project.isBlog ? styles.blogCard : ''}
                `}
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
                <div className={styles.projectImageContainer}>
                  <div className={styles.projectImageOverlay}></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className={styles.projectImage}
                    loading="lazy"
                  />
                  
                  {project.featured && (
                    <div className={styles.featuredBadge}>FEATURED</div>
                  )}
                  
                  {project.isBlog && (
                    <div className={styles.blogBadge}>BLOG</div>
                  )}
                </div>
                
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  
                  <div className={styles.projectCategories}>
                    {project.categories.map((category, idx) => (
                      <span key={idx} className={styles.projectCategory}>
                        {categories.find(c => c.id.toLowerCase() === category.toLowerCase())?.name || category.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  
                  {project.isBlog && (
                    <div className={styles.blogDate}>{project.date}</div>
                  )}
                  
                  <p className={styles.projectDescription}>{project.description}</p>
                  
                  {!project.isBlog && (
                    <div className={styles.projectTechnologies}>
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className={styles.projectTechnology}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className={styles.projectLinks}>
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
            ))
          ) : (
            <motion.div 
              className={styles.noProjects}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.noProjectsMessage}>
                <div className={styles.noProjectsIcon}>!</div>
                <h3>NO PROJECTS FOUND</h3>
                <p>Try selecting a different category filter.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {!fullPage && filteredProjects.length > 0 && (
          <motion.div 
            className={styles.viewAllContainer}
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
      </div>
    </section>
  );
};

export default ProjectsGrid;
