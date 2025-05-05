import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ResumeHologram.module.css';
import { FaUserSecret, FaGithub, FaPhone, FaBriefcase, FaGraduationCap, FaLinux, FaCode, FaTrophy } from 'react-icons/fa'; 


// Resume sections data
const RESUME_SECTIONS = [
  {
    id: 'profile',
    title: 'Profile',
    icon: FaUserSecret,
    color: '#00bcd4',
    content: `Driven Cybersecurity Professional and Integration Technician II with strong technical expertise in system integration, penetration testing, and secure development. Skilled in detecting vulnerabilities, building secure applications, and implementing defensive countermeasures. Currently pursuing a Master's in Cybersecurity while expanding my expertise through hands-on projects and professional certification paths. Committed to continuous learning and staying at the forefront of cybersecurity innovation.`
  },
  {
    id: 'experience',
    title: 'Experience',
    icon: FaBriefcase,
    color: '#ff9800',
    content: [
      {
        title: 'Integration Technician II',
        company: 'Sealing Technologies',
        location: 'Columbia, MD',
        duration: '2024 - Present',
        responsibilities: [
          'Manage and optimize QA workflows for custom server builds, ensuring alignment with strict timelines and regulatory standards',
          'Upgrade and maintain computer hardware across the facility for optimal performance with custom server builds',
          'Consult on assembly and logistics for $40M worth of servers, network switches, and cyber kits',
          'Author technical blogs for company website detailing efficient QA processes for high-stakes assembly projects',
          'Develop and implement SOPs to standardize assembly procedures and streamline onboarding across teams'
        ]
      },
      {
        title: 'General Manager',
        company: "Jimmy John's",
        location: 'Severna Park, MD',
        duration: '2022 - 2024',
        responsibilities: [
          'Supervised 10+ staff members, optimizing task delegation and daily procedures for smooth operations',
          'Diagnosed and repaired POS systems and networks across five stores, maintaining franchise service reliability',
          'Optimized workflows and processes to eliminate excess labor costs and COGS, resulting in smoother operations',
          'Reduced delivery times by 8 minutes weekly, securing recognition as top-performing GM in 5-store franchise',
          'Created prep and cleaning checklists to improve back-of-house efficiency and accountability'
        ]
      }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    icon: FaGraduationCap,
    color: '#4caf50',
    content: [
      {
        degree: "Master's Degree in Cybersecurity",
        institution: 'University of Maryland Global Campus',
        duration: '2024 - 2027',
        details: [
          'Focus on advanced security protocols, penetration testing, and threat intelligence',
          'Active member of Cybersecurity Club and Programming Club',
          'Expected graduation: May 2027',
          'Research areas include threat hunting and zero-day vulnerability detection'
        ]
      }
    ]
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    icon: FaLinux,
    color: '#e91e63',
    content: {
      categories: [
        {
          name: 'Cybersecurity',
          skills: [
            'Penetration Testing',
            'Vulnerability Assessment',
            'Security Monitoring',
            'Incident Response',
            'MITRE ATT&CK Framework',
            'Threat Hunting',
            'Digital Forensics',
            'Splunk SIEM'
          ]
        },
        {
          name: 'Development',
          skills: [
            'Python',
            'JavaScript/React',
            'HTML/CSS',
            'Shell Scripting',
            'Flask',
            'Redux',
            'MongoDB',
            'Docker/Containerization'
          ]
        },
        {
          name: 'Networking',
          skills: [
            'TCP/IP',
            'Firewall Management',
            'AWS WAF & Shield',
            'VPN Configuration',
            'Network Security',
            'Intrusion Detection Systems',
            'IAM Implementation',
            'SSL/TLS Management'
          ]
        },
        {
          name: 'Cloud & Infrastructure',
          skills: [
            'AWS (EC2, S3, CloudFront)',
            'Docker Orchestration',
            'Nginx/Apache Configuration',
            'CI/CD Pipelines',
            'Git/GitHub',
            'Linux Administration',
            'CloudWatch Monitoring',
            'EventBridge Integration'
          ]
        },
        {
          name: 'Governance',
          skills: [
            'ISO 27001',
            'NIST 800-53',
            'Risk Assessment',
            'Compliance Frameworks',
            'COBIT Implementation',
            'ITIL Best Practices',
            'Security Auditing',
            'Policy Development'
          ]
        }
      ]
    }
  },
  {
    id: 'certifications',
    title: 'Certifications',
    icon: FaTrophy,
    color: '#ffeb3b',
    content: [
      {
        name: 'CompTIA A+',
        issuer: 'CompTIA',
        date: 'April 2024'
      },
      {
        name: 'CompTIA Network+',
        issuer: 'CompTIA',
        date: 'May 2024'
      },
      {
        name: 'CompTIA Security+',
        issuer: 'CompTIA',
        date: 'May 2024'
      },
      {
        name: 'CompTIA CySA+',
        issuer: 'CompTIA',
        date: 'October 2024'
      },
      {
        name: 'CompTIA PenTest+',
        issuer: 'CompTIA',
        date: 'November 2024'
      },
      {
        name: 'CompTIA CASP+',
        issuer: 'CompTIA',
        date: 'December 2024'
      },
      {
        name: 'PCEP – Certified Entry-Level Python Programmer',
        issuer: 'Python Institute',
        date: 'February 2025'
      }
    ]
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FaGithub,
     color: '#FFF',
    content: [
      {
        name: 'CertGames.com',
        description: 'A gamified platform for certification preparation with 500+ active learners (100+ paying subscribers) in just 2 months. Features comprehensive content including 13k+ questions, 10+ learning games, 15+ themes, and real-time support to make cybersecurity education accessible and engaging.',
        technologies: ['React', 'Redux', 'Python/Flask', 'MongoDB', 'Redis', 'OpenAI'],
        link: 'https://github.com/CarterPerez-dev/CertGames-Core',
        featured: false
      },
      {
        name: 'Flask-Honeypot',
        description: 'A sophisticated cybersecurity deception system built as a Python package that redirects 500+ common attack vectors to 20+ realistic-looking fake admin dashboards and portals. Records all attacker interactions collecting 30+ data points including geolocation and behavioral patterns with built-in admin dashboard for comprehensive threat intelligence.',
        technologies: ['Python', 'Flask', 'Docker', 'MongoDB', 'Redis'],
        link: 'https://github.com/CarterPerez-dev/flask-honeypot',
        featured: false
      },
      {
        name: 'AngelaCLI',
        description: 'An AI-powered command line tool that assists with coding tasks and cybersecurity assessments. Integrates with development workflows to provide context-aware suggestions and can perform preliminary vulnerability scanning on code repositories to identify potential security weaknesses before deployment.',
        technologies: ['Python', 'OpenAI API', 'TensorFlow', 'Click'],
        link: 'https://github.com/CarterPerez-dev/angela-cli',
        featured: false
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact',
    color: '#2196f3',
    icon: FaPhone,
    content: {
      email: 'CarterPerez-dev@gmail.com',
      phone: '443-510-0866',
      location: 'Annapolis, MD',
      github: 'https://github.com/CarterPerez-dev',
      linkedin: 'https://www.linkedin.com/in/carterperez-dev/'
    }
  }
];

// Project data for the gifts section
const GIFT_OPTIONS = [
  {
    id: 'health',
    name: '+ 500 HEALTH',
    subtext: 'Apocalyptic Potion',
    icon: '🧪',
    color: 'var(--accent-green)'
  },
  {
    id: 'power',
    name: '+ 2000 POWER',
    subtext: 'The Power of Code',
    icon: '⚡',
    color: 'var(--accent-magenta)'
  },
  {
    id: 'intelligence',
    name: '+ 750 INTELLIGENCE',
    subtext: 'Forest Potion',
    icon: '🧠',
    color: 'var(--accent-green)'
  },
  {
    id: 'mana',
    name: '+ 12,000 MANA',
    subtext: 'Ice Potion',
    icon: '✨',
    color: 'var(--accent-blue)'
  }
];

const ResumeHologram = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Canvas animation for background effects
  // Modify this portion of ResumeHologram.jsx
  // Find the useEffect hook that handles the canvas animation and replace it
  
  // Canvas animation for background effects - OPTIMIZED VERSION
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    // Throttle function to limit execution frequency
    const throttle = (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };
    
    // Reduced and optimized grid drawing
    const drawGrid = () => {
      const gridSize = 30;
      const primaryColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.15)' : 'rgba(77, 77, 255, 0.15)';
      const secondaryColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.05)' : 'rgba(77, 77, 255, 0.05)';
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate visible grid lines only
      const startX = Math.floor(0 / gridSize) * gridSize;
      const endX = Math.ceil(canvas.width / gridSize) * gridSize;
      const startY = Math.floor(0 / gridSize) * gridSize;
      const endY = Math.ceil(canvas.height / gridSize) * gridSize;
      
      // Draw fewer vertical lines - only every other line
      for (let x = startX; x <= endX; x += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Draw fewer horizontal lines - only every other line
      for (let y = startY; y <= endY; y += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Draw scan line with reduced frequency
      if (Date.now() % 100 < 50) { // Only draw scan line every other frame
        const scanLineY = (Date.now() % 3000) / 3000 * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(canvas.width, scanLineY);
        ctx.strokeStyle = theme === 'dark' 
          ? 'rgba(0, 255, 245, 0.3)' 
          : 'rgba(77, 77, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Simplify active element highlighting
      if (activeSection) {
        const activeElement = document.getElementById(`section-${activeSection}`);
        if (activeElement) {
          const rect = activeElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Calculate position relative to canvas
          const x = rect.left - containerRect.left;
          const y = rect.top - containerRect.top;
          const width = rect.width;
          const height = rect.height;
          
          // Simplified glow - just draw a rectangle
          ctx.strokeStyle = theme === 'dark' 
            ? 'rgba(0, 255, 245, 0.5)' 
            : 'rgba(77, 77, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
        }
      }
    };
    
    // Throttled animation with reduced frame rate
    const throttledDraw = throttle(drawGrid, 1000/30); // Target 30 FPS instead of 60
    
    // Detect visibility to pause animation when tab is not visible
    let animationId;
    let isVisible = true;
    
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      
      if (isVisible && !animationId) {
        animate();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Animation loop with frame skipping for better performance
    let frameCount = 0;
    const animate = () => {
      if (!isVisible) {
        cancelAnimationFrame(animationId);
        animationId = null;
        return;
      }
      
      // Only draw every other frame
      frameCount++;
      if (frameCount % 2 === 0) {
        throttledDraw();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme, activeSection]);
  
  // Trigger a glitch effect
  const triggerGlitch = () => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 200);
  };
  
  // Simulate download process
    // Simulate download process
    const handleDownload = (format) => {
      setIsDownloading(true);
      setDownloadProgress(0);
  
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          const nextProgress = prev + (Math.random() * 5) + 2;
          if (nextProgress >= 100) {
            clearInterval(interval);
            setDownloadProgress(100); // Ensure it hits 100
  
            // --- START OF CHANGES ---
            setTimeout(() => {
              setIsDownloading(false);
              setShowDownloadOptions(false);
              triggerGlitch(); // Keep the visual effect
  
              // Determine the correct filename and URL based on format
              let fileName = '';
              let fileUrl = '';
              const baseName = 'CarterPerez'; // Consistent base name
  
              switch (format.toLowerCase()) {
                case 'pdf':
                  fileName = `${baseName}.pdf`;
                  fileUrl = `/${fileName}`; // Path relative to the public folder root
                  break;
                case 'docx':
                  fileName = `${baseName}.docx`;
                  fileUrl = `/${fileName}`; // Path relative to the public folder root
                  break;
                case 'txt':
                  fileName = `${baseName}.txt`;
                  fileUrl = `/${fileName}`; // Path relative to the public folder root
                  break;
                default:
                  console.error("Invalid download format:", format);
                  // Optionally, show an error to the user here
                  return; // Stop if the format is unknown
              }
  
              // Create link element
              const link = document.createElement('a');
  
              // Set the href to the file in the public folder
              link.href = fileUrl;
  
              // Set the download attribute to the desired filename for the user
              link.download = fileName;
  
              // Append to the DOM, click, and then remove
              // Appending is necessary for Firefox compatibility
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
  
            }, 500); // Delay after progress hits 100
            // --- END OF CHANGES ---
            return 100; // Return 100 for the state update
          }
          return nextProgress; // Continue progress update
        });
      }, 100);
    };
  
  // Handle gift selection
  const handleGiftSelect = (gift) => {
    setSelectedGift(gift);
    triggerGlitch();
    setTimeout(() => {
      setShowGiftModal(false);
      setSelectedGift(null);
    }, 1500);
  };
  
  // Render experience items
  const renderExperienceItems = (experienceList) => {
    return experienceList.map((item, index) => (
      <div key={index} className={styles.experienceCard}>
        <div className={styles.experienceHeader}>
          <h4 className={styles.experienceTitle}>{item.title}</h4>
          <div className={styles.experienceMeta}>
            <span className={styles.companyName}>{item.company}</span>
            <span className={styles.metaSeparator}>|</span>
            <span className={styles.locationText}>{item.location}</span>
            <span className={styles.metaSeparator}>|</span>
            <span className={styles.durationText}>{item.duration}</span>
          </div>
        </div>
        <ul className={styles.responsibilitiesList}>
          {item.responsibilities.map((resp, idx) => (
            <li key={idx} className={styles.responsibilityItem}>{resp}</li>
          ))}
        </ul>
      </div>
    ));
  };
  
  // Render education items
  const renderEducationItems = (educationList) => {
    return educationList.map((item, index) => (
      <div key={index} className={styles.educationCard}>
        <div className={styles.educationHeader}>
          <h4 className={styles.educationDegree}>{item.degree}</h4>
          <div className={styles.educationMeta}>
            <span className={styles.institutionName}>{item.institution}</span>
            <span className={styles.metaSeparator}>|</span>
            <span className={styles.durationText}>{item.duration}</span>
          </div>
        </div>
        <ul className={styles.educationDetails}>
          {item.details.map((detail, idx) => (
            <li key={idx} className={styles.detailItem}>{detail}</li>
          ))}
        </ul>
      </div>
    ));
  };
  
  // Render skills items
  const renderSkillsItems = (skillsData) => {
    return skillsData.categories.map((category, index) => (
      <div key={index} className={styles.skillCategory}>
        <h4 className={styles.categoryName}>{category.name}</h4>
        <div className={styles.skillsGrid}>
          {category.skills.map((skill, idx) => (
            <div key={idx} className={styles.skillBadge}>{skill}</div>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render certifications
  const renderCertificationItems = (certList) => {
    return certList.map((cert, index) => (
      <div key={index} className={styles.certificationCard}>
        <div className={styles.certificationName}>{cert.name}</div>
        <div className={styles.certificationMeta}>
          <span className={styles.issuerName}>{cert.issuer}</span>
          <span className={styles.metaSeparator}>|</span>
          <span className={styles.dateText}>{cert.date}</span>
        </div>
      </div>
    ));
  };
  
  // Render project items
  const renderProjectItems = (projectList) => {
    return projectList.map((project, index) => (
      <div key={index} className={`${styles.projectCard} ${project.featured ? styles.featuredProject : ''}`}>
        <div className={styles.projectHeader}>
          <h4 className={styles.projectName}>{project.name}</h4>
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.projectLink}
          >
            View
          </a>
        </div>
        <p className={styles.projectDescription}>{project.description}</p>
        <div className={styles.technologiesList}>
          {project.technologies.map((tech, idx) => (
            <span key={idx} className={styles.technologyBadge}>{tech}</span>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render contact info
  const renderContactInfo = (contactData) => {
    return (
      <div className={styles.contactGrid}>
        <div className={styles.contactCard}>
          <div className={styles.contactLabel}>Email</div>
          <a 
            href={`mailto:${contactData.email}`}
            className={styles.contactValue}
          >
            {contactData.email}
          </a>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactLabel}>Phone</div>
          <a 
            href={`tel:${contactData.phone}`}
            className={styles.contactValue}
          >
            {contactData.phone}
          </a>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactLabel}>Location</div>
          <div className={styles.contactValue}>{contactData.location}</div>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactLabel}>Profiles</div>
          <div className={styles.socialLinks}>
            <a 
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              GitHub
            </a>
            <a 
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Render profile section
  const renderProfileSection = (content) => {
    return (
      <div className={styles.profileCard}>
        <p className={styles.profileText}>{content}</p>
      </div>
    );
  };
  
  // Render active section content
  const renderSectionContent = () => {
    const section = RESUME_SECTIONS.find(s => s.id === activeSection);
    
    if (!section) return null;
    
    switch (section.id) {
      case 'profile':
        return renderProfileSection(section.content);
      case 'experience':
        return renderExperienceItems(section.content);
      case 'education':
        return renderEducationItems(section.content);
      case 'skills':
        return renderSkillsItems(section.content);
      case 'certifications':
        return renderCertificationItems(section.content);
      case 'projects':
        return renderProjectItems(section.content);
      case 'contact':
        return renderContactInfo(section.content);
      default:
        return <div>Section content not available</div>;
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
    <section className={styles.resumeSection} id="resume">
      <div className={styles.scanLines}></div>
      
      <div className="container">
        <motion.h1 
          className={styles.pageTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Résumé Interface
        </motion.h1>
        
        <motion.div 
          ref={containerRef}
          className={`${styles.resumeContainer} ${glitchEffect ? styles.glitchEffect : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <canvas 
            ref={canvasRef}
            className={styles.backgroundCanvas}
            aria-hidden="true"
          ></canvas>
          
          <div className={styles.resumeContent}>
            <div className={styles.resumeHeader}>
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>Carter Rush Perez</h2>
                <div className={styles.profileTitle}>System Integration Technician & Cybersecurity Specialist</div>
              </div>
              
              <div className={styles.actionButtons}>
                <button 
                  className={styles.downloadButton}
                  onClick={() => {
                    setShowDownloadOptions(!showDownloadOptions);
                  }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className={styles.downloadProgress}>
                      <span className={styles.progressText}>DOWNLOADING</span>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <>DOWNLOAD RÉSUMÉ</>
                  )}
                </button>
                
                {showDownloadOptions && !isDownloading && (
                  <div className={styles.downloadOptions}>
                    <button 
                      className={styles.downloadOption}
                      onClick={() => handleDownload('PDF')}
                    >
                      PDF Format
                    </button>
                    <button 
                      className={styles.downloadOption}
                      onClick={() => handleDownload('DOCX')}
                    >
                      DOCX Format
                    </button>
                    <button 
                      className={styles.downloadOption}
                      onClick={() => handleDownload('TXT')}
                    >
                      TXT Format
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.resumeMain}>
              <motion.div 
                className={styles.sectionNav}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {RESUME_SECTIONS.map((section) => {
                  const IconComponent = section.icon; // Get the specific icon component for this section
                  return (
                    <motion.button
                      key={section.id}
                      className={`${styles.navButton} ${activeSection === section.id ? styles.activeNav : ''}`}
                      onClick={() => {
                        setActiveSection(section.id);
                        triggerGlitch();
                      }}
                      variants={itemVariants}
                    >
                      <span className={styles.navIcon}>
                        {/* Render the IconComponent and pass the color prop */}
                        <IconComponent color={section.color} />
                      </span>
                      <span className={styles.navText}>{section.title}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
              
              <motion.div 
                id={`section-${activeSection}`}
                className={styles.sectionContent}
                key={activeSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    {RESUME_SECTIONS.find(s => s.id === activeSection)?.icon} {RESUME_SECTIONS.find(s => s.id === activeSection)?.title}
                  </h3>
                </div>
                
                <div className={styles.sectionBody}>
                  {renderSectionContent()}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Gift selection modal */}
        {showGiftModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.giftModal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Choose Your Gift</h3>
                <div 
                  className={styles.closeButton}
                  onClick={() => {
                    setShowGiftModal(false);
                  }}
                >
                  ×
                </div>
              </div>
              
              <div className={styles.modalContent}>
                <p className={styles.modalText}>What power will you choose? What do you want to get?</p>
                
                <div className={styles.giftGrid}>
                  {GIFT_OPTIONS.map((gift) => (
                    <div 
                      key={gift.id}
                      className={`${styles.giftCard} ${selectedGift?.id === gift.id ? styles.selectedGift : ''}`}
                      onClick={() => handleGiftSelect(gift)}
                      style={{ '--gift-color': gift.color }}
                    >
                      <div className={styles.giftIcon}>{gift.icon}</div>
                      <div className={styles.giftName}>{gift.name}</div>
                      <div className={styles.giftSubtext}>{gift.subtext}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeHologram;
