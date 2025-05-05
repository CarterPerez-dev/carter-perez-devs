import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';
import styles from './AITerminal.module.css'; // Import the CSS module

// Terminal commands
const COMMANDS = {
  HELP: 'help',
  CLEAR: 'clear',
  ABOUT: 'about',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CONTACT: 'contact',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  CERTIFICATIONS: 'certifications',
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  RESUME: 'resume',
  ECHO: 'echo',
  WHOIS: 'whois',
  LS: 'ls',
  DATE: 'date',
  TIME: 'time',
  ASK: 'ask',
  EXIT: 'exit',
  THEME: 'theme',
  MATRIX: 'matrix',
  HACK: 'hack',
  QUOTE: 'quote'
};

// Terminal history entries
const WELCOME_MESSAGE = `
███████╗██╗   ██╗ ██████╗████████╗███████╗███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
███████╗ ╚████╔╝ ╚█████╗    ██║   █████╗  ██╔████╔██║
╚════██║  ╚██╔╝   ╚═══██╗   ██║   ██╔══╝  ██║╚██╔╝██║
███████║   ██║   ██████╔╝   ██║   ███████╗██║ ╚═╝ ██║
╚══════╝   ╚═╝   ╚═════╝    ╚═╝   ╚══════╝╚═╝     ╚═╝
                                                     
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                                                                  
v1.0.0 - Neural Interface Active

Welcome to the Interactive Neural Terminal.
This terminal allows direct communication with the portfolio system.
Type 'help' to see available commands or 'ask' followed by a question.

[System] Connection established. Terminal ready.
`;

// Cyber quotes array
const CYBER_QUOTES = [
  "The future is already here – it's just not evenly distributed. - William Gibson",
  "Information wants to be free. - Stewart Brand",
  "In the face of ambiguity, refuse the temptation to guess. - The Zen of Python",
  "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
  "The best way to predict the future is to invent it. - Alan Kay",
  "Security is always excessive until it's not enough. - Robbie Sinclair",
  "Privacy is not something that I'm merely entitled to, it's an absolute prerequisite. - Marlon Brando",
  "The quieter you become, the more you can hear. - Ram Dass",
  "There is no security on this earth; there is only opportunity. - Douglas MacArthur",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci"
];

const AITerminal = () => {
  const { theme, toggleTheme } = useTheme();
  const { playSound } = useAudio();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([{ type: 'system', content: WELCOME_MESSAGE }]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHackProgress, setShowHackProgress] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixCharacters, setMatrixCharacters] = useState([]);
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  
  // Focus input on component mount
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);
  
  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user input to history
    const userInput = input.trim();
    setHistory(prev => [...prev, { type: 'user', content: userInput }]);
    setInput('');
    playSound('click');
    
    // Process command
    await processCommand(userInput);
  };
  
  // Process terminal commands
  const processCommand = async (command) => {
    // Convert to lowercase and split into parts
    const parts = command.toLowerCase().split(' ');
    const mainCommand = parts[0];
    const args = parts.slice(1).join(' ');
    
    // Simulate processing time
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    setIsLoading(false);
    
    // Process based on command
    switch (mainCommand) {
      case COMMANDS.HELP:
        displayHelp();
        break;
      case COMMANDS.CLEAR:
        clearTerminal();
        break;
      case COMMANDS.ABOUT:
        displayAbout();
        break;
      case COMMANDS.SKILLS:
        displaySkills();
        break;
      case COMMANDS.PROJECTS:
        displayProjects();
        break;
      case COMMANDS.CONTACT:
        displayContact();
        break;
      case COMMANDS.EXPERIENCE:
        displayExperience();
        break;
      case COMMANDS.EDUCATION:
        displayEducation();
        break;
      case COMMANDS.CERTIFICATIONS:
        displayCertifications();
        break;
      case COMMANDS.GITHUB:
        openLink('https://github.com/username');
        break;
      case COMMANDS.LINKEDIN:
        openLink('https://linkedin.com/in/username');
        break;
      case COMMANDS.RESUME:
        displayResume();
        break;
      case COMMANDS.ECHO:
        echoText(args);
        break;
      case COMMANDS.WHOIS:
        displayWhois();
        break;
      case COMMANDS.LS:
        displayLs();
        break;
      case COMMANDS.DATE:
      case COMMANDS.TIME:
        displayDateTime();
        break;
      case COMMANDS.ASK:
        await handleAskCommand(args);
        break;
      case COMMANDS.EXIT:
        handleExit();
        break;
      case COMMANDS.THEME:
        handleTheme();
        break;
      case COMMANDS.MATRIX:
        startMatrix();
        break;
      case COMMANDS.HACK:
        startHack(args);
        break;
      case COMMANDS.QUOTE:
        displayQuote();
        break;
      default:
        displayUnknownCommand(mainCommand);
    }
  };
  
  // Terminal command handlers
  
  const displayHelp = () => {
    const helpMessage = `
Available commands:

NAVIGATION & INFO:
  help              - Display this help message
  about             - About the developer
  skills            - List technical skills
  projects          - View featured projects
  experience        - Show work experience
  education         - Display educational background
  certifications    - Show earned certifications
  
CONTACT & LINKS:
  contact           - Display contact information
  github            - Open GitHub profile
  linkedin          - Open LinkedIn profile
  resume            - View resume information
  
TERMINAL CONTROLS:
  clear             - Clear terminal screen
  echo [text]       - Echo text back to terminal
  whois             - Display information about the system
  ls                - List available sections
  date / time       - Display current date and time
  ask [question]    - Ask a question about me (AI-powered)
  theme             - Toggle light/dark theme
  exit              - Exit terminal mode
  
FUN COMMANDS:
  matrix            - Display Matrix effect (type any key to exit)
  hack [target]     - Simulate hacking (for fun)
  quote             - Display a random cyber quote
`;
    setHistory(prev => [...prev, { type: 'system', content: helpMessage }]);
  };
  
  const clearTerminal = () => {
    setHistory([{ type: 'system', content: 'Terminal cleared.' }]);
  };
  
  const displayAbout = () => {
    const aboutMessage = `
=== ABOUT ME ===

Name: Carter Rush Perez
Age: 21
Location: Annapolis, MD

I am a system integration technician with a passion for cybersecurity, 
currently working at Sealing Technologies. I focus on building and 
configuring custom cybersecurity and defense systems, ensuring they 
meet client needs and perform reliably under demanding conditions.

With expertise in both hardware integration and software development, 
I bring a holistic approach to creating secure technological solutions. 
My background in multiple CompTIA certifications and ongoing education 
in cybersecurity reinforces my commitment to staying at the forefront 
of the rapidly evolving security landscape.

When not working on technological challenges, I enjoy strength training, 
swimming, and the occasional cliff jumping for an adrenaline rush.
`;
    setHistory(prev => [...prev, { type: 'system', content: aboutMessage }]);
  };
  
  const displaySkills = () => {
    const skillsMessage = `
=== TECHNICAL SKILLS ===

CYBERSECURITY:
  • Risk Assessment and Threat Mitigation
  • Compliance with ISO 27001 and 9001:2015
  • Role-Based Access Controls
  • Encryption Best Practices
  • Incident Response Planning

DEVELOPMENT:
  • Languages: Python, JavaScript, HTML, CSS, Shell Scripting
  • Frameworks: React, Flask
  • Databases: MongoDB
  • Containerization: Docker
  • Web Servers: Nginx, Apache

NETWORKING:
  • TCP/IP, DNS, DHCP
  • Firewalls (UFW, iptables)
  • Secure Network Configurations
  • SSH Encryption
  • Virtual Private Networks (VPNs)

CLOUD:
  • AWS Security (EC2, S3, WAF, Shield, ACM)
  • Cloud Resource Optimization
  • TLS/SSL Implementation

ADDITIONAL:
  • System Hardening and Security
  • DevOps/DevSecOps Pipelines
  • Log Analysis (Splunk)
  • Virtualization
`;
    setHistory(prev => [...prev, { type: 'system', content: skillsMessage }]);
  };
  
  const displayProjects = () => {
    const projectsMessage = `
=== FEATURED PROJECTS ===

1. ProxyAuthRequired.com
   A centralized cybersecurity platform integrating AI-driven simulations
   and learning modules. Features include GRC Wizard for compliance questions,
   Log Analysis for real-time practice, and scenario-based exercises 
   for incident response.
   [Technologies: React, Python, Flask, MongoDB, Docker]

2. CertsGamified
   A gamified platform for certification preparation. Follow structured
   roadmaps to learn, practice, and master certifications like CompTIA.
   Earn XP, unlock badges, and track your progress.
   [Technologies: React, Node.js, MongoDB, Express]

3. Cyber Labs
   Hands-on labs for penetration testing and system hardening, providing
   practical training environments for cybersecurity enthusiasts.
   [Technologies: Docker, Kali Linux, Python, Bash]

4. AutoApplication
   An automated application bot for Indeed and LinkedIn, streamlining the
   job application process with web automation and scripting.
   [Technologies: Python, Selenium, BeautifulSoup]

Type 'projects [number]' to get more details about a specific project.
`;
    setHistory(prev => [...prev, { type: 'system', content: projectsMessage }]);
  };
  
  const displayContact = () => {
    const contactMessage = `
=== CONTACT INFORMATION ===

Email: CarterPerez-dev@ProxyAuthRequired.com
Phone: 443-510-0866

Social Links:
  • GitHub:   https://github.com/CarterPerez-dev
  • LinkedIn: https://www.linkedin.com/in/carterperez-dev/

Preferred Contact Method: Email

Feel free to reach out for collaboration opportunities, consulting,
or just to connect about cybersecurity and development topics.
`;
    setHistory(prev => [...prev, { type: 'system', content: contactMessage }]);
  };
  
  const displayExperience = () => {
    const experienceMessage = `
=== WORK EXPERIENCE ===

SYSTEM INTEGRATION TECHNICIAN II | Sealing Technologies
2024 - Present | Annapolis, MD
- Build and configure custom cybersecurity and defense systems
- Perform quality assurance testing and system optimization
- Collaborate with cross-functional teams for solution delivery
- Maintain detailed documentation for all build processes

GENERAL MANAGER | Jimmy John's
2022 - 2024 | Severna Park, MD
- Managed daily operations and supervised staff
- Ensured efficient workflows and high customer satisfaction
- Maintained network and POS systems functionality
- Implemented new inventory procedures to reduce waste
`;
    setHistory(prev => [...prev, { type: 'system', content: experienceMessage }]);
  };
  
  const displayEducation = () => {
    const educationMessage = `
=== EDUCATION ===

MASTER'S DEGREE IN CYBERSECURITY
University of Maryland Global Campus | 2024 - Present
- Focus on advanced security protocols and threat intelligence
- Maintaining a 3.9 GPA while working full-time
- Participating in cybersecurity research initiatives


SOUTH RIVER HIGH SCHOOL
2018 - 2022
- Focus on science and mathematics
- Participated in STEM-related extracurriculars
`;
    setHistory(prev => [...prev, { type: 'system', content: educationMessage }]);
  };
  
  const displayCertifications = () => {
    const certificationsMessage = `
=== CERTIFICATIONS ===

COMPTIA CERTIFICATIONS:
- CompTIA A+
- CompTIA Network+
- CompTIA Security+
- CompTIA CySA+
- CompTIA PenTest+
- CompTIA CASP+

ADDITIONAL CERTIFICATIONS:
- PCEP (Certified Entry-Level Python Programmer)

All CompTIA certifications were achieved within a nine-month period,
with an average of two weeks study time for each.

STUDY METHODS:
- Watching Professor Messer's tutorials
- Using ChatGPT to enhance understanding
- Employing the PQR method
- Maintaining confidence throughout the process
`;
    setHistory(prev => [...prev, { type: 'system', content: certificationsMessage }]);
  };
  
  const openLink = (url) => {
    const linkMessage = `Opening ${url} in a new tab...`;
    setHistory(prev => [...prev, { type: 'system', content: linkMessage }]);
    window.open(url, '_blank');
  };
  
  const displayResume = () => {
    const resumeMessage = `
=== RESUME INFORMATION ===

My resume includes detailed information about my:
- Work experience
- Educational background
- Technical skills
- Certifications
- Projects
- Contact details

You can view or download my complete resume by:
1. Clicking the "RESUME" link in the navigation menu
2. Visiting: /assets/CarterPerez.pdf directly
3. Using the command 'open resume' to open it in a new tab

The resume is available in PDF format and showcases my
qualifications for cybersecurity and technical roles.
`;
    setHistory(prev => [...prev, { type: 'system', content: resumeMessage }]);
  };
  
  const echoText = (text) => {
    if (!text) {
      setHistory(prev => [...prev, { type: 'system', content: 'Usage: echo [text]' }]);
      return;
    }
    
    setHistory(prev => [...prev, { type: 'system', content: text }]);
  };
  
  const displayWhois = () => {
    const whoisMessage = `
=== SYSTEM INFORMATION ===

Terminal: Neural Interface Terminal v1.0.0
Developer: Carter Rush Perez
Framework: React v18.3.1
Architecture: Cyberpunk-inspired Single Page Application
Creation Date: 2025
Purpose: Interactive portfolio demonstration
Features: Dynamic command processing, AI interaction, visual effects

Current Status: ONLINE
Server Location: AWS us-east-1
Security Protocol: TLS 1.3, HSTS Enabled
Last Updated: ${new Date().toLocaleDateString()}
`;
    setHistory(prev => [...prev, { type: 'system', content: whoisMessage }]);
  };
  
  const displayLs = () => {
    const lsMessage = `
DIRECTORY CONTENTS:

drwxr-xr-x  about/
drwxr-xr-x  projects/
drwxr-xr-x  skills/
drwxr-xr-x  experience/
drwxr-xr-x  education/
drwxr-xr-x  certifications/
drwxr-xr-x  contact/
-rw-r--r--  resume.pdf
-rw-r--r--  README.md
-rw-r--r--  .terminal_config
-rw-r--r--  .env
`;
    setHistory(prev => [...prev, { type: 'system', content: lsMessage }]);
  };
  
  const displayDateTime = () => {
    const now = new Date();
    const dateTimeMessage = `Current Date & Time: ${now.toLocaleString()}`;
    setHistory(prev => [...prev, { type: 'system', content: dateTimeMessage }]);
  };
  
  const handleAskCommand = async (question) => {
    if (!question) {
      setHistory(prev => [...prev, { 
        type: 'system', 
        content: 'Usage: ask [question]\nExample: ask What are your favorite programming languages?' 
      }]);
      return;
    }
    
    // Show loading
    setHistory(prev => [...prev, { type: 'loading', content: 'Processing your question...' }]);
    
    try {
      // Make API call to backend
      const response = await fetch('/api/portfolio/ask_about_me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Remove loading message and add AI response
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { type: 'ai', content: data.answer }];
      });
      
    } catch (error) {
      // Handle error
      console.error('Error fetching AI response:', error);
      
      // Remove loading message and add error message
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'error', 
          content: 'Sorry, I encountered an error processing your question. Please try again later.' 
        }];
      });
    }
  };
  
  const handleExit = () => {
    const exitMessage = 'Exiting terminal mode. Redirecting to home page...';
    setHistory(prev => [...prev, { type: 'system', content: exitMessage }]);
    
    // Redirect after delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };
  
  const handleTheme = () => {
    toggleTheme();
    const themeMessage = `Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode.`;
    setHistory(prev => [...prev, { type: 'system', content: themeMessage }]);
  };
  
  const startMatrix = () => {
    setShowMatrix(true);
    
    // Generate initial matrix characters
    const chars = [];
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
      chars.push({
        x: i * 20,
        y: Math.floor(Math.random() * -100),
        speed: Math.random() * 10 + 5,
        value: getRandomMatrixChar()
      });
    }
    
    setMatrixCharacters(chars);
    
    // Add exit message to history
    setHistory(prev => [...prev, { 
      type: 'system', 
      content: 'Matrix mode activated. Press any key to exit.' 
    }]);
  };
  
  const getRandomMatrixChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };
  
  const startHack = (target) => {
    if (!target) {
      setHistory(prev => [...prev, { 
        type: 'system', 
        content: 'Usage: hack [target]\nExample: hack firewall' 
      }]);
      return;
    }
    
    setShowHackProgress(true);
    setHackProgress(0);
    
    const hackMessages = [
      `Initiating hack on ${target}...`,
      `Scanning ${target} for vulnerabilities...`,
      `Vulnerabilities found. Exploiting entry points...`,
      `Bypassing security protocols...`,
      `Injecting payload into ${target}...`,
      `Establishing backdoor connection...`,
      `Extracting data from ${target}...`,
      `Covering tracks and removing logs...`,
      `Hack successful. Access granted to ${target}.`
    ];
    
    // Add initial message
    setHistory(prev => [...prev, { type: 'system', content: hackMessages[0] }]);
    
    // Progress simulation
    let currentMessage = 1;
    const intervalId = setInterval(() => {
      setHackProgress(prev => {
        const newProgress = prev + (Math.random() * 5) + 2;
        
        // Add new message at certain progress points
        if (currentMessage < hackMessages.length && newProgress >= (currentMessage * 100) / hackMessages.length) {
          setHistory(prev => [...prev, { type: 'system', content: hackMessages[currentMessage] }]);
          currentMessage++;
        }
        
        // Complete hack
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            setShowHackProgress(false);
            
            // Add completion message if not already added
            if (currentMessage < hackMessages.length) {
              setHistory(prev => [...prev, { type: 'system', content: hackMessages[hackMessages.length - 1] }]);
            }
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  const displayQuote = () => {
    const randomQuote = CYBER_QUOTES[Math.floor(Math.random() * CYBER_QUOTES.length)];
    setHistory(prev => [...prev, { type: 'system', content: randomQuote }]);
  };
  
  const displayUnknownCommand = (command) => {
    const unknownMessage = `Command not found: ${command}\nType 'help' to see available commands.`;
    setHistory(prev => [...prev, { type: 'error', content: unknownMessage }]);
  };
  
  // Handle matrix animation
  useEffect(() => {
    if (!showMatrix) return;
    
    const animateMatrix = () => {
      setMatrixCharacters(prevChars => {
        return prevChars.map(char => {
          // Update y position
          let y = char.y + char.speed;
          
          // Reset if off-screen
          if (y > window.innerHeight) {
            y = Math.random() * -100;
          }
          
          // Occasionally change character
          const newChar = Math.random() > 0.9 ? getRandomMatrixChar() : char.value;
          
          return {
            ...char,
            y,
            value: newChar
          };
        });
      });
    };
    
    const intervalId = setInterval(animateMatrix, 100);
    
    // Exit matrix mode on any keypress
    const handleKeyPress = () => {
      setShowMatrix(false);
      setHistory(prev => [...prev, { type: 'system', content: 'Matrix mode deactivated.' }]);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showMatrix]);
  
  return (
    <section className={styles.terminalSection} id="terminal">
      <div className="container">
        <motion.h1 
          className={styles.pageTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Neural Interface Terminal
        </motion.h1>
        
        <motion.div 
          className={styles.terminalContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.terminalHeader}>
            <div className={styles.terminalTitle}>system.terminal</div>
            <div className={styles.terminalControls}>
              <div className={`${styles.terminalControl} ${styles.terminalMinimize}`}></div>
              <div className={`${styles.terminalControl} ${styles.terminalMaximize}`}></div>
              <div className={`${styles.terminalControl} ${styles.terminalClose}`}></div>
            </div>
          </div>
          
          <div className={styles.terminalWindow} ref={historyRef}>
            {history.map((entry, index) => (
              <div 
                key={index} 
                className={`${styles.terminalEntry} ${styles[`terminal${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}`]}`}
              >
                {entry.type === 'user' ? (
                  <>
                    <span className={styles.terminalPrompt}>
                      <span className={styles.promptUser}>user</span>
                      <span className={styles.promptAt}>@</span>
                      <span className={styles.promptHost}>neural-terminal</span>
                      <span className={styles.promptColon}>:</span>
                      <span className={styles.promptPath}>~</span>
                      <span className={styles.promptDollar}>$</span>
                    </span>
                    <span className={styles.terminalCommand}>{entry.content}</span>
                  </>
                ) : entry.type === 'loading' ? (
                  <div className={styles.terminalLoading}>
                    <span>{entry.content}</span>
                    <span className={styles.loadingDots}>...</span>
                  </div>
                ) : (
                  <pre className={styles.terminalOutput}>{entry.content}</pre>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.terminalEntry} ${styles.terminalLoading}`}>
                <span className="loading-text">Processing</span>
                <span className={styles.loadingDots}>...</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className={styles.terminalInputForm}>
            <span className={styles.terminalPrompt}>
              <span className={styles.promptUser}>user</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>neural-terminal</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>~</span>
              <span className={styles.promptDollar}>$</span>
            </span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.terminalInput}
              ref={inputRef}
              autoFocus
              disabled={isLoading || showMatrix}
            />
          </form>
          
          {showHackProgress && (
            <div className={styles.hackProgressContainer}>
              <div className={styles.hackProgressLabel}>
                <span>HACK PROGRESS:</span>
                <span className={styles.hackProgressPercent}>{Math.floor(hackProgress)}%</span>
              </div>
              <div className={styles.hackProgressBar}>
                <div 
                  className={styles.hackProgressFill}
                  style={{ width: `${hackProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>
        
        {showMatrix && (
          <div className={styles.matrixOverlay}>
            {matrixCharacters.map((char, index) => (
              <div 
                key={index}
                className={styles.matrixChar}
                style={{
                  left: `${char.x}px`,
                  top: `${char.y}px`
                }}
              >
                {char.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AITerminal;
