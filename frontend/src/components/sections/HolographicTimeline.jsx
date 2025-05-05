import React, { useState, useMemo, useCallback } from 'react'; 
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
// Removed useAudio import
import styles from './HolographicTimeline.module.css';


// Timeline data
const TIMELINE_DATA = [
  {
    id: 1,
    title: 'System Integration Technician II',
    company: 'Sealing Technologies',
    location: 'Columbia, MD',
    date: 'June 2024',
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
    date: 'Sept 2027',
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
    date: 'Oct 2024',
    description: 'Developed full-stack cybersecurity platform using React/Redux frontend, Python/Flask backend, MongoDB database, Redis caching, Nginx, and targeted OpenAI capabilities for cybersecurity training.',
    achievements: [
      'Built platform serving 500+ active learners (100+ paying subscribers) within 2 months',
      'Created comprehensive learning content including 13k+ questions across certification paths',
      'Developed 10+ interactive learning games and 15+ customizable themes',
      'Implemented real-time support system for enhanced user experience'
    ],
    skills: ['React', 'Redux', 'Python', 'Flask', 'MongoDB', 'OpenAI Integration', 'Docker', 'Redis', 'Nginx'], // Added missing quote for Docker
    category: 'project'
  },
  {
    id: 4,
    title: 'CertGames iOS App',
    company: 'Mobile Development',
    location: 'Remote',
    date: 'Jan 2025',
    description: 'Developed native iOS application for CompTIA certification practice using React Native, complementing the web platform and providing on-the-go learning experiences.',
    achievements: [
      'Published app on Apple App Store with positive user ratings',
      'Implemented seamless cross-platform experience between web and mobile',
      'Optimized for iOS devices with offline capabilities',
      'Designed intuitive mobile UI for certification practice'
    ],
    skills: ['React Native', 'Typescript', 'Mobile Development', 'iOS App Store', 'Cross-Platform Integration'], // Added missing quote for Typescript
    category: 'project'
  },
  {
    id: 5,
    title: 'Flask-Honeypot Python Package',
    company: 'Open Source Security Tool',
    location: 'Remote',
    date: 'Apr 2025',
    description: 'Created a sophisticated cybersecurity deception system published on PyPI that redirects 500+ common attack vectors to 20+ realistic-looking fake admin dashboards and portals.',
    achievements: [
      'Developed comprehensive attack detection for common penetration testing paths',
      'Implemented 30+ data point collection including geolocation and behavioral patterns',
      'Built interactive admin dashboard for threat intelligence visualization',
      'Published as Python package with simplified integration for existing Flask apps'
    ],
    skills: ['Python', 'Flask', 'Cybersecurity', 'Honeypot Development', 'PyPI Package', 'React'], // Added missing quote for PyPI Package
    category: 'project'
  },
  {
    id: 6,
    title: 'CompTIA Certification Path',
    company: 'CompTIA',
    location: 'Remote',
    date: 'May 2024',
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

// Helper function to parse date strings (for sorting) - Moved outside component
function parseDate(dateStr) {
  // Handle date ranges like 'Month Year - Month Year' or 'Month Year - Present'
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    const endPart = parts[1].trim(); // Get the end date part

    if (endPart.toLowerCase() === 'present') {
      return new Date(); // Use current date for 'Present'
    }
    // Try parsing the end date part (assuming 'Month Year' format)
    const date = new Date(endPart);
    if (!isNaN(date)) return date;
  }

  // Handle specific dates like 'Month Year' or 'Month Day, Year'
  const date = new Date(dateStr);
  if (!isNaN(date)) return date;

  // Fallback for formats like 'Month Year' if Date() constructor fails
  const monthYearMatch = dateStr.match(/(\w+)\s+(\d{4})/);
  if (monthYearMatch) {
    return new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`);
  }

  // Fallback if parsing fails (e.g., return epoch or throw error)
  console.warn(`Could not parse date: ${dateStr}`);
  return new Date(0); // Return epoch as a fallback
}


// Memoize expensive calculations (Filtering and Sorting)
const useFilteredItems = (activeCategory, timelineData) => {
  return useMemo(() => {
    const filtered = activeCategory === 'all'
      ? [...timelineData]
      : timelineData.filter(item => item.category === activeCategory);

    // Sort by date (most recent first)
    return filtered.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      // Handle potential invalid dates from parseDate
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1; // Put invalid dates last
      if (isNaN(dateB)) return -1; // Put invalid dates last
      return dateB - dateA;
    });
  }, [activeCategory, timelineData]);
};

// Optimize category styles to avoid recalculation
const categoryStyles = {
  work: { color: 'var(--accent-cyan)', icon: '💼' },
  education: { color: 'var(--accent-blue)', icon: '🎓' },
  project: { color: 'var(--accent-magenta)', icon: '🚀' },
  certification: { color: 'var(--accent-green)', icon: '📜' },
  default: { color: 'var(--accent-cyan)', icon: '⚡' }
};


const HolographicTimeline = ({ fullPage = false }) => {
  const { theme } = useTheme();
  // Removed playSound state/function
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Use memoized filtered items
  const filteredItems = useFilteredItems(activeCategory, TIMELINE_DATA);

  // Prevent unnecessary re-renders by using callbacks
  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
    setExpandedItem(null);
    // playSound('click'); // Removed sound
  }, [setActiveCategory, setExpandedItem]); // Added setters to dependency array

  const handleItemClick = useCallback((itemId) => {
    setExpandedItem(currentExpandedItem => currentExpandedItem === itemId ? null : itemId); // Use functional update
    // playSound('click'); // Removed sound
  }, [setExpandedItem]); // Dependency is only the setter

  const handleClose = useCallback((e, itemId) => {
    e.stopPropagation();
    // Check against the current state inside the callback logic if needed,
    // but setting to null is safe regardless. If logic depended on *reading*
    // expandedItem state here, it would need to be a dependency.
    // Since we only set it based on the item passed, we don't need expandedItem dependency.
    setExpandedItem(null);
    // playSound('click'); // Removed sound
  }, [setExpandedItem]); // Dependency is only the setter

  // Optimize getting category style
  const getCategoryStyle = useCallback((category) => {
    return categoryStyles[category] || categoryStyles.default;
  }, []); // No dependencies as categoryStyles is stable


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
              onClick={() => handleCategoryChange(category.id)} // Use memoized handler
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
            key={activeCategory} // Re-trigger animation on category change
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const categoryStyle = getCategoryStyle(item.category); // Use memoized getter
                const isExpanded = expandedItem === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className={`${styles.timelineCard} ${isExpanded ? styles.expanded : ''} ${hoveredItem === item.id ? styles.hovered : ''}`}
                    variants={itemVariants}
                    onClick={() => handleItemClick(item.id)} // Use memoized handler
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      '--card-color': categoryStyle.color
                    }}
                    layout // Add layout prop for smoother expand/collapse animation
                  >
                    <motion.div // Animate close button presence
                      className={styles.closeButton}
                      onClick={(e) => handleClose(e, item.id)} // Use memoized handler
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ×
                    </motion.div>

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

                    {/* Wrap content that changes height in motion.div for layout animation */}
                    <motion.div layout className={styles.cardContent}>
                      <p className={styles.cardDescription}>{item.description}</p>

                      {/* Animate the details section */}
                      <motion.div
                         className={styles.cardDetails}
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
                         transition={{ duration: 0.3 }}
                         style={{ overflow: 'hidden' }} // Keep content clipped during animation
                      >
                          {isExpanded && ( // Conditionally render content *inside* animating container
                            <>
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
                            </>
                          )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className={styles.emptyState}
                variants={itemVariants} // Use item variant for consistency
                initial="hidden" // Add initial/animate for fade-in
                animate="visible"
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
