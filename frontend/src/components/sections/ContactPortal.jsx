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
    
    // Submit form to backend
    try {
      const response = await fetch('/portfolio/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
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
      } else {
        throw new Error('Failed to send message');
      }
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
  
  // Optimized canvas rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set canvas dimensions with device pixel ratio for sharpness
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale context
      ctx.scale(dpr, dpr);
    };
    
    // Throttle resize event
    let resizeTimeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasDimensions, 300);
    };
    
    window.addEventListener('resize', handleResize);
    setCanvasDimensions();
    
    // Cached connection points and lines
    const connectionPoints = [];
    const maxParticles = 10; // Reduced from 30
    let particles = [];
    
    // Setup connection points - only once instead of every frame
    const setupConnectionPoints = () => {
      connectionPoints.length = 0;
      
      const formElement = canvas.parentElement;
      if (!formElement) return;
      
      // Get positions of form elements
      const inputElements = formElement.querySelectorAll('.connection-point');
      const canvasRect = canvas.getBoundingClientRect();
      
      inputElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // Calculate position relative to canvas
        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top + rect.height / 2;
        
        // Add connection point
        const fieldName = el.dataset.field;
        
        connectionPoints.push({
          x,
          y,
          field: fieldName,
          pulseRadius: 0
        });
      });
      
      // Pre-calculate connections
      for (let i = 0; i < connectionPoints.length - 1; i++) {
        const point = connectionPoints[i];
        point.connections = [{
          target: connectionPoints[connectionPoints.length - 1],
          distance: calculateDistance(point, connectionPoints[connectionPoints.length - 1])
        }];
      }
    };
    
    const calculateDistance = (point1, point2) => {
      return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + 
        Math.pow(point2.y - point1.y, 2)
      );
    };
    
    // Create a particle with simplified properties
    const createParticle = (startPoint, endPoint) => {
      // Skip if too many particles
      if (particles.length >= maxParticles) return;
      
      // Create particle with simpler properties
      particles.push({
        x: startPoint.x,
        y: startPoint.y,
        targetX: endPoint.x,
        targetY: endPoint.y,
        progress: 0,
        speed: 0.01 + Math.random() * 0.01
      });
    };
    
    // Simpler draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      
      // Update connection point active states
      connectionPoints.forEach(point => {
        point.active = (point.field === focusedField) || 
                      (point.field === 'submit' && isSubmitting);
      });
      
      // Draw connection lines
      connectionPoints.forEach(point => {
        if (point.connections) {
          point.connections.forEach(connection => {
            // Draw line
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(connection.target.x, connection.target.y);
            
            ctx.strokeStyle = theme === 'dark' ? 
              'rgba(0, 255, 245, 0.2)' : 
              'rgba(77, 77, 255, 0.2)';
            
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Create particles occasionally
            if (point.active && Math.random() > 0.97) {
              createParticle(point, connection.target);
            }
          });
        }
      });
      
      // Draw connection points
      connectionPoints.forEach(point => {
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = point.active ? 
          (theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)') : 
          'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        // Simplified pulse effect
        if (point.active) {
          // Update pulse only on active nodes
          point.pulseRadius = (point.pulseRadius + 0.2) % 15;
          
          // Draw pulse
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.pulseRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = theme === 'dark' ? 
            `rgba(0, 255, 245, ${0.7 - point.pulseRadius / 15})` : 
            `rgba(77, 77, 255, ${0.7 - point.pulseRadius / 15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      
      // Update and draw particles
      const remainingParticles = [];
      
      for (const particle of particles) {
        // Linear interpolation for position
        particle.progress += particle.speed;
        
        if (particle.progress < 1) {
          // Calculate new position
          particle.x = particle.x + (particle.targetX - particle.x) * particle.speed * 2;
          particle.y = particle.y + (particle.targetY - particle.y) * particle.speed * 2;
          
          // Keep particle
          remainingParticles.push(particle);
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = theme === 'dark' ? 'rgba(0, 255, 245, 0.7)' : 'rgba(77, 77, 255, 0.7)';
          ctx.fill();
        }
      }
      
      // Update particles array
      particles = remainingParticles;
    };
    
    // Setup connection points once
    setupConnectionPoints();
    
    // More efficient animation with requestAnimationFrame
    let lastFrameTime = 0;
    const targetFPS = 30; // Reduce FPS for better performance
    const frameInterval = 1000 / targetFPS;
    
    const animate = (timestamp) => {
      if (!document.hidden) {
        // Calculate time since last frame
        const elapsed = timestamp - lastFrameTime;
        
        // Only render if enough time has passed (frame limiting)
        if (elapsed > frameInterval) {
          lastFrameTime = timestamp - (elapsed % frameInterval);
          draw();
        }
        
        requestAnimationFrame(animate);
      }
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastFrameTime = performance.now();
        requestAnimationFrame(animate);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start animation
    requestAnimationFrame(animate);
    
    // Clean up
    return () => {
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
                    <a href="mailto:CarterPerez-dev@gmail.com" className={styles.infoLink}>
                      CarterPerez-dev@gmail.com
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
