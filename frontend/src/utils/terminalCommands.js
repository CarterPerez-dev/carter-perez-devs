/**
 * Enhanced Terminal Commands Processor
 * Provides command handling and execution for the terminal interface
 */

import TerminalFileSystem from './TerminalFileSystem';

class TerminalCommands {
  constructor() {
    this.fileSystem = new TerminalFileSystem();
    this.commandHistory = [];
    this.historyIndex = -1;
    this.maxHistorySize = 100;
    
    // Available commands
    this.commands = {
      // Basic commands
      help: this.helpCommand.bind(this),
      clear: this.clearCommand.bind(this),
      exit: this.exitCommand.bind(this),
      
      // File system navigation
      ls: this.listCommand.bind(this),
      cd: this.changeDirectoryCommand.bind(this),
      pwd: this.printWorkingDirectoryCommand.bind(this),
      cat: this.catCommand.bind(this),
      mkdir: this.makeDirectoryCommand.bind(this),
      touch: this.touchCommand.bind(this),
      rm: this.removeCommand.bind(this),
      rmdir: this.removeDirCommand.bind(this),
      
      // System information
      date: this.dateCommand.bind(this),
      time: this.timeCommand.bind(this),
      whoami: this.whoamiCommand.bind(this),
      hostname: this.hostnameCommand.bind(this),
      echo: this.echoCommand.bind(this),
      uname: this.unameCommand.bind(this),
      history: this.historyCommand.bind(this),
      
      // Special commands
      man: this.manCommand.bind(this),
      find: this.findCommand.bind(this),
      grep: this.grepCommand.bind(this),
      neofetch: this.neofetchCommand.bind(this),
      
      // Visual effects
      matrix: this.matrixCommand.bind(this),
      hack: this.hackCommand.bind(this),
      
      // Portfolio specific
      about: this.aboutCommand.bind(this),
      skills: this.skillsCommand.bind(this),
      projects: this.projectsCommand.bind(this),
      contact: this.contactCommand.bind(this),
      experience: this.experienceCommand.bind(this),
      education: this.educationCommand.bind(this),
      certifications: this.certificationsCommand.bind(this),
      resume: this.resumeCommand.bind(this),
      github: this.githubCommand.bind(this),
      linkedin: this.linkedinCommand.bind(this),
      
      // AI commands
      ask: this.askCommand.bind(this),
      generate: this.generateCommand.bind(this),
      explain: this.explainCommand.bind(this),
      translate: this.translateCommand.bind(this),
      
      // Theme and customization
      theme: this.themeCommand.bind(this),
      quote: this.quoteCommand.bind(this)
    };
    
    // Command aliases
    this.aliases = {
      dir: 'ls',
      ll: 'ls -l',
      la: 'ls -a',
      cls: 'clear',
      '?': 'help',
      open: 'cat',
      bye: 'exit',
      quit: 'exit',
      logout: 'exit'
    };
    
    // Manual pages for commands
    this.manPages = {
      ls: {
        name: 'ls',
        synopsis: 'ls [OPTION]... [FILE]...',
        description: 'List directory contents',
        options: [
          { flag: '-a, --all', description: 'do not ignore entries starting with .' },
          { flag: '-l', description: 'use a long listing format' },
          { flag: '-h, --human-readable', description: 'print sizes in human readable format' }
        ]
      },
      cd: {
        name: 'cd',
        synopsis: 'cd [DIRECTORY]',
        description: 'Change the current working directory',
        options: [
          { flag: '.', description: 'current directory' },
          { flag: '..', description: 'parent directory' },
          { flag: '/', description: 'root directory' },
          { flag: '~', description: 'home directory' }
        ]
      },
      cat: {
        name: 'cat',
        synopsis: 'cat [FILE]...',
        description: 'Concatenate files and print on the standard output',
        options: []
      },
      mkdir: {
        name: 'mkdir',
        synopsis: 'mkdir [OPTION]... DIRECTORY...',
        description: 'Create the DIRECTORY(ies), if they do not already exist',
        options: [
          { flag: '-p, --parents', description: 'make parent directories as needed' }
        ]
      },
      rm: {
        name: 'rm',
        synopsis: 'rm [OPTION]... FILE...',
        description: 'Remove (unlink) the FILE(s)',
        options: [
          { flag: '-r, -R, --recursive', description: 'remove directories and their contents recursively' },
          { flag: '-f, --force', description: 'ignore nonexistent files, never prompt' }
        ]
      },
      pwd: {
        name: 'pwd',
        synopsis: 'pwd',
        description: 'Print the name of the current working directory',
        options: []
      },
      help: {
        name: 'help',
        synopsis: 'help [COMMAND]',
        description: 'Display help information about available commands',
        options: []
      },
      man: {
        name: 'man',
        synopsis: 'man [COMMAND]',
        description: 'Display the manual page for a command',
        options: []
      },
      find: {
        name: 'find',
        synopsis: 'find [PATH] [EXPRESSION]',
        description: 'Search for files in a directory hierarchy',
        options: [
          { flag: '-name PATTERN', description: 'find files matching PATTERN' },
          { flag: '-type [f|d]', description: 'find files (f) or directories (d)' }
        ]
      },
      grep: {
        name: 'grep',
        synopsis: 'grep [OPTION]... PATTERN [FILE]...',
        description: 'Search for PATTERN in each FILE',
        options: [
          { flag: '-i, --ignore-case', description: 'ignore case distinctions' },
          { flag: '-n, --line-number', description: 'print line number with output lines' }
        ]
      },
      ask: {
        name: 'ask',
        synopsis: 'ask [QUESTION]',
        description: 'Ask a question to the AI assistant about the portfolio',
        options: []
      },
      generate: {
        name: 'generate',
        synopsis: 'generate [TYPE] [PROMPT]',
        description: 'Generate content using AI',
        options: [
          { flag: 'code', description: 'generate code snippet based on description' },
          { flag: 'idea', description: 'generate project idea based on keywords' },
          { flag: 'story', description: 'generate a brief creative story' }
        ]
      }
    };
  }

  // Process command input
  processCommand(input) {
    if (!input || input.trim() === '') {
      return {
        type: 'empty',
        content: ''
      };
    }

    // Add to history
    this.addToHistory(input);
    
    // Parse command and arguments
    const args = this.parseCommandLine(input);
    const commandName = args[0].toLowerCase();
    const commandArgs = args.slice(1);
    
    // Check for aliases
    const resolvedCommand = this.aliases[commandName] || commandName;
    
    // If the alias contains multiple words (e.g., "ls -l")
    if (resolvedCommand.includes(' ')) {
      const aliasArgs = this.parseCommandLine(resolvedCommand);
      const actualCommand = aliasArgs[0];
      const actualArgs = [...aliasArgs.slice(1), ...commandArgs];
      
      if (this.commands[actualCommand]) {
        return this.executeCommand(actualCommand, actualArgs);
      }
    }
    
    // Execute command
    if (this.commands[resolvedCommand]) {
      return this.executeCommand(resolvedCommand, commandArgs);
    }
    
    // Check if it's an executable in the current path
    try {
      // Try to execute as a file
      const file = this.fileSystem.getFileAtPath(commandName);
      if (file && file.executable) {
        return {
          type: 'success',
          content: this.fileSystem.executeFile(commandName, commandArgs)
        };
      }
    } catch (error) {
      // Not a file or not executable
    }
    
    // Command not found
    return {
      type: 'error',
      content: `${commandName}: command not found`
    };
  }

  // Execute a command
  executeCommand(command, args) {
    try {
      return this.commands[command](args);
    } catch (error) {
      return {
        type: 'error',
        content: `${command}: ${error.message}`
      };
    }
  }

  // Parse command line into tokens (handling quotes)
  parseCommandLine(input) {
    const tokens = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if ((char === '"' || char === "'") && (!inQuotes || char === quoteChar)) {
        inQuotes = !inQuotes;
        quoteChar = inQuotes ? char : '';
        continue;
      }
      
      if (char === ' ' && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }
      
      current += char;
    }
    
    if (current) {
      tokens.push(current);
    }
    
    return tokens;
  }

  // Command history management
  addToHistory(command) {
    // Don't add duplicates consecutively
    if (this.commandHistory.length > 0 && this.commandHistory[this.commandHistory.length - 1] === command) {
      return;
    }
    
    this.commandHistory.push(command);
    
    // Trim history if it exceeds max size
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
    
    // Reset history index
    this.historyIndex = this.commandHistory.length;
  }

  getPreviousCommand() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex];
    }
    return null;
  }

  getNextCommand() {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex];
    } else if (this.historyIndex === this.commandHistory.length - 1) {
      this.historyIndex++;
      return '';
    }
    return null;
  }

  // Command implementations
  helpCommand(args) {
    if (args.length > 0) {
      // Help for specific command
      const command = args[0].toLowerCase();
      if (this.commands[command]) {
        const manPage = this.manPages[command];
        if (manPage) {
          return {
            type: 'help',
            content: `
Command: ${manPage.name}
Synopsis: ${manPage.synopsis}
Description: ${manPage.description}

${manPage.options.length > 0 ? 'Options:' : ''}
${manPage.options.map(opt => `  ${opt.flag.padEnd(20)} ${opt.description}`).join('\n')}
`
          };
        } else {
          return {
            type: 'help',
            content: `Help for command '${command}' not available.`
          };
        }
      } else {
        return {
          type: 'error',
          content: `Unknown command: ${command}`
        };
      }
    }

    // General help
    const categories = {
      'File System': ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'rmdir'],
      'System': ['date', 'time', 'whoami', 'hostname', 'echo', 'uname', 'history'],
      'Utilities': ['man', 'find', 'grep', 'neofetch'],
      'Visual': ['matrix', 'hack', 'theme', 'quote'],
      'Portfolio': ['about', 'skills', 'projects', 'contact', 'experience', 'education',
      'certifications', 'resume', 'github', 'linkedin'],
      'AI Features': ['ask', 'generate', 'explain', 'translate'],
      'Misc': ['help', 'clear', 'exit']
    };

    const helpText = Object.entries(categories).map(([category, cmds]) => {
      return `${category}:\n${cmds.map(cmd => `  ${cmd.padEnd(12)}`).join('\n')}`;
    }).join('\n\n');

    return {
      type: 'help',
      content: `
Available commands:

${helpText}

Type 'help [command]' or 'man [command]' for more information about a specific command.
`
    };
  }

  clearCommand() {
    return {
      type: 'clear',
      content: ''
    };
  }

  exitCommand() {
    return {
      type: 'exit',
      content: 'Exiting terminal...'
    };
  }

  listCommand(args) {
    // Parse options
    let path = '.';
    const options = {
      all: false,
      longFormat: false,
      humanReadable: false
    };

    for (const arg of args) {
      if (arg.startsWith('-')) {
        // Handle options
        if (arg.includes('a')) options.all = true;
        if (arg.includes('l')) options.longFormat = true;
        if (arg.includes('h')) options.humanReadable = true;
      } else {
        // It's a path
        path = arg;
      }
    }

    // Get directory listing
    const entries = this.fileSystem.listDirectory(path, options);

    if (!options.longFormat) {
      // Simple format
      const formattedEntries = entries.map(entry => {
        let displayName = entry.name;
        if (entry.type === 'directory') {
          displayName = `<span class="terminal-dir">${displayName}/</span>`;
        } else if (entry.isExecutable) {
          displayName = `<span class="terminal-exec">${displayName}*</span>`;
        }
        return displayName;
      });

      return {
        type: 'success',
        content: formattedEntries.join('  '),
        isHTML: true
      };
    } else {
      // Long format
      const getHumanSize = (size) => {
        if (!options.humanReadable || size < 1024) return size.toString().padStart(5);
        if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'K';
        return (size / (1024 * 1024)).toFixed(1) + 'M';
      };

      const rows = entries.map(entry => {
        const size = getHumanSize(entry.size);
        let nameDisplay = entry.name;

        if (entry.isDirectory) {
          nameDisplay = `<span class="terminal-dir">${entry.name}/</span>`;
        } else if (entry.isExecutable) {
          nameDisplay = `<span class="terminal-exec">${entry.name}*</span>`;
        }

        return `${entry.permissions}  ${size.padStart(5)}  ${entry.date}  ${nameDisplay}`;
      });

      return {
        type: 'success',
        content: rows.join('\n'),
        isHTML: true
      };
    }
  }

  changeDirectoryCommand(args) {
    const path = args[0] || '~';
    
    // Handle ~ for home directory
    let targetPath = path;
    if (path === '~') {
      targetPath = '/home/user';
    }
    
    try {
      const newPath = this.fileSystem.changeDirectory(targetPath);
      return {
        type: 'success',
        content: ''
      };
    } catch (error) {
      return {
        type: 'error',
        content: `cd: ${error.message}`
      };
    }
  }

  printWorkingDirectoryCommand() {
    return {
      type: 'success',
      content: this.fileSystem.getCurrentPath()
    };
  }

  catCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'cat: missing file operand'
      };
    }

    try {
      const content = this.fileSystem.getFileContent(args[0]);
      
      // Determine if content looks like a code file
      let type = 'text';
      const filename = args[0].toLowerCase();
      if (filename.endsWith('.js') || filename.endsWith('.jsx') || 
          filename.endsWith('.py') || filename.endsWith('.java') ||
          filename.endsWith('.c') || filename.endsWith('.cpp') ||
          filename.endsWith('.html') || filename.endsWith('.css')) {
        type = 'code';
      } else if (filename.endsWith('.md')) {
        type = 'markdown';
      } else if (filename.endsWith('.json')) {
        type = 'json';
      }
      
      return {
        type,
        content
      };
    } catch (error) {
      return {
        type: 'error',
        content: `cat: ${error.message}`
      };
    }
  }

  makeDirectoryCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'mkdir: missing operand'
      };
    }

    try {
      const result = this.fileSystem.makeDirectory(args[0]);
      return {
        type: 'success',
        content: result
      };
    } catch (error) {
      return {
        type: 'error',
        content: `mkdir: ${error.message}`
      };
    }
  }

  touchCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'touch: missing file operand'
      };
    }

    try {
      const result = this.fileSystem.createFile(args[0], '');
      return {
        type: 'success',
        content: result
      };
    } catch (error) {
      return {
        type: 'error',
        content: `touch: ${error.message}`
      };
    }
  }

  removeCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'rm: missing operand'
      };
    }

    let recursive = false;
    let force = false;
    let filesToRemove = [];

    // Parse options
    for (const arg of args) {
      if (arg.startsWith('-')) {
        if (arg.includes('r') || arg.includes('R')) recursive = true;
        if (arg.includes('f')) force = true;
      } else {
        filesToRemove.push(arg);
      }
    }

    if (filesToRemove.length === 0) {
      return {
        type: 'error',
        content: 'rm: missing operand'
      };
    }

    const results = [];
    for (const file of filesToRemove) {
      try {
        // Try to remove as file first
        try {
          const result = this.fileSystem.removeFile(file);
          results.push(result);
        } catch (error) {
          // If it's a directory and recursive is true, remove directory
          if (recursive) {
            const result = this.fileSystem.removeDirectory(file, true);
            results.push(result);
          } else {
            throw error;
          }
        }
      } catch (error) {
        if (!force) {
          results.push(`rm: ${error.message}`);
        }
      }
    }

    if (results.length === 0) {
      return {
        type: 'success',
        content: ''
      };
    }

    const hasErrors = results.some(result => result.startsWith('rm:'));
    return {
      type: hasErrors ? 'warning' : 'success',
      content: results.join('\n')
    };
  }

  removeDirCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'rmdir: missing operand'
      };
    }

    const results = [];
    for (const dir of args) {
      try {
        const result = this.fileSystem.removeDirectory(dir);
        results.push(result);
      } catch (error) {
        results.push(`rmdir: ${error.message}`);
      }
    }

    const hasErrors = results.some(result => result.startsWith('rmdir:'));
    return {
      type: hasErrors ? 'warning' : 'success',
      content: results.join('\n')
    };
  }

  dateCommand() {
    const now = new Date();
    return {
      type: 'success',
      content: now.toDateString()
    };
  }

  timeCommand() {
    const now = new Date();
    return {
      type: 'success',
      content: now.toLocaleTimeString()
    };
  }

  whoamiCommand() {
    return {
      type: 'success',
      content: 'user'
    };
  }

  hostnameCommand() {
    return {
      type: 'success',
      content: 'neural-terminal'
    };
  }

  echoCommand(args) {
    return {
      type: 'success',
      content: args.join(' ')
    };
  }

  unameCommand(args) {
    const includeAll = args.includes('-a');
    
    if (includeAll) {
      return {
        type: 'success',
        content: 'Neural OS 5.15.0-cyberpunk-1 #1 SMP x86_64 x86_64 x86_64 GNU/Linux'
      };
    }
    
    return {
      type: 'success',
      content: 'Neural'
    };
  }

  historyCommand() {
    if (this.commandHistory.length === 0) {
      return {
        type: 'success',
        content: 'No commands in history'
      };
    }

    const numberedHistory = this.commandHistory.map((cmd, index) => 
      `${(index + 1).toString().padStart(4)}  ${cmd}`
    );

    return {
      type: 'success',
      content: numberedHistory.join('\n')
    };
  }

  manCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'What manual page do you want?\nFor example, try \'man ls\'.'
      };
    }

    const command = args[0].toLowerCase();
    const manPage = this.manPages[command];

    if (!manPage) {
      return {
        type: 'error',
        content: `No manual entry for ${command}`
      };
    }

    return {
      type: 'man-page',
      content: `
<div class="man-page">
  <div class="man-header">
    <span class="man-title">${manPage.name.toUpperCase()}(1)</span>
    <span class="man-section">User Commands</span>
    <span class="man-title">${manPage.name.toUpperCase()}(1)</span>
  </div>

  <div class="man-name">
    <h2>NAME</h2>
    <p>${manPage.name} - ${manPage.description}</p>
  </div>

  <div class="man-synopsis">
    <h2>SYNOPSIS</h2>
    <p><span class="man-cmd">${manPage.synopsis}</span></p>
  </div>

  <div class="man-description">
    <h2>DESCRIPTION</h2>
    <p>${manPage.description}</p>
  </div>

  ${manPage.options.length > 0 ? `
  <div class="man-options">
    <h2>OPTIONS</h2>
    ${manPage.options.map(opt => `
      <div class="man-option">
        <p><span class="man-flag">${opt.flag}</span></p>
        <p class="man-desc">${opt.description}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="man-footer">
    <p>Neural Terminal Manual</p>
    <p>May 2025</p>
  </div>
</div>
`,
      isHTML: true
    };
  }

  findCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'find: missing path operand'
      };
    }

    let path = args[0];
    let namePattern = null;
    let fileType = null;

    // Parse arguments
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '-name' && i + 1 < args.length) {
        namePattern = args[i + 1];
        i++; // Skip the next argument
      } else if (args[i] === '-type' && i + 1 < args.length) {
        fileType = args[i + 1];
        i++; // Skip the next argument
      }
    }

    try {
      // Get directory to start search
      const startDir = this.fileSystem.getDirectoryAtPath(path);
      
      // Simple implementation - not recursive for now
      const entries = this.fileSystem.listDirectory(path, { all: true, longFormat: false });
      
      // Filter results
      const filteredEntries = entries.filter(entry => {
        // Filter by type if specified
        if (fileType) {
          if (fileType === 'f' && entry.type !== 'file') return false;
          if (fileType === 'd' && entry.type !== 'directory') return false;
        }
        
        // Filter by name pattern if specified
        if (namePattern) {
          const pattern = namePattern.replace(/\*/g, '.*').replace(/\?/g, '.');
          const regex = new RegExp(`^${pattern}$`);
          if (!regex.test(entry.name)) return false;
        }
        
        return true;
      });
      
      // Format results
      const results = filteredEntries.map(entry => {
        const fullPath = `${path === '.' ? this.fileSystem.getCurrentPath() : path}/${entry.name}`;
        return fullPath;
      });
      
      return {
        type: 'success',
        content: results.join('\n') || 'No matching files found'
      };
    } catch (error) {
      return {
        type: 'error',
        content: `find: ${error.message}`
      };
    }
  }

  grepCommand(args) {
    if (args.length < 2) {
      return {
        type: 'error',
        content: 'grep: missing pattern and/or file operand'
      };
    }

    // Parse options
    let ignoreCase = false;
    let showLineNumbers = false;
    let pattern = '';
    let files = [];

    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('-')) {
        if (args[i].includes('i')) ignoreCase = true;
        if (args[i].includes('n')) showLineNumbers = true;
      } else if (!pattern) {
        pattern = args[i];
      } else {
        files.push(args[i]);
      }
    }

    if (!pattern || files.length === 0) {
      return {
        type: 'error',
        content: 'grep: missing pattern and/or file operand'
      };
    }

    const results = [];
    for (const file of files) {
      try {
        const content = this.fileSystem.getFileContent(file);
        const lines = content.split('\n');
        
        const flags = ignoreCase ? 'i' : '';
        const regex = new RegExp(pattern, flags);
        
        const matches = lines.filter((line, index) => {
          const match = regex.test(line);
          if (match) {
            const lineNum = showLineNumbers ? `${index + 1}:` : '';
            results.push(`${file}:${lineNum}${line}`);
          }
          return match;
        });
      } catch (error) {
        results.push(`grep: ${file}: ${error.message}`);
      }
    }

    if (results.length === 0) {
      return {
        type: 'success',
        content: ''
      };
    }

    return {
      type: 'success',
      content: results.join('\n')
    };
  }

  neofetchCommand() {
    try {
      // Try to execute neofetch from bin
      return {
        type: 'neofetch',
        content: this.fileSystem.getFileContent('/bin/neofetch')
      };
    } catch (error) {
      return {
        type: 'error',
        content: `neofetch: command not found`
      };
    }
  }

  matrixCommand() {
    return {
      type: 'matrix',
      content: 'Starting Matrix effect. Press any key to exit.'
    };
  }

  hackCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'hack: missing target operand'
      };
    }

    const target = args[0];
    return {
      type: 'hack',
      content: target
    };
  }

  // Portfolio-specific commands
  aboutCommand() {
    return {
      type: 'about',
      content: `
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
`
    };
  }

  skillsCommand() {
    return {
      type: 'skills',
      content: `
=== TECHNICAL SKILLS ===

CYBERSECURITY:
  • Risk Assessment and Threat Mitigation
  • Compliance with ISO 27001 and 9001:2015
  • Role-Based Access Controls
  • Encryption Best Practices
  • Incident Response Planning

DEVELOPMENT:
  • Languages: Python, JavaScript, TypeScript, HTML, CSS, Shell Scripting
  • Frameworks: React, Flask, Vite
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
`
    };
  }

  projectsCommand(args) {
    if (args.length > 0) {
      // Show specific project
      const projectNumber = parseInt(args[0]);
      
      const projects = [
        {
          name: "CertGames.com",
          description: "A gamified platform for certification preparation. Follow structured roadmaps to learn, practice,"
          "and master certifications like CompTIA. Earn XP, unlock badges, and track your progress.",
          technologies: "React, React-Native Python, Flask, MongoDB, Docker, Nginx, Redis, iOS APP",
          status: "Active development, launched Q2 2025"
        },
        {
          name: "Flask-Honeypot",
          description: "A lightweight honeypot system built with Flask. Detects and logs potential cyber attacks"
          "while presenting convincing decoy services to attackers. Helps identify common attack vectors and malicious IP addresses.",
          technologies: "React, Node.js, MongoDB, Python-Flask, PyPi",
          status: "Active development, launched Q3 2025"
        },
        {
          name: "AngelaCLI",
          description: "An AI-powered command line tool that assists with coding tasks."
          "Integrates with your development workflow to provide context-aware suggestions, refactoring tips, and code generation.",
          technologies: "Shell, Linux, Python, Bash, Gemini API",
          status: "Internal use, in-progress, planning public release"
        },
        {
          name: "Portfolio",
          description: "A futuristic themed portfolio website with interactive elements and holographic UI."
          "Features include 3D elements, glitch effects, and a custom terminal interface.",
          technologies: "Python, Vite, Nginx, Docker, Three.js, CSS3",
          status: "Personal project, ongoing development"
        }
      ];
      
      if (projectNumber >= 1 && projectNumber <= projects.length) {
        const project = projects[projectNumber - 1];
        return {
          type: 'project',
          content: `
=== ${project.name} ===

DESCRIPTION:
${project.description}

TECHNOLOGIES:
${project.technologies}

STATUS:
${project.status}
`
        };
      } else {
        return {
          type: 'error',
          content: `Invalid project number. Available projects: 1-${projects.length}`
        };
      }
    }
    
    // Show all projects
    return {
      type: 'projects',
      content: `
=== FEATURED PROJECTS ===

1. Certgames.com
   A centralized cybersecurity platform integrating AI-driven simulations
   and learning modules. Features include GRC Wizard for compliance questions,
   Log Analysis for real-time practice, scenario-based exercises 
   for incident response, gamified elements like leaderboards, shop, achievements etc.
   13,000 Practice Questions with 13 certification tracks, 
   Daily PBQ's, Personalized stats, 24/7 support and more.
   ios App with an Android App coming soon.
   [Technologies: React, React-Native, Typescript, Nginx, Redis, Flask, MongoDB, Docker]

2. Flask-Honeypot
   A lightweight honeypot system built with Flask. Detects and logs potential cyber attacks 
   while presenting convincing decoy services to attackers. Helps identify common attack vectors
   and malicious IP addresses.
   [Technologies: Python, React, MongoDB, Docker, Nginx]

3. AngelaCLI
   An AI-powered command line tool that assists with coding tasks. 
   Integrates with your development workflow provide context-aware suggestions, 
   refactoring tips, and code generation.
   [Technologies: Gemini API, Shell, Python, Bash]

4. Portfolio
   A futuristic themed portfolio website with interactive elements
   and holographic UI. Features include 3D elements, glitch effects,
   effects, and a custom terminal interface.
   [Technologies: Python, React-Vite, Three.js, CSS3, Nginx, Docker]

Type 'projects [number]' to get more details about a specific project.
`
    };
  }

  contactCommand() {
    return {
      type: 'contact',
      content: `
=== CONTACT INFORMATION ===

Email: CarterPerez-dev@gmail.com
Phone: 443-510-0866

Social Links:
  • GitHub:   https://github.com/CarterPerez-dev
  • LinkedIn: https://www.linkedin.com/in/carterperez-dev/

Preferred Contact Method: Email

Feel free to reach out for collaboration opportunities, consulting,
or just to connect about cybersecurity and development topics.
`
    };
  }

  experienceCommand() {
    return {
      type: 'experience',
      content: `
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
`
    };
  }

  educationCommand() {
    return {
      type: 'education',
      content: `
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
`
    };
  }

  certificationsCommand() {
    return {
      type: 'certifications',
      content: `
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

All CompTIA certifications were achieved within a nine-month period.

STUDY METHODS:
- Watching Professor Messer's tutorials
- Employing the PQR method
- Maintaining confidence throughout the process
`
    };
  }

  resumeCommand() {
    return {
      type: 'resume',
      content: `
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
2. Visiting: https://carterperez-dev.com/resume
3. Using the command 'cat /home/user/documents/resume.md' to view it in the terminal

The resume is available in PDF, DOCX, and TXT format and showcases my
qualifications for cybersecurity and technical roles.
`
    };
  }

  githubCommand() {
    return {
      type: 'link',
      content: 'https://github.com/CarterPerez-dev'
    };
  }

  linkedinCommand() {
    return {
      type: 'link',
      content: 'https://www.linkedin.com/in/carterperez-dev/'
    };
  }

  // AI commands
  askCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'Usage: ask [question]\nExample: ask What are your favorite programming languages?'
      };
    }

    const question = args.join(' ');
    return {
      type: 'ask',
      content: question
    };
  }

  generateCommand(args) {
    if (args.length < 2) {
      return {
        type: 'error',
        content: `
Usage: generate [type] [prompt]

Available types:
  code    - Generate code snippet based on description
  idea    - Generate project idea based on keywords
  story   - Generate a brief creative story

Examples:
  generate code "Function to calculate fibonacci in JavaScript"
  generate idea "Cybersecurity monitoring dashboard"
  generate story "A hacker who discovers a hidden AI"
`
      };
    }

    const type = args[0].toLowerCase();
    const prompt = args.slice(1).join(' ');

    if (!['code', 'idea', 'story'].includes(type)) {
      return {
        type: 'error',
        content: `Invalid generation type: ${type}\nValid types: code, idea, story`
      };
    }

    return {
      type: 'generate',
      content: { type, prompt }
    };
  }

  explainCommand(args) {
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'Usage: explain [concept]\nExample: explain CSRF attacks'
      };
    }

    const concept = args.join(' ');
    return {
      type: 'explain',
      content: concept
    };
  }

  translateCommand(args) {
    if (args.length < 3 || args[0].toLowerCase() !== 'to') {
      return {
        type: 'error',
        content: 'Usage: translate to [language] [text]\nExample: translate to Spanish "Hello world"'
      };
    }

    const language = args[1];
    const text = args.slice(2).join(' ');

    return {
      type: 'translate',
      content: { language, text }
    };
  }

  // Theme and customization
  themeCommand() {
    return {
      type: 'theme',
      content: ''
    };
  }

  quoteCommand() {
    const quotes = [
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

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      type: 'quote',
      content: randomQuote
    };
  }
}

export default TerminalCommands;
