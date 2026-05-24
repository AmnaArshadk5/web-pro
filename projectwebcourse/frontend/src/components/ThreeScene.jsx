import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, RoundedBox, Environment, ContactShadows, Sparkles } from '@react-three/drei';

const FloatingShapes = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#D8F3DC" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#F4A261" />
      <directionalLight position={[0, 10, -10]} intensity={0.5} color="#E2E8F0" />
      
      {/* Central Abstract Fintech Shape (Torus Knot) */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[0, 0.5, 0]}>
          <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
          <MeshDistortMaterial 
            color="#1B4332" 
            envMapIntensity={1} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.6} 
            roughness={0.2} 
            distort={0.3} 
            speed={2} 
          />
        </mesh>
      </Float>

      {/* Floating Glass Cube representing Analytics/Data */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1} position={[2, 2, -2]}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.15} smoothness={4}>
          <meshPhysicalMaterial 
            color="#E07A5F" 
            transmission={0.9} 
            thickness={0.5} 
            roughness={0.1} 
            ior={1.5}
            clearcoat={1}
          />
        </RoundedBox>
      </Float>

      {/* Floating Coin-like object */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={3} position={[-2, -1.5, 1]}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
          <meshPhysicalMaterial 
            color="#F4A261" 
            metalness={0.8} 
            roughness={0.2} 
            clearcoat={1} 
          />
        </mesh>
      </Float>

      {/* Ambient Sparkles */}
      <Sparkles count={80} scale={8} size={3} speed={0.4} opacity={0.4} color="#D8F3DC" />
      
      {/* Environment reflections and soft shadows */}
      <Environment preset="city" />
      <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={20} blur={2.5} far={5} />
    </>
  );
};

export default function ThreeScene() {
  return (
    <div className="w-full h-[500px] lg:h-[600px] relative z-10 cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
