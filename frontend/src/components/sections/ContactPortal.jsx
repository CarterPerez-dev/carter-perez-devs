import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';

const ContactPortal = () => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  
  // Generate random security code
  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSecurityCode(code);
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle input focus
  const handleFocus = (field) => {
    setFocusedField(field);
    playSound('hover');
  };
  
  // Handle input blur
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound('click');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real implementation, this would be a fetch call to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setIsSubmitting(false);
        setShowSuccess(false);
        
        // Generate new security code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setSecurityCode(newCode);
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error message
      setShowFailure(true);
      
      // Hide error message after delay
      setTimeout(() => {
        setIsSubmitting(false);
        setShowFailure(false);
      }, 3000);
    }
  };
  
  // Digital connection animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();
    
    // Connection points (input fields + submit button)
    const getConnectionPoints = () => {
      const formElement = canvas.parentElement;
      if (!formElement) return [];
      
      const points = [];
      
      // Get positions of form elements
      const inputElements = formElement.querySelectorAll('.connection-point');
      
      inputElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // Calculate position relative to canvas
        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top + rect.height / 2;
        
        // Add connection point with active state
        const fieldName = el.dataset.field;
        const isActive = fieldName === focusedField || 
                        (el.classList.contains('submit-button') && isSubmitting);
        
        points.push({
          x,
          y,
          active: isActive,
          pulseRadius: 0,
          pulseOpacity: 1,
          field: fieldName
        });
      });
      
      return points;
    };
    
    // Data flow particles
    let particles = [];
    
    // Create particle between two points
    const createParticle = (startPoint, endPoint) => {
      const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
      const distance = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) + 
        Math.pow(endPoint.y - startPoint.y, 2)
      );
      
      // Create multiple particles along the path
      const particleCount = Math.max(1, Math.floor(distance / 50));
      
      for (let i = 0; i < particleCount; i++) {
        const position = Math.random();
        
        particles.push({
          x: startPoint.x + (endPoint.x - startPoint.x) * position,
          y: startPoint.y + (endPoint.y - startPoint.y) * position,
          angle,
          speed: 1 + Math.random() * 3,
          distance,
          progress: position,
          size: 2 + Math.random() * 3,
          color: theme === 'dark' ? 
            (Math.random() > 0.3 ? 'rgba(0, 255, 245, 0.7)' : 'rgba(255, 61, 61, 0.7)') :
            (Math.random() > 0.3 ? 'rgba(77, 77, 255, 0.7)' : 'rgba(255, 61, 61, 0.7)'),
          startPoint,
          endPoint
        });
      }
    };
    
    // Draw connections and animate particles
    const drawConnections = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get connection points
      const points = getConnectionPoints();
      if (points.length === 0) return;
      
      // Submit button is the last point
      const submitPoint = points[points.length - 1];
      
      // Connect form fields to submit button
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = submitPoint;
        
        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        
        const gradient = ctx.createLinearGradient(
          startPoint.x, startPoint.y,
          endPoint.x, endPoint.y
        );
        
        const primaryColor = theme === 'dark' ? 
          'rgba(0, 255, 245, 0.2)' : 'rgba(77, 77, 255, 0.2)';
        const secondaryColor = 'rgba(255, 61, 61, 0.2)';
        
        gradient.addColorStop(0, startPoint.active ? primaryColor : secondaryColor);
        gradient.addColorStop(1, submitPoint.active ? primaryColor : secondaryColor);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = startPoint.active || submitPoint.active ? 2 : 1;
        ctx.stroke();
        
        // Create particles if field is active
        if (startPoint.active && Math.random() > 0.7) {
          createParticle(startPoint, endPoint);
        }
      }
      
      // Draw connection points
      points.forEach(point => {
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = point.active ? 
          (theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)') : 
          'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        // Draw pulse if active
        if (point.active) {
          // Update pulse
          point.pulseRadius = (point.pulseRadius + 0.5) % 20;
          point.pulseOpacity = 1 - point.pulseRadius / 20;
          
          // Draw pulse
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.pulseRadius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = theme === 'dark' ? 
            `rgba(0, 255, 245, ${point.pulseOpacity})` : 
            `rgba(77, 77, 255, ${point.pulseOpacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Update and draw particles
      const updatedParticles = [];
      
      for (const particle of particles) {
        // Update progress
        particle.progress += particle.speed / particle.distance;
        
        // Calculate new position
        particle.x = particle.startPoint.x + 
          (particle.endPoint.x - particle.startPoint.x) * particle.progress;
        particle.y = particle.startPoint.y + 
          (particle.endPoint.y - particle.startPoint.y) * particle.progress;
        
        // Keep if still active
        if (particle.progress < 1) {
          updatedParticles.push(particle);
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        }
      }
      
      // Update particles array
      particles = updatedParticles;
      
      // Generate more particles when submitting
      if (isSubmitting) {
        points.forEach(point => {
          if (point !== submitPoint && Math.random() > 0.7) {
            createParticle(point, submitPoint);
          }
        });
      }
    };
    
    // Animation loop
    let animationId;
    const animate = () => {
      drawConnections();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, focusedField, isSubmitting]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Neural Communication Channel
        </motion.h1>
        
        <motion.div 
          className="contact-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <canvas 
            ref={canvasRef} 
            className="contact-canvas"
            aria-hidden="true"
          ></canvas>
          
          <div className="contact-columns">
            <motion.div 
              className="contact-info"
              variants={itemVariants}
            >
              <div className="info-container">
                <h2 className="info-title">Communication Vectors</h2>
                
                <div className="info-section">
                  <h3 className="info-section-title">Physical Location</h3>
                  <p className="info-text">Annapolis, Maryland</p>
                </div>
                
                <div className="info-section">
                  <h3 className="info-section-title">Neural Bandwidth</h3>
                  <p className="info-text">
                    <a href="mailto:CarterPerez-dev@ProxyAuthRequired.com" className="info-link">
                      CarterPerez-dev@ProxyAuthRequired.com
                    </a>
                  </p>
                </div>
                
                <div className="info-section">
                  <h3 className="info-section-title">Frequency Channel</h3>
                  <p className="info-text">+1 443-510-0866</p>
                </div>
                
                <div className="info-section">
                  <h3 className="info-section-title">Digital Nexus Points</h3>
                  <div className="social-links">
                    <a 
                      href="https://github.com/CarterPerez-dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link"
                      onClick={() => playSound('click')}
                    >
                      GitHub
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/carter-perez-ProxyAuthRequired/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link"
                      onClick={() => playSound('click')}
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
                
                <div className="contact-data">
                  <div className="data-item">
                    <div className="data-label">STATUS</div>
                    <div className="data-value available">AVAILABLE</div>
                  </div>
                  
                  <div className="data-item">
                    <div className="data-label">RESPONSE TIME</div>
                    <div className="data-value">24-48 HRS</div>
                  </div>
                  
                  <div className="data-item">
                    <div className="data-label">PRIORITY CHANNELS</div>
                    <div className="data-value">EMAIL / FORM</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="contact-form-container"
              variants={itemVariants}
            >
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-header">
                  <h2 className="form-title">Establish Connection</h2>
                  <div className="form-subtitle">Send a direct message to my neural interface</div>
                </div>
                
                <div className="form-body">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Identifier</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      className={`form-input connection-point ${errors.name ? 'error' : ''}`}
                      data-field="name"
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Neural Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className={`form-input connection-point ${errors.email ? 'error' : ''}`}
                      data-field="email"
                      placeholder="Your email"
                      disabled={isSubmitting}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Transmission Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={handleBlur}
                      className={`form-input connection-point ${errors.subject ? 'error' : ''}`}
                      data-field="subject"
                      placeholder="Message subject"
                      disabled={isSubmitting}
                    />
                    {errors.subject && <div className="error-message">{errors.subject}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Signal Content</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      className={`form-textarea connection-point ${errors.message ? 'error' : ''}`}
                      data-field="message"
                      placeholder="Your message"
                      rows="5"
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <div className="error-message">{errors.message}</div>}
                  </div>
                  
                  <div className="form-security">
                    <div className="security-code">
                      <span className="security-label">SECURITY CODE:</span>
                      <span className="security-value">{securityCode}</span>
                    </div>
                    
                    <div className="security-message">
                      Human verification complete. You are authorized to proceed.
                    </div>
                  </div>
                </div>
                
                <div className="form-footer">
                  <button 
                    type="submit" 
                    className="submit-button connection-point"
                    data-field="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="button-text">
                        <span className="loading-icon"></span>
                        TRANSMITTING...
                      </span>
                    ) : (
                      <span className="button-text">INITIATE TRANSMISSION</span>
                    )}
                  </button>
                </div>
              </form>
              
              {showSuccess && (
                <div className="form-notification success">
                  <div className="notification-icon">✓</div>
                  <div className="notification-content">
                    <div className="notification-title">TRANSMISSION SUCCESSFUL</div>
                    <div className="notification-message">
                      Your message has been received. I will respond through your provided neural address.
                    </div>
                  </div>
                </div>
              )}
              
              {showFailure && (
                <div className="form-notification error">
                  <div className="notification-icon">!</div>
                  <div className="notification-content">
                    <div className="notification-title">TRANSMISSION FAILED</div>
                    <div className="notification-message">
                      A neural interference occurred. Please try again or use an alternate communication vector.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .contact-section {
          padding: var(--space-xxl) 0;
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .page-title {
          text-align: center;
          margin-bottom: var(--space-xl);
          color: var(--accent-cyan);
          font-size: 3rem;
          position: relative;
        }
        
        .page-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent-cyan),
            transparent
          );
        }
        
        .contact-container {
          position: relative;
          width: 100%;
          min-height: 600px;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .contact-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        
        .contact-columns {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xl);
          position: relative;
          z-index: 1;
        }
        
        .contact-info {
          flex: 1;
          min-width: 300px;
        }
        
        .info-container {
          background-color: rgba(10, 10, 10, 0.75);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--border-radius-md);
          padding: var(--space-lg);
          height: 100%;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(5px);
        }
        
        .info-title {
          font-size: 1.5rem;
          color: var(--accent-cyan);
          margin-bottom: var(--space-lg);
          position: relative;
        }
        
        .info-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 2px;
          background-color: var(--accent-cyan);
        }
        
        .info-section {
          margin-bottom: var(--space-lg);
        }
        
        .info-section-title {
          font-size: 0.9rem;
          font-family: var(--font-mono);
          color: var(--accent-magenta);
          margin-bottom: var(--space-xs);
          letter-spacing: 1px;
        }
        
        .info-text {
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        
        .info-link {
          color: var(--accent-cyan);
          position: relative;
          transition: all var(--transition-normal);
        }
        
        .info-link:hover {
          color: var(--accent-blue);
        }
        
        .social-links {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-xs);
        }
        
        .social-link {
          display: inline-block;
          padding: var(--space-xs) var(--space-md);
          background-color: rgba(0, 255, 245, 0.1);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--border-radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          transition: all var(--transition-normal);
        }
        
        .social-link:hover {
          background-color: var(--accent-cyan);
          color: var(--bg-primary);
          transform: translateY(-2px);
        }
        
        .contact-data {
          margin-top: auto;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-sm);
          padding: var(--space-md);
        }
        
        .data-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-xs);
        }
        
        .data-item:last-child {
          margin-bottom: 0;
        }
        
        .data-label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .data-value {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--accent-cyan);
        }
        
        .data-value.available {
          color: var(--accent-green);
        }
        
        .contact-form-container {
          flex: 1.5;
          min-width: 400px;
          position: relative;
        }
        
        .contact-form {
          background-color: rgba(10, 10, 10, 0.75);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          backdrop-filter: blur(5px);
        }
        
        .form-header {
          padding: var(--space-md) var(--space-lg);
          background-color: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(0, 255, 245, 0.2);
        }
        
        .form-title {
          font-size: 1.5rem;
          color: var(--accent-cyan);
          margin-bottom: var(--space-xs);
        }
        
        .form-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .form-body {
          padding: var(--space-lg);
          flex: 1;
        }
        
        .form-group {
          margin-bottom: var(--space-lg);
        }
        
        .form-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-xs);
        }
        
        .form-input,
        .form-textarea {
          width: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius-sm);
          padding: var(--space-sm) var(--space-md);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 1rem;
          transition: all var(--transition-normal);
        }
        
        .form-input:focus,
        .form-textarea:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 255, 245, 0.2);
          outline: none;
        }
        
        .form-input.error,
        .form-textarea.error {
          border-color: var(--accent-magenta);
          box-shadow: 0 0 10px rgba(255, 61, 61, 0.2);
        }
        
        .error-message {
          color: var(--accent-magenta);
          font-size: 0.8rem;
          margin-top: var(--space-xs);
          font-family: var(--font-mono);
        }
        
        .form-security {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-sm);
          padding: var(--space-sm) var(--space-md);
          margin-bottom: var(--space-md);
        }
        
        .security-code {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        
        .security-label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .security-value {
          font-family: var(--font-mono);
          font-size: 1rem;
          color: var(--accent-cyan);
          letter-spacing: 1px;
        }
        
        .security-message {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--accent-green);
        }
        
        .form-footer {
          padding: var(--space-md) var(--space-lg);
          background-color: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(0, 255, 245, 0.2);
          display: flex;
          justify-content: flex-end;
        }
        
        .submit-button {
          padding: var(--space-sm) var(--space-xl);
          background-color: rgba(0, 255, 245, 0.1);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--border-radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          letter-spacing: 1px;
          transition: all var(--transition-normal);
          cursor: none;
          position: relative;
          overflow: hidden;
        }
        
        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 245, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .submit-button:hover {
          background-color: rgba(0, 255, 245, 0.2);
          transform: translateY(-2px);
        }
        
        .submit-button:hover::before {
          left: 100%;
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .submit-button:disabled:hover {
          transform: none;
        }
        
        .button-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
        }
        
        .loading-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 255, 245, 0.3);
          border-top: 2px solid var(--accent-cyan);
          border-radius: 50%;
          animation: loading-spin 1s linear infinite;
        }
        
        .form-notification {
          position: absolute;
          bottom: var(--space-md);
          left: 0;
          right: 0;
          width: 80%;
          margin: 0 auto;
          padding: var(--space-md);
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          animation: slide-up 0.5s ease-out;
        }
        
        .form-notification.success {
          background-color: rgba(0, 255, 165, 0.1);
          border: 1px solid var(--accent-green);
        }
        
        .form-notification.error {
          background-color: rgba(255, 61, 61, 0.1);
          border: 1px solid var(--accent-magenta);
        }
        
        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .success .notification-icon {
          background-color: rgba(0, 255, 165, 0.2);
          color: var(--accent-green);
        }
        
        .error .notification-icon {
          background-color: rgba(255, 61, 61, 0.2);
          color: var(--accent-magenta);
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-title {
          font-family: var(--font-mono);
          font-size: 1rem;
          margin-bottom: var(--space-xs);
        }
        
        .success .notification-title {
          color: var(--accent-green);
        }
        
        .error .notification-title {
          color: var(--accent-magenta);
        }
        
        .notification-message {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        /* Light theme styles */
        .light-theme .info-container,
        .light-theme .contact-form {
          background-color: rgba(245, 245, 245, 0.75);
          border-color: var(--accent-blue);
        }
        
        .light-theme .form-header,
        .light-theme .form-footer {
          background-color: rgba(220, 220, 220, 0.3);
          border-color: rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .info-title,
        .light-theme .form-title,
        .light-theme .data-value,
        .light-theme .security-value {
          color: var(--accent-blue);
        }
        
        .light-theme .info-title::after {
          background-color: var(--accent-blue);
        }
        
        .light-theme .form-input,
        .light-theme .form-textarea {
          background-color: rgba(255, 255, 255, 0.3);
          border-color: rgba(0, 0, 0, 0.1);
        }
        
        .light-theme .form-input:focus,
        .light-theme .form-textarea:focus {
          border-color: var(--accent-blue);
          box-shadow: 0 0 10px rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .contact-data,
        .light-theme .form-security {
          background-color: rgba(220, 220, 220, 0.3);
        }
        
        .light-theme .social-link {
          background-color: rgba(77, 77, 255, 0.1);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
        }
        
        .light-theme .social-link:hover {
          background-color: var(--accent-blue);
          color: white;
        }
        
        .light-theme .submit-button {
          background-color: rgba(77, 77, 255, 0.1);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
        }
        
        .light-theme .submit-button::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(77, 77, 255, 0.2),
            transparent
          );
        }
        
        .light-theme .submit-button:hover {
          background-color: rgba(77, 77, 255, 0.2);
        }
        
        .light-theme .loading-icon {
          border-color: rgba(77, 77, 255, 0.3);
          border-top-color: var(--accent-blue);
        }
        
        /* Animations */
        @keyframes loading-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        /* Media queries */
        @media (max-width: 1200px) {
          .contact-columns {
            flex-direction: column;
          }
          
          .contact-info,
          .contact-form-container {
            width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }
          
          .info-title,
          .form-title {
            font-size: 1.3rem;
          }
          
          .form-security {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-xs);
          }
          
          .security-message {
            font-size: 0.7rem;
          }
        }
        
        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }
          
          .contact-form-container {
            min-width: 100%;
          }
          
          .form-body,
          .info-container {
            padding: var(--space-md);
          }
          
          .form-header,
          .form-footer {
            padding: var(--space-sm) var(--space-md);
          }
          
          .submit-button {
            width: 100%;
          }
          
          .form-notification {
            width: 90%;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactPortal;
