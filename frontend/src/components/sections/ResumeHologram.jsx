import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';
import { useGlitch } from '../../hooks/useGlitch';
import styles from './ResumeHologram.module.css';

// Import projects from ProjectsGrid data
const PROJECTS_DATA = [
  {
    id: 1,
    title: 'CertGames.com',
    description: 'A gamified platform for certification preparation. Follow structured roadmaps to learn, practice, and master certifications like CompTIA. Earn XP, unlock badges, and track your progress.',
    categories: ['cybersecurity', 'education'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    link: 'https://certgames.com',
    featured: true
  },
  {
    id: 2,
    title: 'Flask-Honeypot',
    description: 'A lightweight honeypot system built with Flask. Detects and logs potential cyber attacks while presenting convincing decoy services to attackers. Helps identify common attack vectors and malicious IP addresses.',
    categories: ['cybersecurity'],
    technologies: ['Python', 'Flask', 'Docker', 'SQLite'],
    link: 'https://github.com/CarterPerez-dev/flask-honeypot',
    featured: false
  },
  {
    id: 3,
    title: 'Portfolio',
    description: 'A futuristic themed portfolio website with interactive elements and holographic UI. Features include 3D elements, glitch effects, and a custom terminal interface.',
    categories: ['web dev'],
    technologies: ['React', 'Three.js', 'CSS3', 'Framer Motion'],
    link: 'https://github.com/CarterPerez-dev/carter-perez-devs',
    featured: false
  },
  {
    id: 4,
    title: 'AngelaCLI',
    description: 'An AI-powered command line tool that assists with coding tasks. Integrates with your development workflow to provide context-aware suggestions, refactoring tips, and code generation.',
    categories: ['ai'],
    technologies: ['Python', 'OpenAI API', 'TensorFlow', 'Click'],
    link: 'https://github.com/CarterPerez-dev/angela-cli',
    featured: false
  }
];

// Blog posts from ProjectsGrid
const BLOG_POSTS = [
  {
    id: 5,
    title: 'How My Career Growth Led to Enhancing Customer Experience',
    description: 'Certifications have a unique way of shaping not only the knowledge we carry but also the way we approach challenges. As an Integration Technician at SealingTech, earning professional CompTIA certifications such as the A+, Network+, Security+, Network+, CySa+, Pentest+, and CASP+ have placed me on a learning path which has become the catalyst for personal….',
    categories: ['blogs', 'cybersecurity'],
    date: 'April 15, 2025',
    link: 'https://www.sealingtech.com/2025/02/03/how-my-career-growth-led-to-enhancing-customer-experience/',
    isBlog: true
  },
  {
    id: 6,
    title: 'Building Custom Solutions with Quality at the Core',
    description: 'As a System Integration Technician at SealingTech, my team and I are responsible for building custom defense systems that are not only powerful but also tailored to the unique needs of our customers. From selecting the right hardware specifications to configuring the complex systems into a carry-on compliant Cyber-Fly-Away Kit, we focus on optimizing performance,…',
    categories: ['blogs', 'web dev'],
    date: 'March 22, 2025',
    link: 'https://www.sealingtech.com/2024/10/03/building-custom-solutions-with-quality-at-the-core/',
    isBlog: true
  },
  {
    id: 7,
    title: 'Top 10 Tips to Pass the CompTIA Security+ Exam on Your First Try',
    description: 'The CompTIA Security+ certification is one of the most sought-after entry-level cybersecurity certifications. With over 900,000 Security+ certified professionals worldwide, this certification validates the baseline skills necessary to perform core security functions and serves as a springboard for more advanced cybersecurity roles...',
    categories: ['blogs', 'ai', 'education'],
    date: 'February 8, 2025',
    link: 'https://certgames.com/blog/comptia-security-plus-exam-tips',
    isBlog: true
  }
];

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
    content: PROJECTS_DATA.map(project => ({
      name: project.title,
      description: project.description,
      technologies: project.technologies,
      link: project.link,
      featured: project.featured
    }))
  },
  {
    id: 'blogs',
    title: 'Publications',
    icon: '📝',
    content: BLOG_POSTS.map(blog => ({
      name: blog.title,
      description: blog.description,
      date: blog.date,
      link: blog.link,
      categories: blog.categories
    }))
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
  const titleRef = useRef(null);
  const resumeContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [hologramState, setHologramState] = useState({
    flicker: false,
    glitch: false,
    scanLine: 0,
    noise: 0.05
  });
  
  // Initialize glitch effect for title
  const { startGlitch } = useGlitch(titleRef, {
    intensity: 3,
    duration: 500,
    continuousGlitch: false
  });
  
  // Simulate hologram effects with periodic glitches and flickers
  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        setHologramState(prevState => ({ 
          ...prevState, 
          glitch: true 
        }));
        
        // Trigger title glitch
        if (Math.random() < 0.5) {
          startGlitch();
        }
        
        // Reset glitch after short duration
        setTimeout(() => {
          setHologramState(prevState => ({ 
            ...prevState, 
            glitch: false 
          }));
        }, 200 + Math.random() * 300);
      }
    }, 3000);
    
    // Random flicker effect
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setHologramState(prevState => ({ 
          ...prevState, 
          flicker: true 
        }));
        
        // Reset flicker after short duration
        setTimeout(() => {
          setHologramState(prevState => ({ 
            ...prevState, 
            flicker: false 
          }));
        }, 100 + Math.random() * 150);
      }
    }, 5000);
    
    // Scan line animation
    const scanLineInterval = setInterval(() => {
      setHologramState(prevState => ({ 
        ...prevState, 
        scanLine: (prevState.scanLine + 1) % 100 
      }));
    }, 50);
    
    // Noise intensity variation
    const noiseInterval = setInterval(() => {
      setHologramState(prevState => ({ 
        ...prevState, 
        noise: 0.03 + Math.random() * 0.04
      }));
    }, 200);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(flickerInterval);
      clearInterval(scanLineInterval);
      clearInterval(noiseInterval);
    };
  }, [startGlitch]);
  
  // 3D Holographic effect with advanced canvas rendering
  useEffect(() => {
    if (!canvasRef.current || !resumeContainerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const rect = resumeContainerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();
    
    // Holographic parameters
    const primaryColor = theme === 'dark' 
      ? { r: 0, g: 255, b: 245 } 
      : { r: 77, g: 77, b: 255 };
    const secondaryColor = { r: 255, g: 61, b: 61 };
    
    // Create grid-based data points
    const gridSpacing = 30;
    const cols = Math.ceil(canvas.width / gridSpacing);
    const rows = Math.ceil(canvas.height / gridSpacing);
    const dataPoints = [];
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() < 0.3) { // Only create some points
          dataPoints.push({
            x: i * gridSpacing + (Math.random() * gridSpacing * 0.5),
            y: j * gridSpacing + (Math.random() * gridSpacing * 0.5),
            size: 1 + Math.random(),
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            connections: []
          });
        }
      }
    }
    
    // Connect nearby data points
    dataPoints.forEach(point => {
      dataPoints.forEach(otherPoint => {
        if (point === otherPoint) return;
        
        const dx = point.x - otherPoint.x;
        const dy = point.y - otherPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < gridSpacing * 1.5 && Math.random() < 0.3) {
          point.connections.push(otherPoint);
        }
      });
    });
    
    // Data flow particles
    const particles = [];
    
    const createParticle = (startPoint, endPoint) => {
      particles.push({
        startPoint,
        endPoint,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        size: 1.5 + Math.random(),
        color: Math.random() < 0.8 ? primaryColor : secondaryColor,
        alpha: 0.6 + Math.random() * 0.4
      });
    };
    
    // Create initial particles
    const initialParticleCount = Math.floor(dataPoints.length * 0.2);
    for (let i = 0; i < initialParticleCount; i++) {
      const randomPoint = dataPoints[Math.floor(Math.random() * dataPoints.length)];
      if (randomPoint.connections.length > 0) {
        const randomConnection = randomPoint.connections[Math.floor(Math.random() * randomPoint.connections.length)];
        createParticle(randomPoint, randomConnection);
      }
    }
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply scan line effect
      const scanLineY = (canvas.height * hologramState.scanLine) / 100;
      ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.1)`;
      ctx.fillRect(0, scanLineY, canvas.width, 2);
      
      // Apply hologram flicker
      if (hologramState.flicker) {
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.05)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Apply digital noise
      if (hologramState.noise > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() < hologramState.noise) {
            data[i] = primaryColor.r * Math.random();     // R
            data[i + 1] = primaryColor.g * Math.random(); // G
            data[i + 2] = primaryColor.b * Math.random(); // B
            data[i + 3] = Math.random() * 50;             // A
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      // Draw glitch effect
      if (hologramState.glitch) {
        const glitchHeight = 20 + Math.random() * 30;
        const glitchY = Math.random() * canvas.height;
        
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.2)`;
        ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
        
        // Draw offset copies for RGB split effect
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(2, glitchY + 2, canvas.width, glitchHeight - 4);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(-2, glitchY - 2, canvas.width, glitchHeight + 4);
        ctx.globalCompositeOperation = 'source-over';
      }
      
      // Draw data points and connections
      dataPoints.forEach(point => {
        // Update pulse phase
        point.pulsePhase += point.pulseSpeed;
        if (point.pulsePhase > Math.PI * 2) {
          point.pulsePhase -= Math.PI * 2;
        }
        
        // Calculate pulse effect
        const pulseFactor = 0.7 + Math.sin(point.pulsePhase) * 0.3;
        
        // Draw connections first
        point.connections.forEach(connectedPoint => {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connectedPoint.x, connectedPoint.y);
          
          // Glow effect based on active section
          const distToActive = getDistanceToActiveSection((point.x + connectedPoint.x) / 2, (point.y + connectedPoint.y) / 2);
          const alpha = Math.max(0.03, Math.min(0.2, 1 - distToActive / 1000));
          
          ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
        
        // Draw the data point with pulse effect
        const pointSize = point.size * pulseFactor;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
        
        // Distance-based glow
        const distToActive = getDistanceToActiveSection(point.x, point.y);
        const alpha = Math.max(0.1, Math.min(0.5, 1 - distToActive / 1000));
        
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${alpha})`;
        ctx.fill();
      });
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update progress
        particle.progress += particle.speed;
        
        // Remove if completed
        if (particle.progress >= 1) {
          // Create new particle
          if (Math.random() < 0.7) {
            const randomPoint = dataPoints[Math.floor(Math.random() * dataPoints.length)];
            if (randomPoint.connections.length > 0) {
              const randomConnection = randomPoint.connections[Math.floor(Math.random() * randomPoint.connections.length)];
              createParticle(randomPoint, randomConnection);
            }
          }
          
          particles.splice(i, 1);
          continue;
        }
        
        // Calculate current position
        const currentX = particle.startPoint.x + (particle.endPoint.x - particle.startPoint.x) * particle.progress;
        const currentY = particle.startPoint.y + (particle.endPoint.y - particle.startPoint.y) * particle.progress;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(currentX, currentY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`;
        ctx.fill();
        
        // Add glow
        const glowSize = particle.size * 3;
        const gradient = ctx.createRadialGradient(
          currentX, currentY, 0,
          currentX, currentY, glowSize
        );
        
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Add new particles occasionally
      if (Math.random() < 0.05 && particles.length < Math.floor(dataPoints.length * 0.3)) {
        const randomPoint = dataPoints[Math.floor(Math.random() * dataPoints.length)];
        if (randomPoint.connections.length > 0) {
          const randomConnection = randomPoint.connections[Math.floor(Math.random() * randomPoint.connections.length)];
          createParticle(randomPoint, randomConnection);
        }
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
        const glowSize = 25;
        
        // Create gradient
        const glow = ctx.createLinearGradient(
          highlightRect.x, 
          highlightRect.y, 
          highlightRect.x + highlightRect.width, 
          highlightRect.y + highlightRect.height
        );
        
        glow.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.1)`);
        glow.addColorStop(0.5, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.2)`);
        glow.addColorStop(1, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.1)`);
        
        // Draw rounded rectangle with glow
        drawRoundedRect(
          ctx, 
          highlightRect.x - glowSize, 
          highlightRect.y - glowSize, 
          highlightRect.width + glowSize * 2, 
          highlightRect.height + glowSize * 2, 
          10,
          glow
        );
      }
      
      // Request next animation frame
      requestAnimationFrame(animate);
    };
    
    // Helper function to draw rounded rectangle
    const drawRoundedRect = (ctx, x, y, width, height, radius, fill) => {
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
      
      if (!activeElement) return 1000; // Default large distance
      
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
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, activeSection, hologramState]);
  
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
            
            // Trigger glitch effect on completion
            setHologramState(prevState => ({ ...prevState, glitch: true }));
            setTimeout(() => {
              setHologramState(prevState => ({ ...prevState, glitch: false }));
            }, 500);
            
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
      <div key={index} className={`${styles.projectItem} ${project.featured ? styles.featuredProject : ''}`}>
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
  
  // Render blogs list
  const renderBlogsList = (blogs) => {
    return blogs.map((blog, index) => (
      <div key={index} className={styles.blogItem}>
        <div className={styles.blogHeader}>
          <h3 className={styles.blogName}>{blog.name}</h3>
          <div className={styles.blogDate}>{blog.date}</div>
        </div>
        
        <p className={styles.blogDescription}>{blog.description}</p>
        
        <div className={styles.blogFooter}>
          <div className={styles.blogCategories}>
            {blog.categories.map((category, idx) => (
              <span key={idx} className={styles.blogCategory}>{category}</span>
            ))}
          </div>
          
          <a 
            href={blog.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.blogLink}
            onClick={() => playSound('click')}
          >
            Read Article
          </a>
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
      case 'blogs':
        return renderBlogsList(section.content);
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
  
  // Hologram effect classes based on state
  const hologramEffectClasses = `
    ${styles.resumeContainer} 
    ${hologramState.flicker ? styles.flicker : ''} 
    ${hologramState.glitch ? styles.glitch : ''}
  `;
  
  return (
    <section className={styles.resumeSection} id="resume">
      <div className={styles.scanLines}></div>
      <div className={styles.hologramProjection}></div>
      
      <div className="container">
        <motion.h1 
          ref={titleRef}
          className={styles.pageTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-text="Neural Résumé Interface"
        >
          Neural Résumé Interface
        </motion.h1>
        
        <motion.div 
          ref={resumeContainerRef}
          className={hologramEffectClasses}
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
                      
                      // Trigger mild glitch effect on section change
                      setHologramState(prevState => ({ ...prevState, glitch: true }));
                      setTimeout(() => {
                        setHologramState(prevState => ({ ...prevState, glitch: false }));
                      }, 150);
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
                key={activeSection} // Force re-render on section change
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
