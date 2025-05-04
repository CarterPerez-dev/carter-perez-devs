import React, { useState, useEffect, useRef } from 'react';
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
    location: 'Columbia, MD',
    date: 'June 2024 - April 2025',
    description: 'Managed and optimized QA workflows for custom server builds, aligning with strict timelines and regulatory standards while maintaining computer hardware across the facility.',
    achievements: [
      'Consulted on assembly and logistics for $40M worth of servers, network switches, and cyber kits',
      'Authored multiple technical blogs for company website detailing efficient QA processes',
      'Developed SOPs to standardize assembly procedures across teams',
      'Streamlined onboarding processes for new team members'
    ],
    skills: ['System Integration', 'Quality Assurance', 'Hardware Configuration', 'Technical Documentation'],
    category: 'work'
  },
  {
    id: 2,
    title: "Master's Degree in Cybersecurity",
    company: 'University of Maryland Global Campus',
    location: 'Largo, MD',
    date: '2024 - May 2027',
    description: 'Currently pursuing a master\'s degree in Cybersecurity with advanced studies in security strategies and threat management.',
    achievements: [
      'Maintaining a strong academic record while working full-time',
      'Specializing in advanced security protocols and threat intelligence',
      'Participating in cybersecurity research projects',
      'Developing expertise in security analysis and risk management'
    ],
    skills: ['Advanced Cybersecurity', 'Threat Intelligence', 'Security Research', 'Risk Management'],
    category: 'education'
  },
  {
    id: 3,
    title: 'CertGames.com',
    company: 'Full-Stack Project',
    location: 'Remote',
    date: '2024 - Present',
    description: 'Developed full-stack cybersecurity platform using React/Redux frontend, Python/Flask backend, MongoDB database, Redis caching, Nginx, and targeted OpenAI capabilities for cybersecurity training.',
    achievements: [
      'Built platform serving 500+ active learners (100+ paying subscribers) within 2 months',
      'Created comprehensive learning content including 13k+ questions across certification paths',
      'Developed 10+ interactive learning games and 15+ customizable themes',
      'Implemented real-time support system for enhanced user experience'
    ],
    skills: ['React', 'Redux', 'Python', 'Flask', 'MongoDB', 'OpenAI Integration', 'Docker'],
    category: 'project'
  },
  {
    id: 4,
    title: 'CertGames iOS App',
    company: 'Mobile Development',
    location: 'Remote',
    date: '2024 - Present',
    description: 'Developed native iOS application for CompTIA certification practice using React Native, complementing the web platform and providing on-the-go learning experiences.',
    achievements: [
      'Published app on Apple App Store with positive user ratings',
      'Implemented seamless cross-platform experience between web and mobile',
      'Optimized for iOS devices with offline capabilities',
      'Designed intuitive mobile UI for certification practice'
    ],
    skills: ['React Native', 'Mobile Development', 'iOS App Store', 'Cross-Platform Integration'],
    category: 'project'
  },
  {
    id: 5,
    title: 'Flask-Honeypot Python Package',
    company: 'Open Source Security Tool',
    location: 'Remote',
    date: '2025 - Present',
    description: 'Created a sophisticated cybersecurity deception system published on PyPI that redirects 500+ common attack vectors to 20+ realistic-looking fake admin dashboards and portals.',
    achievements: [
      'Developed comprehensive attack detection for common penetration testing paths',
      'Implemented 30+ data point collection including geolocation and behavioral patterns',
      'Built interactive admin dashboard for threat intelligence visualization',
      'Published as Python package with simplified integration for existing Flask apps'
    ],
    skills: ['Python', 'Flask', 'Cybersecurity', 'Honeypot Development', 'PyPI Package'],
    category: 'project'
  },
  {
    id: 6,
    title: 'CompTIA Certification Path',
    company: 'CompTIA',
    location: 'Remote',
    date: '2024',
    description: 'Completed comprehensive CompTIA certification path including A+, Network+, Security+, CySA+, PenTest+, and CASP+, establishing a strong foundation in cybersecurity principles and practices.',
    achievements: [
      'Earned six major CompTIA certifications in rapid succession',
      'Developed expertise across security domains from fundamentals to advanced topics',
      'Applied certification knowledge to practical security projects',
      'Obtained PCEP certification from Python Institute'
    ],
    skills: ['Cybersecurity Fundamentals', 'Network Security', 'Penetration Testing', 'Security Analysis'],
    category: 'certification'
  },
  {
    id: 7,
    title: 'General Manager',
    company: "Jimmy John's",
    location: 'Severna Park, MD',
    date: 'December 2022 - July 2024',
    description: 'Supervised 10+ staff members, optimizing task delegation and daily procedures for smooth restaurant operations while handling technical systems management.',
    achievements: [
      'Diagnosed and repaired POS systems and networks across five stores',
      'Optimized workflows to eliminate excess labor costs and improve COGS',
      'Reduced delivery times by 8 minutes weekly, becoming top-performing GM in 5-store franchise',
      'Created prep and cleaning checklists to improve back-of-house efficiency'
    ],
    skills: ['Team Management', 'Operations', 'Technical Support', 'Process Optimization'],
    category: 'work'
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Filter and sort timeline items based on active category
  const filteredItems = React.useMemo(() => {
    const filtered = activeCategory === 'all' 
      ? [...TIMELINE_DATA] 
      : TIMELINE_DATA.filter(item => item.category === activeCategory);
    
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
  
  // Close a card
  const handleClose = (e, itemId) => {
    e.stopPropagation();
    if (expandedItem === itemId) {
      setExpandedItem(null);
    }
    playSound('click');
  };
  
  // Helper function to parse date strings (for sorting)
  function parseDate(dateStr) {
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      const endPart = parts[1].trim();
      
      if (endPart === 'Present') {
        return new Date();
      }
      
      return new Date(endPart, 0);
    }
    
    if (dateStr.includes(',')) {
      return new Date(dateStr);
    }
    
    return new Date(dateStr, 0);
  }
  
  // Get category style
  const getCategoryStyle = (category) => {
    switch (category) {
      case 'work':
        return { color: 'var(--accent-cyan)', icon: '💼' };
      case 'education':
        return { color: 'var(--accent-blue)', icon: '🎓' };
      case 'project':
        return { color: 'var(--accent-magenta)', icon: '🚀' };
      case 'certification':
        return { color: 'var(--accent-green)', icon: '📜' };
      default:
        return { color: 'var(--accent-cyan)', icon: '⚡' };
    }
  };
  
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className={`${styles.timelineSection} ${fullPage ? styles.fullPage : ''}`} id="experience">
      <div className={styles.scanLines}></div>
      <div className="container">
        {fullPage ? (
          <motion.h1 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chronological Matrix
          </motion.h1>
        ) : (
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
          <motion.div 
            className={styles.timelineCards}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeCategory}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const categoryStyle = getCategoryStyle(item.category);
                const isExpanded = expandedItem === item.id;
                
                return (
                  <motion.div 
                    key={item.id}
                    className={`${styles.timelineCard} ${isExpanded ? styles.expanded : ''} ${hoveredItem === item.id ? styles.hovered : ''}`}
                    variants={itemVariants}
                    onClick={() => handleItemClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      '--card-color': categoryStyle.color
                    }}
                  >
                    <div className={styles.closeButton} onClick={(e) => handleClose(e, item.id)}>×</div>
                    
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>{categoryStyle.icon}</div>
                      <div className={styles.cardTitleContainer}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <div className={styles.cardMeta}>
                          <span className={styles.cardCompany}>{item.company}</span>
                          <span className={styles.cardSeparator}>|</span>
                          <span className={styles.cardLocation}>{item.location}</span>
                        </div>
                      </div>
                      <div className={styles.cardDate}>{item.date}</div>
                    </div>
                    
                    <div className={styles.cardContent}>
                      <p className={styles.cardDescription}>{item.description}</p>
                      
                      {isExpanded && (
                        <div className={styles.cardDetails}>
                          <div className={styles.detailSection}>
                            <h4 className={styles.detailTitle}>Achievements</h4>
                            <ul className={styles.achievementsList}>
                              {item.achievements.map((achievement, idx) => (
                                <li key={idx} className={styles.achievementItem}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className={styles.detailSection}>
                            <h4 className={styles.detailTitle}>Skills</h4>
                            <div className={styles.skillsList}>
                              {item.skills.map((skill, idx) => (
                                <span key={idx} className={styles.skillBadge}>{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className={styles.emptyState}
                variants={itemVariants}
              >
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No Records Found</h3>
                <p>Try selecting a different category</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HolographicTimeline;
