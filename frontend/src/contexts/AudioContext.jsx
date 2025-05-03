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
      setAudioEnabled(savedAudioEnabled);
      
      // If audio was enabled previously, start ambient sound
      if (savedAudioEnabled) {
        ambient.play().catch((e) => console.log('Audio play prevented by browser', e));
      }
    }
  }, [audioInitialized]);

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (!audioInitialized) return;
    
    setAudioEnabled((prev) => {
      const newState = !prev;
      
      // Save preference to localStorage
      localStorage.setItem('audioEnabled', newState.toString());
      
      // Play or pause ambient audio
      if (newState) {
        ambientAudio.play().catch((e) => console.log('Audio play prevented by browser', e));
      } else {
        ambientAudio.pause();
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

  // Provide audio context to children
  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio, playSound, initializeAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
