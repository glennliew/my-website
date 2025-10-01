import { useState, Suspense, useEffect } from 'react';
import Globe from 'react-globe.gl';
import Button from '../components/Button.jsx';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import useGridInteraction from '../hooks/useGridInteraction.js';
import InteractivePanel from '../components/InteractivePanel';
import MatrixRain from '../components/MatrixRain';
import TechCarousel from '../components/TechCarousel';
import Developer from '../components/Developer.jsx';
import CanvasLoader from '../components/Loading.jsx';

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animationName, setAnimationName] = useState('idle');
  
  // Initialize panel interaction hook
  const {
    isPanelHovered,
    isPanelActive,
    handlePanelMouseEnter,
    handlePanelMouseLeave,
    handlePanelClick
  } = useGridInteraction();

  // Track scroll position for matrix rain effect
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const normalizedScroll = Math.min(window.scrollY / maxScroll, 1);
      setScrollY(normalizedScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('glennliew1@gmail.com');
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  // Handle 3D model animation
  const handleIntroHover = () => {
    handlePanelMouseEnter("intro");
    setAnimationName('salute');
  };

  const handleIntroLeave = () => {
    handlePanelMouseLeave("intro");
    setAnimationName('idle');
  };

  const handleIntroClick = () => {
    handlePanelClick("intro");
    setAnimationName('victory');
    setTimeout(() => setAnimationName('idle'), 2000);
  };

  return (
    <section id="about" className="c-space py-24 relative min-h-screen">
      {/* Matrix rain background effect */}
      <MatrixRain scrollFactor={scrollY} className="opacity-20" />
      
      <div className="grid lg:grid-cols-3 lg:auto-rows-minmax(200px, auto) md:grid-cols-2 grid-cols-1 gap-6 w-full">
        {/* Intro Panel */}
        <div className="lg:col-span-1 min-h-[400px]" data-aos="fade-right" data-aos-duration="1000">
          <InteractivePanel
            id="intro"
            isHovered={isPanelHovered("intro")}
            isActive={isPanelActive("intro")}
            onMouseEnter={handleIntroHover}
            onMouseLeave={handleIntroLeave}
            onClick={handleIntroClick}
            className="h-full"
          >
            <div className="flex flex-col h-full justify-top">
              <p className="grid-headtext">Hi, I'm Glenn Liew</p>
              <p className="grid-subtext mb-4">
                In my 2nd year of Computer Science at the National University of Singapore. I love learning and building things
              </p>
              
              {/* 3D Developer Model */}
              <div className="w-full h-64 mx-auto">
                <Canvas>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={0.8} />
                  <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />
                  
                  <Suspense fallback={<CanvasLoader />}>
                    <Developer position-y={-1.5} scale={2.2} animationName={animationName} />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </InteractivePanel>
        </div>

        {/* Tech Stack Panel - Interactive Carousel */}
        <div className="lg:col-span-2 min-h-[300px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <InteractivePanel
            id="tech"
            isHovered={isPanelHovered("tech")}
            isActive={isPanelActive("tech")}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onClick={handlePanelClick}
            className="h-full"
          >
            <div className="flex flex-col h-full justify-center">
              <p className="grid-headtext">Tech Stack</p>
              <p className="grid-subtext mb-4">
                I have experience in a variety of languages, frameworks, and tools that allow me to build robust and scalable
                applications
              </p>
              
              {/* Interactive Tech Carousel */}
              <TechCarousel className="h-64 w-64 mx-auto my-2" />
            </div>
          </InteractivePanel>
        </div>

        {/* Passion for Coding Panel */}
        <div className="lg:col-span-1 min-h-[300px]" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
          <InteractivePanel
            id="passion"
            isHovered={isPanelHovered("passion")}
            isActive={isPanelActive("passion")}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onClick={handlePanelClick}
            className="h-full"
          >
            <div className="flex flex-col h-full justify-top">
              <p className="grid-headtext">My Passion for Coding</p>
              <p className="grid-subtext mb-4">
                I love solving problems and building things through code. Programming isn&apos;t just my
                profession—it&apos;s my passion. I enjoy exploring new technologies, and enhancing my skills.
              </p>
              <div className="w-128 h-128 mx-auto overflow-hidden rounded-full">
                <img 
                  src="/assets/grid3.png" 
                  alt="Glenn Liew" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </InteractivePanel>
        </div>

        {/* Singapore Panel */}
        <div className="lg:col-span-1 min-h-[300px] lg:row-span-1" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="400">
          <InteractivePanel
            id="location"
            isHovered={isPanelHovered("location")}
            isActive={isPanelActive("location")}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onClick={handlePanelClick}
            className="h-full"
          >
            <div className="flex flex-col h-full">
              <div className="rounded-3xl w-full h-[240px] mb-4 flex justify-center items-center">
                <Globe
                  height={240}
                  width={240}
                  backgroundColor="rgba(0, 0, 0, 0)"
                  backgroundImageOpacity={0.5}
                  showAtmosphere
                  showGraticules
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  labelsData={[{ lat: 1.3521, lng: 103.8198, text: 'Singapore', color: 'white', size: 15 }]}
                />
              </div>
              <div className="mt-auto">
                <p className="grid-headtext">I'm based in Singapore!</p>
                <p className="grid-subtext mb-4">I&apos;m based in Singapore and open to work/ internships in Singapore.</p>
              </div>
            </div>
          </InteractivePanel>
        </div>

        {/* Contact Panel */}
        <div className="lg:col-span-1 min-h-[150px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
          <InteractivePanel
            id="contact"
            bgImg="assets/grid4.png"
            isHovered={isPanelHovered("contact")}
            isActive={isPanelActive("contact")}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onClick={handlePanelClick}
            className="h-full"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <p className="grid-subtext text-center">Contact me</p>
              <div className="copy-container" onClick={handleCopy}>
                <img src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'} alt="copy" />
                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">glennliew1@gmail.com</p>
              </div>
              <Button name="Contact Me" isBeam containerClass="w-full mt-4" />
            </div>
          </InteractivePanel>
        </div>
      </div>
    </section>
  );
};

export default About;
