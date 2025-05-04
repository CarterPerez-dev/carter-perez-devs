import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';
import styles from './HolographicTimeline.module.css';

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
  const [expandedItem, setExpandedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Create a memoized filtered list of items based on the active category
  // Create a memoized filtered list of items based on the active category
  const filteredItems = useMemo(() => {
    // Filter by category - FIXED with better logging and case-insensitive comparison
    console.log(`Filtering timeline by category: ${activeCategory}`);
    const filtered = activeCategory === 'all' 
      ? [...TIMELINE_DATA] 
      : TIMELINE_DATA.filter(item => {
          const matches = item.category.toLowerCase() === activeCategory.toLowerCase();
          console.log(`Timeline item "${item.title}" has category: ${item.category} - matches filter: ${matches}`);
          return matches;
        });
    
    console.log(`Found ${filtered.length} matching timeline items`);
    
    // Sort by date (most recent first)
    return filtered.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA;
    });
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
    <section className={`${styles.timelineSection} ${fullPage ? styles.fullPage : ''}`} id="experience">
      <div className="container">
        {!fullPage && (
          <motion.h2 
            className={styles.sectionTitle}
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
            className={styles.pageTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chronological Matrix
          </motion.h1>
        )}
        
        <motion.div 
          className={styles.categorySelector}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))}
        </motion.div>
        
        <div className={styles.timelineContainer}>
          <canvas 
            ref={canvasRef} 
            className={styles.timelineGrid}
            aria-hidden="true"
          ></canvas>
          
          <motion.div 
            className={styles.timelineItems}
            ref={timelineRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible" // Use animate instead of whileInView
            key={activeCategory} // Add a key that changes with filter
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const categoryStyle = getCategoryStyle(item.category);
                const isExpanded = expandedItem === item.id;
                
                return (
                  <motion.div 
                    key={item.id}
                    id={`timeline-item-${item.id}`}
                    className={`${styles.timelineItem} ${isExpanded ? styles.expanded : ''} ${hoveredItem === item.id ? styles.hovered : ''}`}
                    variants={itemVariants}
                    onClick={() => handleItemClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      '--timeline-color': categoryStyle.color
                    }}
                  >
                    <div className={styles.timelineItemHeader}>
                      <div className={styles.timelineIcon} style={{ backgroundColor: categoryStyle.color }}>
                        {categoryStyle.icon}
                      </div>
                      
                      <div className={styles.timelineHeaderContent}>
                        <h3 className={styles.timelineTitle}>{item.title}</h3>
                        <div className={styles.timelineSubtitle}>
                          <span className={styles.timelineCompany}>{item.company}</span>
                          <span className={styles.timelineSeparator}>|</span>
                          <span className={styles.timelineLocation}>{item.location}</span>
                        </div>
                      </div>
                      
                      <div className={styles.timelineDate}>{item.date}</div>
                    </div>
                    
                    <div className={styles.timelineContent}>
                      <p className={styles.timelineDescription}>{item.description}</p>
                      
                      {isExpanded && (
                        <div className={styles.timelineDetails}>
                          <div className={styles.timelineSection}>
                            <h4 className={styles.timelineSectionTitle}>Key Achievements</h4>
                            <ul className={styles.timelineAchievements}>
                              {item.achievements.map((achievement, idx) => (
                                <li key={idx} className={styles.timelineAchievementItem}>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className={styles.timelineSection}>
                            <h4 className={styles.timelineSectionTitle}>Skills Applied</h4>
                            <div className={styles.timelineSkills}>
                              {item.skills.map((skill, idx) => (
                                <span key={idx} className={styles.timelineSkill}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.timelineConnector}>
                      <div className={styles.timelineDot}></div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className={styles.noItemsMessage}
                variants={itemVariants}
              >
                <div className={styles.noItemsIcon}>🔍</div>
                <h3>NO TIMELINE ENTRIES FOUND</h3>
                <p>Try selecting a different category filter.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HolographicTimeline;
