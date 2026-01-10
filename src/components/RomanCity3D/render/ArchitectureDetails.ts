/**
 * Roman Architecture Detail Renderers
 * Procedural generation of columns, arches, pediments
 */

import {
    drawCellShadedCube,
    drawCellShadedCylinder,
    drawCellShadedDiamond,
    lighten,
    darken,
} from './CellShading'
import { drawStoneTexture, drawRoofTiles } from './TextureGen'

/**
 * Draw a Doric column with fluting
 */
export function drawDoricColumn(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    color: string = '#faf0e6'
) {
    const radius = 3
    const segments = 20

    // Base (3 tiers)
    for (let tier = 0; tier < 3; tier++) {
        drawCellShadedCylinder(ctx, x, y - tier * 2, radius + (3 - tier) * 0.5, 2, lighten(color, 10), 2)
    }

    // Shaft with fluting
    for (let seg = 0; seg < segments; seg++) {
        const segY = y - 6 - seg * (height / segments)
        const flutedColor = seg % 2 === 0 ? color : darken(color, 8)
        drawCellShadedCylinder(ctx, x, segY, radius, height / segments, flutedColor, 1)
    }

    // Capital (echinus + abacus)
    drawCellShadedCylinder(ctx, x, y - height - 6, radius * 1.3, 3, lighten(color, 15), 2)
    drawCellShadedCube(ctx, x, y - height - 9, radius * 2.5, radius * 2.5, 2, lighten(color, 20), 2)
}

/**
 * Draw Corinthian column with acanthus leaves
 */
export function drawCorinthianColumn(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    color: string = '#faf0e6'
) {
    const radius = 3.5

    // Base (Attic style)
    for (let tier = 0; tier < 4; tier++) {
        drawCellShadedCylinder(ctx, x, y - tier * 1.5, radius + (4 - tier) * 0.3, 1.5, lighten(color, 8), 1.5)
    }

    // Shaft (smooth)
    for (let seg = 0; seg < 15; seg++) {
        const segY = y - 6 - seg * (height / 15)
        drawCellShadedCylinder(ctx, x, segY, radius, height / 15, color, 1)
    }

    // Corinthian capital with acanthus leaves
    const capitalY = y - height - 6

    // Lower leaves (2 rows)
    for (let row = 0; row < 2; row++) {
        for (let leaf = 0; leaf < 8; leaf++) {
            const angle = (leaf / 8) * Math.PI * 2
            const lx = x + Math.cos(angle) * radius * 1.5
            const ly = capitalY + row * 3

            ctx.fillStyle = row === 0 ? lighten(color, 20) : '#c9b037' // Gold accent
            ctx.beginPath()
            ctx.ellipse(lx, ly, 2, 4, angle, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 1
            ctx.stroke()
        }
    }

    // Abacus (top)
    drawCellShadedCube(ctx, x, capitalY - 6, radius * 3, radius * 3, 2, lighten(color, 25), 2)
}

/**
 * Draw an arched doorway
 */
export function drawArch(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = '#d4a574'
) {
    const stones = 12
    const outlineWidth = 2

    // Voussoirs (wedge-shaped stones)
    for (let i = 0; i < stones; i++) {
        const angle = (i / stones) * Math.PI
        const sx = x + Math.cos(angle) * (width / 2)
        const sy = y - Math.sin(angle) * height

        const stoneColor = i % 2 === 0 ? color : lighten(color, 10)

        // Draw wedge stone
        ctx.save()
        ctx.translate(sx, sy)
        ctx.rotate(angle - Math.PI / 2)

        ctx.fillStyle = stoneColor
        ctx.fillRect(-3, 0, 6, 5)

        ctx.strokeStyle = '#000000'
        ctx.lineWidth = outlineWidth
        ctx.strokeRect(-3, 0, 6, 5)

        ctx.restore()
    }

    // Keystone (center top)
    ctx.fillStyle = lighten(color, 20)
    ctx.fillRect(x - 4, y - height - 3, 8, 6)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = outlineWidth
    ctx.strokeRect(x - 4, y - height - 3, 8, 6)
}

/**
 * Draw a triangular pediment
 */
export function drawPediment(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = '#faf0e6'
) {
    ctx.save()

    // Triangle fill
    ctx.fillStyle = lighten(color, 10)
    ctx.beginPath()
    ctx.moveTo(x, y - height)
    ctx.lineTo(x + width / 2, y)
    ctx.lineTo(x - width / 2, y)
    ctx.closePath()
    ctx.fill()

    // Outline
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.stroke()

    // Frieze (decorative band)
    ctx.fillStyle = color
    ctx.fillRect(x - width / 2, y, width, 4)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(x - width / 2, y, width, 4)

    // Optional: Relief sculptures (simplified)
    for (let i = 0; i < 5; i++) {
        const fx = x - width / 3 + i * (width / 6)
        const fy = y - height / 2

        ctx.fillStyle = darken(color, 15)
        ctx.fillRect(fx - 2, fy - 2, 4, 4)
    }

    ctx.restore()
}

/**
 * Draw window with shutters
 */
export function drawWindow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    isLit: boolean = false
) {
    // Frame
    ctx.fillStyle = '#4a3520'
    ctx.fillRect(x - 1, y - 1, width + 2, height + 2)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.strokeRect(x - 1, y - 1, width + 2, height + 2)

    // Glass
    ctx.fillStyle = isLit ? '#ffeb3b' : '#1a3a52'
    ctx.fillRect(x, y, width, height)

    // Reflection
    if (!isLit) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.fillRect(x, y, width / 2, height / 2)
    }
}

/**
 * Draw door with arch
 */
export function drawDoor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = '#5d4037'
) {
    // Door frame
    ctx.fillStyle = '#8d6e63'
    ctx.fillRect(x - 2, y - 2, width + 4, height + 2)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 2)

    // Door panels
    ctx.fillStyle = color
    ctx.fillRect(x, y - height, width, height)

    // Panel lines
    ctx.strokeStyle = darken(color, 30)
    ctx.lineWidth = 1.5
    ctx.strokeRect(x + 2, y - height + 4, width - 4, height / 2 - 6)
    ctx.strokeRect(x + 2, y - height / 2 + 2, width - 4, height / 2 - 6)

    // Handle
    ctx.fillStyle = '#c9b037' // Bronze
    ctx.fillRect(x + width - 4, y - height / 2 - 1, 2, 2)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 0.5
    ctx.strokeRect(x + width - 4, y - height / 2 - 1, 2, 2)
}

/**
 * Draw a small statue on pedestal
 */
export function drawStatue(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    color: string = '#e8e8e8'
) {
    // Pedestal
    drawCellShadedCube(ctx, x, y, 8, 8, height * 0.3, '#d4a574', 2)

    // Figure (simplified)
    ctx.fillStyle = color
    ctx.fillRect(x - 2, y - height, 4, height * 0.7)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1.5
    ctx.strokeRect(x - 2, y - height, 4, height * 0.7)

    // Head
    ctx.beginPath()
    ctx.arc(x, y - height - 2, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
}
