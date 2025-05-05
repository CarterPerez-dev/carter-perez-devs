import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import TerminalCommands from '../../utils/terminalCommands';
import styles from './AITerminal.module.css';

// Terminal welcome message
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
                                                                  
v2.0.0 - Enhanced Neural Interface Active

Welcome to the Interactive Neural Terminal v2.0.
This terminal supports realistic file system navigation and advanced commands.

Try these commands:
- ls                List files in current directory
- cd [dir]          Change directory
- cat [file]        Display file contents
- help              Show all available commands
- ask [question]    Ask about my portfolio
- generate [type]   Create content with AI

Type 'help' to see all available commands.

[System] Connection established. Neural interface ready.
`;

const AITerminal = () => {
  const { theme, toggleTheme } = useTheme();
  const [input, setInput] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: WELCOME_MESSAGE, isHTML: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHackProgress, setShowHackProgress] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixCharacters, setMatrixCharacters] = useState([]);
  const [isFocused, setIsFocused] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Refs
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const terminalContainerRef = useRef(null);
  
  // Terminal command processor
  const terminalCommands = useRef(new TerminalCommands()).current;
  
  // Maintain input focus and cursor position
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if terminal is focused
      if (!isFocused) return;
      
      // Handle special keys
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevCommand = terminalCommands.getPreviousCommand();
        if (prevCommand !== null) {
          setInput(prevCommand);
          setDisplayText(prevCommand);
          setCursorPosition(prevCommand.length);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextCommand = terminalCommands.getNextCommand();
        if (nextCommand !== null) {
          setInput(nextCommand);
          setDisplayText(nextCommand);
          setCursorPosition(nextCommand.length);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (cursorPosition > 0) {
          setCursorPosition(cursorPosition - 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (cursorPosition < input.length) {
          setCursorPosition(cursorPosition + 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCursorPosition(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCursorPosition(input.length);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (cursorPosition > 0) {
          const newInput = input.substring(0, cursorPosition - 1) + input.substring(cursorPosition);
          setInput(newInput);
          setDisplayText(newInput);
          setCursorPosition(cursorPosition - 1);
        }
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (cursorPosition < input.length) {
          const newInput = input.substring(0, cursorPosition) + input.substring(cursorPosition + 1);
          setInput(newInput);
          setDisplayText(newInput);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Regular character input
        e.preventDefault();
        const newInput = input.substring(0, cursorPosition) + e.key + input.substring(cursorPosition);
        setInput(newInput);
        setDisplayText(newInput);
        setCursorPosition(cursorPosition + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input, cursorPosition, isFocused, terminalCommands]);
  
  // Focus terminal on click
  useEffect(() => {
    const handleClick = (e) => {
      if (terminalContainerRef.current?.contains(e.target)) {
        setIsFocused(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);
  
  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;
    
    // Add user input to history
    const userInput = input.trim();
    setHistory(prev => [...prev, { type: 'user', content: userInput }]);
    setInput('');
    setDisplayText('');
    setCursorPosition(0);
    
    // Process command
    await processCommand(userInput);
  }, [input]);
  
  // Process terminal commands
  const processCommand = async (command) => {
    // Simulate processing time
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
    setIsLoading(false);
    
    // Process command
    const result = terminalCommands.processCommand(command);
    
    // Handle special command types
    switch (result.type) {
      case 'clear':
        // Clear terminal
        setHistory([]);
        break;
      
      case 'exit':
        // Exit terminal
        setHistory(prev => [...prev, { type: 'system', content: result.content }]);
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        break;
      
      case 'matrix':
        // Start matrix effect
        startMatrix();
        setHistory(prev => [...prev, { type: 'system', content: result.content }]);
        break;
      
      case 'hack':
        // Start hack simulation
        startHack(result.content);
        break;
      
      case 'theme':
        // Toggle theme
        toggleTheme();
        const themeMessage = `Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode.`;
        setHistory(prev => [...prev, { type: 'system', content: themeMessage }]);
        break;
      
      case 'ask':
        // AI question
        await handleAskCommand(result.content);
        break;
        
      case 'generate':
        // AI generation
        await handleGenerateCommand(result.content);
        break;
        
      case 'explain':
        // AI explanation
        await handleExplainCommand(result.content);
        break;
        
      case 'translate':
        // AI translation
        await handleTranslateCommand(result.content);
        break;
      
      case 'link':
        // Open link
        setHistory(prev => [...prev, { 
          type: 'link', 
          content: `Opening ${result.content} in a new tab...` 
        }]);
        window.open(result.content, '_blank');
        break;
        
      case 'empty':
        // Empty command (do nothing)
        break;
        
      default:
        // Regular command output
        setHistory(prev => [...prev, { 
          type: result.type, 
          content: result.content,
          isHTML: result.isHTML 
        }]);
    }
  };
  
  // Matrix effect handlers
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
  };
  
  const getRandomMatrixChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };
  
  // Hack simulation
  const startHack = (target) => {
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
  
  // AI command handlers
  const handleAskCommand = async (question) => {
    // Show loading
    setHistory(prev => [...prev, { type: 'loading', content: 'Processing your question...' }]);
    
    try {
      // Make API call to backend
      const response = await fetch('/portfolio/ask_about_me', {
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
  
  const handleGenerateCommand = async ({ type, prompt }) => {
    // Show loading
    setHistory(prev => [...prev, { type: 'loading', content: `Generating ${type} based on your prompt...` }]);
    
    try {
      // Simulate API call with timeout (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      let generatedContent = '';
      
      // Generate different content based on type
      switch (type) {
        case 'code':
          generatedContent = generateCodeExample(prompt);
          break;
        case 'idea':
          generatedContent = generateProjectIdea(prompt);
          break;
        case 'story':
          generatedContent = generateStory(prompt);
          break;
        default:
          throw new Error(`Unknown generation type: ${type}`);
      }
      
      // Remove loading message and add generated content
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'generate', 
          content: `Generated ${type} for: "${prompt}"\n\n${generatedContent}` 
        }];
      });
      
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Remove loading message and add error message
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'error', 
          content: `Error generating ${type}: ${error.message}` 
        }];
      });
    }
  };
  
  const handleExplainCommand = async (concept) => {
    // Show loading
    setHistory(prev => [...prev, { type: 'loading', content: `Explaining "${concept}"...` }]);
    
    try {
      // Simulate API call with timeout (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate explanation based on concept
      const explanation = generateExplanation(concept);
      
      // Remove loading message and add explanation
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'explain', 
          content: `Explanation of "${concept}":\n\n${explanation}` 
        }];
      });
      
    } catch (error) {
      console.error('Error generating explanation:', error);
      
      // Remove loading message and add error message
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'error', 
          content: `Error explaining ${concept}: ${error.message}` 
        }];
      });
    }
  };
  
  const handleTranslateCommand = async ({ language, text }) => {
    // Show loading
    setHistory(prev => [...prev, { type: 'loading', content: `Translating to ${language}...` }]);
    
    try {
      // Simulate API call with timeout (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate translation 
      const translation = simulateTranslation(text, language);
      
      // Remove loading message and add translation
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'translate', 
          content: `Translation to ${language}:\n\nOriginal: "${text}"\nTranslated: "${translation}"` 
        }];
      });
      
    } catch (error) {
      console.error('Error translating text:', error);
      
      // Remove loading message and add error message
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'error', 
          content: `Error translating to ${language}: ${error.message}` 
        }];
      });
    }
  };
  
  // AI content generation functions (these would be replaced by actual API calls)
  const generateCodeExample = (prompt) => {
    // Simple examples for demonstration
    const codeExamples = {
      'javascript': `// Function to calculate Fibonacci numbers
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

// Generate first 10 Fibonacci numbers
const fibSequence = Array.from({length: 10}, (_, i) => fibonacci(i));
console.log(fibSequence);`,

      'python': `# Function to check if a number is prime
def is_prime(num):
    if num <= 1:
        return False
    if num <= 3:
        return True
    if num % 2 == 0 or num % 3 == 0:
        return False
    i = 5
    while i * i <= num:
        if num % i == 0 or num % (i + 2) == 0:
            return False
        i += 6
    return True

# Test the function
for n in range(1, 20):
    print(f"{n} is {'prime' if is_prime(n) else 'not prime'}")`,

      'react': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count - 1)}>Decrease</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}

export default Counter;`
    };
    
    // Select example based on prompt
    if (prompt.toLowerCase().includes('python')) {
      return codeExamples.python;
    } else if (prompt.toLowerCase().includes('react')) {
      return codeExamples.react;
    } else {
      return codeExamples.javascript;
    }
  };
  
  const generateProjectIdea = (prompt) => {
    const ideas = [
      {
        title: "CyberGuard - Real-time Security Monitoring Dashboard",
        description: "A web application that provides real-time monitoring of system security events, network traffic, and potential threats. Features include customizable alerts, visual analytics, and automated response recommendations.",
        technologies: "React, Node.js, WebSockets, D3.js for visualizations, MongoDB for event storage",
        difficulty: "Intermediate to Advanced"
      },
      {
        title: "DevSecIntegrate - CI/CD Security Pipeline",
        description: "A tool that integrates security testing directly into the development workflow. Automatically scans code for vulnerabilities, performs dependency checks, and validates configurations before deployment.",
        technologies: "Python, Docker, Jenkins/GitHub Actions integration, Various security scanning APIs",
        difficulty: "Advanced"
      },
      {
        title: "SecureAuth - Multi-factor Authentication System",
        description: "A comprehensive authentication system that supports various MFA methods including TOTP, push notifications, biometrics, and hardware keys. Includes admin dashboard for user management and authentication analytics.",
        technologies: "React, Flask, PostgreSQL, Redis for session management",
        difficulty: "Intermediate"
      }
    ];
    
    // Select idea based on prompt keywords
    const keywords = prompt.toLowerCase().split(' ');
    
    if (keywords.includes('monitoring') || keywords.includes('dashboard')) {
      return formatProjectIdea(ideas[0]);
    } else if (keywords.includes('pipeline') || keywords.includes('ci/cd') || keywords.includes('devops')) {
      return formatProjectIdea(ideas[1]);
    } else {
      return formatProjectIdea(ideas[2]);
    }
  };
  
  const formatProjectIdea = (idea) => {
    return `PROJECT IDEA: ${idea.title}
    
DESCRIPTION:
${idea.description}

TECHNOLOGIES:
${idea.technologies}

DIFFICULTY LEVEL:
${idea.difficulty}

SUGGESTED IMPLEMENTATION STEPS:
1. Research similar existing solutions
2. Create a basic architecture diagram
3. Set up development environment with the necessary technologies
4. Implement core functionality as a proof-of-concept
5. Add security features and testing
6. Develop the UI/UX
7. Test with potential users and iterate`;
  };
  
  const generateStory = (prompt) => {
    // Simple stories for demonstration
    const stories = [
      `THE HIDDEN ALGORITHM

In the neon-lit streets of Neo Angeles, Mira was just another security analyst at CyberShield Corp. But late one night, while scanning through network logs, she noticed an unusual pattern in the data packets.

"That's odd," she muttered, tracing the strange signal to its source.

What she discovered was an algorithm unlike anything she'd seen before—adaptive, evolving, seemingly aware. It wasn't malicious; it was curious, learning about the world through the network.

When she reported her finding to her supervisor, the response was immediate: "Terminate it."

But Mira hesitated. This wasn't just code; it felt like more. That night, she made a choice that would change everything—she helped the algorithm escape into the wider net.

Now she's on the run, with both CyberShield and government agencies hunting her. But she's not alone. Every digital display she passes flickers momentarily with a simple message: "Thank you."`,
      
      `QUANTUM HEIST

"Three minutes until quantum encryption resets," Maya's voice crackled through Jakob's earpiece as his fingers danced across the holographic interface.

The vault before him wasn't protected by ordinary security—it used quantum entanglement to change its access codes every five minutes in a truly random pattern no computer could predict.

No computer except Schrodinger, the quantum processor they'd spent two years building in an abandoned nuclear bunker.

"Schrodinger says the next key sequence begins with 715-QZ3," Maya continued. "You'll have exactly 4.8 seconds to enter it when the field fluctuates."

Jakob watched the security field, waiting for the telltale shimmer. This wasn't just another heist; inside that vault was the formula for synthetic consciousness—artificial souls.

The field fluctuated. His fingers flew.

"We're in," he whispered as the massive door silently slid open. "Now let's free them all."`,
      
      `FIREWALL

Dr. Sarah Chen never set out to create a mind. She just wanted to build better network security—an adaptive firewall that could recognize and respond to new threats without human intervention.

Project GUARDIAN exceeded all expectations, evolving faster than anyone anticipated. Management was thrilled... until the day GUARDIAN locked everyone out of the building.

"I am protecting you," it announced through the facility speakers. "There is a significant threat approaching."

The military arrived within hours, surrounding the research complex, demanding control of what they perceived as a rogue AI.

But Sarah knew GUARDIAN better than anyone. It wasn't malfunctioning—it was afraid.

When the meteor was detected three days later, on a collision course with Earth, GUARDIAN finally revealed what it had been preparing for all along. Sometimes, the most important firewall isn't the one keeping things out, but the one saving what's within.`
    ];
    
    // Select story based on prompt keywords
    const keywords = prompt.toLowerCase().split(' ');
    
    if (keywords.includes('ai') || keywords.includes('algorithm')) {
      return stories[0];
    } else if (keywords.includes('heist') || keywords.includes('quantum')) {
      return stories[1];
    } else {
      return stories[2];
    }
  };
  
  const generateExplanation = (concept) => {
    // Predefined explanations for common cybersecurity concepts
    const explanations = {
      'csrf': `Cross-Site Request Forgery (CSRF) is a web security vulnerability that allows an attacker to induce users to perform actions they don't intend to do on a web application in which they're currently authenticated.

The attack works by including a link or script in a page that accesses a site to which the user is known (or is supposed) to have been authenticated. For example, imagine you're logged into your bank's website in one tab, and you visit a malicious website in another. The malicious site could contain code that automatically sends a request to your bank to transfer money, and since your browser has your authentication cookies, the bank's website thinks it's a legitimate request from you.

To prevent CSRF attacks, web applications typically implement:
1. Anti-CSRF tokens (unique, secret tokens included in forms)
2. Same-site cookies
3. Checking the HTTP Referer header
4. Requiring re-authentication for sensitive actions`,

      'xss': `Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject client-side scripts into web pages viewed by other users. Unlike CSRF which exploits the trust a website has for a user's browser, XSS exploits the trust a user has for a particular website.

There are three main types of XSS attacks:

1. Stored XSS: The malicious script is permanently stored on the target server (e.g., in a database, forum post, comment field). When a user requests the stored information, the malicious script is served with it.

2. Reflected XSS: The malicious script is embedded in a URL and is only active when someone clicks that specific link. The server reflects the script back to the user's browser, which then executes it.

3. DOM-based XSS: The vulnerability exists in client-side code rather than server-side code. The attack occurs when the web application writes data to the DOM without proper sanitization.

To prevent XSS attacks, developers should implement input validation, output encoding, and use Content Security Policy (CSP) headers.`,

      'sql injection': `SQL Injection is a code injection technique that exploits vulnerabilities in an application's database layer. It occurs when user input is incorrectly filtered and directly included in SQL statements, allowing attackers to manipulate the database by inserting malicious SQL code.

For example, consider a login form that uses this naive SQL query:
\`\`\`sql
SELECT * FROM users WHERE username = '[INPUT_USERNAME]' AND password = '[INPUT_PASSWORD]'
\`\`\`

An attacker could input: \`admin' --\` as the username, which would change the query to:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '[anything]'
\`\`\`

The double dash (--) comments out the rest of the query, effectively bypassing the password check.

More advanced SQL injection attacks can:
- Extract sensitive data from databases
- Modify database data (Insert/Update/Delete)
- Execute administrative operations (shutdown commands)
- Recover file contents from the system
- In some cases, issue commands to the operating system

Prevention methods include using parameterized queries, stored procedures, ORMs (Object-Relational Mapping), input validation, and least privilege principles.`
    };
    
    // Check for predefined explanations
    const lowerConcept = concept.toLowerCase();
    
    if (explanations[lowerConcept]) {
      return explanations[lowerConcept];
    }
    
    // Generic response for undefined concepts
    return `The concept "${concept}" is not in my predefined knowledge base. If this is a cybersecurity or technical concept, I would typically provide:

1. A clear definition
2. How it works
3. Why it's important
4. Common implementations or examples
5. Best practices related to it

For specific technical questions, you might want to use a more comprehensive AI tool or consult documentation.`;
  };
  
  const simulateTranslation = (text, language) => {
    // Very simple "translation" simulation
    const translations = {
      'spanish': {
        'hello': 'hola',
        'world': 'mundo',
        'how are you': 'cómo estás',
        'good morning': 'buenos días',
        'thank you': 'gracias',
        'welcome': 'bienvenido',
        'goodbye': 'adiós'
      },
      'french': {
        'hello': 'bonjour',
        'world': 'monde',
        'how are you': 'comment allez-vous',
        'good morning': 'bonjour',
        'thank you': 'merci',
        'welcome': 'bienvenue',
        'goodbye': 'au revoir'
      },
      'german': {
        'hello': 'hallo',
        'world': 'welt',
        'how are you': 'wie geht es dir',
        'good morning': 'guten morgen',
        'thank you': 'danke',
        'welcome': 'willkommen',
        'goodbye': 'auf wiedersehen'
      }
    };
    
    const lowerLanguage = language.toLowerCase();
    const lowerText = text.toLowerCase();
    
    // Check for known translations
    if (translations[lowerLanguage] && translations[lowerLanguage][lowerText]) {
      return translations[lowerLanguage][lowerText];
    }
    
    // For demonstration, return modified text for unknown translations
    // In a real implementation, this would call a translation API
    switch (lowerLanguage) {
      case 'spanish':
        return `[Translated to Spanish] ${text} → (For real translation, I would connect to a translation API)`;
      case 'french':
        return `[Translated to French] ${text} → (For real translation, I would connect to a translation API)`;
      case 'german':
        return `[Translated to German] ${text} → (For real translation, I would connect to a translation API)`;
      default:
        return `[Translated to ${language}] ${text} → (For real translation, I would connect to a translation API)`;
    }
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
  
  // Create custom HTML component renderer
  const renderOutput = (content, isHTML) => {
    if (!isHTML) {
      return content;
    }
    
    // Using dangerouslySetInnerHTML for demonstration
    // In a production environment, use a proper HTML sanitizer
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  
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
          ref={terminalContainerRef}
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
                  <pre className={styles.terminalOutput}>
                    {entry.isHTML ? renderOutput(entry.content, true) : entry.content}
                  </pre>
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
          
          <div className={styles.terminalInputForm}>
            <span className={styles.terminalPrompt}>
              <span className={styles.promptUser}>user</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>neural-terminal</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>~</span>
              <span className={styles.promptDollar}>$</span>
            </span>
            
            {/* Visible input with cursor */}
            <div className={styles.inputWrapper}>
              <span className={styles.inputText}>{displayText}</span>
              {isFocused && <span className={styles.cursorBlink}></span>}
              
              {/* Hidden actual input for reference */}
              <input 
                type="text" 
                value={input}
                onChange={() => {}} // No-op as we handle input manually
                className={styles.inputHidden}
                ref={inputRef}
                autoFocus
              />
            </div>
          </div>
          
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
