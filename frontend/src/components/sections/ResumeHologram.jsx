import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';

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
      <div key={index} className="experience-item">
        <div className="experience-header">
          <h3 className="experience-title">{exp.title}</h3>
          <div className="experience-meta">
            <span className="experience-company">{exp.company}</span>
            <span className="experience-separator">|</span>
            <span className="experience-location">{exp.location}</span>
            <span className="experience-separator">|</span>
            <span className="experience-duration">{exp.duration}</span>
          </div>
        </div>
        
        <ul className="experience-responsibilities">
          {exp.responsibilities.map((item, idx) => (
            <li key={idx} className="experience-responsibility-item">{item}</li>
          ))}
        </ul>
      </div>
    ));
  };
  
  // Render education list
  const renderEducationList = (educations) => {
    return educations.map((edu, index) => (
      <div key={index} className="education-item">
        <div className="education-header">
          <h3 className="education-degree">{edu.degree}</h3>
          <div className="education-meta">
            <span className="education-institution">{edu.institution}</span>
            <span className="education-separator">|</span>
            <span className="education-duration">{edu.duration}</span>
          </div>
        </div>
        
        <ul className="education-details">
          {edu.details.map((item, idx) => (
            <li key={idx} className="education-detail-item">{item}</li>
          ))}
        </ul>
      </div>
    ));
  };
  
  // Render skills list
  const renderSkillsList = (skillsData) => {
    return skillsData.categories.map((category, index) => (
      <div key={index} className="skills-category">
        <h3 className="skills-category-name">{category.name}</h3>
        <div className="skills-grid">
          {category.skills.map((skill, idx) => (
            <div key={idx} className="skill-item">{skill}</div>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render certifications list
  const renderCertificationsList = (certifications) => {
    return certifications.map((cert, index) => (
      <div key={index} className="certification-item">
        <div className="certification-name">{cert.name}</div>
        <div className="certification-meta">
          <span className="certification-issuer">{cert.issuer}</span>
          <span className="certification-separator">|</span>
          <span className="certification-date">{cert.date}</span>
        </div>
      </div>
    ));
  };
  
  // Render projects list
  const renderProjectsList = (projects) => {
    return projects.map((project, index) => (
      <div key={index} className="project-item">
        <div className="project-header">
          <h3 className="project-name">{project.name}</h3>
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
            onClick={() => playSound('click')}
          >
            View
          </a>
        </div>
        
        <p className="project-description">{project.description}</p>
        
        <div className="project-technologies">
          {project.technologies.map((tech, idx) => (
            <span key={idx} className="project-technology">{tech}</span>
          ))}
        </div>
      </div>
    ));
  };
  
  // Render contact information
  const renderContactInfo = (contact) => {
    return (
      <div className="contact-info">
        <div className="contact-item">
          <div className="contact-label">Email</div>
          <div className="contact-value">
            <a 
              href={`mailto:${contact.email}`} 
              className="contact-link"
              onClick={() => playSound('click')}
            >
              {contact.email}
            </a>
          </div>
        </div>
        
        <div className="contact-item">
          <div className="contact-label">Phone</div>
          <div className="contact-value">
            <a 
              href={`tel:${contact.phone}`} 
              className="contact-link"
              onClick={() => playSound('click')}
            >
              {contact.phone}
            </a>
          </div>
        </div>
        
        <div className="contact-item">
          <div className="contact-label">Location</div>
          <div className="contact-value">{contact.location}</div>
        </div>
        
        <div className="contact-item">
          <div className="contact-label">Profiles</div>
          <div className="contact-social">
            <a 
              href={contact.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-social-link"
              onClick={() => playSound('click')}
            >
              GitHub
            </a>
            <a 
              href={contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-social-link"
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
        return <p className="section-text">{section.content}</p>;
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
    <section className="resume-section" id="resume">
      <div className="container">
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Neural Résumé Interface
        </motion.h1>
        
        <motion.div 
          className="resume-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <canvas 
            ref={canvasRef} 
            className="resume-canvas"
            aria-hidden="true"
          ></canvas>
          
          <div className="resume-content">
            <div className="resume-header">
              <motion.div 
                className="resume-identity"
                variants={itemVariants}
              >
                <h2 className="resume-name">Carter Rush Perez</h2>
                <div className="resume-title">System Integration Technician & Cybersecurity Specialist</div>
              </motion.div>
              
              <motion.div 
                className="resume-actions"
                variants={itemVariants}
              >
                <button 
                  className="download-button"
                  onClick={() => {
                    setShowDownloadOptions(!showDownloadOptions);
                    playSound('click');
                  }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="download-progress">
                      <span className="progress-text">DOWNLOADING</span>
                      <span 
                        className="progress-bar" 
                        style={{ width: `${downloadProgress}%` }}
                      ></span>
                    </span>
                  ) : (
                    <span className="button-text">DOWNLOAD RÉSUMÉ</span>
                  )}
                </button>
                
                {showDownloadOptions && !isDownloading && (
                  <div className="download-options">
                    <button 
                      className="download-option"
                      onClick={() => handleDownload('PDF')}
                    >
                      PDF Format
                    </button>
                    <button 
                      className="download-option"
                      onClick={() => handleDownload('DOCX')}
                    >
                      DOCX Format
                    </button>
                    <button 
                      className="download-option"
                      onClick={() => handleDownload('TXT')}
                    >
                      TXT Format
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="resume-body">
              <motion.div 
                className="resume-nav"
                variants={itemVariants}
              >
                <div className="nav-title">SECTIONS</div>
                {RESUME_SECTIONS.map((section) => (
                  <button 
                    key={section.id}
                    className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(section.id);
                      playSound('click');
                    }}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    <span className="nav-label">{section.title}</span>
                  </button>
                ))}
              </motion.div>
              
              <motion.div 
                className="resume-section-content"
                variants={itemVariants}
                id={`section-${activeSection}`}
              >
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="section-icon">
                      {RESUME_SECTIONS.find(s => s.id === activeSection)?.icon}
                    </span>
                    <span>{RESUME_SECTIONS.find(s => s.id === activeSection)?.title}</span>
                  </h2>
                </div>
                
                <div className="section-body">
                  {renderSectionContent()}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .resume-section {
          padding: var(--space-xxl) 0;
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .page-title {
          text-align: center;
          margin-bottom: var(--space-xl);
          color: var(--accent-cyan);
          font-size: 3rem;
          position: relative;
        }
        
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
        
        .resume-container {
          position: relative;
          width: 100%;
          min-height: 600px;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .resume-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        
        .resume-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 600px;
        }
        
        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg);
          background-color: rgba(10, 10, 10, 0.75);
          border-bottom: 1px solid var(--accent-cyan);
          backdrop-filter: blur(5px);
        }
        
        .resume-identity {
          flex: 1;
        }
        
        .resume-name {
          font-size: 1.8rem;
          color: var(--accent-cyan);
          margin-bottom: var(--space-xs);
        }
        
        .resume-title {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
        
        .resume-actions {
          position: relative;
        }
        
        .download-button {
          padding: var(--space-sm) var(--space-lg);
          background-color: rgba(0, 255, 245, 0.1);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--border-radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          letter-spacing: 1px;
          transition: all var(--transition-normal);
          cursor: none;
          position: relative;
          overflow: hidden;
          min-width: 180px;
        }
        
        .download-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 245, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .download-button:hover {
          background-color: rgba(0, 255, 245, 0.2);
          transform: translateY(-2px);
        }
        
        .download-button:hover::before {
          left: 100%;
        }
        
        .download-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .download-progress {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--space-xs);
        }
        
        .progress-text {
          font-size: 0.8rem;
        }
        
        .progress-bar {
          height: 3px;
          background-color: var(--accent-cyan);
          width: 0%;
          transition: width 0.2s ease-out;
        }
        
        .download-options {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: var(--space-xs);
          background-color: rgba(10, 10, 10, 0.9);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--border-radius-sm);
          padding: var(--space-xs);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          min-width: 150px;
          z-index: var(--z-dropdown);
          backdrop-filter: blur(5px);
        }
        
        .download-option {
          padding: var(--space-xs) var(--space-sm);
          background-color: transparent;
          border: none;
          color: var(--text-primary);
          text-align: left;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          transition: all var(--transition-fast);
          cursor: none;
        }
        
        .download-option:hover {
          background-color: rgba(0, 255, 245, 0.1);
          color: var(--accent-cyan);
        }
        
        .resume-body {
          display: flex;
          flex: 1;
        }
        
        .resume-nav {
          width: 250px;
          padding: var(--space-md);
          background-color: rgba(10, 10, 10, 0.75);
          border-right: 1px solid var(--accent-cyan);
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(5px);
        }
        
        .nav-title {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          border-radius: var(--border-radius-sm);
          color: var(--text-secondary);
          background-color: transparent;
          border: none;
          font-family: var(--font-body);
          font-size: 1rem;
          text-align: left;
          transition: all var(--transition-normal);
          margin-bottom: var(--space-xs);
          cursor: none;
        }
        
        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        
        .nav-item.active {
          background-color: rgba(0, 255, 245, 0.1);
          color: var(--accent-cyan);
        }
        
        .nav-icon {
          font-size: 1.2rem;
          min-width: 20px;
          text-align: center;
        }
        
        .resume-section-content {
          flex: 1;
          padding: var(--space-lg);
          background-color: rgba(10, 10, 10, 0.75);
          overflow-y: auto;
          backdrop-filter: blur(5px);
        }
        
        .resume-section-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .resume-section-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        .resume-section-content::-webkit-scrollbar-thumb {
          background: var(--accent-cyan);
          border-radius: 3px;
        }
        
        .section-header {
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-title {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          color: var(--accent-cyan);
          gap: var(--space-sm);
        }
        
        .section-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 255, 245, 0.1);
          border-radius: 50%;
          font-size: 1.2rem;
        }
        
        .section-text {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.1rem;
        }
        
        /* Experience styling */
        .experience-item {
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .experience-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .experience-header {
          margin-bottom: var(--space-sm);
        }
        
        .experience-title {
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-bottom: var(--space-xs);
        }
        
        .experience-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .experience-company {
          color: var(--accent-magenta);
        }
        
        .experience-separator {
          color: var(--text-tertiary);
        }
        
        .experience-responsibilities {
          list-style-type: none;
          padding-left: var(--space-md);
        }
        
        .experience-responsibility-item {
          position: relative;
          color: var(--text-secondary);
          margin-bottom: var(--space-xs);
        }
        
        .experience-responsibility-item::before {
          content: '▹';
          position: absolute;
          left: calc(-1 * var(--space-md));
          color: var(--accent-cyan);
        }
        
        /* Education styling */
        .education-item {
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .education-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .education-header {
          margin-bottom: var(--space-sm);
        }
        
        .education-degree {
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-bottom: var(--space-xs);
        }
        
        .education-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .education-institution {
          color: var(--accent-magenta);
        }
        
        .education-separator {
          color: var(--text-tertiary);
        }
        
        .education-details {
          list-style-type: none;
          padding-left: var(--space-md);
        }
        
        .education-detail-item {
          position: relative;
          color: var(--text-secondary);
          margin-bottom: var(--space-xs);
        }
        
        .education-detail-item::before {
          content: '▹';
          position: absolute;
          left: calc(-1 * var(--space-md));
          color: var(--accent-cyan);
        }
        
        /* Skills styling */
        .skills-category {
          margin-bottom: var(--space-lg);
        }
        
        .skills-category:last-child {
          margin-bottom: 0;
        }
        
        .skills-category-name {
          font-size: 1.2rem;
          color: var(--accent-magenta);
          margin-bottom: var(--space-sm);
          position: relative;
          display: inline-block;
        }
        
        .skills-category-name::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--accent-magenta);
          opacity: 0.5;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: var(--space-sm);
        }
        
        .skill-item {
          padding: var(--space-xs) var(--space-sm);
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius-sm);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        /* Certifications styling */
        .certification-item {
          margin-bottom: var(--space-md);
          padding: var(--space-sm);
          border-left: 2px solid var(--accent-cyan);
          background-color: rgba(255, 255, 255, 0.03);
        }
        
        .certification-name {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: var(--space-xs);
        }
        
        .certification-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .certification-issuer {
          color: var(--accent-magenta);
        }
        
        .certification-separator {
          color: var(--text-tertiary);
        }
        
        /* Projects styling */
        .project-item {
          margin-bottom: var(--space-lg);
          padding: var(--space-md);
          border-radius: var(--border-radius-sm);
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-sm);
        }
        
        .project-name {
          font-size: 1.2rem;
          color: var(--text-primary);
        }
        
        .project-link {
          padding: 2px 10px;
          background-color: rgba(0, 255, 245, 0.1);
          border-radius: var(--border-radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          transition: all var(--transition-normal);
        }
        
        .project-link:hover {
          background-color: var(--accent-cyan);
          color: var(--bg-primary);
        }
        
        .project-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
          line-height: 1.5;
        }
        
        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
        }
        
        .project-technology {
          padding: 2px 8px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }
        
        /* Contact styling */
        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--space-lg);
        }
        
        .contact-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        
        .contact-label {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--accent-magenta);
        }
        
        .contact-value {
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        
        .contact-link {
          color: var(--accent-cyan);
          transition: all var(--transition-normal);
        }
        
        .contact-link:hover {
          text-decoration: underline;
        }
        
        .contact-social {
          display: flex;
          gap: var(--space-md);
        }
        
        .contact-social-link {
          padding: var(--space-xs) var(--space-sm);
          background-color: rgba(0, 255, 245, 0.1);
          border-radius: var(--border-radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          transition: all var(--transition-normal);
        }
        
        .contact-social-link:hover {
          background-color: var(--accent-cyan);
          color: var(--bg-primary);
          text-decoration: none;
        }
        
        /* Light theme styles */
        .light-theme .resume-header,
        .light-theme .resume-nav,
        .light-theme .resume-section-content {
          background-color: rgba(245, 245, 245, 0.75);
        }
        
        .light-theme .resume-header {
          border-color: var(--accent-blue);
        }
        
        .light-theme .resume-nav {
          border-color: var(--accent-blue);
        }
        
        .light-theme .resume-name,
        .light-theme .section-title {
          color: var(--accent-blue);
        }
        
        .light-theme .nav-item.active {
          background-color: rgba(77, 77, 255, 0.1);
          color: var(--accent-blue);
        }
        
        .light-theme .section-icon {
          background-color: rgba(77, 77, 255, 0.1);
        }
        
        .light-theme .download-button {
          background-color: rgba(77, 77, 255, 0.1);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
        }
        
        .light-theme .download-button::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(77, 77, 255, 0.2),
            transparent
          );
        }
        
        .light-theme .download-button:hover {
          background-color: rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .progress-bar {
          background-color: var(--accent-blue);
        }
        
        .light-theme .download-options {
          background-color: rgba(245, 245, 245, 0.9);
          border-color: var(--accent-blue);
        }
        
        .light-theme .download-option:hover {
          background-color: rgba(77, 77, 255, 0.1);
          color: var(--accent-blue);
        }
        
        .light-theme .resume-section-content::-webkit-scrollbar-thumb {
          background: var(--accent-blue);
        }
        
        .light-theme .experience-responsibility-item::before,
        .light-theme .education-detail-item::before {
          color: var(--accent-blue);
        }
        
        .light-theme .skills-category-name,
        .light-theme .experience-company,
        .light-theme .education-institution,
        .light-theme .certification-issuer,
        .light-theme .contact-label {
          color: var(--accent-blue);
        }
        
        .light-theme .skills-category-name::after {
          background-color: var(--accent-blue);
        }
        
        .light-theme .certification-item {
          border-left-color: var(--accent-blue);
        }
        
        .light-theme .project-link,
        .light-theme .contact-link,
        .light-theme .contact-social-link,
        .light-theme .project-technology {
          color: var(--accent-blue);
          background-color: rgba(77, 77, 255, 0.1);
        }
        
        .light-theme .project-link:hover,
        .light-theme .contact-social-link:hover {
          background-color: var(--accent-blue);
          color: white;
        }
        
        /* Media queries */
        @media (max-width: 1024px) {
          .resume-body {
            flex-direction: column;
          }
          
          .resume-nav {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--accent-cyan);
            padding: var(--space-sm);
            flex-direction: row;
            flex-wrap: wrap;
            gap: var(--space-xs);
          }
          
          .nav-title {
            width: 100%;
            margin-bottom: var(--space-xs);
          }
          
          .nav-item {
            margin-bottom: 0;
            padding: var(--space-xs) var(--space-sm);
          }
          
          .nav-label {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }
          
          .resume-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }
          
          .resume-actions {
            width: 100%;
          }
          
          .download-button {
            width: 100%;
          }
          
          .resume-name {
            font-size: 1.5rem;
          }
          
          .resume-title {
            font-size: 1rem;
          }
          
          .section-title {
            font-size: 1.3rem;
          }
          
          .contact-info {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }
          
          .nav-icon {
            font-size: 1rem;
          }
          
          .nav-label {
            display: none;
          }
          
          .nav-item {
            padding: var(--space-xs);
            min-width: 40px;
            justify-content: center;
          }
          
          .resume-section-content {
            padding: var(--space-md);
          }
          
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ResumeHologram;
