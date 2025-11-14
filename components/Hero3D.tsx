'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Environment, Clouds } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';

// Dynamic camera movement
function CameraRig() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useFrame((state) => {
    const cam = cameraRef.current;
    cam.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 1.5;
    cam.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.8;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

// Main 3D scene component
function Scene() {
  return (
    <>
      <CameraRig />
      <Environment preset="night" />
      <Stars radius={300} depth={100} count={10000} factor={6} saturation={0} fade speed={0.5} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ec4899" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#8b5cf6"
        castShadow
      />

      {/* 3D Elements */}
      <Clouds />

      {/* Background geometric shapes */}
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#000000" opacity={0.8} transparent />
      </mesh>
    </>
  );
}

// Main Hero3D component
export default function Hero3D() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  return (
    <motion.div
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        className="absolute inset-0"
        dpr={[1, 2]} // Optimize for mobile performance
      >
        <Scene />
      </Canvas>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-transparent px-2 sm:px-4">
        <div className="text-center text-white max-w-4xl relative pointer-events-auto bg-transparent w-full">

          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-2 sm:mb-4 text-white bg-transparent leading-tight"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.3)',
              WebkitTextStroke: '1px rgba(255,255,255,0.1)'
            }}
          >
            TEENSRAVE
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-purple-300 bg-transparent leading-tight"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 20px rgba(168,85,247,0.9), 0 0 40px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.3)',
              WebkitTextStroke: '1px rgba(168,85,247,0.1)'
            }}
          >
            FESTIVAL
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 bg-transparent"
          >
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg pointer-events-auto w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Tickets
            </motion.button>
            <motion.button
              className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 pointer-events-auto bg-transparent w-full sm:w-auto"
              whileHover={{ scale: 1.05, backgroundColor: "white", color: "#581c87" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Experiences
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}