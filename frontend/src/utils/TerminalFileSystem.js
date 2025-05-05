/**
 * Terminal File System Utility
 * Simulates a basic Unix-like file system for the interactive terminal
 */

class TerminalFileSystem {
  constructor() {
    // Initialize root filesystem
    this.fileSystem = {
      '/': {
        type: 'directory',
        content: {
          home: {
            type: 'directory',
            content: {
              user: {
                type: 'directory',
                content: {
                  documents: {
                    type: 'directory',
                    content: {
                      'resume.md': {
                        type: 'file',
                        content: `# Carter Rush Perez - Resume
                        
## Professional Experience
- System Integration Technician II at Sealing Technologies
- General Manager at Jimmy John's

## Education
- Master's Degree in Cybersecurity (in progress)
- South River High School

## Skills
- Cybersecurity, System Integration, Python, JavaScript, React, React-Native, Vite,
  Typescript, HTML, MongoDB, Redis, Docker, Nginx/Apache, AWS, Git, Ubuntu
- CompTIA Certifications (A+, Network+, Security+, CySA+, PenTest+, CASP+)
                        `,
                        lastModified: new Date('2025-02-15')
                      },
                      'certifications.txt': {
                        type: 'file',
                        content: `CompTIA A+
CompTIA Network+
CompTIA Security+
CompTIA CySA+
CompTIA PenTest+
CompTIA CASP+
PCEP (Certified Entry-Level Python Programmer)`,
                        lastModified: new Date('2025-01-10')
                      }
                    }
                  },
                  projects: {
                    type: 'directory',
                    content: {
                      'README.md': {
                        type: 'file',
                        content: `# My Projects

This directory contains information about my key projects.
- CertGames.com - A gamified platform for certification preparation. Follow structured roadmaps to learn, practice,
and master certifications like CompTIA. Earn XP, unlock badges, and track your progress.
- Flak-Honeypot - A lightweight honeypot system built with Flask. Detects and logs potential cyber attacks 
while presenting convincing decoy services to attackers. Helps identify common attack vectors and malicious IP addresses.
- AngelaCLI - An AI-powered command line tool that assists with coding tasks. Integrates with your development workflow 
to provide context-aware suggestions, refactoring tips, and code generation.`,
                        lastModified: new Date('2025-04-01')
                      },
                      'cert-games.md': {
                        type: 'file',
                        content: `# CertGames.com

A centralized cybersecurity platform integrating AI-driven simulations and learning modules. Features include:
- 13,000 practice questions with 13 cert tracks
- 10+ interactive learning games
- Personalized Stats
- 15+ themes to choose from
- Phishing Phrenzy game
- Incident Scenarios game
- Cipher Challenge game
- Daily PBQ's
- Anaolgy Hub
- Resource HUb
- Threat Hunter game
- Gamified elements (e.g leaderboard, shop, achievements etc.)
- GRC Wizard for compliance questions
- Log Analysis for real-time practice
- Scenario-based exercises for incident response

## Technologies
- React, Redux, React-Native, Typescript, Vite, Tailwind CSS, HTML
- Python/Flask
- MongoDB
- Docker
- Redis
- Apache
- Nginx
- AWS
- Cloudfare
- Oracle
- HTML
- Shell Scripting
- Github Actions
- Expo, EAS
- Ubuntu linux

## Status
Active development, launched Q1 2025`,
                        lastModified: new Date('2025-03-05')
                      }
                    }
                  },
                  '.bash_history': {
                    type: 'file',
                    content: `ls -la
cd documents
cat resume.md
cd ../projects
ls
cat README.md
cd ..
pwd`,
                    lastModified: new Date('2025-03-10')
                  },
                  '.bashrc': {
                    type: 'file',
                    content: `# .bashrc
                    
# Environment variables
export PATH=$PATH:/usr/local/bin
export EDITOR=nano

# Aliases
alias ll='ls -la'
alias cls='clear'
alias home='cd ~'

# Custom prompt
PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '`,
                    lastModified: new Date('2025-01-01')
                  }
                }
              }
            }
          },
          bin: {
            type: 'directory',
            content: {
              'sysinfo': {
                type: 'file',
                content: `#!/bin/bash
echo "System Information"
echo "---------------"
echo "Hostname: neural-terminal"
echo "Kernel: Linux 5.15.0-carter"
echo "Architecture: x86_64"
echo "CPU: Neural Processing Unit v4.2"
echo "Memory: 16GB Quantum RAM"
echo "Storage: 2TB Molecular Drive"`,
                lastModified: new Date('2025-01-15'),
                executable: true
              },
              'neofetch': {
                type: 'file',
                content: `#!/bin/bash
                
                       .+ohhy+:.                
                    \`/hmMMMMMMMMmho-              user@neural-terminal
                   :dMMMMMMMMMMMMMMMh/            -------------------
                 \`yMMMMMMMMMMMMMMMMMMMy\`          OS: CarterOS 2025
                 hMMMMMMMMMMMMMMMMMMMMMs          Host: Neuromancer 4200X
                /MMMMMMMMMMMMMMMMMMMMMM/          Kernel: 5.15.0-Carter
                yMMMMMMMMMMMMMMMMMMMMMMy          Uptime: 12 days, 5 hours
                oMMMMMMMMMMMMMMMMMMMMMMo          Packages: 2541 (apt)
                \`NMMMMMMMMMMMMMMMMMMMMm\`          Shell: bash 5.2.15
                 :dMMMMMMMMMMMMMMMMMm+\`           Terminal: xterm
                  \`/hNMMMMMMMMMMNh+.              CPU: Neural Processing Unit
                     \`:+syhys+:.                  Memory: 2.4GiB / 16GiB`,
                lastModified: new Date('2025-02-10'),
                executable: true
              }
            }
          },
          etc: {
            type: 'directory',
            content: {
              'hosts': {
                type: 'file',
                content: `127.0.0.1       localhost
127.0.1.1       neural-terminal

# IPv6 localhost address
::1             localhost ip6-localhost ip6-loopback

# network endpoints
192.168.1.1     gateway
192.168.1.10    server1
192.168.1.20    server2
192.168.1.50    client1`,
                lastModified: new Date('2025-01-05')
              },
              'motd': {
                type: 'file',
                content: `
 _   _                      _   _____                    _             _ 
| \\ | |                    | | |_   _|                  (_)           | |
|  \\| | ___ _   _ _ __ __ _| |   | |  ___ _ __ _ __ ___  _ _ __   __ _| |
| . \` |/ _ \\ | | | '__/ _\` | |   | | / _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
| |\\  |  __/ |_| | | | (_| | |   | ||  __/ |  | | | | | | | | | | (_| | |
\\_| \\_/\\___|\\__,_|_|  \\__,_|_|   \\_/ \\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|
                                                                          
Welcome to the Neural Terminal - Access Authorized
Connection secure. Enhanced cryptography enabled.
`,
                lastModified: new Date('2025-03-10')
              }
            }
          },
          var: {
            type: 'directory',
            content: {
              log: {
                type: 'directory',
                content: {
                  'system.log': {
                    type: 'file',
                    content: `[2025-03-11 08:00:01] System boot completed
[2025-03-11 08:00:05] Neural interface initialized
[2025-03-11 08:00:10] Security protocols activated
[2025-03-11 08:01:23] User session started
[2025-03-11 12:34:56] Connection from 192.168.1.45 established
[2025-03-11 15:45:12] System update available: v2.7.5
[2025-03-11 18:30:45] Low memory warning - cleared cache
[2025-03-11 23:59:59] Daily backup completed`,
                    lastModified: new Date('2025-03-11')
                  },
                  'auth.log': {
                    type: 'file',
                    content: `[2025-03-11 08:01:20] Authentication attempt for user: successful
[2025-03-11 09:15:34] Sudo command executed: system update
[2025-03-11 10:22:15] Authentication attempt from 203.0.113.42: failed
[2025-03-11 10:22:45] Authentication attempt from 203.0.113.42: failed
[2025-03-11 10:23:15] IP 203.0.113.42 blocked for 30 minutes
[2025-03-11 14:45:12] Authentication attempt for user: successful
[2025-03-11 16:30:00] Permission escalation: granted
[2025-03-11 20:15:23] Authentication attempt for guest: successful`,
                    lastModified: new Date('2025-03-11')
                  }
                }
              }
            }
          },
          tmp: {
            type: 'directory',
            content: {}
          }
        }
      }
    };


    this.currentPath = '/home/user';
  }


  getCurrentPath() {
    return this.currentPath;
  }


  getDirectoryAtPath(path) {
    const resolvedPath = this._resolvePath(path);
    const node = this._getNodeAtPath(resolvedPath);
    
    if (!node) {
      throw new Error(`Path not found: ${resolvedPath}`);
    }
    
    if (node.type !== 'directory') {
      throw new Error(`Not a directory: ${resolvedPath}`);
    }
    
    return node;
  }

  // Get the file object at a given path
  getFileAtPath(path) {
    const resolvedPath = this._resolvePath(path);
    const node = this._getNodeAtPath(resolvedPath);
    
    if (!node) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    
    if (node.type !== 'file') {
      throw new Error(`Not a file: ${resolvedPath}`);
    }
    
    return node;
  }

  // Change current directory
  changeDirectory(path) {
    const resolvedPath = this._resolvePath(path);
    const node = this._getNodeAtPath(resolvedPath);
    
    if (!node) {
      throw new Error(`Directory not found: ${resolvedPath}`);
    }
    
    if (node.type !== 'directory') {
      throw new Error(`Not a directory: ${resolvedPath}`);
    }
    
    this.currentPath = resolvedPath;
    return resolvedPath;
  }

  // List contents of a directory
  listDirectory(path = '.', options = { all: false, longFormat: false }) {
    const targetPath = this._resolvePath(path);
    const dir = this._getNodeAtPath(targetPath);
    
    if (!dir || dir.type !== 'directory') {
      throw new Error(`Cannot list directory: ${targetPath}`);
    }
    
    const entries = Object.entries(dir.content).filter(([name, _]) => {
      // Filter hidden files unless -a option is provided
      return options.all || !name.startsWith('.');
    });
    
    if (!options.longFormat) {
      // Simple format - just names
      return entries.map(([name, node]) => ({
        name,
        type: node.type
      }));
    } else {
      // Long format with details
      return entries.map(([name, node]) => {
        const isDir = node.type === 'directory';
        const isExec = node.type === 'file' && node.executable;
        const size = node.type === 'file' ? node.content.length : 0;
        const date = node.lastModified ? 
          node.lastModified.toISOString().split('T')[0] : 
          '2025-01-01';
          
        return {
          name,
          type: node.type,
          permissions: isDir ? 'drwxr-xr-x' : (isExec ? '-rwxr-xr-x' : '-rw-r--r--'),
          size,
          date,
          isDirectory: isDir,
          isExecutable: isExec
        };
      });
    }
  }

  // Create a new directory
  makeDirectory(path) {
    const resolvedPath = this._resolvePath(path);
    const parentPath = this._getParentPath(resolvedPath);
    const dirName = resolvedPath.split('/').pop();
    
    // Check if parent exists and is a directory
    const parent = this._getNodeAtPath(parentPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`Cannot create directory: parent directory does not exist`);
    }
    
    // Check if directory already exists
    if (parent.content[dirName]) {
      throw new Error(`Cannot create directory: ${resolvedPath} already exists`);
    }
    
    // Create the directory
    parent.content[dirName] = {
      type: 'directory',
      content: {}
    };
    
    return `Directory created: ${resolvedPath}`;
  }

  // Create a new file
  createFile(path, content = '') {
    const resolvedPath = this._resolvePath(path);
    const parentPath = this._getParentPath(resolvedPath);
    const fileName = resolvedPath.split('/').pop();
    
    // Check if parent exists and is a directory
    const parent = this._getNodeAtPath(parentPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`Cannot create file: parent directory does not exist`);
    }
    
    // Create or overwrite the file
    parent.content[fileName] = {
      type: 'file',
      content: content,
      lastModified: new Date()
    };
    
    return `File created: ${resolvedPath}`;
  }

  // Remove a file
  removeFile(path) {
    const resolvedPath = this._resolvePath(path);
    const parentPath = this._getParentPath(resolvedPath);
    const fileName = resolvedPath.split('/').pop();
    
    // Check if parent exists and is a directory
    const parent = this._getNodeAtPath(parentPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`Cannot remove file: parent directory does not exist`);
    }
    
    // Check if file exists
    if (!parent.content[fileName]) {
      throw new Error(`Cannot remove file: ${resolvedPath} does not exist`);
    }
    
    // Check if it's a file
    if (parent.content[fileName].type !== 'file') {
      throw new Error(`Cannot remove file: ${resolvedPath} is a directory`);
    }
    
    // Remove the file
    delete parent.content[fileName];
    
    return `File removed: ${resolvedPath}`;
  }

  // Remove a directory
  removeDirectory(path, recursive = false) {
    const resolvedPath = this._resolvePath(path);
    
    // Can't remove root
    if (resolvedPath === '/') {
      throw new Error('Cannot remove root directory');
    }
    
    const parentPath = this._getParentPath(resolvedPath);
    const dirName = resolvedPath.split('/').pop();
    
    // Check if parent exists and is a directory
    const parent = this._getNodeAtPath(parentPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`Cannot remove directory: parent directory does not exist`);
    }
    
    // Check if directory exists
    if (!parent.content[dirName]) {
      throw new Error(`Cannot remove directory: ${resolvedPath} does not exist`);
    }
    
    // Check if it's a directory
    if (parent.content[dirName].type !== 'directory') {
      throw new Error(`Cannot remove directory: ${resolvedPath} is a file`);
    }
    
    // Check if directory is empty or recursive is true
    const dirContents = Object.keys(parent.content[dirName].content);
    if (dirContents.length > 0 && !recursive) {
      throw new Error(`Cannot remove directory: ${resolvedPath} is not empty`);
    }
    
    // Remove the directory
    delete parent.content[dirName];
    
    return `Directory removed: ${resolvedPath}`;
  }

  // Get file content
  getFileContent(path) {
    const file = this.getFileAtPath(path);
    return file.content;
  }

  // Execute a file
  executeFile(path, args = []) {
    const resolvedPath = this._resolvePath(path);
    const file = this._getNodeAtPath(resolvedPath);
    
    if (!file) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    
    if (file.type !== 'file') {
      throw new Error(`Not a file: ${resolvedPath}`);
    }
    
    if (!file.executable) {
      throw new Error(`Permission denied: ${resolvedPath} is not executable`);
    }
    
    // Simply return the content for display
    return file.content;
  }

  // Helper function to resolve a path (relative or absolute)
  _resolvePath(path) {
    if (!path) return this.currentPath;
    
    // Handle absolute paths
    if (path.startsWith('/')) {
      return this._normalizePath(path);
    }
    
    // Handle special cases
    if (path === '.') {
      return this.currentPath;
    }
    
    if (path === '..') {
      return this._getParentPath(this.currentPath);
    }
    
    // Handle relative paths
    if (path.startsWith('./')) {
      path = path.substring(2);
    }
    
    let currentPathParts = this.currentPath.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    
    for (const part of pathParts) {
      if (part === '..') {
        if (currentPathParts.length > 0) {
          currentPathParts.pop();
        }
      } else if (part !== '.') {
        currentPathParts.push(part);
      }
    }
    
    return '/' + currentPathParts.join('/');
  }

  // Normalize a path (remove . and .. segments)
  _normalizePath(path) {
    const parts = path.split('/').filter(Boolean);
    const result = [];
    
    for (const part of parts) {
      if (part === '..') {
        if (result.length > 0) {
          result.pop();
        }
      } else if (part !== '.') {
        result.push(part);
      }
    }
    
    return '/' + result.join('/');
  }

  // Get the parent path of a given path
  _getParentPath(path) {
    const normalized = this._normalizePath(path);
    const parts = normalized.split('/').filter(Boolean);
    
    if (parts.length === 0) {
      return '/';
    }
    
    parts.pop();
    return '/' + parts.join('/');
  }

  // Get the node (file or directory) at a given path
  _getNodeAtPath(path) {
    const normalized = this._normalizePath(path);
    const parts = normalized.split('/').filter(Boolean);
    
    // Start at root
    let currentNode = this.fileSystem['/'];
    
    // Navigate through the path
    for (const part of parts) {
      if (!currentNode.content[part]) {
        return null;
      }
      currentNode = currentNode.content[part];
    }
    
    return currentNode;
  }
}

export default TerminalFileSystem;
