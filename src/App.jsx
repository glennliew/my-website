import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Footer from "./sections/Footer.jsx";
import Navbar from "./sections/Navbar.jsx";
import Contact from "./sections/Contact.jsx";
import Projects from "./sections/Projects.jsx";
import WorkExperience from "./sections/Experience.jsx";
import PhotoBooth from "./sections/PhotoBooth.jsx";
import MarketDashboard from "./sections/MarketDashboard.jsx";
import MatrixRain from "./components/MatrixRain.jsx";

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <WorkExperience />
      <Contact />
      <Footer />
    </>
  );
};

const App = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Track scroll position for animation effects
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);
      setScrollProgress(progress);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on first render
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <main className="max-w-7xl mx-auto relative">
        {/* Global Matrix Rain effect that responds to scrolling */}
        <MatrixRain 
          scrollFactor={scrollProgress} 
          className="opacity-15"
          colors={["#0f0", "#00f", "#0ff", "#f0f", "#90f"]} 
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photobooth" element={<PhotoBooth />} />
          <Route path="/market-dashboard" element={<MarketDashboard />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
