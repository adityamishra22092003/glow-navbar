import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Mail, Settings, Users, HelpCircle, Sparkles, Menu, X } from 'lucide-react';

// --- Interfaces and Data ---
interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  angle: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  opacity: number;
  hue: number;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '#', angle: 0 },
  { label: 'About', icon: User, href: '#', angle: 45 },
  { label: 'Services', icon: Briefcase, href: '#', angle: 90 },
  { label: 'Contact', icon: Mail, href: '#', angle: 135 },
  { label: 'Settings', icon: Settings, href: '#', angle: 180 },
  { label: 'Team', icon: Users, href: '#', angle: 225 },
  { label: 'Help', icon: HelpCircle, href: '#', angle: 270 },
  { label: 'Magic', icon: Sparkles, href: '#', angle: 315 },
];

// --- Main App Component ---
export default function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // Effect for screen size
  useEffect(() => {
    const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect for particle system
  useEffect(() => {
    if (screenSize.width === 0) return;

    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * screenSize.width,
      y: Math.random() * screenSize.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 1.5 + 0.5,
      life: Math.random() * 200 + 100,
      maxLife: Math.random() * 200 + 100,
      opacity: Math.random() * 0.5 + 0.2,
      hue: 220 + Math.random() * 60, // Hue range from blue to purple
    });

    setParticles(Array.from({ length: 150 }, createParticle));

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: (p.x + p.vx + screenSize.width) % screenSize.width,
          y: (p.y + p.vy + screenSize.height) % screenSize.height,
          life: p.life - 1,
        })).filter(p => p.life > 0);
        while (updated.length < 150) updated.push(createParticle());
        return updated;
      });
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [screenSize]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const itemVariants = {
    closed: { x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 },
    open: (i: number) => {
      const angleInRadians = (navItems[i].angle - 90) * (Math.PI / 180);
      const radius = 140;
      return {
        x: radius * Math.cos(angleInRadians),
        y: radius * Math.sin(angleInRadians),
        opacity: 1,
        scale: 1,
        rotate: 360,
      };
    },
  };

  return (
    <div
      className="bg-black min-h-screen w-full flex items-center justify-center font-sans antialiased overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* SVG filter for the "gooey" effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Particle System */}
      <motion.svg className="absolute inset-0 w-full h-full pointer-events-none">
        {particles.map(p => (
          <motion.circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={`hsl(${p.hue}, 100%, 80%)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, p.opacity, 0] }}
            transition={{
              delay: Math.random() * 2,
              duration: p.maxLife / 40,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.svg>

      {/* Gooey Menu Container */}
      <motion.div
        className="relative w-96 h-96 flex items-center justify-center"
        style={{ filter: 'url(#gooey-effect)' }}
        initial="closed"
        animate={isExpanded ? "open" : "closed"}
      >
        {/* Orbital Ring */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.5))' }}
                    className="absolute w-80 h-80 border-2 border-dashed border-indigo-400/50 rounded-full"
                >
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full"
                     />
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Navigation Items */}
        {navItems.map((item, i) => (
          <motion.div
            key={item.label}
            className="absolute"
            custom={i}
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: i * 0.04 }}
            whileHover={{ 
              scale: 1.2, 
              rotate: [0, 10, -10, 0],
              transition: { duration: 0.4 } 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href={item.href}
              className="w-20 h-20 bg-purple-600 rounded-full flex flex-col items-center justify-center text-white text-xs gap-1 cursor-pointer group hover:bg-blue-500 transition-colors duration-300"
              style={{ filter: 'drop-shadow(0 0 5px rgba(167, 139, 250, 0.6))' }}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-6 h-6" />
              </div>
              <span>{item.label}</span>
            </a>
          </motion.div>
        ))}

        {/* Main Toggle Button */}
        <motion.div
          className="absolute z-10"
          initial={{ y: -250, opacity: 0, scale: 2 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, delay: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer border-none"
            style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5)) drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))' }}
          >
              <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                  <AnimatePresence mode="wait">
                      {!isExpanded ? (
                      <motion.div key="menu" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                          <Menu size={32} />
                      </motion.div>
                      ) : (
                      <motion.div key="close" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                          <X size={32} />
                      </motion.div>
                      )}
                  </AnimatePresence>
              </motion.div>
          </button>
        </motion.div>
      </motion.div>

      {/* Mouse Trail Effect */}
      <motion.div
        className="absolute w-3 h-3 bg-indigo-400/50 rounded-full pointer-events-none blur-sm z-30"
        style={{ top: mousePosition.y - 6, left: mousePosition.x - 6 }}
        transition={{ type: "spring", stiffness: 800, damping: 40 }}
      />
    </div>
  );
}
