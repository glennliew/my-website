import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Interactive grid panel component with hover and click effects
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the panel
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.bgImg - Background image URL
 * @param {boolean} props.isHovered - Whether the panel is being hovered
 * @param {boolean} props.isActive - Whether the panel is active (clicked)
 * @param {Function} props.onMouseEnter - Mouse enter handler
 * @param {Function} props.onMouseLeave - Mouse leave handler
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const InteractivePanel = ({
  id,
  children,
  bgImg,
  isHovered = false,
  isActive = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className = "",
}) => {
  // Animation variants for different states
  const panelVariants = {
    initial: { 
      scale: 1, 
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(50, 50, 50, 0.5)"
    },
    hover: { 
      scale: 1.02, 
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(0, 200, 200, 0.5)",
      transition: { duration: 0.3 }
    },
    active: { 
      scale: 1.03,
      boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.25)",
      borderColor: "rgba(0, 100, 255, 0.6)",
      transition: { duration: 0.3 }
    },
  };

  // Generate gradient overlay based on panel state
  const generateOverlay = () => {
    if (isActive) {
      return "linear-gradient(rgba(0, 0, 100, 0.1), rgba(0, 0, 100, 0.05))";
    }
    if (isHovered) {
      return "linear-gradient(rgba(0, 100, 100, 0.1), rgba(0, 100, 100, 0.03))";
    }
    return "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))";
  };

  return (
    <motion.div
      className={`grid-container cursor-pointer ${isActive ? 'panel-active' : isHovered ? 'panel-hovered' : ''} ${className}`}
      initial="initial"
      animate={isActive ? "active" : isHovered ? "hover" : "initial"}
      variants={panelVariants}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave(id)}
      onClick={() => onClick(id)}
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0F0F13",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        padding: "1.25rem",
      }}
    >
      {/* Background image with overlay */}
      {bgImg && (
        <div
          className="absolute inset-0 w-full h-full transition-all duration-300"
          style={{
            backgroundImage: `${generateOverlay()}, url(${bgImg})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            opacity: 0.8,
          }}
        />
      )}

      {/* Panel content */}
      <div 
        className="relative z-10 transition-all duration-300 flex-grow"
        style={{
          transform: isActive ? "translateY(-5px)" : "translateY(0)",
        }}
      >
        {children}
      </div>

      {/* Indicator effect when panel is active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractivePanel; 