
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [glitters, setGlitters] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  const handleEnvelopeClick = () => {
    if (isOpen) return;
    
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio playback failed:", error);
        toast("Click anywhere to enable music! 🎵", {
          description: "Browser requires user interaction first",
          duration: 5000,
        });
      });
    }
    
    setTimeout(() => {
      setShowLetter(true);
    }, 1000);
    
    setTimeout(() => {
      setShowHearts(true);
      generateHearts();
      createGlitterEffect();
      toast("Happy Birthday! 🎂", {
        description: "With all my love! ❤️",
        duration: 5000,
      });
    }, 3000);
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
    if (!containerRef.current || !isOpen) return;
    
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
        animate={{ opacity: isOpen ? 1 : 0 }}
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
          <span className="relative z-10">Happy Birthday</span>
          <motion.div 
            className="absolute -bottom-2 left-0 h-3 bg-gold-light/70 w-full -z-0 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </h1>
        <motion.p 
          className="mt-4 cursive text-2xl md:text-3xl text-rose-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          My Beloved
        </motion.p>
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

      <div className="envelope-container relative w-full max-w-md mx-auto">
        <motion.div 
          className={`relative bg-love-light border-2 border-love rounded-md p-4 aspect-[4/3] shadow-lg`}
          whileHover={!isOpen ? { scale: 1.02 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div 
            className={`envelope-lid absolute top-0 left-0 w-full h-1/2 bg-love border-2 border-love rounded-t-md z-20 ${isOpen ? 'open' : ''}`}
            style={{ transformOrigin: 'top' }}
          >
            {!isOpen && (
              <motion.button 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-gold-light text-love-dark font-semibold py-2 px-6 rounded-full shadow-md
                          border-2 border-gold flex items-center gap-2 animate-scale-pulse"
                onClick={handleEnvelopeClick}
                whileHover={{ scale: 1.05, backgroundColor: "#FFD566" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Click Here</span>
                <Heart className="inline-block" size={18} />
              </motion.button>
            )}
          </div>

          <div 
            className={`letter absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[120%] 
                       bg-white rounded-md p-6 shadow-md z-10 ${showLetter ? 'show' : ''}`}
          >
            <div className="h-full overflow-y-auto flex items-center justify-center">
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
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-love-light rounded-md"></div>
          
          <div className="absolute top-0 left-0 w-full h-1/2 bg-love-light rounded-t-md transform -translate-y-[99%] z-0"
                style={{ display: isOpen ? 'block' : 'none' }}></div>
        </motion.div>
      </div>

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

      {showHearts && glitters.map((glitter) => (
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
