export const vertexShader = `
uniform sampler2D uTouch;
uniform float uTime;
uniform vec2 uResolution;
attribute vec3 targetPosition;
attribute float random;
varying vec2 vUv;
varying float vAlpha;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Sample touch texture
  vec2 touchUv = (position.xy + uResolution * 0.5) / uResolution;
  touchUv.y = 1.0 - touchUv.y;
  vec4 touch = texture2D(uTouch, touchUv);
  
  // Displacement from touch
  float displacement = touch.r * 50.0;
  
  // Direction from touch point
  vec2 touchPos = (touch.gb - 0.5) * 2.0 * uResolution;
  vec2 direction = normalize(pos.xy - touchPos);
  
  // Apply displacement
  pos.xy += direction * displacement;
  pos.z += displacement * 0.3;
  
  // Smooth return animation
  pos = mix(pos, targetPosition, 0.1);
  
  // Vary alpha based on displacement and random
  vAlpha = mix(0.6, 1.0, 1.0 - touch.r) * (0.5 + random * 0.5);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (2.0 + random * 3.0) * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = `
varying vec2 vUv;
varying float vAlpha;

void main() {
  // Soft circular particle
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  
  // Gold color
  vec3 color = vec3(0.831, 0.686, 0.216);
  
  gl_FragColor = vec4(color, alpha * vAlpha * 0.4);
}
`;
