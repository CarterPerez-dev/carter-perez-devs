import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Create context for audio functionality
const AudioContext = createContext({
  audioEnabled: false,
  audioInitialized: false,
  toggleAudio: () => {},
  playSound: () => {},
  initializeAudio: () => {},
  setVolume: () => {},
  ambientVolume: 0.3,
  effectsVolume: 0.5
});

// Custom hook to use the audio context
export const useAudio = () => useContext(AudioContext);

// Provider component for audio context
export const AudioProvider = ({ children }) => {
  // State for audio settings
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  
  // References to audio elements
  const ambientAudioRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const glitchSoundRef = useRef(null);
  const successSoundRef = useRef(null);
  const errorSoundRef = useRef(null);
  
  // Debounce timer for hover sound to prevent sound spam
  const hoverDebounceRef = useRef(null);
  
  // Initialize audio system - must be called after user interaction
  const initializeAudio = useCallback(() => {
    if (audioInitialized) return;
    
    // Try to get audio elements from DOM
    const ambientAudio = document.getElementById('ambient-background');
    const hoverSound = document.getElementById('ui-sound-hover');
    const clickSound = document.getElementById('ui-sound-click');
    const glitchSound = document.getElementById('ui-sound-glitch');
    const successSound = document.getElementById('ui-sound-success');
    const errorSound = document.getElementById('ui-sound-error');
    
    // If all required audio elements exist
    if (ambientAudio && hoverSound && clickSound) {
      // Store references
      ambientAudioRef.current = ambientAudio;
      hoverSoundRef.current = hoverSound;
      clickSoundRef.current = clickSound;
      
      // Store optional audio references if they exist
      if (glitchSound) glitchSoundRef.current = glitchSound;
      if (successSound) successSoundRef.current = successSound;
      if (errorSound) errorSoundRef.current = errorSound;
      
      // Set initial volumes
      ambientAudio.volume = ambientVolume;
      hoverSound.volume = effectsVolume;
      clickSound.volume = effectsVolume;
      if (glitchSound) glitchSound.volume = effectsVolume;
      if (successSound) successSound.volume = effectsVolume;
      if (errorSound) errorSound.volume = effectsVolume;
      
      // Mark as initialized
      setAudioInitialized(true);
      
      // Load preference from localStorage
      const savedAudioEnabled = localStorage.getItem('audioEnabled') === 'true';
      setAudioEnabled(savedAudioEnabled);
      
      // Start ambient audio if enabled
      if (savedAudioEnabled) {
        ambientAudio.play().catch(error => {
          console.warn('Could not autoplay ambient audio:', error);
        });
      }
    }
  }, [audioInitialized, ambientVolume, effectsVolume]);
  
  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (!audioInitialized) return;
    
    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);
    
    // Save preference to localStorage
    localStorage.setItem('audioEnabled', newAudioEnabled);
    
    // Play or pause ambient audio
    if (newAudioEnabled) {
      ambientAudioRef.current.play().catch(error => {
        console.warn('Could not play ambient audio:', error);
      });
    } else {
      ambientAudioRef.current.pause();
    }
    
    // Play click sound to confirm toggle
    playSound('click');
  }, [audioInitialized, audioEnabled]);
  
  // Function to play sound effects
  const playSound = useCallback((type = 'click') => {
    if (!audioInitialized || !audioEnabled) return;
    
    let sound;
    switch (type) {
      case 'hover':
        // Prevent hover sound spam with debouncing
        if (hoverDebounceRef.current) return;
        sound = hoverSoundRef.current;
        hoverDebounceRef.current = setTimeout(() => {
          hoverDebounceRef.current = null;
        }, 100);
        break;
      case 'click':
        sound = clickSoundRef.current;
        break;
      case 'glitch':
        sound = glitchSoundRef.current;
        break;
      case 'success':
        sound = successSoundRef.current;
        break;
      case 'error':
        sound = errorSoundRef.current;
        break;
      default:
        sound = clickSoundRef.current;
    }
    
    if (sound) {
      // Reset sound to start
      sound.currentTime = 0;
      
      // Play the sound
      sound.play().catch(error => {
        console.warn(`Could not play ${type} sound:`, error);
      });
    }
  }, [audioInitialized, audioEnabled]);
  
  // Set volume levels
  const setVolume = useCallback((type, level) => {
    if (!audioInitialized) return;
    
    // Ensure volume is between 0 and 1
    const volume = Math.max(0, Math.min(1, level));
    
    switch (type) {
      case 'ambient':
        setAmbientVolume(volume);
        if (ambientAudioRef.current) {
          ambientAudioRef.current.volume = volume;
        }
        break;
      case 'effects':
        setEffectsVolume(volume);
        // Update all effect sounds
        if (hoverSoundRef.current) hoverSoundRef.current.volume = volume;
        if (clickSoundRef.current) clickSoundRef.current.volume = volume;
        if (glitchSoundRef.current) glitchSoundRef.current.volume = volume;
        if (successSoundRef.current) successSoundRef.current.volume = volume;
        if (errorSoundRef.current) errorSoundRef.current.volume = volume;
        break;
    }
    
    // Save settings to localStorage
    localStorage.setItem(`${type}Volume`, volume.toString());
  }, [audioInitialized]);
  
  // Add hover sound to interactive elements
  useEffect(() => {
    if (!audioInitialized || !audioEnabled) return;
    
    const handleMouseEnter = () => playSound('hover');
    
    // Find all interactive elements
    const buttons = document.querySelectorAll('button:not([disabled])');
    const links = document.querySelectorAll('a:not([disabled])');
    const interactives = document.querySelectorAll('[role="button"]:not([disabled])');
    
    // Add event listeners
    buttons.forEach(el => el.addEventListener('mouseenter', handleMouseEnter));
    links.forEach(el => el.addEventListener('mouseenter', handleMouseEnter));
    interactives.forEach(el => el.addEventListener('mouseenter', handleMouseEnter));
    
    // Cleanup function
    return () => {
      buttons.forEach(el => el.removeEventListener('mouseenter', handleMouseEnter));
      links.forEach(el => el.removeEventListener('mouseenter', handleMouseEnter));
      interactives.forEach(el => el.removeEventListener('mouseenter', handleMouseEnter));
    };
  }, [audioInitialized, audioEnabled, playSound]);
  
  // Load volume settings from localStorage on init
  useEffect(() => {
    if (!audioInitialized) return;
    
    const savedAmbientVolume = parseFloat(localStorage.getItem('ambientVolume') || '0.3');
    const savedEffectsVolume = parseFloat(localStorage.getItem('effectsVolume') || '0.5');
    
    setAmbientVolume(savedAmbientVolume);
    setEffectsVolume(savedEffectsVolume);
    
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = savedAmbientVolume;
    }
    
    if (hoverSoundRef.current) hoverSoundRef.current.volume = savedEffectsVolume;
    if (clickSoundRef.current) clickSoundRef.current.volume = savedEffectsVolume;
    if (glitchSoundRef.current) glitchSoundRef.current.volume = savedEffectsVolume;
    if (successSoundRef.current) successSoundRef.current.volume = savedEffectsVolume;
    if (errorSoundRef.current) errorSoundRef.current.volume = savedEffectsVolume;
  }, [audioInitialized]);
  
  return (
    <AudioContext.Provider value={{
      audioEnabled,
      audioInitialized,
      toggleAudio,
      playSound,
      initializeAudio,
      setVolume,
      ambientVolume,
      effectsVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export default useAudio;
