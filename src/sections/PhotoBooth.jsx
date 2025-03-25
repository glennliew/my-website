import { useState, useRef, useEffect } from "react";
import React from "react";
import usePhotoStorage from "../hooks/usePhotoStorage";

const PhotoBooth = () => {
  const [photos, setPhotos] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isTakingPhotos, setIsTakingPhotos] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavedStrips, setShowSavedStrips] = useState(false);
  const [photoStripName, setPhotoStripName] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const { savedPhotoStrips, savePhotoStrip, deletePhotoStrip, clearAllPhotoStrips } = usePhotoStorage();

  // Request camera access when component mounts
  useEffect(() => {
    return () => {
      // Clean up stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const requestCameraAccess = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        };
        streamRef.current = stream;
        setCameraPermission(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please ensure you have a camera connected and have granted permission.");
    } finally {
      setIsLoading(false);
    }
  };

  const startPhotoSession = () => {
    setPhotos([]);
    setIsTakingPhotos(true);
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Apply a retro filter
      context.filter = "sepia(0.5) contrast(1.2) brightness(0.9)";
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Add retro border
      context.strokeStyle = "#ffffff";
      context.lineWidth = 10;
      context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
      
      // Add retro timestamp
      const date = new Date();
      const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      context.fillStyle = "#ffffff";
      context.font = "16px 'Courier New', monospace";
      context.fillText(timestamp, 20, canvas.height - 20);
      
      // Convert to data URL and save
      const photoData = canvas.toDataURL("image/jpeg");
      setPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos, photoData];
        
        // If we have 3 photos, we're done
        if (newPhotos.length >= 3) {
          setIsTakingPhotos(false);
          return newPhotos;
        }
        
        // Otherwise, start countdown for next photo
        startCountdown();
        return newPhotos;
      });
    }
  };

  const handleSavePhotoStrip = () => {
    // Save to localStorage
    savePhotoStrip(photos, photoStripName);
    
    // Create canvas for download as well
    const stripCanvas = document.createElement("canvas");
    const ctx = stripCanvas.getContext("2d");
    
    // Set dimensions for strip
    const photoWidth = 300;
    const photoHeight = 225; // 4:3 aspect ratio
    stripCanvas.width = photoWidth;
    stripCanvas.height = photoHeight * photos.length + 100; // extra space for title
    
    // Fill the background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);
    
    // Add a vintage title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("RETRO PHOTO BOOTH", stripCanvas.width / 2, 40);
    ctx.font = "16px 'Courier New', monospace";
    ctx.fillText(new Date().toLocaleDateString(), stripCanvas.width / 2, 70);
    
    // Draw each photo onto the strip
    photos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = 100 + (photoHeight * index);
        ctx.drawImage(img, 0, y, photoWidth, photoHeight);
        
        // If this is the last photo, create and download the image
        if (index === photos.length - 1) {
          const link = document.createElement("a");
          link.download = `photo-strip-${Date.now()}.jpg`;
          link.href = stripCanvas.toDataURL("image/jpeg");
          link.click();
        }
      };
      img.src = photo;
    });
    
    // Reset name field
    setPhotoStripName("");
    
    // Show feedback
    alert("Photo strip saved successfully!");
  };
  
  const toggleSavedStrips = () => {
    setShowSavedStrips(!showSavedStrips);
  };

  return (
    <section className="min-h-screen w-full pt-20 flex flex-col items-center px-4 bg-gray-900">
      <h1 
        className="text-5xl font-bold text-white mb-8 mt-12" 
        data-aos="fade-down"
        data-aos-duration="800"
      >
        Retro Photo Booth
      </h1>
      
      <div 
        className="w-full max-w-4xl bg-black p-6 rounded-lg shadow-lg"
        data-aos="zoom-in"
        data-aos-duration="1000"
        data-aos-delay="200"
      >
        {!cameraPermission ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 
              className="text-2xl font-bold text-white mb-6"
              data-aos="fade-up" 
              data-aos-delay="300"
            >
              Take a Vintage Photo Strip
            </h2>
            <p 
              className="text-white mb-8 text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Capture three retro-style photos and create a nostalgic photo strip to save and share!
            </p>
            <button
              onClick={requestCameraAccess}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center disabled:opacity-50"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              {isLoading ? "Accessing Camera..." : "Allow Camera Access"}
            </button>
            
            {savedPhotoStrips.length > 0 && (
              <button
                onClick={toggleSavedStrips}
                className="mt-4 text-white underline hover:text-blue-400"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                {showSavedStrips ? "Hide Saved Photo Strips" : "View Saved Photo Strips"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-8">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full max-w-lg rounded-lg ${isTakingPhotos ? "border-4 border-red-600" : ""}`}
                style={{ display: cameraPermission ? "block" : "none" }}
              />
              
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-70 text-white text-6xl font-bold w-24 h-24 flex items-center justify-center rounded-full">
                    {countdown}
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            {!isTakingPhotos ? (
              <button
                onClick={startPhotoSession}
                disabled={photos.length === 3}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full mb-8 transition duration-300 disabled:opacity-50"
              >
                {photos.length === 0 ? "Take Photos" : "Retake Photos"}
              </button>
            ) : (
              <p className="text-white mb-8">Taking photos... Please wait and smile!</p>
            )}
            
            {photos.length > 0 && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-white mb-4">Your Photo Strip</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {photos.map((photo, index) => (
                    <div key={index} className="bg-gray-800 p-2 rounded">
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full rounded" />
                    </div>
                  ))}
                </div>
                
                {photos.length === 3 && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <input
                      type="text"
                      value={photoStripName}
                      onChange={(e) => setPhotoStripName(e.target.value)}
                      placeholder="Name your photo strip (optional)"
                      className="w-full sm:w-auto px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSavePhotoStrip}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                    >
                      Save Photo Strip
                    </button>
                  </div>
                )}
                
                <button
                  onClick={toggleSavedStrips}
                  className="text-white underline hover:text-blue-400 mb-4"
                >
                  {showSavedStrips ? "Hide Saved Photo Strips" : "View Saved Photo Strips"}
                </button>
              </div>
            )}
          </div>
        )}
        
        {showSavedStrips && savedPhotoStrips.length > 0 && (
          <div 
            className="mt-8 border-t border-gray-800 pt-8"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Saved Photo Strips</h3>
              <button
                onClick={clearAllPhotoStrips}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                Delete All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPhotoStrips.map((strip, index) => (
                <div 
                  key={strip.id} 
                  className="bg-gray-800 p-4 rounded"
                  data-aos="fade-up"
                  data-aos-delay={400 + (index * 100)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">{strip.name}</h4>
                    <button
                      onClick={() => deletePhotoStrip(strip.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {new Date(strip.createdAt).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {strip.photos.map((photo, index) => (
                      <img 
                        key={index} 
                        src={photo} 
                        alt={`Saved photo ${index + 1}`} 
                        className="w-full rounded"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoBooth; 