import { Leva } from 'leva';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import { PerspectiveCamera } from '@react-three/drei';
import React from 'react';
import Cube from '../components/Cube.jsx';
import Rings from '../components/Rings.jsx';
import ReactLogo from '../components/ReactLogo.jsx';
import Button from '../components/Button.jsx';
import Target from '../components/Target.jsx';
import CanvasLoader from '../components/Loading.jsx';
import HeroCamera from '../components/HeroCamera.jsx';
import { calculateSizes } from '../constants/index.js';
import { HackerRoom } from '../components/HackerRoom.jsx';

const Hero = () => {
  // Use media queries to determine screen size
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  return (
    <section id="home" className="min-h-screen w-full flex flex-col relative overflow-hidden" >
      {/* Top content with greeting and tagline */}
      <div className="w-full mx-auto flex flex-col sm:mt-24 mt-16 c-space gap-3 relative z-10">
        <p 
          className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Hi, I'm Glenn! <span className="waving-hand"> 🙋🏻‍♂️</span>
        </p>
        <p 
          className="hero_tag text-gray_gradient"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Learning and Building Everyday
        </p>
      </div>

      {/* 3D Scene Container */}
      <div 
        className="w-full absolute inset-0 h-[90vh] sm:h-screen"
        data-aos="fade-in"
        data-aos-delay="300"
      >
        <Canvas 
          className="w-full h-full"
          camera={{ position: [0, 0, 30], fov: isMobile ? 60 : 25 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<CanvasLoader />}>
            {/* To hide controller */}
            <Leva hidden />
            <PerspectiveCamera 
              makeDefault 
              position={[0, 0, 35]} 
              fov={isMobile ? 60 : 35}
              near={0.1}
              far={1000}
            />

            <HeroCamera isMobile={isMobile}>
              <HackerRoom 
                scale={sizes.deskScale} 
                position={sizes.deskPosition} 
                rotation={[0.1, -Math.PI, 0]} 
              />
            </HeroCamera>

            <group>
              <Target position={sizes.targetPosition} />
              <ReactLogo position={sizes.reactLogoPosition} />
              <Rings position={sizes.ringPosition} />
              <Cube position={sizes.cubePosition} />
            </group>

            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 10, 10]} intensity={0.7} />
          </Suspense>
        </Canvas>
      </div>

      {/* Bottom action button */}
      <div 
        className="absolute bottom-7 left-0 right-0 w-full z-10 c-space"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <a href="#about" className="w-fit">
          <Button name="Let's work together" isBeam containerClass="sm:w-fit w-full sm:min-w-96" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
