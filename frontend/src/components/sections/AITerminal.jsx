import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import TerminalCommands from '../../utils/terminalCommands';
import styles from './css/AITerminal.module.css';
import { debounce } from '../../utils/performance';

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

// Maximum number of history items to render
const MAX_VISIBLE_HISTORY = 50;

// Memoized terminal output component for better performance
const TerminalEntry = memo(({ entry }) => {
  // Only render HTML content if it's explicitly marked as HTML
  const renderOutput = (content, isHTML) => {
    if (!isHTML) {
      return content;
    }
    
    // Using dangerouslySetInnerHTML for demonstration
    // In a production environment, use a proper HTML sanitizer
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  if (entry.type === 'user') {
    return (
      <div className={`${styles.terminalEntry} ${styles.terminalUser}`}>
        <span className={styles.terminalPrompt}>
          <span className={styles.promptUser}>user</span>
          <span className={styles.promptAt}>@</span>
          <span className={styles.promptHost}>neural-terminal</span>
          <span className={styles.promptColon}>:</span>
          <span className={styles.promptPath}>~</span>
          <span className={styles.promptDollar}>$</span>
        </span>
        <span className={styles.terminalCommand}>{entry.content}</span>
      </div>
    );
  } else if (entry.type === 'loading') {
    return (
      <div className={`${styles.terminalEntry} ${styles.terminalLoading}`}>
        <span>{entry.content}</span>
        <span className={styles.loadingDots}>...</span>
      </div>
    );
  } else {
    return (
      <div className={`${styles.terminalEntry} ${styles[`terminal${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}`]}`}>
        <pre className={styles.terminalOutput}>
          {entry.isHTML ? renderOutput(entry.content, true) : entry.content}
        </pre>
      </div>
    );
  }
});

TerminalEntry.displayName = 'TerminalEntry';

const AITerminal = () => {
  const { theme, toggleTheme } = useTheme();
  const [input, setInput] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: WELCOME_MESSAGE, isHTML: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Refs
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const terminalContainerRef = useRef(null);
  
  // Terminal command processor
  const terminalCommands = useRef(new TerminalCommands()).current;
  
  // Create visible history slice for better performance
  const visibleHistory = history.slice(-MAX_VISIBLE_HISTORY);
  
  // Debounced input handler to reduce render frequency
  const debouncedInputChange = useCallback(
    debounce((newInput, newCursorPos) => {
      setInput(newInput);
      setDisplayText(newInput);
      setCursorPosition(newCursorPos);
    }, 16), // Approximately 60fps
    []
  );
  
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
          debouncedInputChange(prevCommand, prevCommand.length);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextCommand = terminalCommands.getNextCommand();
        if (nextCommand !== null) {
          debouncedInputChange(nextCommand, nextCommand.length);
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
          debouncedInputChange(newInput, cursorPosition - 1);
        }
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (cursorPosition < input.length) {
          const newInput = input.substring(0, cursorPosition) + input.substring(cursorPosition + 1);
          debouncedInputChange(newInput, cursorPosition);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Regular character input
        e.preventDefault();
        const newInput = input.substring(0, cursorPosition) + e.key + input.substring(cursorPosition);
        debouncedInputChange(newInput, cursorPosition + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input, cursorPosition, isFocused, terminalCommands, debouncedInputChange]);
  
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
    
    // Reset input state in a single batch
    setInput('');
    setDisplayText('');
    setCursorPosition(0);
    
    // Process command
    await processCommand(userInput);
  }, [input]);
  
  // Process terminal commands
  const processCommand = useCallback(async (command) => {
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
  }, [theme, toggleTheme]);
  
  // AI command handlers
  const handleAskCommand = useCallback(async (question) => {
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
      
      // Remove loading message and add AI response in a single update
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
  }, []);
  
  const handleGenerateCommand = useCallback(async ({ type, prompt }) => {
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
  }, []);
  
  const handleExplainCommand = useCallback(async (concept) => {
    // Show loading
    setHistory(prev => [...prev, { type: 'loading', content: `Explaining "${concept}"...` }]);
    
    try {
      // Make API call to backend
      const response = await fetch('/api/ai/explain', {
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
  }, []);
  
  const handleTranslateCommand = useCallback(async ({ language, text }) => {
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
  }, []);

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
            {visibleHistory.map((entry, index) => (
              <TerminalEntry key={`${entry.type}-${index}`} entry={entry} />
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
        </motion.div>
      </div>
    </section>
  );
};

export default memo(AITerminal);
