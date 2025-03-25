import { useState, useCallback } from "react";

/**
 * Custom hook to manage interactive grid panels
 * Handles hover states and click (active) states for grid panels
 * 
 * @param {Object} initialState - Initial state configuration
 * @param {string|null} initialState.hoveredPanel - Initially hovered panel ID
 * @param {string|null} initialState.activePanel - Initially active panel ID
 * @returns {Object} - Interaction state and handlers
 */
const useGridInteraction = (initialState = { hoveredPanel: null, activePanel: null }) => {
  // Track which panel is currently being hovered
  const [hoveredPanel, setHoveredPanel] = useState(initialState.hoveredPanel);
  
  // Track which panel is currently active (clicked)
  const [activePanel, setActivePanel] = useState(initialState.activePanel);

  /**
   * Handle mouse enter event on a panel
   * @param {string} panelId - ID of the panel being hovered
   */
  const handlePanelMouseEnter = useCallback((panelId) => {
    setHoveredPanel(panelId);
  }, []);

  /**
   * Handle mouse leave event on a panel
   */
  const handlePanelMouseLeave = useCallback(() => {
    setHoveredPanel(null);
  }, []);

  /**
   * Handle click event on a panel
   * @param {string} panelId - ID of the panel being clicked
   */
  const handlePanelClick = useCallback((panelId) => {
    // Toggle active state - if already active, deactivate it
    setActivePanel((prevActivePanel) => 
      prevActivePanel === panelId ? null : panelId
    );
  }, []);

  /**
   * Check if a specific panel is being hovered
   * @param {string} panelId - ID of the panel to check
   * @returns {boolean} - Whether the panel is being hovered
   */
  const isPanelHovered = useCallback((panelId) => {
    return hoveredPanel === panelId;
  }, [hoveredPanel]);

  /**
   * Check if a specific panel is active
   * @param {string} panelId - ID of the panel to check
   * @returns {boolean} - Whether the panel is active
   */
  const isPanelActive = useCallback((panelId) => {
    return activePanel === panelId;
  }, [activePanel]);

  return {
    hoveredPanel,
    activePanel,
    handlePanelMouseEnter,
    handlePanelMouseLeave,
    handlePanelClick,
    isPanelHovered,
    isPanelActive
  };
};

export default useGridInteraction; 