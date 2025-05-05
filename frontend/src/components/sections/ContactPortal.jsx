import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ContactPortal.module.css';

const ContactPortal = () => {
  const { theme } = useTheme();
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

    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
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
  

  

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions with performance throttling
    const setCanvasDimensions = () => {
      // Skip if canvas is not visible
      if (canvas.offsetWidth === 0) return;
      
      // Only resize if dimensions really changed to avoid unnecessary work
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };
    
    // Throttle resize listener
    let resizeTimeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasDimensions, 250);
    };
    
    window.addEventListener('resize', handleResize);
    setCanvasDimensions();
    
    // Optimize connection points detection
    // Cache DOM elements to avoid querying on every frame
    let connectionPoints = [];
    let lastConnectionUpdate = 0;
    const connectionUpdateInterval = 500; // ms
    
    const getConnectionPoints = () => {
      const now = Date.now();
      
      // Only update connection points every 500ms
      if (now - lastConnectionUpdate < connectionUpdateInterval) {
        return connectionPoints;
      }
      
      lastConnectionUpdate = now;
      const formElement = canvas.parentElement;
      if (!formElement) return [];
      
      const points = [];
      
      // Get positions of form elements
      const inputElements = formElement.querySelectorAll('.connection-point');
      const canvasRect = canvas.getBoundingClientRect();
      
      inputElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
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
      
      connectionPoints = points;
      return points;
    };
    
    // Reduce particle count
    const maxParticles = 30; // Limit max particles
    let particles = [];
    
    // Create particle between two points - with reduced frequency
    const createParticle = (startPoint, endPoint) => {
      // Skip if we already have too many particles
      if (particles.length >= maxParticles) return;
      
      const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
      const distance = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) + 
        Math.pow(endPoint.y - startPoint.y, 2)
      );
      
      // Create fewer particles - max 1-2 per path
      const particleCount = Math.min(1, Math.floor(distance / 200));
      
      for (let i = 0; i < particleCount; i++) {
        const position = Math.random();
        
        particles.push({
          x: startPoint.x + (endPoint.x - startPoint.x) * position,
          y: startPoint.y + (endPoint.y - startPoint.y) * position,
          angle,
          speed: 1 + Math.random(), // reduced speed variation
          distance,
          progress: position,
          size: 2, // fixed size to reduce calculations
          color: theme === 'dark' ? 
            'rgba(0, 255, 245, 0.7)' : 
            'rgba(77, 77, 255, 0.7)',
          startPoint,
          endPoint
        });
      }
    };
    
    // Draw connections and animate particles
    const drawConnections = () => {
      // Skip rendering if not visible
      if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get connection points with caching
      const points = getConnectionPoints();
      if (points.length === 0) return;
      
      // Submit button is the last point
      const submitPoint = points[points.length - 1];
      
      // Connect form fields to submit button
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = submitPoint;
        
        // Draw connection line - simpler style
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        
        ctx.strokeStyle = theme === 'dark' ? 
          'rgba(0, 255, 245, 0.2)' : 
          'rgba(77, 77, 255, 0.2)';
        
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Create particles with reduced frequency
        if (startPoint.active && Math.random() > 0.94) {
          createParticle(startPoint, endPoint);
        }
      }
      
      // Draw connection points - simplified
      points.forEach(point => {
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = point.active ? 
          (theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)') : 
          'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        // Draw pulse if active - less frequent updates
        if (point.active) {
          // Update pulse only sometimes
          if (Math.random() > 0.7) {
            point.pulseRadius = (point.pulseRadius + 0.5) % 20;
            point.pulseOpacity = 1 - point.pulseRadius / 20;
          }
          
          // Draw pulse
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.pulseRadius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = theme === 'dark' ? 
            `rgba(0, 255, 245, ${point.pulseOpacity})` : 
            `rgba(77, 77, 255, ${point.pulseOpacity})`;
          ctx.lineWidth = 1; // reduced line width
          ctx.stroke();
        }
      });
      
      // Update and draw particles - with optimizations
      const updatedParticles = [];
      
      for (const particle of particles) {
        // Update progress with smaller steps
        particle.progress += particle.speed / (particle.distance * 2);
        
        // Calculate new position
        particle.x = particle.startPoint.x + 
          (particle.endPoint.x - particle.startPoint.x) * particle.progress;
        particle.y = particle.startPoint.y + 
          (particle.endPoint.y - particle.startPoint.y) * particle.progress;
        
        // Keep if still active
        if (particle.progress < 1) {
          updatedParticles.push(particle);
          
          // Draw particle - simplified
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        }
      }
      
      // Update particles array - limit to max number
      particles = updatedParticles.slice(0, maxParticles);
      
      // Generate more particles when submitting - but less frequently
      if (isSubmitting && Math.random() > 0.9) {
        points.forEach(point => {
          if (point !== submitPoint && Math.random() > 0.9) {
            createParticle(point, submitPoint);
          }
        });
      }
    };
    
    // Reduce animation frame rate
    let frameSkip = 0;
    let animationId;
    let isVisible = true;
    
    // Handle page visibility
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      
      if (isVisible && !animationId) {
        animate();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Animation loop with frame skipping for better performance
    const animate = () => {
      if (!isVisible) {
        cancelAnimationFrame(animationId);
        animationId = null;
        return;
      }
      
      // Skip frames for performance
      frameSkip++;
      if (frameSkip % 2 === 0) { // Only render on every other frame
        drawConnections();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    <section className={styles.contactSection} id="contact">
      <div className="container">
        <motion.h1 
          className={styles.pageTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Neural Communication Channel
        </motion.h1>
        
        <motion.div 
          className={styles.contactContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <canvas 
            ref={canvasRef} 
            className={styles.contactCanvas}
            aria-hidden="true"
          ></canvas>
          
          <div className={styles.contactColumns}>
            <motion.div 
              className={styles.contactInfo}
              variants={itemVariants}
            >
              <div className={styles.infoContainer}>
                <h2 className={styles.infoTitle}>Communication Vectors</h2>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.infoSectionTitle}>Physical Location</h3>
                  <p className={styles.infoText}>Annapolis, Maryland</p>
                </div>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.infoSectionTitle}>Neural Bandwidth</h3>
                  <p className={styles.infoText}>
                    <a href="mailto:CarterPerez-dev@ProxyAuthRequired.com" className={styles.infoLink}>
                      CarterPerez-dev@ProxyAuthRequired.com
                    </a>
                  </p>
                </div>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.infoSectionTitle}>Frequency Channel</h3>
                  <p className={styles.infoText}>+1 443-510-0866</p>
                </div>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.infoSectionTitle}>Digital Nexus Points</h3>
                  <div className={styles.socialLinks}>
                    <a 
                      href="https://github.com/CarterPerez-dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      GitHub
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/carterperez-dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
                
                <div className={styles.contactData}>
                  <div className={styles.dataItem}>
                    <div className={styles.dataLabel}>STATUS</div>
                    <div className={`${styles.dataValue} ${styles.dataValueAvailable}`}>AVAILABLE</div>
                  </div>
                  
                  <div className={styles.dataItem}>
                    <div className={styles.dataLabel}>RESPONSE TIME</div>
                    <div className={styles.dataValue}>24-48 HRS</div>
                  </div>
                  
                  <div className={styles.dataItem}>
                    <div className={styles.dataLabel}>PRIORITY CHANNELS</div>
                    <div className={styles.dataValue}>EMAIL / FORM</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.contactFormContainer}
              variants={itemVariants}
            >
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Establish Connection</h2>
                  <div className={styles.formSubtitle}>Send a direct message to my neural interface</div>
                </div>
                
                <div className={styles.formBody}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Identifier</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.name ? styles.formInputError : ''} connection-point`}
                      data-field="name"
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                    {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>Neural Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.email ? styles.formInputError : ''} connection-point`}
                      data-field="email"
                      placeholder="Your email"
                      disabled={isSubmitting}
                    />
                    {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.formLabel}>Transmission Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.subject ? styles.formInputError : ''} connection-point`}
                      data-field="subject"
                      placeholder="Message subject"
                      disabled={isSubmitting}
                    />
                    {errors.subject && <div className={styles.errorMessage}>{errors.subject}</div>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.formLabel}>Signal Content</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      className={`${styles.formTextarea} ${errors.message ? styles.formTextareaError : ''} connection-point`}
                      data-field="message"
                      placeholder="Your message"
                      rows="5"
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <div className={styles.errorMessage}>{errors.message}</div>}
                  </div>
                  
                  <div className={styles.formSecurity}>
                    <div className={styles.securityCode}>
                      <span className={styles.securityLabel}>SECURITY CODE:</span>
                      <span className={styles.securityValue}>{securityCode}</span>
                    </div>
                    
                    <div className={styles.securityMessage}>
                      Human verification complete. You are authorized to proceed.
                    </div>
                  </div>
                </div>
                
                <div className={styles.formFooter}>
                  <button 
                    type="submit" 
                    className={`${styles.submitButton} connection-point submit-button`}
                    data-field="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className={styles.buttonText}>
                        <span className={styles.loadingIcon}></span>
                        TRANSMITTING...
                      </span>
                    ) : (
                      <span className={styles.buttonText}>INITIATE TRANSMISSION</span>
                    )}
                  </button>
                </div>
              </form>
              
              {showSuccess && (
                <div className={`${styles.formNotification} ${styles.formNotificationSuccess}`}>
                  <div className={`${styles.notificationIcon} ${styles.notificationIconSuccess}`}>✓</div>
                  <div className={styles.notificationContent}>
                    <div className={`${styles.notificationTitle} ${styles.notificationTitleSuccess}`}>TRANSMISSION SUCCESSFUL</div>
                    <div className={styles.notificationMessage}>
                      Your message has been received. I will respond through your provided neural address.
                    </div>
                  </div>
                </div>
              )}
              
              {showFailure && (
                <div className={`${styles.formNotification} ${styles.formNotificationError}`}>
                  <div className={`${styles.notificationIcon} ${styles.notificationIconError}`}>!</div>
                  <div className={styles.notificationContent}>
                    <div className={`${styles.notificationTitle} ${styles.notificationTitleError}`}>TRANSMISSION FAILED</div>
                    <div className={styles.notificationMessage}>
                      A neural interference occurred. Please try again or use an alternate communication vector.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPortal;
