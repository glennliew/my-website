import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationControls } from "framer-motion";

/**
 * Interactive tech stack carousel component
 * Displays tech icons in a horizontal scrolling list with automatic animation
 * and swipe interaction capability
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
const TechCarousel = ({ className = "" }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const x = useMotionValue(0);
  const controls = useAnimationControls();

  // Tech stack list with all technologies
  const techStack = [
    { name: "JavaScript", icon: "/assets/js.png" },
    { name: "TypeScript", icon: "/assets/typescript.png" },
    { name: "Python", icon: "/assets/python.png" },
    { name: "Java", icon: "/assets/java.png" },
    { name: "C", icon: "/assets/c.png" },
    { name: "C#", icon: "/assets/csharp.png" },
    { name: "PostgreSQL", icon: "/assets/postgresql.png" },
    { name: "Tailwind", icon: "/assets/tailwind.png" },
    { name: "React Native", icon: "/assets/react.png" },
    { name: "Figma", icon: "/assets/figma.png" },
    { name: "Node.js", icon: "/assets/nodejs.png" },
    { name: "Next.js", icon: "/assets/nextjs1.png" },
    { name: "HTML5", icon: "/assets/html.png" },
    { name: "Git", icon: "/assets/git.png" },
    { name: "Firebase", icon: "/assets/firebase.png" },
    { name: "UiPath", icon: "/assets/uipath.png" },
    { name: "PowerApps", icon: "/assets/powerapps.png" },
    { name: "VBA", icon: "/assets/vba.png" }
  ];

  // Duplicate tech stack to ensure smooth continuous scrolling
  const extendedTechStack = [...techStack, ...techStack];

  // Measure container width on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener("resize", updateWidth);
    
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate total width of all tech items
  const itemWidth = 100; // Width of each tech item including margins
  const totalWidth = techStack.length * itemWidth;
  
  // Number of visible icons (showing 8 at once)
  const visibleIcons = 8;

  // Ensure animation runs when not paused
  useEffect(() => {
    if (isPaused || !containerWidth || isDragging) return;

    const startAnimation = async () => {
      // Start from current position and animate to -totalWidth
      const currentX = x.get();
      
      await controls.start({ 
        x: [currentX, -totalWidth],
        transition: { 
          duration: 15 * (1 - Math.abs(currentX) / totalWidth), 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    };

    startAnimation();
    
    return () => {
      controls.stop();
    };
  }, [controls, totalWidth, containerWidth, isPaused, isDragging, x]);

  // Handle manual dragging
  const handleDragStart = () => {
    setIsDragging(true);
    setIsPaused(true);
    controls.stop();
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    
    // Get the current x position
    const currentX = x.get();
    
    // If we've dragged past the end, reset to beginning
    if (currentX > 0) {
      controls.start({ x: -totalWidth, transition: { duration: 0 } });
    } 
    // If we've dragged past the beginning, reset to end
    else if (currentX < -totalWidth) {
      controls.start({ x: 0, transition: { duration: 0 } });
    }
    
    // Resume automatic animation immediately after drag ends
    setIsPaused(false);
  };

  return (
    <div 
      className={`relative overflow-hidden w-full flex items-center justify-center py-8 ${className}`}
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ 
        minWidth: `${visibleIcons * itemWidth}px`,
        maxWidth: "100%" 
      }}
    >
      <motion.div
        className="flex"
        style={{ x }}
        animate={controls}
        drag="x"
        dragConstraints={{ left: -totalWidth * 2, right: totalWidth }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
      >
        {extendedTechStack.map((tech, index) => (
          <div 
            key={`${tech.name}-${index}`}
            className="flex flex-col items-center justify-center mx-1 group"
            style={{ width: `${itemWidth - 2}px` }}
          >
            <div className="w-24 h-24 bg-[#111] flex items-center justify-center hover:scale-125 transition-transform duration-200 rounded-full">
              <img 
                src={tech.icon} 
                alt={tech.name} 
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/code-icon.png"; // Fallback icon
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {tech.name}
            </div>
          </div>
        ))}
      </motion.div>
      
      <div className="absolute bottom-0 left-0 w-full text-center text-xs text-gray-400 py-1">
        {isDragging ? "Release to continue" : "Swipe or hover to pause"}
      </div>
    </div>
  );
};

export default TechCarousel;