/**
 * Perlin Noise Generator for Texture Variation
 */

class PerlinNoise {
    private gradients: { [key: string]: [number, number] } = {}
    private memory: { [key: string]: number } = {}

    private rand_vect(): [number, number] {
        const theta = Math.random() * 2 * Math.PI
        return [Math.cos(theta), Math.sin(theta)]
    }

    private dot_prod_grid(x: number, y: number, vx: number, vy: number): number {
        const g_vect = this.gradients[[vx, vy].join(',')]
        const d_vect: [number, number] = [x - vx, y - vy]
        return d_vect[0] * g_vect[0] + d_vect[1] * g_vect[1]
    }

    private smootherstep(x: number): number {
        return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3
    }

    private interp(x: number, a: number, b: number): number {
        return a + this.smootherstep(x) * (b - a)
    }

    private seed_gradients(): void {
        for (let x = -10; x < 10; x++) {
            for (let y = -10; y < 10; y++) {
                this.gradients[[x, y].join(',')] = this.rand_vect()
            }
        }
    }

    public get(x: number, y: number): number {
        const mem_key = [x, y].join(',')
        if (this.memory[mem_key]) {
            return this.memory[mem_key]
        }

        if (Object.keys(this.gradients).length === 0) {
            this.seed_gradients()
        }

        const xf = Math.floor(x)
        const yf = Math.floor(y)

        // Interpolate
        const tl = this.dot_prod_grid(x, y, xf, yf)
        const tr = this.dot_prod_grid(x, y, xf + 1, yf)
        const bl = this.dot_prod_grid(x, y, xf, yf + 1)
        const br = this.dot_prod_grid(x, y, xf + 1, yf + 1)

        const xt = this.interp(x - xf, tl, tr)
        const xb = this.interp(x - xf, bl, br)
        const v = this.interp(y - yf, xt, xb)

        this.memory[mem_key] = v
        return v
    }
}

// Singleton instance
const perlinInstance = new PerlinNoise()

/**
 * Get Perlin noise value at coordinates
 */
export function perlinNoise(x: number, y: number): number {
    return perlinInstance.get(x, y)
}

/**
 * Apply texture grain to a rectangular area
 */
export function applyTextureGrain(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    baseColor: string,
    grainIntensity: number = 15
) {
    const rgb = hexToRgb(baseColor)
    const imageData = ctx.getImageData(x, y, width, height)
    const pixels = imageData.data

    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            const i = (py * width + px) * 4
            const noise = perlinNoise(px * 0.05, py * 0.05) * grainIntensity

            pixels[i] = Math.min(255, Math.max(0, rgb.r + noise))
            pixels[i + 1] = Math.min(255, Math.max(0, rgb.g + noise))
            pixels[i + 2] = Math.min(255, Math.max(0, rgb.b + noise))
            pixels[i + 3] = 255
        }
    }

    ctx.putImageData(imageData, x, y)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : { r: 0, g: 0, b: 0 }
}

/**
 * Draw stone texture pattern
 */
export function drawStoneTexture(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    baseColor: string
) {
    // Fill base
    ctx.fillStyle = baseColor
    ctx.fillRect(x, y, width, height)

    // Apply grain
    applyTextureGrain(ctx, x, y, width, height, baseColor, 12)

    // Add stone cracks
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.lineWidth = 1

    for (let i = 0; i < 5; i++) {
        const crack = Math.random()
        if (crack > 0.7) {
            ctx.beginPath()
            ctx.moveTo(x + Math.random() * width, y)
            ctx.lineTo(x + Math.random() * width, y + height)
            ctx.stroke()
        }
    }
}

/**
 * Draw roof tile pattern
 */
export function drawRoofTiles(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    depth: number,
    tileColor: string
) {
    const tileW = 6
    const tileH = 3
    const tilesX = Math.floor(width / tileW)
    const tilesY = Math.floor(depth / tileH)

    for (let row = 0; row < tilesY; row++) {
        for (let col = 0; col < tilesX; col++) {
            const tx = x + col * tileW
            const ty = y + row * tileH

            // Alternate tile shade
            const shade = (row + col) % 2 === 0 ? tileColor : darken(tileColor, 15)

            ctx.fillStyle = shade
            ctx.fillRect(tx, ty, tileW - 1, tileH - 1)

            // Tile outline
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 0.5
            ctx.strokeRect(tx, ty, tileW - 1, tileH - 1)
        }
    }
}

function darken(hex: string, amount: number): string {
    const rgb = hexToRgb(hex)
    return `#${toHex(rgb.r - amount)}${toHex(rgb.g - amount)}${toHex(rgb.b - amount)}`
}

function toHex(n: number): string {
    return Math.min(255, Math.max(0, Math.floor(n)))
        .toString(16)
        .padStart(2, '0')
}
