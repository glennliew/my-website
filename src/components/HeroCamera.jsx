import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';

/**
 * Camera component for the Hero section that handles camera positioning and rotation
 * @param {Object} props - Component props
 * @param {boolean} props.isMobile - Whether the device is mobile
 * @param {React.ReactNode} props.children - Child components
 */
const HeroCamera = ({ isMobile, children }) => {
  const group = useRef();

  useFrame((state, delta) => {
    // Position the camera further back to see more of the scene
    const targetZ = isMobile ? 25 : 30;
    
    // Smoothly move the camera to the target position
    easing.damp3(
      state.camera.position, 
      [0, 0, targetZ], 
      0.25, 
      delta
    );

    // Only enable mouse-based rotation on non-mobile devices
    if (!isMobile) {
      // Reduce rotation factor to allow seeing more of the scene
      // Use wider range for x-axis rotation to show more objects
      easing.dampE(
        group.current.rotation, 
        [-state.pointer.y / 4, state.pointer.x / 3, 0], 
        0.25, 
        delta
      );
    } else {
      // Add subtle automatic rotation for mobile
      const time = state.clock.getElapsedTime() * 0.1;
      easing.dampE(
        group.current.rotation,
        [Math.sin(time) * 0.05, Math.cos(time) * 0.05, 0],
        0.5,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default HeroCamera;
