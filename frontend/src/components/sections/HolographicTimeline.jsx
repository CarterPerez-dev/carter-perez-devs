import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';

// Timeline data
const TIMELINE_DATA = [
  {
    id: 1,
    title: 'System Integration Technician II',
    company: 'Sealing Technologies',
    location: 'Annapolis, MD',
    date: '2024 - Present',
    description: 'Building and configuring custom cybersecurity and defense systems, ensuring they meet client needs and perform reliably under demanding conditions. Responsibilities include system assembly, optimization, testing, and maintenance, as well as collaborating with cross-functional teams to deliver comprehensive solutions.',
    achievements: [
      'Completed over 50 custom system builds with a 99.8% pass rate on quality assurance tests',
      'Implemented new cable management techniques that reduced setup time by 15%',
      'Authored a company blog post on efficient quality assurance processes',
      'Reduced RMA rates by 22% through improved assembly procedures'
    ],
    skills: ['System Integration', 'Quality Assurance', 'Hardware Configuration', 'Technical Documentation'],
    category: 'work'
  },
  {
    id: 2,
    title: "Master's Degree in Cybersecurity",
    company: 'University of Maryland Global Campus',
    location: 'Adelphi, MD',
    date: '2024 - Present',
    description: 'Currently pursuing a master\'s degree with advanced studies in cybersecurity strategies and threat management.',
    achievements: [
      'Maintaining a 3.9 GPA while working full-time',
      'Specializing in advanced security protocols and threat intelligence',
      'Participating in cybersecurity research projects',
      'Member of the Cybersecurity Club'
    ],
    skills: ['Advanced Cybersecurity', 'Threat Intelligence', 'Security Research', 'Risk Management'],
    category: 'education'
  },
  {
    id: 3,
    title: 'Developed ProxyAuthRequired.com',
    company: 'Personal Project',
    location: 'Remote',
    date: 'December, 2024',
    description: 'Developed a centralized cybersecurity platform integrating AI-driven simulations and learning modules. Features include GRC Wizard for compliance questions, Log Analysis for real-time practice, and scenario-based exercises for incident response.',
    achievements: [
      'Built a secure, scalable platform leveraging Docker containers and multi-stage builds',
      'Integrated advanced log analysis and compliance tools',
      'Created an educational hub tailored for CompTIA certifications',
      'Successfully launched with positive user feedback'
    ],
    skills: ['React', 'Python', 'Flask', 'MongoDB', 'Docker', 'AI Integration'],
    category: 'project'
  },
  {
    id: 4,
    title: 'CompTIA Certification Path',
    company: 'CompTIA',
    location: 'Remote',
    date: '2024',
    description: 'Completed the full CompTIA cybersecurity path within nine months, acquiring seven certifications including A+, Network+, Security+, CySA+, PenTest+, and CASP+.',
    achievements: [
      'Achieved all certifications on first attempt',
      'Completed certifications in record time',
      'Developed efficient study techniques for rapid certification',
      'Presented study methods at ISSA UMBC chapter'
    ],
    skills: ['Cybersecurity Fundamentals', 'Network Security', 'Penetration Testing', 'Security Analysis'],
    category: 'certification'
  },
  {
    id: 5,
    title: 'General Manager',
    company: "Jimmy John's",
    location: 'Severna Park, MD',
    date: '2022 - 2024',
    description: 'Managed daily operations, supervised staff, and ensured customer satisfaction. Optimized workflows and enhanced team performance while troubleshooting technical issues with network and point-of-sale systems.',
    achievements: [
      'Increased store revenue by 18% through operational improvements',
      'Reduced employee turnover by 35% through improved training',
      'Maintained network and POS systems with 99.7% uptime',
      'Implemented new inventory system reducing waste by 12%'
    ],
    skills: ['Team Management', 'Operations', 'Customer Service', 'Technical Support'],
    category: 'work'
  },
  {
    id: 6,
    title: 'Associates in Cybersecurity',
    company: 'Anne Arundel Community College',
    location: 'Arnold, MD',
    date: '2022 - 2024',
    description: 'Completed foundational courses in cybersecurity, focusing on network security and ethical hacking.',
    achievements: [
      'Graduated with honors (3.8 GPA)',
      'Participated in capture-the-flag competitions',
      'Completed independent study on cloud security',
      'Assisted professors with lab setup for security courses'
    ],
    skills: ['Network Security', 'Ethical Hacking', 'Information Security', 'Risk Assessment'],
    category: 'education'
  },
  {
    id: 7,
    title: 'AutoApplication Development',
    company: 'Personal Project',
    location: 'Remote',
    date: 'July, 2024',
    description: 'Created an automated application bot for Indeed and LinkedIn, streamlining the job application process with web automation and scripting.',
    achievements: [
      'Developed Python-based automation using Selenium',
      'Implemented custom resume parsing and matching algorithms',
      'Reduced application time by 90% compared to manual process',
      'Built flexible configuration for different job search criteria'
    ],
    skills: ['Python', 'Selenium', 'Web Scraping', 'Process Automation'],
    category: 'project'
  }
];

// Category settings
const CATEGORIES = [
  { id: 'all', name: 'ALL', icon: '⚡' },
  { id: 'work', name: 'WORK', icon: '💼' },
  { id: 'education', name: 'EDUCATION', icon: '🎓' },
  { id: 'project', name: 'PROJECTS', icon: '🚀' },
  { id: 'certification', name: 'CERTIFICATIONS', icon: '📜' }
];

const HolographicTimeline = ({ fullPage = false }) => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Apply filter
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredItems([...TIMELINE_DATA].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // Most recent first
      }));
    } else {
      setFilteredItems(
        [...TIMELINE_DATA]
          .filter(item => item.category === activeCategory)
          .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA; // Most recent first
          })
      );
    }
  }, [activeCategory]);
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setExpandedItem(null);
    playSound('click');
  };
  
  // Handle item click
  const handleItemClick = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
    playSound('click');
  };
  
  // Holographic grid effect animation
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
    
    // Grid parameters
    const gridSize = 30;
    
    // Render holographic grid
    const renderGrid = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set color based on theme
      const primaryColor = theme === 'dark' ? 
        'rgba(0, 255, 245, 0.4)' : 'rgba(77, 77, 255, 0.4)';
      const secondaryColor = 'rgba(255, 61, 61, 0.2)';
      
      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const opacity = 0.1 + Math.sin(x * 0.01 + scrollPosition * 0.002) * 0.05;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = x % (gridSize * 2) === 0 ? 
          primaryColor.replace('0.4', opacity) : 
          secondaryColor.replace('0.2', opacity * 0.5);
        ctx.lineWidth = x % (gridSize * 3) === 0 ? 1.5 : 0.5;
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const opacity = 0.1 + Math.cos(y * 0.01 + scrollPosition * 0.002) * 0.05;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = y % (gridSize * 2) === 0 ? 
          primaryColor.replace('0.4', opacity) : 
          secondaryColor.replace('0.2', opacity * 0.5);
        ctx.lineWidth = y % (gridSize * 3) === 0 ? 1.5 : 0.5;
        ctx.stroke();
      }
      
      // Draw glow effect for hover or expanded item
      if (hoveredItem !== null || expandedItem !== null) {
        const itemId = hoveredItem !== null ? hoveredItem : expandedItem;
        const index = filteredItems.findIndex(item => item.id === itemId);
        
        if (index !== -1) {
          const itemElement = document.getElementById(`timeline-item-${itemId}`);
          
          if (itemElement) {
            const rect = itemElement.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const x = rect.left - canvasRect.left + rect.width / 2;
            const y = rect.top - canvasRect.top + rect.height / 2;
            const radius = Math.max(rect.width, rect.height) * 0.7;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(0, 255, 245, ${hoveredItem !== null ? 0.3 : 0.2})`);
            gradient.addColorStop(1, 'rgba(0, 255, 245, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      }
    };
    
    // Update scroll position
    const handleScroll = () => {
      if (timelineRef.current) {
        setScrollPosition(timelineRef.current.scrollTop);
      }
    };
    
    timelineRef.current?.addEventListener('scroll', handleScroll);
    
    // Animation loop
    let animationId;
    const animate = () => {
      renderGrid();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      timelineRef.current?.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, [theme, hoveredItem, expandedItem, filteredItems, scrollPosition]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
  
  // Helper function to parse date strings (for sorting)
  function parseDate(dateStr) {
    // Handle ranges like "2022 - 2024" or "2024 - Present"
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      const endPart = parts[1].trim();
      
      // If end date is "Present", use current date
      if (endPart === 'Present') {
        return new Date();
      }
      
      // Otherwise use the end year
      return new Date(endPart, 0);
    }
    
    // Handle months like "December, 2024"
    if (dateStr.includes(',')) {
      return new Date(dateStr);
    }
    
    // Handle just years like "2024"
    return new Date(dateStr, 0);
  }
  
  // Get category icon and styling
  const getCategoryStyle = (category) => {
    switch (category) {
      case 'work':
        return { icon: '💼', color: 'var(--accent-cyan)' };
      case 'education':
        return { icon: '🎓', color: 'var(--accent-blue)' };
      case 'project':
        return { icon: '🚀', color: 'var(--accent-magenta)' };
      case 'certification':
        return { icon: '📜', color: 'var(--accent-green)' };
      default:
        return { icon: '⚡', color: 'var(--accent-purple)' };
    }
  };
  
  return (
    <section className={`timeline-section ${fullPage ? 'full-page' : ''}`} id="experience">
      <div className="container">
        {!fullPage && (
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Experience Timeline
          </motion.h2>
        )}
        
        {fullPage && (
          <motion.h1 
            className="page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chronological Matrix
          </motion.h1>
        )}
        
        <motion.div 
          className="category-selector"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </motion.div>
        
        <div className="timeline-container">
          <canvas 
            ref={canvasRef} 
            className="timeline-grid"
            aria-hidden="true"
          ></canvas>
          
          <motion.div 
            className="timeline-items"
            ref={timelineRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const categoryStyle = getCategoryStyle(item.category);
                const isExpanded = expandedItem === item.id;
                
                return (
                  <motion.div 
                    key={item.id}
                    id={`timeline-item-${item.id}`}
                    className={`timeline-item ${isExpanded ? 'expanded' : ''} ${hoveredItem === item.id ? 'hovered' : ''}`}
                    variants={itemVariants}
                    onClick={() => handleItemClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      '--timeline-color': categoryStyle.color
                    }}
                  >
                    <div className="timeline-item-header">
                      <div className="timeline-icon" style={{ backgroundColor: categoryStyle.color }}>
                        {categoryStyle.icon}
                      </div>
                      
                      <div className="timeline-header-content">
                        <h3 className="timeline-title">{item.title}</h3>
                        <div className="timeline-subtitle">
                          <span className="timeline-company">{item.company}</span>
                          <span className="timeline-separator">|</span>
                          <span className="timeline-location">{item.location}</span>
                        </div>
                      </div>
                      
                      <div className="timeline-date">{item.date}</div>
                    </div>
                    
                    <div className="timeline-content">
                      <p className="timeline-description">{item.description}</p>
                      
                      {isExpanded && (
                        <div className="timeline-details">
                          <div className="timeline-section">
                            <h4 className="timeline-section-title">Key Achievements</h4>
                            <ul className="timeline-achievements">
                              {item.achievements.map((achievement, idx) => (
                                <li key={idx} className="timeline-achievement-item">
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="timeline-section">
                            <h4 className="timeline-section-title">Skills Applied</h4>
                            <div className="timeline-skills">
                              {item.skills.map((skill, idx) => (
                                <span key={idx} className="timeline-skill">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="timeline-connector">
                      <div className="timeline-line"></div>
                      <div className="timeline-dot"></div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className="no-items-message"
                variants={itemVariants}
              >
                <div className="no-items-icon">🔍</div>
                <h3>NO TIMELINE ENTRIES FOUND</h3>
                <p>Try selecting a different category filter.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      <style jsx>{`
        .timeline-section {
          position: relative;
          padding: var(--space-xxl) 0;
          min-height: ${fullPage ? '100vh' : 'auto'};
        }
        
        .timeline-section.full-page {
          padding-top: calc(var(--header-height) + var(--space-xl));
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
        
        .category-selector {
          display: flex;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
        }
        
        .category-button {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          background-color: rgba(10, 10, 10, 0.5);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-sm);
          color: var(--text-secondary);
          transition: all var(--transition-normal);
          cursor: none;
        }
        
        .category-button:hover {
          transform: translateY(-2px);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 255, 245, 0.2);
        }
        
        .category-button.active {
          background-color: rgba(0, 255, 245, 0.1);
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
          box-shadow: 0 0 15px rgba(0, 255, 245, 0.3);
        }
        
        .category-icon {
          font-size: 1.2rem;
        }
        
        .category-name {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        
        .timeline-container {
          position: relative;
          width: 100%;
          height: 600px;
          background-color: rgba(10, 10, 10, 0.5);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-primary);
        }
        
        .timeline-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .timeline-items {
          position: relative;
          z-index: 2;
          height: 100%;
          overflow-y: auto;
          padding: var(--space-lg);
        }
        
        .timeline-items::-webkit-scrollbar {
          width: 6px;
        }
        
        .timeline-items::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        .timeline-items::-webkit-scrollbar-thumb {
          background: var(--accent-cyan);
          border-radius: 3px;
        }
        
        .timeline-item {
          position: relative;
          background-color: rgba(20, 20, 20, 0.7);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--space-lg);
          overflow: hidden;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all var(--transition-normal);
          transform-origin: center left;
        }
        
        .timeline-item:hover,
        .timeline-item.hovered {
          transform: translateX(5px);
          border-color: var(--timeline-color);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), 0 0 10px var(--timeline-color);
        }
        
        .timeline-item.expanded {
          background-color: rgba(30, 30, 30, 0.8);
        }
        
        .timeline-item-header {
          display: flex;
          align-items: center;
          padding: var(--space-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          cursor: none;
        }
        
        .timeline-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: var(--space-md);
          flex-shrink: 0;
        }
        
        .timeline-header-content {
          flex: 1;
        }
        
        .timeline-title {
          font-size: 1.2rem;
          margin-bottom: var(--space-xs);
          color: var(--text-primary);
        }
        
        .timeline-subtitle {
          display: flex;
          align-items: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
          flex-wrap: wrap;
        }
        
        .timeline-separator {
          margin: 0 var(--space-xs);
          color: var(--text-tertiary);
        }
        
        .timeline-date {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--timeline-color);
          white-space: nowrap;
          margin-left: var(--space-md);
        }
        
        .timeline-content {
          padding: var(--space-md);
        }
        
        .timeline-description {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: var(--space-md);
        }
        
        .timeline-details {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: var(--space-md);
        }
        
        .timeline-section {
          margin-bottom: var(--space-md);
        }
        
        .timeline-section:last-child {
          margin-bottom: 0;
        }
        
        .timeline-section-title {
          font-size: 1rem;
          color: var(--timeline-color);
          margin-bottom: var(--space-sm);
          font-family: var(--font-mono);
          letter-spacing: 1px;
        }
        
        .timeline-achievements {
          list-style-type: none;
          padding-left: var(--space-md);
        }
        
        .timeline-achievement-item {
          position: relative;
          color: var(--text-secondary);
          margin-bottom: var(--space-xs);
          line-height: 1.5;
        }
        
        .timeline-achievement-item::before {
          content: '▹';
          position: absolute;
          left: -15px;
          color: var(--timeline-color);
        }
        
        .timeline-skills {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
        }
        
        .timeline-skill {
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          padding: 3px 10px;
          border-radius: var(--border-radius-sm);
          font-size: 0.8rem;
          border: 1px solid var(--timeline-color);
        }
        
        .timeline-connector {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          z-index: -1;
        }
        
        .timeline-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 20px;
          width: 1px;
          background-color: var(--timeline-color);
        }
        
        .timeline-dot {
          position: absolute;
          top: 30px;
          left: 20px;
          width: 10px;
          height: 10px;
          background-color: var(--timeline-color);
          border-radius: 50%;
          transform: translateX(-4.5px);
          box-shadow: 0 0 10px var(--timeline-color);
        }
        
        .no-items-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-secondary);
          text-align: center;
        }
        
        .no-items-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }
        
        /* Light theme styles */
        .light-theme .timeline-container {
          background-color: rgba(245, 245, 245, 0.5);
        }
        
        .light-theme .timeline-item {
          background-color: rgba(230, 230, 230, 0.7);
          border-color: rgba(0, 0, 0, 0.1);
        }
        
        .light-theme .timeline-item.expanded {
          background-color: rgba(215, 215, 215, 0.8);
        }
        
        .light-theme .category-button {
          background-color: rgba(220, 220, 220, 0.5);
          border-color: rgba(0, 0, 0, 0.1);
        }
        
        .light-theme .category-button:hover {
          border-color: var(--accent-blue);
          box-shadow: 0 0 10px rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .category-button.active {
          background-color: rgba(77, 77, 255, 0.1);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
          box-shadow: 0 0 15px rgba(77, 77, 255, 0.3);
        }
        
        .light-theme .timeline-items::-webkit-scrollbar-thumb {
          background: var(--accent-blue);
        }
        
        .light-theme .timeline-item-header,
        .light-theme .timeline-details {
          border-color: rgba(0, 0, 0, 0.1);
        }
        
        .light-theme .timeline-skill {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        /* Media queries */
        @media (max-width: 768px) {
          .category-selector {
            gap: var(--space-sm);
          }
          
          .category-button {
            padding: var(--space-xs) var(--space-sm);
          }
          
          .timeline-item-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .timeline-date {
            margin-left: 0;
            margin-top: var(--space-xs);
          }
          
          .timeline-items {
            padding: var(--space-md);
          }
          
          .page-title {
            font-size: 2.2rem;
          }
        }
        
        @media (max-width: 480px) {
          .timeline-icon {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }
          
          .timeline-title {
            font-size: 1rem;
          }
          
          .timeline-subtitle {
            font-size: 0.8rem;
          }
          
          .timeline-date {
            font-size: 0.8rem;
          }
          
          .timeline-description {
            font-size: 0.9rem;
          }
          
          .timeline-section-title {
            font-size: 0.9rem;
          }
          
          .timeline-achievement-item,
          .timeline-skill {
            font-size: 0.8rem;
          }
          
          .category-name {
            display: none;
          }
          
          .category-icon {
            font-size: 1.5rem;
          }
          
          .category-button {
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default HolographicTimeline;
