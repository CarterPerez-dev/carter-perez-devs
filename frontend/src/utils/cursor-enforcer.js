function enforceCursorVisibility() {
  document.querySelectorAll('*').forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.cursor === 'none') {
      el.style.setProperty('cursor', 'auto', 'important');
    }
  });
  
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

enforceCursorVisibility();

window.addEventListener('load', enforceCursorVisibility);

setInterval(enforceCursorVisibility, 2000);

const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
  if (propertyName === 'cursor' && value === 'none') {
    return originalSetProperty.call(this, propertyName, 'auto', 'important');
  }
  return originalSetProperty.call(this, propertyName, value, priority);
};
