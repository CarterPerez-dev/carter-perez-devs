import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Global styles
import './styles/reset.css'
import './styles/base.css'
import './styles/cyberpunk.css'
import './styles/animations.css'
import './styles/glitch.css'
import './styles/responsive.css'
import './styles/cursor-fix.css'
import './styles/global-cursor-fix.css';

// Theme context setup
import { ThemeProvider } from './contexts/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
          <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

window.addEventListener('DOMContentLoaded', () => {
  const performanceTest = () => {
    let startTime = performance.now();
    let iterations = 10000000;
    
    for (let i = 0; i < iterations; i++) {
      Math.sqrt(Math.random());
    }
    
    let endTime = performance.now();
    let duration = endTime - startTime;
    
    let performanceLevel = 5;
    
    if (duration > 500) performanceLevel = 1;
    else if (duration > 300) performanceLevel = 2;
    else if (duration > 200) performanceLevel = 3;
    else if (duration > 100) performanceLevel = 4;
    
    localStorage.setItem('performanceLevel', performanceLevel);
    console.log(`Performance level: ${performanceLevel}`);
  };
  
  performanceTest();
});
