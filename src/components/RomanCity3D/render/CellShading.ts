/**
 * Cell-Shaded Drawing Utilities
 * Borderlands-style thick outlines with vivid colors
 */

export interface Point {
    x: number
    y: number
}

export interface IsoPoint {
    x: number
    y: number
}

export interface Color {
    r: number
    g: number
    b: number
    a?: number
}

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 }
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(color: Color): string {
    const toHex = (n: number) => Math.min(255, Math.max(0, Math.floor(n))).toString(16).padStart(2, '0')
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

/**
 * Lighten a color by amount
 */
export function lighten(hex: string, amount: number): string {
    const rgb = hexToRgb(hex)
    return rgbToHex({
        r: rgb.r + amount,
        g: rgb.g + amount,
        b: rgb.b + amount,
    })
}

/**
 * Darken a color by amount
 */
export function darken(hex: string, amount: number): string {
    return lighten(hex, -amount)
}

/**
 * Draw a cell-shaded rectangle (isometric)
 */
export function drawCellShadedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    outlineWidth: number = 3
) {
    // Save context
    ctx.save()

    // Draw outline first
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = outlineWidth
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.rect(x - width / 2, y - height / 2, width, height)
    ctx.stroke()

    // Fill interior
    ctx.fillStyle = color
    ctx.fill()

    ctx.restore()
}

/**
 * Draw a cell-shaded isometric diamond (ground tile)
 */
export function drawCellShadedDiamond(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tileW: number,
    tileH: number,
    color: string,
    outlineWidth: number = 2
) {
    ctx.save()

    // Define diamond path
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + tileW / 2, y + tileH / 2)
    ctx.lineTo(x, y + tileH)
    ctx.lineTo(x - tileW / 2, y + tileH / 2)
    ctx.closePath()

    // Fill
    ctx.fillStyle = color
    ctx.fill()

    // Outline
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = outlineWidth
    ctx.lineJoin = 'round'
    ctx.stroke()

    ctx.restore()
}

/**
 * Draw a cell-shaded isometric cube
 */
export function drawCellShadedCube(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    depth: number,
    height: number,
    color: string,
    outlineWidth: number = 3
) {
    ctx.save()

    const lightColor = lighten(color, 20)
    const shadowColor = darken(color, 30)
    const midColor = darken(color, 10)

    // Left face (shadow)
    ctx.fillStyle = shadowColor
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x - width / 2, y + depth / 2)
    ctx.lineTo(x - width / 2, y + depth / 2 - height)
    ctx.lineTo(x, y - height)
    ctx.closePath()
    ctx.fill()

    // Right face (mid-tone)
    ctx.fillStyle = midColor
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width / 2, y + depth / 2)
    ctx.lineTo(x + width / 2, y + depth / 2 - height)
    ctx.lineTo(x, y - height)
    ctx.closePath()
    ctx.fill()

    // Top face (light)
    ctx.fillStyle = lightColor
    ctx.beginPath()
    ctx.moveTo(x, y - height)
    ctx.lineTo(x + width / 2, y + depth / 2 - height)
    ctx.lineTo(x, y + depth - height)
    ctx.lineTo(x - width / 2, y + depth / 2 - height)
    ctx.closePath()
    ctx.fill()

    // Outline all edges
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = outlineWidth
    ctx.lineJoin = 'round'

    // Left face outline
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x - width / 2, y + depth / 2)
    ctx.lineTo(x - width / 2, y + depth / 2 - height)
    ctx.lineTo(x, y - height)
    ctx.stroke()

    // Right face outline
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width / 2, y + depth / 2)
    ctx.lineTo(x + width / 2, y + depth / 2 - height)
    ctx.lineTo(x, y - height)
    ctx.stroke()

    // Top edges
    ctx.beginPath()
    ctx.moveTo(x, y - height)
    ctx.lineTo(x + width / 2, y + depth / 2 - height)
    ctx.lineTo(x, y + depth - height)
    ctx.lineTo(x - width / 2, y + depth / 2 - height)
    ctx.closePath()
    ctx.stroke()

    ctx.restore()
}

/**
 * Draw a cell-shaded cylinder segment (for columns)
 */
export function drawCellShadedCylinder(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    height: number,
    color: string,
    outlineWidth: number = 2
) {
    ctx.save()

    const lightColor = lighten(color, 15)
    const shadowColor = darken(color, 25)

    // Left side (shadow)
    ctx.fillStyle = shadowColor
    ctx.fillRect(x - radius, y - height, radius, height)

    // Right side (mid)
    ctx.fillStyle = color
    ctx.fillRect(x, y - height, radius, height)

    // Top ellipse (light)
    ctx.fillStyle = lightColor
    ctx.beginPath()
    ctx.ellipse(x, y - height, radius, radius / 2, 0, 0, Math.PI * 2)
    ctx.fill()

    // Outline
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = outlineWidth

    // Vertical edges
    ctx.beginPath()
    ctx.moveTo(x - radius, y - height)
    ctx.lineTo(x - radius, y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x + radius, y - height)
    ctx.lineTo(x + radius, y)
    ctx.stroke()

    // Top ellipse outline
    ctx.beginPath()
    ctx.ellipse(x, y - height, radius, radius / 2, 0, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
}

/**
 * Convert grid coordinates to isometric screen coordinates
 */
export function toIsometric(gridX: number, gridY: number, tileW: number, tileH: number): IsoPoint {
    return {
        x: (gridX - gridY) * tileW,
        y: (gridX + gridY) * tileH,
    }
}

/**
 * Draw text with thick outline
 */
export function drawOutlinedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fillColor: string,
    outlineColor: string = '#000000',
    outlineWidth: number = 4
) {
    ctx.save()

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Outline
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = outlineWidth
    ctx.lineJoin = 'round'
    ctx.strokeText(text, x, y)

    // Fill
    ctx.fillStyle = fillColor
    ctx.fillText(text, x, y)

    ctx.restore()
}
