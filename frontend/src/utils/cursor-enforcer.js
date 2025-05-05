/**
 * cursor-enforcer.js - Ensures cursor visibility throughout the application
 * Add this script at the end of your body tag to ensure it runs after everything else
 */

// Function to fix cursor visibility
function enforceCursorVisibility() {
  // Set default cursor for all elements
  document.querySelectorAll('*').forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.cursor === 'none') {
      el.style.setProperty('cursor', 'auto', 'important');
    }
  });
  
  // Set pointer cursor for interactive elements
  const interactiveElements = document.querySelectorAll(`
    a, button, input[type="button"], input[type="submit"], input[type="reset"],
    select, [role="button"], .cyber-button, .neon-button, .holographic-button,
    .neon-link, .menu-toggle, .themeToggle, .audioToggle, .performanceToggle,
    .categoryButton, .timelineCard, .menuLink, .closeButton, .socialLink,
    .footerLink, .logoLink, label[for], .menu-item, .neon-border, .neon-text,
    .glitch-text, .cyber-card, .data-panel, .holographic
  `);
  
  interactiveElements.forEach(el => {
    el.style.setProperty('cursor', 'pointer', 'important');
  });
  
  // Remove any custom cursor elements
  const customCursors = document.querySelectorAll(`
    .cyber-cursor, .cyber-cursor-dot, .custom-cursor, .cursor-follower,
    #cursor, #cursor-dot, .cursor-dot, .cursor-inner, .cursor-outer
  `);
  
  customCursors.forEach(el => {
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
  });
  
  console.log("Cursor visibility enforced");
}

// Run immediately
enforceCursorVisibility();

// Run again after full page load
window.addEventListener('load', enforceCursorVisibility);

// Run periodically to catch any dynamically added elements
setInterval(enforceCursorVisibility, 2000);

// Detect and override any attempts to change cursor style
const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
  if (propertyName === 'cursor' && value === 'none') {
    return originalSetProperty.call(this, propertyName, 'auto', 'important');
  }
  return originalSetProperty.call(this, propertyName, value, priority);
};
