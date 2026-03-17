import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

type OrbVisualState = VoiceState | 'listening' | 'thinking';
type VoiceOrbVariant = 'default' | 'mini';

interface VoiceOrbProps {
  state: VoiceState;
  visualState?: OrbVisualState;
  analyser: AnalyserNode | null;
  onClick: () => void;
  variant?: VoiceOrbVariant;
}

const STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Assistente vocale — apri pannello',
  loading: 'Assistente vocale — caricamento in corso',
  speaking: 'Assistente vocale — in riproduzione',
  paused: 'Assistente vocale — in pausa',
  error: 'Assistente vocale — errore',
};

export default function VoiceOrb({ state, visualState, analyser, onClick, variant = 'default' }: VoiceOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reducedMotion = useReducedMotion();
  const effectiveState = visualState ?? state;
  const isMini = variant === 'mini';

  const getAmplitude = useMemo(() => {
    if (!analyser) return () => 0;
    const data = new Uint8Array(analyser.frequencyBinCount);

    return () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) sum += data[i];
      return sum / (data.length * 255);
    };
  }, [analyser]);

  useEffect(() => {
    const host = mountRef.current;
    if (!host || isMini) return;

    const width = 108;
    const height = width;
    const orbRadius = 5.2;
    const glowRadius = orbRadius + 0.14;
    const cameraDistance = 18;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, cameraDistance);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    host.innerHTML = '';
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const keyLight = new THREE.PointLight(0xaed5ff, 1.6, 80, 2);
    keyLight.position.set(8, 10, 16);
    const fillLight = new THREE.PointLight(0xd6b8ff, 1.2, 80, 2);
    fillLight.position.set(-10, -6, 12);
    scene.add(ambient, keyLight, fillLight);

    const geometry = new THREE.IcosahedronGeometry(orbRadius, 18);
    const positionAttribute = geometry.getAttribute('position');
    const originalPositions = Float32Array.from(positionAttribute.array as ArrayLike<number>);
    const originalVectors = Array.from({ length: positionAttribute.count }, (_, index) => {
      const vector = new THREE.Vector3(
        originalPositions[index * 3],
        originalPositions[index * 3 + 1],
        originalPositions[index * 3 + 2],
      );
      return vector.clone();
    });

    const orbMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('hsl(0, 0%, 100%)'),
      wireframe: true,
      transparent: true,
      opacity: effectiveState === 'paused' ? 0.44 : 0.78,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
    });

    const orb = new THREE.Mesh(geometry, orbMaterial);
    group.add(orb);

    const glowGeometry = new THREE.IcosahedronGeometry(glowRadius, 10);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('hsl(0, 0%, 100%)'),
      transparent: true,
      opacity: effectiveState === 'paused' ? 0.05 : 0.1,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowOrb = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glowOrb);

    const setColors = () => {
      let orbHue = 205;
      let glowHue = 286;

      if (effectiveState === 'error') {
        orbHue = 6;
        glowHue = 18;
      } else if (effectiveState === 'thinking' || effectiveState === 'loading') {
        orbHue = 218;
        glowHue = 260;
      } else if (effectiveState === 'listening') {
        orbHue = 196;
        glowHue = 268;
      } else if (effectiveState === 'speaking') {
        orbHue = 198;
        glowHue = 312;
      }

      orbMaterial.color = new THREE.Color(`hsl(${orbHue}, 100%, 88%)`);
      glowMaterial.color = new THREE.Color(`hsl(${glowHue}, 100%, 76%)`);
    };

    setColors();

    const resizeRenderer = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = () => {
      const time = performance.now() * 0.001;
      const liveAmplitude = reducedMotion ? 0 : effectiveState === 'speaking' ? getAmplitude() : 0;

      let morphBase = 0.08;
      let morphAudioBoost = 0;
      let rotationSpeed = 0.0035;
      let pulseSpeed = 1.6;
      let noiseScale = 1.2;
      let glowOpacity = 0.08;
      let wireOpacity = 0.72;
      let zBob = 0.18;

      switch (effectiveState) {
        case 'listening':
          morphBase = 0.12;
          rotationSpeed = 0.0058;
          pulseSpeed = 2.2;
          glowOpacity = 0.11;
          wireOpacity = 0.78;
          zBob = 0.26;
          break;
        case 'thinking':
        case 'loading':
          morphBase = 0.15;
          rotationSpeed = 0.008;
          pulseSpeed = 2.8;
          noiseScale = 1.45;
          glowOpacity = 0.12;
          wireOpacity = 0.82;
          zBob = 0.24;
          break;
        case 'speaking':
          morphBase = 0.16;
          morphAudioBoost = liveAmplitude * 1.45;
          rotationSpeed = 0.0105 + liveAmplitude * 0.012;
          pulseSpeed = 3.1 + liveAmplitude * 2.4;
          noiseScale = 1.75 + liveAmplitude * 0.6;
          glowOpacity = 0.12 + liveAmplitude * 0.12;
          wireOpacity = 0.8 + liveAmplitude * 0.18;
          zBob = 0.34 + liveAmplitude * 0.22;
          break;
        case 'paused':
          morphBase = 0.03;
          rotationSpeed = 0.0015;
          pulseSpeed = 1;
          glowOpacity = 0.04;
          wireOpacity = 0.4;
          zBob = 0.1;
          break;
        case 'error':
          morphBase = 0.07;
          rotationSpeed = 0.0046;
          pulseSpeed = 1.8;
          glowOpacity = 0.09;
          wireOpacity = 0.74;
          zBob = 0.14;
          break;
        default:
          break;
      }

      const morphAmount = morphBase + morphAudioBoost;

      for (let index = 0; index < positionAttribute.count; index += 1) {
        const source = originalVectors[index];
        const normalized = source.clone().normalize();
        const waveA = Math.sin(source.x * noiseScale + time * pulseSpeed + source.y * 0.8);
        const waveB = Math.cos(source.y * (noiseScale * 1.16) - time * (pulseSpeed * 0.86) + source.z * 1.2);
        const waveC = Math.sin(source.z * (noiseScale * 1.42) + time * (pulseSpeed * 0.62) + source.x * 1.6);
        const ripple = (waveA + waveB * 0.7 + waveC * 0.55) * morphAmount;
        const radius = source.length() + ripple;
        const deformed = normalized.multiplyScalar(radius);
        positionAttribute.setXYZ(index, deformed.x, deformed.y, deformed.z);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      orbMaterial.opacity = wireOpacity;
      glowMaterial.opacity = glowOpacity;

      group.rotation.y += reducedMotion ? 0.001 : rotationSpeed;
      group.rotation.x = Math.sin(time * 0.7) * 0.16;
      group.rotation.z = Math.cos(time * 0.55) * 0.1;
      group.position.z = Math.sin(time * 1.2) * zBob;
      glowOrb.rotation.y = -group.rotation.y * 1.14;
      glowOrb.rotation.x = group.rotation.x * 0.8;
      glowOrb.scale.setScalar(1.008 + Math.sin(time * 1.8) * 0.012 + liveAmplitude * 0.08);

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    resizeRenderer();
    render();

    const handleResize = () => resizeRenderer();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      geometry.dispose();
      glowGeometry.dispose();
      orbMaterial.dispose();
      glowMaterial.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
    };
  }, [effectiveState, getAmplitude, isMini, reducedMotion]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="voice-orb voice-siri-orb"
      aria-label={STATE_LABELS[state]}
      title="Assistente vocale"
      data-voice-assistant
      data-voice-orb
      data-state={state}
      data-visual-state={effectiveState}
      data-variant={variant}
    >
      <span className="voice-orb-halo" aria-hidden="true" />
      <span className="voice-siri-orb__surface" aria-hidden="true" />
      <div ref={mountRef} className="voice-orb-webgl" aria-hidden="true" />
      <span className="voice-orb-tooltip" aria-hidden="true">Ascolta o chiedi guida</span>
    </button>
  );
}
