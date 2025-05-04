// frontend/src/contexts/AudioContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

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
  const ambientAudioRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  
  // Initialize audio elements
  const initializeAudio = useCallback(() => {
    if (audioInitialized) return;
    
    const ambient = document.getElementById('ambient-background');
    const hover = document.getElementById('ui-sound-hover');
    const click = document.getElementById('ui-sound-click');
    
    if (ambient && hover && click) {
      // Store references
      ambientAudioRef.current = ambient;
      hoverSoundRef.current = hover;
      clickSoundRef.current = click;
      
      // Set volume levels
      ambient.volume = 0.1;
      hover.volume = 0.2;
      click.volume = 0.3;
      
      // Set loop attribute explicitly
      ambient.loop = true;
      
      // Mark as initialized
      setAudioInitialized(true);
      
      // Get saved audio preference from localStorage
      const savedAudioEnabled = localStorage.getItem('audioEnabled') === 'true';
      
      // If audio was enabled previously, start ambient sound
      if (savedAudioEnabled) {
        // Try to restore the saved position if available
        const savedPosition = parseFloat(localStorage.getItem('audioPosition') || '0');
        if (savedPosition > 0 && savedPosition < ambient.duration) {
          ambient.currentTime = savedPosition;
        }
        
        // Actually play the audio
        const playPromise = ambient.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log('Audio play prevented by browser', e);
            // If autoplay is prevented, update our state to match reality
            setAudioEnabled(false);
            localStorage.setItem('audioEnabled', 'false');
          });
        }
      }
      
      // Update state AFTER attempting to play to ensure UI matches actual state
      setAudioEnabled(savedAudioEnabled);
      
      // Save position periodically while playing
      ambient.addEventListener('timeupdate', () => {
        if (ambient.currentTime > 0) {
          localStorage.setItem('audioPosition', ambient.currentTime.toString());
        }
      });
      
      // Add event listeners to catch when audio finishes or errors
      ambient.addEventListener('ended', () => {
        // This shouldn't happen with loop=true, but just in case
        console.log('Audio ended, restarting');
        ambient.currentTime = 0;
        ambient.play().catch(e => console.log('Audio restart prevented', e));
      });
      
      ambient.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioEnabled(false);
      });
    }
  }, [audioInitialized]);

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (!audioInitialized || !ambientAudioRef.current) return;
    
    const ambient = ambientAudioRef.current;
    
    // Toggle the state
    setAudioEnabled(prevState => {
      const newState = !prevState;
      console.log(`Toggling audio: ${prevState} -> ${newState}`);
      
      // Save preference to localStorage
      localStorage.setItem('audioEnabled', newState.toString());
      
      // Play or pause based on new state
      if (newState) {
        // We're turning audio ON
        console.log("Starting audio playback");
        const playPromise = ambient.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error('Failed to play audio:', e);
            // Revert state if play fails
            localStorage.setItem('audioEnabled', 'false');
            return false; // Don't update state if play fails
          });
        }
      } else {
        // We're turning audio OFF
        console.log("Stopping audio playback");
        // Save position before pausing
        localStorage.setItem('audioPosition', ambient.currentTime.toString());
        // Force pause the audio
        ambient.pause();
      }
      
      return newState;
    });
  }, [audioInitialized]);

  // Play UI sound effect
  const playSound = useCallback((type = 'click') => {
    if (!audioInitialized || !audioEnabled) return;
    
    try {
      const sound = type === 'hover' ? hoverSoundRef.current : clickSoundRef.current;
      
      if (sound) {
        // Reset sound to beginning
        sound.currentTime = 0;
        sound.play().catch((e) => {
          console.log('Sound play prevented by browser', e);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [audioInitialized, audioEnabled]);

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

  // Check status of audio when audioEnabled state changes
  useEffect(() => {
    if (!audioInitialized || !ambientAudioRef.current) return;
    
    const ambient = ambientAudioRef.current;
    
    if (audioEnabled && ambient.paused) {
      console.log("Audio should be playing but is paused - attempting to play");
      ambient.play().catch(e => {
        console.error('Failed to play audio:', e);
        // If we can't play, update state to match reality
        setAudioEnabled(false);
        localStorage.setItem('audioEnabled', 'false');
      });
    } else if (!audioEnabled && !ambient.paused) {
      console.log("Audio should be paused but is playing - forcing pause");
      ambient.pause();
    }
  }, [audioEnabled, audioInitialized]);

  // Provide audio context to children
  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio, playSound, initializeAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
