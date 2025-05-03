import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';
import styles from './ResumeHologram.module.css';

// Resume sections data
const RESUME_SECTIONS = [
  {
    id: 'profile',
    title: 'Profile',
    icon: '👤',
    content: `Dedicated System Integration Technician with strong cybersecurity expertise. Proven ability to build, configure, and optimize custom security systems. Holds seven CompTIA certifications and pursuing a master's degree in Cybersecurity. Combines technical knowledge with practical skills to deliver reliable, secure solutions.`
  },
  {
    id: 'experience',
    title: 'Experience',
    icon: '💼',
    content: [
      {
        title: 'System Integration Technician II',
        company: 'Sealing Technologies',
        location: 'Annapolis, MD',
        duration: '2024 - Present',
        responsibilities: [
          'Build and configure custom cybersecurity and defense systems',
          'Ensure systems meet client specifications and reliability standards',
          'Perform quality assurance and optimization testing',
          'Collaborate with cross-functional teams to deliver comprehensive solutions',
          'Document build processes and system configurations'
        ]
      },
      {
        title: 'General Manager',
        company: "Jimmy John's",
        location: 'Severna Park, MD',
        duration: '2022 - 2024',
        responsibilities: [
          'Managed daily operations and supervised staff',
          'Ensured efficient workflows and high customer satisfaction',
          'Maintained network and POS systems functionality',
          'Implemented new inventory procedures to reduce waste',
          'Diagnosed and resolved technical issues'
        ]
      },
      {
        title: 'General Manager',
        company: "Jimmy John's",
        location: 'Annapolis, MD',
        duration: '2022 - 2022',
        responsibilities: [
          'Diagnosed network & POS issues',
          'Oversaw staff scheduling and training',
          'Ensured compliance with company standards',
          'Optimized operational workflows'
        ]
      }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    icon: '🎓',
    content: [
      {
        degree: "Master's Degree in Cybersecurity",
        institution: 'University of Maryland Global Campus',
        duration: '2024 - Present',
        details: [
          'Focus on advanced security protocols and threat intelligence',
          'GPA: 3.9',
          'Expected graduation: 2026'
        ]
      },
      {
        degree: "Associate's Degree in Cybersecurity",
        institution: 'Anne Arundel Community College',
        duration: '2022 - 2024',
        details: [
          'Graduated with honors (3.8 GPA)',
          'Focus on network security and ethical hacking',
          'Participated in capture-the-flag competitions'
        ]
      },
      {
        degree: 'High School Diploma',
        institution: 'South River High School',
        duration: '2018 - 2022',
        details: [
          'Focus on science and mathematics',
          'Participated in STEM-related extracurriculars'
        ]
      }
    ]
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    icon: '💻',
    content: {
      categories: [
        {
          name: 'Cybersecurity',
          skills: [
            'Risk Assessment',
            'Threat Mitigation',
            'Compliance (ISO 27001, 9001:2015)',
            'Role-Based Access Controls',
            'Encryption Best Practices',
            'Incident Response Planning'
          ]
        },
        {
          name: 'Development',
          skills: [
            'Python',
            'JavaScript',
            'HTML/CSS',
            'Shell Scripting',
            'React',
            'Flask',
            'MongoDB',
            'Docker'
          ]
        },
        {
          name: 'Networking',
          skills: [
            'TCP/IP',
            'DNS/DHCP',
            'Firewalls (UFW, iptables)',
            'Secure Network Configurations',
            'SSH Encryption',
            'VPNs'
          ]
        },
        {
          name: 'Cloud & DevOps',
          skills: [
            'AWS Security (EC2, S3, WAF, Shield)',
            'CI/CD Pipelines',
            'Containerization',
            'Infrastructure as Code',
            'Web Servers (Nginx, Apache)'
          ]
        }
      ]
    }
  },
  {
    id: 'certifications',
    title: 'Certifications',
    icon: '🏆',
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
        name: 'PCEP (Certified Entry-Level Python Programmer)',
        issuer: 'Python Institute',
        date: 'June 2024'
      }
    ]
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '🚀',
    content: [
      {
        name: 'ProxyAuthRequired.com',
        description: 'A centralized cybersecurity platform integrating AI-driven simulations and learning modules.',
        technologies: ['React', 'Python', 'Flask', 'MongoDB', 'Docker'],
        link: 'https://github.com/username/proxyauthrequired'
      },
      {
        name: 'CertsGamified',
        description: 'A gamified platform for certification preparation with structured learning roadmaps.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        link: 'https://github.com/username/certsgamified'
      },
      {
        name: 'AutoApplication',
        description: 'An automated application bot for job sites, streamlining the application process.',
        technologies: ['Python', 'Selenium', 'BeautifulSoup'],
        link: 'https://github.com/username/autoapplication'
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '📞',
    content: {
      email: 'CarterPerez-dev@ProxyAuthRequired.com',
      phone: '443-510-0866',
      location: 'Annapolis, MD',
      github: 'https://github.com/CarterPerez-dev',
      linkedin: 'https://www.linkedin.com/in/carter-perez-ProxyAuthRequired/'
    }
  }
];

const ResumeHologram = () => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const canvasRef = useRef(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Holographic effect animation
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
    
    // Holographic parameters
    const grid = {
      spacing: 25,
      dotSize: 1,
      color: theme === 'dark' ? 'rgba(0, 255, 245, 0.4)' : 'rgba(77, 77, 255, 0.4)'
    };
    
    const particles = [];
    const linesCount = 5;
    
    // Create particles along paths
    const createParticles = () => {
      // Reset particles
      particles.length = 0;
      
      // Create flowing lines
      for (let i = 0; i < linesCount; i++) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const length = 100 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;
        
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        // Create particles along the line
        const particleCount = Math.max(5, Math.floor(length / 20));
        
        for (let j = 0; j < particleCount; j++) {
          const t = j / particleCount;
          
          particles.push({
            x: startX + (endX - startX) * t,
            y: startY + (endY - startY) * t,
            size: 2 + Math.random() * 2,
            speed: 0.5 + Math.random() * 1.5,
            color: Math.random() > 0.7 ? 'rgba(255, 61, 61, 0.7)' : grid.color.replace('0.4', '0.7'),
            direction: angle,
            life: 1 + Math.random() * 2
          });
        }
      }
    };
    
    // Draw holographic grid
    const drawGrid = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid dots
      for (let x = 0; x < canvas.width; x += grid.spacing) {
        for (let y = 0; y < canvas.height; y += grid.spacing) {
          const distanceToActiveSection = getDistanceToActiveSection(x, y);
          const alpha = Math.max(0.1, Math.min(0.7, 1 - distanceToActiveSection / 500));
          
          ctx.beginPath();
          ctx.arc(x, y, grid.dotSize, 0, Math.PI * 2);
          ctx.fillStyle = grid.color.replace('0.4', alpha.toFixed(2));
          ctx.fill();
        }
      }
      
      // Update and draw particles
      const updatedParticles = [];
      
      for (const particle of particles) {
        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Update life
        particle.life -= 0.01;
        
        // Keep if still alive
        if (particle.life > 0 && 
            particle.x > 0 && particle.x < canvas.width && 
            particle.y > 0 && particle.y < canvas.height) {
          updatedParticles.push(particle);
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace('0.7', (particle.life * 0.6).toFixed(2));
          ctx.fill();
        }
      }
      
      // Update particles array
      particles.splice(0, particles.length, ...updatedParticles);
      
      // Add new particles if needed
      if (particles.length < linesCount * 5) {
        createParticles();
      }
      
      // Draw highlight around active section
      const activeElement = document.getElementById(`section-${activeSection}`);
      
      if (activeElement) {
        const rect = activeElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // Convert rect to canvas coordinates
        const highlightRect = {
          x: rect.left - canvasRect.left,
          y: rect.top - canvasRect.top,
          width: rect.width,
          height: rect.height
        };
        
        // Draw glow effect
        const glowSize = 20;
        
        // Create gradient
        const glow = ctx.createLinearGradient(
          highlightRect.x, 
          highlightRect.y, 
          highlightRect.x + highlightRect.width, 
          highlightRect.y + highlightRect.height
        );
        
        glow.addColorStop(0, theme === 'dark' ? 'rgba(0, 255, 245, 0.1)' : 'rgba(77, 77, 255, 0.1)');
        glow.addColorStop(0.5, theme === 'dark' ? 'rgba(0, 255, 245, 0.2)' : 'rgba(77, 77, 255, 0.2)');
        glow.addColorStop(1, theme === 'dark' ? 'rgba(0, 255, 245, 0.1)' : 'rgba(77, 77, 255, 0.1)');
        
        // Draw rounded rectangle with glow
        roundRect(
          ctx, 
          highlightRect.x - glowSize, 
          highlightRect.y - glowSize, 
          highlightRect.width + glowSize * 2, 
          highlightRect.height + glowSize * 2, 
          10,
          glow
        );
      }
    };
    
    // Helper function to draw rounded rectangle
    const roundRect = (ctx, x, y, width, height, radius, fill) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      
      ctx.fillStyle = fill;
      ctx.fill();
    };
    
    // Get distance from point to active section
    const getDistanceToActiveSection = (x, y) => {
      const activeElement = document.getElementById(`section-${activeSection}`);
      
      if (!activeElement) return 500; // Default large distance
      
      const rect = activeElement.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      
      // Convert rect to canvas coordinates
      const sectionRect = {
        x: rect.left - canvasRect.left,
        y: rect.top - canvasRect.top,
        width: rect.width,
        height: rect.height
      };
      
      // Calculate center of section
      const centerX = sectionRect.x + sectionRect.width / 2;
      const centerY = sectionRect.y + sectionRect.height / 2;
      
      // Calculate distance
      return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    };
    
    // Initialize particles
    createParticles();
    
    // Animation loop
    let animationId;
    const animate = () => {
      drawGrid();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, activeSection]);
  
  // Simulate download progress
  const handleDownload = (format) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    playSound('click');
    
    // Simulating download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            setShowDownloadOptions(false);
            
            // In a real implementation, trigger actual download here
            const link = document.createElement('a');
            link.href = '/assets/CarterPerez.pdf';
            link.download = `Carter_Perez_Resume.${format.toLowerCase()}`;
            link.click();
          }, 500);
          return 100;
        }
        return prev + (Math.random() * 5) + 2;
      });
    }, 100);
  };
  
  // Render experience list
  const renderExperienceList = (experiences) => {
    return experiences.map((exp, index) => (
      <div key={index} className={styles.experienceItem}>
        <div className={styles.experienceHeader}>
          <h3 className={styles.experienceTitle}>{exp.title}</h3>
          <div className={styles.experienceMeta}>
            <span className={styles.experienceCompany}>{exp.company}</span>
            <span className={styles.experienceSeparator}>|</span>
            <span className={styles.experienceLocation}>{exp.location}</span>
            <span className={styles.experienceSeparator}>|</span>
            <span className={styles.experienceDuration}>{exp.duration}</span>
          </div>
        </div>
        
        <ul className={styles.experienceResponsibilities}>
          {exp.responsibilities.map((item, idx) => (
            <li key={idx} className={styles.experienceResponsibilityItem}>{item}</li>
          ))}
        </ul>
      </div>
    ));
  };
  
  // Render education list
  const renderEducationList = (educations) => {
    return educations.map((edu, index) => (
      <div key={index} className={styles.educationItem}>
        <div className={styles.educationHeader}>
          <h3 className={styles.educationDegree}>{edu.degree}</h3>
          <div className={styles.educationMeta}>
            <span className={styles.educationInstitution}>{edu.institution}</span>
            <span className={styles.educationSeparator}>|</span>
            <span className={styles.educationDuration}>{edu.duration}</span>
          </div>
        </div>
        
        <ul className={styles.educationDetails}>
          {edu.details.map((item, idx) => (
            <li key={idx} className={styles.educationDetailItem}>{item}</li>
          ))}
        </ul>
      </div>
    ));
  };
  
  // Render skills list
  const renderSkillsList = (skillsData) => {
    return skillsData.categories.map((category, index) => (
      <div key={index} className={styles.skillsCategory}>
        <h3 className={styles.skillsCategoryName}>{category.name}</h3>
        <div className={styles.skillsGrid}>
          {category.skills.map((skill, idx) => (
            <div key={idx} className={styles.skillItem}>{skill}</div>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render certifications list
  const renderCertificationsList = (certifications) => {
    return certifications.map((cert, index) => (
      <div key={index} className={styles.certificationItem}>
        <div className={styles.certificationName}>{cert.name}</div>
        <div className={styles.certificationMeta}>
          <span className={styles.certificationIssuer}>{cert.issuer}</span>
          <span className={styles.certificationSeparator}>|</span>
          <span className={styles.certificationDate}>{cert.date}</span>
        </div>
      </div>
    ));
  };
  
  // Render projects list
  const renderProjectsList = (projects) => {
    return projects.map((project, index) => (
      <div key={index} className={styles.projectItem}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectName}>{project.name}</h3>
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.projectLink}
            onClick={() => playSound('click')}
          >
            View
          </a>
        </div>
        
        <p className={styles.projectDescription}>{project.description}</p>
        
        <div className={styles.projectTechnologies}>
          {project.technologies.map((tech, idx) => (
            <span key={idx} className={styles.projectTechnology}>{tech}</span>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render contact information
  const renderContactInfo = (contact) => {
    return (
      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <div className={styles.contactLabel}>Email</div>
          <div className={styles.contactValue}>
            <a 
              href={`mailto:${contact.email}`} 
              className={styles.contactLink}
              onClick={() => playSound('click')}
            >
              {contact.email}
            </a>
          </div>
        </div>
        
        <div className={styles.contactItem}>
          <div className={styles.contactLabel}>Phone</div>
          <div className={styles.contactValue}>
            <a 
              href={`tel:${contact.phone}`} 
              className={styles.contactLink}
              onClick={() => playSound('click')}
            >
              {contact.phone}
            </a>
          </div>
        </div>
        
        <div className={styles.contactItem}>
          <div className={styles.contactLabel}>Location</div>
          <div className={styles.contactValue}>{contact.location}</div>
        </div>
        
        <div className={styles.contactItem}>
          <div className={styles.contactLabel}>Profiles</div>
          <div className={styles.contactSocial}>
            <a 
              href={contact.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.contactSocialLink}
              onClick={() => playSound('click')}
            >
              GitHub
            </a>
            <a 
              href={contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.contactSocialLink}
              onClick={() => playSound('click')}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  // Render section content based on activeSection
  const renderSectionContent = () => {
    const section = RESUME_SECTIONS.find(s => s.id === activeSection);
    
    if (!section) {
      return <div>Section not found</div>;
    }
    
    switch (section.id) {
      case 'profile':
        return <p className={styles.sectionText}>{section.content}</p>;
      case 'experience':
        return renderExperienceList(section.content);
      case 'education':
        return renderEducationList(section.content);
      case 'skills':
        return renderSkillsList(section.content);
      case 'certifications':
        return renderCertificationsList(section.content);
      case 'projects':
        return renderProjectsList(section.content);
      case 'contact':
        return renderContactInfo(section.content);
      default:
        return <div>Content not available</div>;
    }
  };
  
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
    <section className={styles.resumeSection} id="resume">
      <div className="container">
        <motion.h1 
          className={styles.pageTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Neural Résumé Interface
        </motion.h1>
        
        <motion.div 
          className={styles.resumeContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <canvas 
            ref={canvasRef} 
            className={styles.resumeCanvas}
            aria-hidden="true"
          ></canvas>
          
          <div className={styles.resumeContent}>
            <div className={styles.resumeHeader}>
              <motion.div 
                className={styles.resumeIdentity}
                variants={itemVariants}
              >
                <h2 className={styles.resumeName}>Carter Rush Perez</h2>
                <div className={styles.resumeTitle}>System Integration Technician & Cybersecurity Specialist</div>
              </motion.div>
              
              <motion.div 
                className={styles.resumeActions}
                variants={itemVariants}
              >
                <button 
                  className={styles.downloadButton}
                  onClick={() => {
                    setShowDownloadOptions(!showDownloadOptions);
                    playSound('click');
                  }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className={styles.downloadProgress}>
                      <span className={styles.progressText}>DOWNLOADING</span>
                      <span 
                        className={styles.progressBar} 
                        style={{ width: `${downloadProgress}%` }}
                      ></span>
                    </span>
                  ) : (
                    <span className="button-text">DOWNLOAD RÉSUMÉ</span>
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
              </motion.div>
            </div>
            
            <div className={styles.resumeBody}>
              <motion.div 
                className={styles.resumeNav}
                variants={itemVariants}
              >
                <div className={styles.navTitle}>SECTIONS</div>
                {RESUME_SECTIONS.map((section) => (
                  <button 
                    key={section.id}
                    className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                    onClick={() => {
                      setActiveSection(section.id);
                      playSound('click');
                    }}
                  >
                    <span className={styles.navIcon}>{section.icon}</span>
                    <span className={styles.navLabel}>{section.title}</span>
                  </button>
                ))}
              </motion.div>
              
              <motion.div 
                className={styles.resumeSectionContent}
                variants={itemVariants}
                id={`section-${activeSection}`}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>
                      {RESUME_SECTIONS.find(s => s.id === activeSection)?.icon}
                    </span>
                    <span>{RESUME_SECTIONS.find(s => s.id === activeSection)?.title}</span>
                  </h2>
                </div>
                
                <div className={styles.sectionBody}>
                  {renderSectionContent()}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeHologram;
