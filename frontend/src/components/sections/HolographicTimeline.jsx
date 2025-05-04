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
    location: 'Annapolis, MD',
    date: '2024 - Present',
    description: 'Building and configuring custom cybersecurity and defense systems, ensuring they meet client needs and perform reliably under demanding conditions.',
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
    description: 'Developed a centralized cybersecurity platform integrating AI-driven simulations and learning modules.',
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
    description: 'Managed daily operations, supervised staff, and ensured customer satisfaction. Optimized workflows and enhanced team performance.',
    achievements: [
      'Increased store revenue by 18% through operational improvements',
      'Reduced employee turnover by 35% through improved training',
      'Maintained network and POS systems with 99.7% uptime',
      'Implemented new inventory system reducing waste by 12%'
    ],
    skills: ['Team Management', 'Operations', 'Customer Service', 'Technical Support'],
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
