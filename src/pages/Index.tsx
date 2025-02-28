
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Star, Volume2, VolumeX, Cake } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  // State for candles and cake
  const [candles, setCandles] = useState([
    { id: 1, isLit: true, position: "left" },
    { id: 2, isLit: true, position: "center" },
    { id: 3, isLit: true, position: "right" }
  ]);
  const [showCake, setShowCake] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs and additional state
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const [glitters, setGlitters] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  // Handle candle blow
  const handleCandleClick = (id: number) => {
    // Update candles array
    setCandles(prev => 
      prev.map(candle => 
        candle.id === id ? { ...candle, isLit: false } : candle
      )
    );
    
    // Play blowing sound if available
    if (audioRef.current && !isMuted) {
      // Reset and play a sound effect for blowing
      const blowSound = new Audio("/path-to-blow-sound.mp3"); 
      blowSound.volume = 0.3;
      blowSound.play().catch(e => console.log("Failed to play blow sound:", e));
    }
    
    // Add some particles for effect
    createParticles(id);
    
    // Check if all candles are blown out
    const updatedCandles = candles.map(candle => 
      candle.id === id ? { ...candle, isLit: false } : candle
    );
    
    if (updatedCandles.every(candle => !candle.isLit)) {
      setTimeout(() => {
        // Fade out the cake
        setShowCake(false);
        
        // After cake disappears, show birthday message
        setTimeout(() => {
          setShowMessage(true);
          setShowHearts(true);
          generateHearts();
          createGlitterEffect();
          
          // Play celebration music
          if (audioRef.current) {
            audioRef.current.play().catch(error => {
              console.log("Audio playback failed:", error);
              toast("Click anywhere to enable music! 🎵", {
                description: "Browser requires user interaction first",
                duration: 5000,
              });
            });
          }
          
          toast("Happy Birthday! 🎂", {
            description: "With all my love! ❤️",
            duration: 5000,
          });
        }, 1500);
      }, 1000);
    }
  };

  const createParticles = (candleId: number) => {
    // This would create smoke/sparkle particles when a candle is blown
    // Simplified implementation for now
    const candleElement = document.getElementById(`candle-${candleId}`);
    if (!candleElement || !containerRef.current) return;
    
    const rect = candleElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const x = rect.left + rect.width / 2 - containerRect.left;
    const y = rect.top - containerRect.top;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 rounded-full bg-white/80 smoke-particle";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
      particle.style.setProperty('--distance', `${Math.random() * 50 + 30}px`);
      particle.style.setProperty('--delay', `${Math.random() * 0.2}s`);
      
      containerRef.current.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 2000);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const generateHearts = () => {
    const newHearts = [];
    const containerWidth = containerRef.current?.offsetWidth || 600;
    
    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * containerWidth,
        y: Math.random() * 300 + 300,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 8
      });
    }
    
    setHearts(newHearts);
  };

  const createGlitterEffect = () => {
    const newGlitters = [];
    const containerWidth = containerRef.current?.offsetWidth || 600;
    const containerHeight = containerRef.current?.offsetHeight || 800;
    
    for (let i = 0; i < 30; i++) {
      newGlitters.push({
        id: i,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 5
      });
    }
    
    setGlitters(newGlitters);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !showMessage) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const glitter = document.createElement("div");
    glitter.className = "glitter visible";
    glitter.style.left = `${x}px`;
    glitter.style.top = `${y}px`;
    glitter.style.width = `${Math.random() * 8 + 5}px`;
    glitter.style.height = glitter.style.width;
    
    containerRef.current.appendChild(glitter);
    
    setTimeout(() => {
      glitter.remove();
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen py-16 px-4 flex flex-col items-center justify-center relative overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <audio ref={audioRef} loop>
        <source src="/path-to-your-music.mp3" type="audio/mpeg" />
      </audio>

      <motion.button
        className="fixed top-4 right-4 z-50 bg-white/80 p-2 rounded-full shadow-md hover:bg-white/90 transition-colors"
        onClick={toggleMute}
        initial={{ opacity: 0 }}
        animate={{ opacity: showMessage ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? <VolumeX size={20} className="text-love" /> : <Volume2 size={20} className="text-love" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-love-dark relative inline-block">
          <span className="relative z-10">
            {showMessage ? "Happy Birthday" : "Make a Wish!"}
          </span>
          <motion.div 
            className="absolute -bottom-2 left-0 h-3 bg-gold-light/70 w-full -z-0 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </h1>
        <AnimatePresence>
          {showMessage && (
            <motion.p 
              className="mt-4 cursive text-2xl md:text-3xl text-rose-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              My Beloved
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        className="absolute top-20 left-1/4 transform -translate-x-1/2 text-gold-dark opacity-75"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles size={28} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-40 right-1/4 transform translate-x-1/2 text-gold-dark opacity-75"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Star size={24} />
      </motion.div>

      <AnimatePresence>
        {showCake && (
          <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5 }}
          >
            {/* Cake */}
            <div className="relative mx-auto w-64 h-40 bg-rose-light rounded-b-3xl rounded-t-lg shadow-lg overflow-visible">
              {/* Cake layers */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-rose-light to-rose rounded-b-3xl rounded-t-lg">
                {/* Frosting */}
                <div className="absolute -top-4 left-0 w-full h-8 bg-white">
                  <div className="absolute top-0 w-full">
                    <div className="flex justify-evenly">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-5 h-6 bg-white rounded-b-full"
                          style={{ transform: 'translateY(-15%)' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Decorations */}
                <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-love rounded-full" />
                  ))}
                </div>
                
                <div className="absolute top-1/3 w-full flex justify-center space-x-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gold-light rounded-full" />
                  ))}
                </div>
                
                {/* Candles */}
                <div className="absolute -top-12 w-full flex justify-center items-end">
                  {candles.map((candle) => (
                    <div 
                      key={candle.id} 
                      className={`relative mx-5 ${
                        candle.position === "left" ? "-translate-x-8" : 
                        candle.position === "right" ? "translate-x-8" : ""
                      }`}
                      id={`candle-${candle.id}`}
                    >
                      {/* Candle stick */}
                      <div className="w-2 h-16 bg-blue-100 rounded-sm z-10" />
                      
                      {/* Candle flame */}
                      {candle.isLit && (
                        <button
                          onClick={() => handleCandleClick(candle.id)}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-8 cursor-pointer focus:outline-none"
                          aria-label="Blow out candle"
                        >
                          <div className="relative w-full h-full">
                            {/* Outer flame */}
                            <motion.div 
                              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gold-light rounded-full oval"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 2, -2, 0]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            />
                            {/* Inner flame */}
                            <motion.div 
                              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-5 bg-white rounded-full oval"
                              animate={{ 
                                scale: [1, 1.05, 1]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            />
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cake base/plate */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-4 bg-gray-200 rounded-full shadow-md"></div>
            </div>
            
            {/* Instructions */}
            <motion.p
              className="text-center mt-12 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Click on the flames to blow out the candles
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md mx-auto bg-white rounded-md p-6 shadow-md"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="flex flex-col justify-between w-full">
              <div>
                <h2 className="cursive text-3xl text-love-dark mb-4 text-center">My Dearest Positron,</h2>
                <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-700">
                  <p className="text-center">
                    Wishing you a very happy Birthday my positron. Thanks for always being there and encouraging me, supporting me in every endeavour.
                  </p>
                  <p className="text-center">
                    Ik we don't talk like others do, but it's alright. I can wait, if it's for you.
                  </p>
                  <p className="text-center">
                    Be chill and enjoy the day to its fullest. Wishing you a lots of happiness and wishing us, loads of conversations, meets and memories ahead!
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="cursive text-2xl text-rose-dark">Happy Birthday once again,</p>
                <p className="cursive text-2xl text-love-dark mt-2">Love ya ❤️</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showHearts && hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="heart-container visible absolute"
          initial={{ x: heart.x, y: heart.y, opacity: 0 }}
          animate={{
            y: heart.y - 300,
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.8],
          }}
          transition={{
            duration: 5 + Math.random() * 2,
            delay: heart.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
          }}
          style={{ 
            left: heart.x, 
            top: heart.y,
          }}
        >
          <Heart 
            size={heart.size} 
            className="text-love fill-love-light animate-heart-float" 
            style={{ 
              animationDelay: `${heart.delay * 0.2}s`,
              filter: 'drop-shadow(0 0 2px rgba(255, 113, 154, 0.5))'
            }}
          />
        </motion.div>
      ))}

      {showMessage && glitters.map((glitter) => (
        <motion.div
          key={glitter.id}
          className="absolute rounded-full bg-white"
          style={{
            left: glitter.x,
            top: glitter.y,
            width: glitter.size,
            height: glitter.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            background: [
              'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
              'radial-gradient(circle, rgba(255,213,102,0.8) 0%, rgba(255,213,102,0) 70%)',
              'radial-gradient(circle, rgba(255,113,154,0.8) 0%, rgba(255,113,154,0) 70%)',
            ]
          }}
          transition={{
            duration: 2,
            delay: glitter.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 8,
          }}
        />
      ))}

      <motion.p 
        className="mt-16 text-center text-muted-foreground text-sm opacity-75 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="cursive text-lg">Made with love</span>
      </motion.p>
    </div>
  );
};

export default Index;
