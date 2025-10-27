import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TouchTexture } from '@/lib/TouchTexture';
import { SymbolShapeGenerator } from '@/lib/SymbolShapeGenerator';
import { vertexShader, fragmentShader } from '@/lib/particleShaders';

interface InteractiveParticlesProps {
  currentSymbol: string;
  isVisible: boolean;
}

export const InteractiveParticles = ({ currentSymbol, isVisible }: InteractiveParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points | null;
    touchTexture: TouchTexture;
    material: THREE.ShaderMaterial;
    shapeGenerator: SymbolShapeGenerator;
    animationId: number;
  } | null>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Touch texture
    const touchTexture = new TouchTexture(width, height);

    // Shape generator
    const shapeGenerator = new SymbolShapeGenerator();
    const { positions, targetPositions, randoms } = shapeGenerator.generatePositions(currentSymbol);

    // Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('targetPosition', new THREE.Float32BufferAttribute(targetPositions, 3));
    geometry.setAttribute('random', new THREE.Float32BufferAttribute(randoms, 1));

    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTouch: { value: touchTexture.texture },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Particles
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      touchTexture,
      material,
      shapeGenerator,
      animationId: 0
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Touch handler
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePos.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      const { renderer, scene, camera, touchTexture, material, particles } = sceneRef.current;

      // Update touch texture
      const dx = mousePos.current.x - lastMousePos.current.x;
      const dy = mousePos.current.y - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        touchTexture.addTouch({ 
          x: mousePos.current.x, 
          y: mousePos.current.y,
          force: Math.min(distance * 0.01, 1)
        });
        lastMousePos.current = { ...mousePos.current };
      }

      touchTexture.update(0.016);

      // Update uniforms
      material.uniforms.uTime.value += 0.016;
      material.uniforms.uTouch.value = touchTexture.texture;

      // Rotate particles slightly
      if (particles) {
        particles.rotation.z += 0.0002;
      }

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;

      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
      sceneRef.current.material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.touchTexture.dispose();
        sceneRef.current.shapeGenerator.dispose();
        sceneRef.current.scene.remove(sceneRef.current.particles!);
        sceneRef.current.particles!.geometry.dispose();
        (sceneRef.current.particles!.material as THREE.Material).dispose();
        sceneRef.current.renderer.dispose();
        container.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, []);

  // Handle symbol change
  useEffect(() => {
    if (!sceneRef.current || !sceneRef.current.particles) return;

    const { shapeGenerator, particles } = sceneRef.current;
    const { targetPositions } = shapeGenerator.generatePositions(currentSymbol);

    // Animate to new positions
    const geometry = particles.geometry;
    const currentPositions = geometry.attributes.position.array;
    const newTargets = new Float32Array(targetPositions);

    // Smooth transition
    const duration = 1000; // ms
    const startTime = Date.now();

    const animateTransition = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

      for (let i = 0; i < currentPositions.length; i++) {
        const current = currentPositions[i];
        const target = newTargets[i];
        currentPositions[i] = current + (target - current) * eased * 0.1;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.targetPosition.needsUpdate = true;

      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      }
    };

    geometry.setAttribute('targetPosition', new THREE.Float32BufferAttribute(newTargets, 3));
    animateTransition();
  }, [currentSymbol]);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};
