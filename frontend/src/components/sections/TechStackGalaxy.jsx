import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
// Import react-icons
import { FaLock, FaDesktop, FaCog, FaSyncAlt, FaDatabase, FaGlobe, FaPause, FaPlay, FaShieldAlt, FaCloudversify } from 'react-icons/fa'; 
import { useTheme } from '../../contexts/ThemeContext'; 
import styles from './css/TechStackGalaxy.module.css';

// Skill categories with React Icons and potentially brighter colors
const SKILL_CATEGORIES = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: FaLock, 
    color: '#ff1744' 
  },
  {
    id: 'frontend',
    name: 'Frontend',
    icon: FaDesktop,
    color: '#29b6f6' 
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: FaCog,
    color: '#ffca28' // Brighter Yellow
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: FaSyncAlt,
    color: '#66bb6a' // Brighter Green
  },
  {
    id: 'cloud',
    name: 'Cloud',
    icon: FaCloudversify,
    color: '#42a5f5' 
  },
  {
    id: 'security_governance',
    name: 'Security Governance',
    icon: FaShieldAlt,
    color: '#ba68c8'
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: FaGlobe,
    color: '#ffa726' 
  }
];

// Updated Skills data with more cybersecurity focus
const SKILLS = [
    // Cybersecurity
    { name: 'Penetration Testing', category: 'cybersecurity', level: 92 },
    { name: 'Vulnerability Assessment', category: 'cybersecurity', level: 94 },
    { name: 'MITRE ATT&CK Framework', category: 'cybersecurity', level: 88 },
    { name: 'Incident Response', category: 'cybersecurity', level: 82 },
    { name: 'Threat Hunting', category: 'cybersecurity', level: 80 },
    { name: 'Digital Forensics', category: 'cybersecurity', level: 79 },
    { name: 'Exploit Development', category: 'cybersecurity', level: 87 },
    { name: 'Security Monitoring', category: 'cybersecurity', level: 96 },

    // Frontend
    { name: 'React/Redux', category: 'frontend', level: 99 },
    { name: 'JavaScript/ES6+', category: 'frontend', level: 90 },
    { name: 'HTML5/CSS3', category: 'frontend', level: 95 },
    { name: 'TypeScript', category: 'frontend', level: 81 },
    { name: 'Responsive Design', category: 'frontend', level: 96 },
    { name: 'React Native', category: 'frontend', level: 86 },
    { name: 'UI/UX Principles', category: 'frontend', level: 85 },
    { name: 'Web Accessibility', category: 'frontend', level: 84 },

    // Backend
    { name: 'Python', category: 'backend', level: 97 },
    { name: 'Flask', category: 'backend', level: 99 },
    { name: 'Node.js', category: 'backend', level: 85 },
    { name: 'Express', category: 'backend', level: 80 },
    { name: 'RESTful API Design', category: 'backend', level: 92 },
    { name: 'API Security', category: 'backend', level: 95 },
    { name: 'Shell Scripting', category: 'backend', level: 89 },
    { name: 'Microservices Architecture', category: 'backend', level: 79 },

    // DevOps
    { name: 'Docker', category: 'devops', level: 99 },
    { name: 'Kubernetes', category: 'devops', level: 70 },
    { name: 'CI/CD Pipelines', category: 'devops', level: 86 },
    { name: 'GitHub Actions', category: 'devops', level: 89 },
    { name: 'Infrastructure as Code', category: 'devops', level: 75 },
    { name: 'Linux Administration', category: 'devops', level: 94 },
    { name: 'Nginx/Apache Configuration', category: 'devops', level: 98 },
    { name: 'DevSecOps Practices', category: 'devops', level: 85 },

    // Cloud
    { name: 'AWS EC2/S3', category: 'cloud', level: 89 },
    { name: 'AWS CloudFront', category: 'cloud', level: 85 },
    { name: 'AWS CloudWatch', category: 'cloud', level: 78 },
    { name: 'AWS WAF & Shield', category: 'cloud', level: 85 },
    { name: 'AWS EventBridge', category: 'cloud', level: 75 },
    { name: 'AWS IAM', category: 'cloud', level: 88 },
    { name: 'Serverless Architecture', category: 'cloud', level: 72 },
    { name: 'Cloud Security Best Practices', category: 'cloud', level: 85 },

    // Security Governance
    { name: 'ISO 27001', category: 'security_governance', level: 88 },
    { name: 'NIST 800-53', category: 'security_governance', level: 87 },
    { name: 'Risk Assessment', category: 'security_governance', level: 92 },
    { name: 'Security Policy Development', category: 'security_governance', level: 78 },
    { name: 'Compliance Frameworks', category: 'security_governance', level: 80 },
    { name: 'COBIT Implementation', category: 'security_governance', level: 75 },
    { name: 'ITIL Best Practices', category: 'security_governance', level: 78 },
    { name: 'Security Auditing', category: 'security_governance', level: 89 },

    // Networking
    { name: 'TCP/IP Protocol Suite', category: 'networking', level: 93 },
    { name: 'Firewalls & IDS/IPS', category: 'networking', level: 90 },
    { name: 'VPN Implementation', category: 'networking', level: 85 },
    { name: 'Zero Trust Architecture', category: 'networking', level: 85 },
    { name: 'Network Security', category: 'networking', level: 93 },
    { name: 'DNS Management', category: 'networking', level: 94 },
    { name: 'SSL/TLS Implementation', category: 'networking', level: 91 },
    { name: 'Network Monitoring', category: 'networking', level: 90 }
];


const TechStackGalaxy = ({ fullPage = false }) => {
  const themeContext = useTheme ? useTheme() : { theme: 'dark' };
  const { theme } = themeContext;

  const canvasRef = useRef(null);
  const galaxyContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('cybersecurity');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [skillDetails, setSkillDetails] = useState(null);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false); // <-- State for hover detection

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setFilteredSkills(SKILLS.filter(skill => skill.category === activeCategory));
  }, [activeCategory]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!galaxyContainerRef.current) return;
      const rect = galaxyContainerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
      });
    };
    const galaxyContainer = galaxyContainerRef.current;
    if (galaxyContainer) galaxyContainer.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (galaxyContainer) galaxyContainer.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Particle Network Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();

    const particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const createParticles = () => {
      particles.length = 0;
      const particleCount = 80; // Slightly more particles for vibrancy
      const maxDist = Math.min(canvas.width, canvas.height) / 2.5; // Allow particles closer to edge
      const minDist = 40;

      for (let i = 0; i < particleCount; i++) {
        // --- Increased Prominence ---
        const radius = Math.random() * 2.5 + 1.5; // Larger radius
        const distance = Math.random() * (maxDist - minDist) + minDist;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.1 + Math.random() * 0.5) * 0.0008; // Base speed can be slightly faster if desired

        const categoryIndex = Math.floor(Math.random() * SKILL_CATEGORIES.length);
        const category = SKILL_CATEGORIES[categoryIndex];

        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          originX: centerX,
          originY: centerY,
          radius,
          distance,
          angle,
          baseSpeed: speed, // Store base speed
          color: category.color,
          // --- Increased Prominence ---
          opacity: 0.8 + Math.random() * 0.2, // Higher base opacity
          category: category.id
        });
      }
    };

    const renderNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentCenterX = canvas.width / 2;
      const currentCenterY = canvas.height / 2;

      // Central Glow (adjust color/intensity if needed)
      const centerGradient = ctx.createRadialGradient(
        currentCenterX, currentCenterY, 0,
        currentCenterX, currentCenterY, 120 // Slightly larger glow
      );
      // --- More Colorful --- (Using the active category color for the main glow)
      const activeColor = SKILL_CATEGORIES.find(c => c.id === activeCategory)?.color || '#ff1744';
      centerGradient.addColorStop(0, `${activeColor}40`); // Use active color with alpha
      centerGradient.addColorStop(0.5, `${activeColor}10`);
      centerGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(currentCenterX, currentCenterY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles
      for (const p of particles) {
        // --- Slowdown on Hover ---
        const speedMultiplier = isHoveringCanvas ? 0.1 : 32.0; 
        const effectiveSpeed = p.baseSpeed * speedMultiplier;

        if (isRotating) {
          p.angle += effectiveSpeed;
        }

        const parallaxX = mousePosition.x * (p.distance * 0.03);
        const parallaxY = mousePosition.y * (p.distance * 0.03);

        p.x = currentCenterX + Math.cos(p.angle) * p.distance + parallaxX;
        p.y = currentCenterY + Math.sin(p.angle) * p.distance + parallaxY;

        // Draw particle
        ctx.globalAlpha = p.category === activeCategory ? p.opacity : p.opacity * 0.8; // Active category stands out more
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Particle Glow (optional, slightly more visible)
        const glowSize = p.radius * 4; // Slightly larger glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glow.addColorStop(0, `${p.color}50`); // Slightly stronger alpha
        glow.addColorStop(1, 'transparent');

        ctx.globalAlpha = p.category === activeCategory ? 0.3 : 0.15;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }

      // Draw connection lines (using active category color for more dynamism)
      // --- More Colorful ---
      ctx.strokeStyle = activeColor; // Use active category color for lines
      ctx.lineWidth = 0.6; // Slightly thicker lines
      const connectionDistance = 130; // Increase connection distance slightly

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // --- More Prominent ---
            ctx.globalAlpha = (1 - distance / connectionDistance) * 0.5; // Stronger line alpha
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    createParticles();
    const animate = () => {
      renderNetwork();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, activeCategory, isRotating, mousePosition, isHoveringCanvas]); // <-- Add isHoveringCanvas dependency

  const handleSkillHover = (skill) => setSkillDetails(skill);
  const handleSkillLeave = () => setSkillDetails(null);

  // --- Handlers for Canvas Hover ---
  const handleMouseEnterCanvas = () => setIsHoveringCanvas(true);
  const handleMouseLeaveCanvas = () => setIsHoveringCanvas(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <section
      className={`${styles.techStackSection} ${fullPage ? styles.fullPage : ''}`}
      id="tech-stack"
    >
      <div className="container">
        {/* Title */}
        {!fullPage ? (
          <motion.h2 /* ... */ >Tech Stack</motion.h2>
        ) : (
          <motion.h1 /* ... */ >Technology Matrix</motion.h1>
        )}

        {/* --- Added hover handlers to this container --- */}
        <div
            className={styles.techGalaxyContainer}
            ref={galaxyContainerRef}
            onMouseEnter={handleMouseEnterCanvas}
            onMouseLeave={handleMouseLeaveCanvas}
        >
          <canvas
            ref={canvasRef}
            className={styles.techGalaxyCanvas}
            aria-hidden="true"
          ></canvas>

          {/* Category Selector */}
          <motion.div
            className={styles.categorySelector}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {SKILL_CATEGORIES.map((category) => {
              // --- Render React Icon ---
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  variants={itemVariants}
                  style={{ '--category-color': category.color }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Use the IconComponent here */}
                  <IconComponent className={styles.categoryIcon} />
                  <span className={styles.categoryName}>{category.name}</span>
                </motion.button>
              );
            })}

            {/* Rotation Toggle */}
            <motion.button
              className={styles.rotationToggle}
              onClick={() => setIsRotating(!isRotating)}
              variants={itemVariants}
              aria-label={isRotating ? 'Pause rotation' : 'Resume rotation'}
              title={isRotating ? 'Pause rotation' : 'Resume rotation'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* --- Use React Icons for Play/Pause --- */}
              {isRotating ? <FaPause /> : <FaPlay />}
            </motion.button>
          </motion.div>

          {/* Skills Display */}
          <motion.div
            className={styles.skillsDisplay}
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={`${activeCategory}-${skill.name}-${index}`}
                className={styles.skillItem}
                variants={itemVariants}
                onMouseEnter={() => handleSkillHover(skill)}
                onMouseLeave={handleSkillLeave}
              >
                <div className={styles.skillName}>{skill.name}</div>
                <div className={styles.skillLevelContainer}>
                  <motion.div
                    className={styles.skillLevelBar}
                    style={{
                      backgroundColor: SKILL_CATEGORIES.find(c => c.id === skill.category)?.color || '#ccc'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <div className={styles.skillLevelText}>{skill.level}%</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Skill Details Popup */}
          {skillDetails && !isMobile && ( // Hide details popup on mobile for better UX
            <motion.div
              className={styles.skillDetails}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                '--detail-color': SKILL_CATEGORIES.find(c => c.id === skillDetails.category)?.color || '#ccc'
              }}
            >
              <div className={styles.skillDetailsHeader}>
                <div className={styles.skillDetailsName}>{skillDetails.name}</div>
                <div className={styles.skillDetailsCategory}>
                  {SKILL_CATEGORIES.find(c => c.id === skillDetails.category)?.name}
                </div>
              </div>

              <div className={styles.skillDetailsLevel}>
                <div className={styles.skillDetailsLevelLabel}>Proficiency</div>
                <div className={styles.skillDetailsLevelBarContainer}>
                  <div
                    className={styles.skillDetailsLevelBar}
                    style={{ width: `${skillDetails.level}%` }}
                  ></div>
                </div>
                <div className={styles.skillDetailsLevelText}>{skillDetails.level}%</div>
              </div>

              <div className={styles.skillDetailsDescription}>
                {getSkillDescription(skillDetails.name)}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Helper function getSkillDescription (updated with more detailed descriptions)
function getSkillDescription(skillName) {
    const descriptions = {
    // Cybersecurity
    'Penetration Testing': 'Execution of ethical hacking techniques to identify security vulnerabilities in systems, networks, and web applications. Expertise in using tools like Metasploit, Burp Suite, and custom exploit development.',
    'Vulnerability Assessment': 'Systematic evaluation of security weaknesses in information systems through both automated scanning and manual testing methods. Proficient in risk ranking and developing remediation recommendations.',
    'MITRE ATT&CK Framework': 'Application of the MITRE ATT&CK knowledge base to model adversary tactics, techniques, and procedures. Used for threat intelligence correlation and security control mapping.',
    'Incident Response': 'Implementation of comprehensive incident handling procedures from detection through containment, eradication, and recovery. Experienced in developing playbooks and conducting post-incident analysis.',
    'Threat Hunting': 'Proactive searching through networks and datasets to detect and isolate advanced threats that evade existing security solutions. Skilled in crafting custom detection rules and threat hypotheses.',
    'Digital Forensics': 'Collection, preservation, and analysis of digital evidence using forensically sound methods. Experience with memory forensics, disk imaging, and artifact analysis.',
    'Exploit Development': 'Creation of custom exploits targeting discovered vulnerabilities to validate security risks. Includes fuzzing, reverse engineering, and payload development.',
    'Security Monitoring (Splunk)': 'Design and management of security monitoring solutions using Splunk SIEM. Creation of custom dashboards, alerts, and correlation rules to detect security incidents.',

    // Frontend
    'React/Redux': 'Development of complex web applications using React component architecture and Redux state management. Implementation of performance optimizations and modern React patterns (hooks, context, etc).',
    'JavaScript/ES6+': 'Expert-level JavaScript programming using modern ES6+ features including async/await, destructuring, modules, and functional programming concepts.',
    'HTML5/CSS3': 'Creation of semantic, accessible markup and responsive designs using advanced CSS features including Grid, Flexbox, CSS variables, and animations.',
    'TypeScript': 'Implementation of type-safe JavaScript applications using TypeScript to improve code reliability, maintainability, and developer experience.',
    'Responsive Design': 'Development of fluid layouts that adapt seamlessly across all devices using mobile-first approach, media queries, and responsive frameworks.',
    'React Native': 'Building cross-platform mobile applications with React Native that deliver near-native performance while sharing code between platforms.',
    'UI/UX Principles': 'Application of user interface and experience design principles to create intuitive, accessible, and aesthetically pleasing applications.',
    'Web Accessibility': 'Implementation of WCAG guidelines to ensure applications are usable by people with diverse abilities. Experience with screen reader testing and accessibility audits.',

    // Backend
    'Python': 'Advanced Python development with deep understanding of the language ecosystem. Experience with data processing, web backends, security tooling, and automation scripts.',
    'Flask': 'Building scalable web applications and microservices using Flask framework. Implementation of robust APIs, authentication systems, and database integrations.',
    'Node.js': 'Server-side JavaScript development using Node.js runtime for building high-performance network applications with event-driven, non-blocking architecture.',
    'Express': 'Creation of web applications and RESTful APIs using Express.js framework with middleware patterns for authentication, validation, and error handling.',
    'RESTful API Design': 'Designing and implementing APIs following REST architectural constraints with proper resource modeling, status codes, and versioning strategies.',
    'API Security': 'Implementation of security best practices for APIs including authentication, authorization, rate limiting, input validation, and protection against common attacks.',
    'Shell Scripting': 'Writing Bash and PowerShell scripts for system automation, deployment tasks, and security operations. Experienced in creating maintainable, robust scripts.',
    'Microservices Architecture': 'Design and implementation of distributed systems using microservices architecture patterns. Familiar with service discovery, API gateways, and inter-service communication.',

    // DevOps
    'Docker': 'Containerization of applications using Docker for consistent development, testing, and production environments. Creation of optimized multi-stage builds and custom images.',
    'Kubernetes': 'Orchestration of containerized applications for automated deployment, scaling, and management. Experience with deployment strategies, service configuration, and persistent volumes.',
    'CI/CD Pipelines': 'Implementation of continuous integration and delivery pipelines to automate building, testing, and deployment processes. Focused on security-centric pipelines with automated scanning.',
    'GitHub Actions': 'Configuration of GitHub Actions workflows for automated testing, building, and deployment of applications. Implementation of complex multi-stage workflows.',
    'Infrastructure as Code': 'Management of infrastructure through declarative configuration files using tools like Terraform and CloudFormation. Experience with version-controlled infrastructure.',
    'Linux Administration': 'System administration of Linux servers including user management, service configuration, performance tuning, and security hardening.',
    'Nginx/Apache Configuration': 'Setup and optimization of web servers for performance, security, and high availability. Implementation of SSL/TLS, load balancing, and reverse proxy configurations.',
    'DevSecOps Practices': 'Integration of security practices into DevOps pipelines including SAST/DAST scanning, dependency checking, and compliance automation.',

    // Cloud
    'AWS EC2/S3': 'Management of virtual servers (EC2) and object storage (S3) on Amazon Web Services. Experience with autoscaling, load balancing, and secure storage configurations.',
    'AWS CloudFront': 'Implementation of content delivery networks using CloudFront to improve application performance and reduce latency with appropriate security configurations.',
    'AWS CloudWatch': 'Setting up comprehensive monitoring, logging, and alerting using CloudWatch services. Creation of custom metrics and dashboards for system health and security.',
    'AWS WAF & Shield': 'Configuration of Web Application Firewall rules and DDoS protection services to secure applications from common web vulnerabilities and attacks.',
    'AWS EventBridge': 'Implementation of event-driven architectures using EventBridge for serverless applications. Creation of event rules and targets for application integration.',
    'AWS IAM': 'Management of identity and access using the principle of least privilege. Implementation of role-based access control and secure key management.',
    'Serverless Architecture': 'Design and development of applications using serverless computing models with AWS Lambda, API Gateway, and other FaaS platforms.',
    'Cloud Security Best Practices': 'Implementation of security controls and configurations specific to cloud environments, including network security, data protection, and access management.',

    // Security Governance
    'ISO 27001': 'Implementation and management of information security programs aligned with ISO 27001 framework. Experience with risk assessment, controls implementation, and audit preparation.',
    'NIST 800-53': 'Application of NIST 800-53 security controls to ensure compliance with federal information security standards. Mapping of controls to technical implementations.',
    'Risk Assessment': 'Conducting comprehensive risk assessments to identify, analyze, and prioritize security risks. Development of risk treatment plans and mitigation strategies.',
    'Security Policy Development': 'Creation of security policies, standards, and procedures aligned with industry frameworks and organizational requirements.',
    'Compliance Frameworks': 'Implementation of security controls to meet regulatory requirements such as GDPR, HIPAA, PCI DSS, and SOC 2. Experience with compliance gap analysis.',
    'COBIT Implementation': 'Application of COBIT framework for IT governance and management. Alignment of IT objectives with business goals and risk management.',
    'ITIL Best Practices': 'Implementation of ITIL service management practices with a focus on security service management, incident response, and problem management.',
    'Security Auditing': 'Performing internal security audits to assess control effectiveness and identify gaps. Preparation and support for external security audits.',

    // Networking
    'TCP/IP Protocol Suite': 'Deep understanding of TCP/IP protocols and their security implications. Experience with packet analysis and network traffic inspection.',
    'Firewalls & IDS/IPS': 'Configuration and management of network security controls including firewalls, intrusion detection, and prevention systems. Implementation of rule sets and signature management.',
    'VPN Implementation': 'Deployment of secure VPN solutions including site-to-site and remote access configurations. Experience with OpenVPN, IPsec, and other protocols.',
    'Zero Trust Architecture': 'Implementation of zero trust security models that verify all users and devices regardless of location. Application of "never trust, always verify" principles.',
    'Network Security': 'Design and implementation of secure network architectures including segmentation, defense-in-depth strategies, and secure communications.',
    'DNS Management': 'Configuration and security of Domain Name Systems including DNSSEC, SPF, DKIM, and DMARC to prevent DNS attacks and email spoofing.',
    'SSL/TLS Implementation': 'Management of cryptographic protocols to secure communications. Experience with certificate management, cipher selection, and protocol configuration.',
    'Network Monitoring': 'Implementation of network monitoring tools and techniques to detect anomalies, performance issues, and security incidents. Experience with NetFlow analysis and traffic baselining.'
  };

  return descriptions[skillName] || 'A specialized technology skill in the selected category.';
}

TechStackGalaxy.propTypes = {
  fullPage: PropTypes.bool
};

export default TechStackGalaxy;
