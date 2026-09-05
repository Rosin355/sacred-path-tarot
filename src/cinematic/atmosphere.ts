import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 247, 216, 1)');
  gradient.addColorStop(.18, 'rgba(232, 200, 134, .9)');
  gradient.addColorStop(.55, 'rgba(212, 175, 106, .24)');
  gradient.addColorStop(1, 'rgba(212, 175, 106, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

/**
 * Layer atmosferico GPU a basso costo.
 * È un progressive enhancement: il sito continua a funzionare se WebGL manca.
 */
export function createAtmosphere(container, { pointCount = 180 } = {}) {
  if (!container || !supportsWebGL()) return null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, .1, 20);
  camera.position.z = 3.4;

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);

  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const palette = [
    new Color('#f4efe6'),
    new Color('#e8c886'),
    new Color('#d4af6a'),
  ];

  for (let i = 0; i < pointCount; i++) {
    const i3 = i * 3;
    const depth = Math.random();
    positions[i3] = (Math.random() - .5) * 6.8;
    positions[i3 + 1] = (Math.random() - .5) * 4.2;
    positions[i3 + 2] = -1.8 + depth * 2.2;
    const color = palette[i % palette.length];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  const texture = createGlowTexture();
  const material = new PointsMaterial({
    map: texture,
    size: .055,
    transparent: true,
    opacity: .5,
    vertexColors: true,
    blending: AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new Points(geometry, material);
  scene.add(particles);

  let targetProgress = 0;
  let progress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let rafId = 0;
  let lastFrame = 0;
  let destroyed = false;

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(width, height, false);
  };

  const onPointerMove = event => {
    pointerX = (event.clientX / window.innerWidth - .5) * 2;
    pointerY = (event.clientY / window.innerHeight - .5) * 2;
  };

  const render = time => {
    if (destroyed) return;
    rafId = requestAnimationFrame(render);
    if (document.hidden || time - lastFrame < 32) return; // atmosfera a ~30 fps

    const delta = Math.min(64, time - (lastFrame || time - 16.67));
    lastFrame = time;
    const smoothing = 1 - Math.exp(-delta / 180);
    progress += (targetProgress - progress) * smoothing;

    particles.rotation.z = progress * .18 + time * .000008;
    particles.rotation.y += (pointerX * .035 - particles.rotation.y) * .025;
    particles.rotation.x += (-pointerY * .025 - particles.rotation.x) * .025;
    particles.position.y = (progress - .5) * .16;
    material.opacity = .38 + Math.sin(time * .00032) * .08;
    renderer.render(scene, camera);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  rafId = requestAnimationFrame(render);

  return {
    setProgress(value) {
      targetProgress = Math.max(0, Math.min(1, value));
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
