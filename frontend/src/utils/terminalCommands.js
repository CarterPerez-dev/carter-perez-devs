/**
 * Terminal commands utility
 * Contains command definitions, processors, and helpers for terminal interface
 */

// ANSI color codes for terminal text
export const ANSI_COLORS = {
  RESET: '\u001b[0m',
  BLACK: '\u001b[30m',
  RED: '\u001b[31m',
  GREEN: '\u001b[32m',
  YELLOW: '\u001b[33m',
  BLUE: '\u001b[34m',
  MAGENTA: '\u001b[35m',
  CYAN: '\u001b[36m',
  WHITE: '\u001b[37m',
  
  BG_BLACK: '\u001b[40m',
  BG_RED: '\u001b[41m',
  BG_GREEN: '\u001b[42m',
  BG_YELLOW: '\u001b[43m',
  BG_BLUE: '\u001b[44m',
  BG_MAGENTA: '\u001b[45m',
  BG_CYAN: '\u001b[46m',
  BG_WHITE: '\u001b[47m',
  
  BRIGHT_BLACK: '\u001b[30;1m',
  BRIGHT_RED: '\u001b[31;1m',
  BRIGHT_GREEN: '\u001b[32;1m',
  BRIGHT_YELLOW: '\u001b[33;1m',
  BRIGHT_BLUE: '\u001b[34;1m',
  BRIGHT_MAGENTA: '\u001b[35;1m',
  BRIGHT_CYAN: '\u001b[36;1m',
  BRIGHT_WHITE: '\u001b[37;1m',
};

// Common terminal symbols
export const TERMINAL_SYMBOLS = {
  PROMPT: '$',
  SUCCESS: '✓',
  ERROR: '✗',
  WARNING: '⚠',
  INFO: 'ℹ',
  LOADING: '⣾⣽⣻⢿⡿⣟⣯⣷',
  COMMAND: '>',
  CURSOR: '▋',
};

// Available terminal commands
export const AVAILABLE_COMMANDS = [
  'help',
  'clear',
  'about',
  'skills',
  'projects',
  'contact',
  'experience',
  'education',
  'certifications',
  'github',
  'linkedin',
  'resume',
  'echo',
  'whois',
  'ls',
  'date',
  'time',
  'ask',
  'exit',
  'theme',
  'matrix',
  'hack',
  'quote',
  'glitch',
  'ping',
  'netstat',
  'whoami',
  'sys',
  'scan',
  'decrypt',
  'encrypt',
];

// Command descriptions for help command
export const COMMAND_DESCRIPTIONS = {
  help: 'Display available commands',
  clear: 'Clear terminal screen',
  about: 'Display information about me',
  skills: 'List my technical skills',
  projects: 'View my featured projects',
  contact: 'Display contact information',
  experience: 'Show work experience',
  education: 'Display educational background',
  certifications: 'Show earned certifications',
  github: 'Open GitHub profile',
  linkedin: 'Open LinkedIn profile',
  resume: 'View resume information',
  echo: 'Echo text back to terminal',
  whois: 'Display information about the system',
  ls: 'List available sections',
  date: 'Display current date',
  time: 'Display current time',
  ask: 'Ask a question about me (AI-powered)',
  exit: 'Exit terminal mode',
  theme: 'Toggle light/dark theme',
  matrix: 'Display Matrix effect',
  hack: 'Simulate hacking (for fun)',
  quote: 'Display a random cyber quote',
  glitch: 'Apply a glitch effect to the terminal',
  ping: 'Ping a network destination',
  netstat: 'Show network statistics',
  whoami: 'Display current user information',
  sys: 'Show system information',
  scan: 'Scan system for vulnerabilities',
  decrypt: 'Decrypt encrypted text',
  encrypt: 'Encrypt plain text',
};

// Cyberpunk quotes for the quote command
export const CYBER_QUOTES = [
  "The future is already here – it's just not evenly distributed. - William Gibson",
  "Information wants to be free. - Stewart Brand",
  "In the face of ambiguity, refuse the temptation to guess. - The Zen of Python",
  "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
  "The best way to predict the future is to invent it. - Alan Kay",
  "Security is always excessive until it's not enough. - Robbie Sinclair",
  "Privacy is not something that I'm merely entitled to, it's an absolute prerequisite. - Marlon Brando",
  "The quieter you become, the more you can hear. - Ram Dass",
  "There is no security on this earth; there is only opportunity. - Douglas MacArthur",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "The function of good software is to make the complex appear to be simple. - Grady Booch",
  "The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room. - Gene Spafford",
  "The electric light did not come from the continuous improvement of candles. - Oren Harari",
  "We're changing the world with technology. - Bill Gates",
  "Hardware: The parts of a computer that can be kicked. - Jeff Pesis",
  "Cyberspace. A consensual hallucination experienced daily by billions. - William Gibson",
  "The real problem is not whether machines think but whether men do. - B.F. Skinner",
  "The Internet treats censorship as a malfunction and routes around it. - John Perry Barlow",
  "In a world of infinite choice, context—not content—is king. - Chris Anderson",
  "It's hardware that makes a machine fast. It's software that makes a fast machine slow. - Craig Bruce"
];

// Random hex codes generator
export const generateRandomHex = (length = 8) => {
  let result = '';
  const characters = 'ABCDEFabcdef0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate simulated terminal IP address
export const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// Format terminal response
export const formatResponse = (text, type = 'standard') => {
  switch (type) {
    case 'success':
      return `${ANSI_COLORS.BRIGHT_GREEN}${TERMINAL_SYMBOLS.SUCCESS} ${text}${ANSI_COLORS.RESET}`;
    case 'error':
      return `${ANSI_COLORS.BRIGHT_RED}${TERMINAL_SYMBOLS.ERROR} ${text}${ANSI_COLORS.RESET}`;
    case 'warning':
      return `${ANSI_COLORS.BRIGHT_YELLOW}${TERMINAL_SYMBOLS.WARNING} ${text}${ANSI_COLORS.RESET}`;
    case 'info':
      return `${ANSI_COLORS.BRIGHT_CYAN}${TERMINAL_SYMBOLS.INFO} ${text}${ANSI_COLORS.RESET}`;
    case 'command':
      return `${ANSI_COLORS.BRIGHT_CYAN}${TERMINAL_SYMBOLS.COMMAND} ${text}${ANSI_COLORS.RESET}`;
    default:
      return text;
  }
};

// Parse command arguments
export const parseCommand = (commandString) => {
  const parts = commandString.trim().split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  
  return { command, args };
};

// Simulate typing effect text
export const simulateTyping = (element, text, speed = 30) => {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
};

// Format current datetime for terminal
export const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export default {
  ANSI_COLORS,
  TERMINAL_SYMBOLS,
  AVAILABLE_COMMANDS,
  COMMAND_DESCRIPTIONS,
  CYBER_QUOTES,
  generateRandomHex,
  generateRandomIP,
  formatResponse,
  parseCommand,
  simulateTyping,
  formatDateTime
};
