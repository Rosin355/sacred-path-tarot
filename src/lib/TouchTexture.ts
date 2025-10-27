import * as THREE from 'three';

export class TouchTexture {
  private size: number;
  private width: number;
  private height: number;
  private maxAge: number;
  private trail: Array<{ x: number; y: number; age: number; force: number }>;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public texture: THREE.Texture;

  constructor(width: number, height: number) {
    this.size = 64;
    this.width = width;
    this.height = height;
    this.maxAge = 120;
    this.trail = [];

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.texture = new THREE.Texture(this.canvas);
  }

  update(delta: number) {
    this.clear();

    // Age points
    this.trail.forEach((point, i) => {
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      }
    });

    this.trail.forEach((point) => {
      this.drawTouch(point);
    });

    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point: { x: number; y: number; force?: number }) {
    const force = point.force || 1;
    const x = point.x / this.width;
    const y = 1.0 - point.y / this.height;

    this.trail.push({ x, y, age: 0, force });
  }

  drawTouch(point: { x: number; y: number; age: number; force: number }) {
    const pos = {
      x: point.x * this.size,
      y: point.y * this.size,
    };

    let intensity = 1.0 - point.age / this.maxAge;
    intensity *= point.force;

    const radius = this.size * 0.15 * intensity;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
    grd.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose() {
    this.texture.dispose();
  }
}
