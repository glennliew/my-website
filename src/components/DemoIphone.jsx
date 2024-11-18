import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, useVideoTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const DemoIphone = (props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/iphone.glb');
  const { actions } = useAnimations(animations, group);

  const txt = useVideoTexture(props.texture ? props.texture : '/textures/project/project1.mp4');

  useEffect(() => {
    if (txt) {
      txt.flipY = false;
    }
  }, [txt]);

  useGSAP(() => {
    gsap.from(group.current.rotation, {
      y: Math.PI / 2,
      duration: 1,
      ease: 'power3.out',
    });
  }, [txt]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="iphone-screen"
          geometry={nodes['iphone-screen'].geometry}
          material={nodes['iphone-screen'].material}
          position={[0.127, 1.831, 0.511]}
          rotation={[1.571, -0.005, 0.031]}
          scale={[0.661, 0.608, 0.401]}>
          <meshBasicMaterial map={txt} toneMapped={false} />
        </mesh>
        <group name="RootNode" position={[0, 1.093, 0]} rotation={[-Math.PI / 2, 0, -0.033]} scale={0.045}>
          <group
            name="Screen001"
            position={[5.658, 1.643, 0.812]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[0.923, 0.855, 0.855]}
          />
          {/* Add other screen groups as needed */}
        </group>
        <group
          name="Iphone-B-_iphone_0"
          position={[0.266, 1.132, 0.051]}
          rotation={[0, -0.033, 0]}
          scale={[0.042, 0.045, 0.045]}>
          <mesh
            name="Iphone-B-_iphone_0_1"
            geometry={nodes['Iphone-B-_iphone_0_1'].geometry}
            material={materials.iphone}
          />
          <mesh
            name="Iphone-B-_iphone_0_2"
            geometry={nodes['Iphone-B-_iphone_0_2'].geometry}
            material={materials.base__0}
          />
          <mesh
            name="Iphone-B-_iphone_0_3"
            geometry={nodes['Iphone-B-_iphone_0_3'].geometry}
            material={materials.Material_36}
          />
          <mesh
            name="Iphone-B-_iphone_0_4"
            geometry={nodes['Iphone-B-_iphone_0_4'].geometry}
            material={materials.Material_35}
          />
          <mesh
            name="Iphone-B-_iphone_0_5"
            geometry={nodes['Iphone-B-_iphone_0_5'].geometry}
            material={materials.Material_34}
          />
          <mesh
            name="Iphone-B-_iphone_0_6'
            geometry={nodes['Iphone-B-_iphone_0_6'].geometry}
            material={materials.keys}
          />
          <mesh
            name="Iphone-B-_iphone_0_7'
            geometry={nodes['Iphone-B-_iphone_0_7'].geometry}
            material={materials.keys2}
          />
          <mesh
            name="Iphone-B-_iphone_0_8'
            geometry={nodes['Iphone-B-_iphone_0_8'].geometry}
            material={materials.Material_37}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload('/models/iphone.glb');

export default DemoIphone;