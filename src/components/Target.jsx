import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React from 'react';

const Target = (props) => {
  const targetRef = useRef();
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf',
  );

  useGSAP(() => {
    gsap.to(targetRef.current.position, {
      y: targetRef.current.position.y + 0.75,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  });

  return (
    <mesh {...props} ref={targetRef} rotation={[0, Math.PI / 5, 0]} scale={2}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Target;
