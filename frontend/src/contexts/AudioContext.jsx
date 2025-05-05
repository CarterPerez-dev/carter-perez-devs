// frontend/src/contexts/AudioContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context with default values
const AudioContext = createContext({
  audioEnabled: false,
  toggleAudio: () => {},
  playSound: () => {},
  initializeAudio: () => {},
});

// Custom hook to use the audio context
export const useAudio = () => useContext(AudioContext);

// Audio provider component
export const AudioProvider = ({ children }) => {
  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(null);
  const [hoverSound, setHoverSound] = useState(null);
  const [clickSound, setClickSound] = useState(null);

  // Initialize audio elements
  const initializeAudio = useCallback(() => {
    if (audioInitialized) return;
    
    const ambient = document.getElementById('ambient-background');
    const hover = document.getElementById('ui-sound-hover');
    const click = document.getElementById('ui-sound-click');
    
    if (ambient && hover && click) {
      setAmbientAudio(ambient);
      setHoverSound(hover);
      setClickSound(click);
      
      // Set volume levels
      ambient.volume = 0.1;
      hover.volume = 0.2;
      click.volume = 0.3;
      
      setAudioInitialized(true);
      
      // Get saved audio preference from localStorage
      const savedAudioEnabled = localStorage.getItem('audioEnabled') === 'true';
      
      // Set the state
      setAudioEnabled(savedAudioEnabled);
      
      // If audio was enabled previously, start ambient sound
      if (savedAudioEnabled) {
        // Try to restore the saved position if available
        const savedPosition = parseFloat(localStorage.getItem('audioPosition') || '0');
        if (savedPosition > 0 && savedPosition < ambient.duration) {
          ambient.currentTime = savedPosition;
        }
        
        ambient.play().catch((e) => console.log('Audio play prevented by browser', e));
      }
      
      // Save position periodically while playing
      ambient.addEventListener('timeupdate', () => {
        // Only save position if actually playing (not at 0)
        if (ambient.currentTime > 0) {
          localStorage.setItem('audioPosition', ambient.currentTime.toString());
        }
      });
    }
  }, [audioInitialized]);

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (!audioInitialized || !ambientAudio) return;
    
    setAudioEnabled((prev) => {
      const newState = !prev;
      
      // Save preference to localStorage
      localStorage.setItem('audioEnabled', newState.toString());
      
      // Play or pause ambient audio
      if (newState) {
        // Resume from where it was paused
        ambientAudio.play().catch((e) => console.log('Audio play prevented by browser', e));
      } else {
        // Pause (don't reset currentTime)
        ambientAudio.pause();
        // Save current position when pausing
        localStorage.setItem('audioPosition', ambientAudio.currentTime.toString());
      }
      
      return newState;
    });
  }, [audioInitialized, ambientAudio]);

  // Play UI sound effect
  const playSound = useCallback((type = 'click') => {
    if (!audioInitialized || !audioEnabled) return;
    
    try {
      const sound = type === 'hover' ? hoverSound : clickSound;
      
      if (sound) {
        // Reset sound to beginning
        sound.currentTime = 0;
        sound.play().catch((e) => {
          // Handle any autoplay restrictions
          console.log('Sound play prevented by browser', e);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [audioInitialized, audioEnabled, hoverSound, clickSound]);

  // Set up global hover sound events
  useEffect(() => {
    if (!audioInitialized || !audioEnabled) return;
    
    const handleMouseEnter = () => playSound('hover');
    
    // Add hover sound to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
    });
    
    // Clean up
    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
      });
    };
  }, [audioInitialized, audioEnabled, playSound]);

  // Handle page navigation - keep playing if enabled
  useEffect(() => {
    if (audioInitialized && audioEnabled && ambientAudio) {
      // Check if the audio should be playing but isn't
      if (audioEnabled && ambientAudio.paused) {
        ambientAudio.play().catch(e => console.log('Audio play prevented by browser', e));
      }
    }
  }, [audioInitialized, audioEnabled, ambientAudio]);

  // Handle page unload - save position
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (ambientAudio && audioEnabled && !ambientAudio.paused) {
        localStorage.setItem('audioPosition', ambientAudio.currentTime.toString());
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [ambientAudio, audioEnabled]);

  // Provide audio context to children
  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio, playSound, initializeAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
