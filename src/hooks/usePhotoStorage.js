import { useState, useEffect } from "react";

/**
 * Custom hook to manage photo storage in localStorage
 * @returns {Object} Methods and state for photo storage
 */
const usePhotoStorage = () => {
  const [savedPhotoStrips, setSavedPhotoStrips] = useState([]);
  
  // Load saved photos from localStorage on component mount
  useEffect(() => {
    const storedPhotoStrips = localStorage.getItem("photoStrips");
    if (storedPhotoStrips) {
      try {
        setSavedPhotoStrips(JSON.parse(storedPhotoStrips));
      } catch (error) {
        console.error("Error parsing stored photos:", error);
        localStorage.removeItem("photoStrips");
      }
    }
  }, []);
  
  /**
   * Save a new photo strip to localStorage
   * @param {string[]} photos - Array of photo data URLs
   * @param {string} name - Optional name for the photo strip
   * @returns {Object} The saved photo strip object
   */
  const savePhotoStrip = (photos, name = "") => {
    const newPhotoStrip = {
      id: Date.now(),
      name: name || `Photo Strip ${savedPhotoStrips.length + 1}`,
      photos,
      createdAt: new Date().toISOString(),
    };
    
    const updatedPhotoStrips = [...savedPhotoStrips, newPhotoStrip];
    setSavedPhotoStrips(updatedPhotoStrips);
    
    try {
      localStorage.setItem("photoStrips", JSON.stringify(updatedPhotoStrips));
    } catch (error) {
      console.error("Error saving photos to localStorage:", error);
    }
    
    return newPhotoStrip;
  };
  
  /**
   * Delete a photo strip from localStorage
   * @param {number} id - ID of the photo strip to delete
   */
  const deletePhotoStrip = (id) => {
    const updatedPhotoStrips = savedPhotoStrips.filter(strip => strip.id !== id);
    setSavedPhotoStrips(updatedPhotoStrips);
    
    try {
      localStorage.setItem("photoStrips", JSON.stringify(updatedPhotoStrips));
    } catch (error) {
      console.error("Error saving updated photos to localStorage:", error);
    }
  };
  
  /**
   * Clear all saved photo strips
   */
  const clearAllPhotoStrips = () => {
    setSavedPhotoStrips([]);
    localStorage.removeItem("photoStrips");
  };
  
  return {
    savedPhotoStrips,
    savePhotoStrip,
    deletePhotoStrip,
    clearAllPhotoStrips,
  };
};

export default usePhotoStorage; 