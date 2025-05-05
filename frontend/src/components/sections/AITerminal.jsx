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
      // Make API call to backend
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type, 
          prompt 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Remove loading message and add generated content
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'generate', 
          content: `Generated ${type} for: "${prompt}"\n\n${data.content}` 
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
      // Make API call to backend
      const response = await fetch('/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concept }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Remove loading message and add explanation
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'explain', 
          content: `Explanation of "${concept}":\n\n${data.explanation}` 
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
      // Make API call to backend
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          language,
          text
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Remove loading message and add translation
      setHistory(prev => {
        const filtered = prev.filter(item => item.type !== 'loading');
        return [...filtered, { 
          type: 'translate', 
          content: `Translation to ${language}:\n\nOriginal: "${text}"\nTranslated: "${data.translation}"` 
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
            
            {/* Visible input with cursor - Split into before cursor and after cursor parts */}
            <div className={styles.inputWrapper}>
              <span className={styles.inputText}>
                {displayText.substring(0, cursorPosition)}
                {isFocused && <span className={styles.cursorBlink}></span>}
                {displayText.substring(cursorPosition)}
              </span>
              
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
