export class SymbolShapeGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private size: number;

  constructor(size = 512) {
    this.size = size;
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext('2d')!;
  }

  generatePositions(symbol: string, numParticles = 6000, spread = 200) {
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.size, this.size);

    // Draw symbol
    this.ctx.fillStyle = 'white';
    this.ctx.font = `${this.size * 0.6}px serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(symbol, this.size / 2, this.size / 2);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, this.size, this.size);
    const pixels = imageData.data;

    // Sample pixels to create positions
    const positions: number[] = [];
    const targetPositions: number[] = [];
    const randoms: number[] = [];
    
    let sampledPixels = 0;
    const step = 2; // Sample every N pixels

    for (let i = 0; i < pixels.length; i += 4 * step) {
      if (sampledPixels >= numParticles) break;

      const alpha = pixels[i + 3];
      if (alpha > 128) {
        const x = ((i / 4) % this.size) - this.size / 2;
        const y = Math.floor(i / 4 / this.size) - this.size / 2;

        // Scale to desired spread
        const scale = spread / this.size;
        positions.push(x * scale, -y * scale, 0);
        targetPositions.push(x * scale, -y * scale, 0);
        randoms.push(Math.random());
        
        sampledPixels++;
      }
    }

    // Fill remaining with random positions if needed
    while (sampledPixels < numParticles) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * spread * 0.5;
      positions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      targetPositions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      randoms.push(Math.random());
      sampledPixels++;
    }

    return { positions, targetPositions, randoms };
  }

  dispose() {
    // Cleanup if needed
  }
}
