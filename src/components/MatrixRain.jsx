import React, { useRef, useEffect } from "react";

/**
 * Matrix-style rain animation background component
 * Creates a canvas with falling colorful characters
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.scrollFactor - Controls speed based on scroll (0-1)
 * @param {string[]} props.colors - Array of colors to use for the rain drops
 */
const MatrixRain = ({ 
  className = "", 
  scrollFactor = 0, 
  colors = ["#0f0", "#00f", "#0ff", "#f0f"] 
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const dropsRef = useRef([]);
  const speedRef = useRef(0.1);
  
  // Matrix rain animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let fontSize = 14;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize drops if not already set
      if (dropsRef.current.length === 0) {
        const columns = Math.floor(canvas.width / fontSize);
        dropsRef.current = Array(columns).fill(0).map(() => ({
          x: Math.floor(Math.random() * columns),
          y: Math.random() * -100, // Start above viewport for staggered effect
          speed: Math.random() * 0.5 + 0.5, // Randomize initial speed
          color: colors[Math.floor(Math.random() * colors.length)]
        }));
      } else {
        // Just adjust for new dimensions without resetting
        const columns = Math.floor(canvas.width / fontSize);
        // Add more drops if canvas got wider
        if (columns > dropsRef.current.length) {
          const newDrops = Array(columns - dropsRef.current.length).fill(0).map(() => ({
            x: Math.floor(Math.random() * columns),
            y: Math.random() * -100,
            speed: Math.random() * 0.5 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
          }));
          dropsRef.current = [...dropsRef.current, ...newDrops];
        } else if (columns < dropsRef.current.length) {
          // Remove excess drops if canvas got narrower
          dropsRef.current = dropsRef.current.slice(0, columns);
        }
      }
    };
    
    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Characters to display (mix of latin and symbols)
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    
    // Smoothly update speed based on scroll factor
    speedRef.current = 0.1 + scrollFactor * 0.3;
    
    // Animation frame function
    const draw = () => {
      // Semi-transparent background to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update each drop
      dropsRef.current.forEach((drop, i) => {
        // Choose a random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        
        // Draw the character
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = drop.color;
        ctx.fillText(text, drop.x * fontSize, drop.y * fontSize);
        
        // Move the drop down with its individual speed plus global speed
        drop.y += drop.speed * speedRef.current;
        
        // Reset drop position when it goes off screen
        if (drop.y * fontSize > canvas.height) {
          drop.y = 0;
          // Occasionally change color when recycling
          if (Math.random() > 0.9) {
            drop.color = colors[Math.floor(Math.random() * colors.length)];
          }
          // Randomize speed slightly for variation
          drop.speed = Math.random() * 0.5 + 0.5;
        }
      });
      
      // Schedule next frame
      requestRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []); // Empty dependency array so it only initializes once
  
  // Update speed when scrollFactor changes without resetting animation
  useEffect(() => {
    speedRef.current = 0.1 + scrollFactor * 0.3;
  }, [scrollFactor]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full z-[-1] pointer-events-none ${className}`}
    />
  );
};

export default MatrixRain; 