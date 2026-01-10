/**
 * Additional Building Type Renderers
 */

import { drawCellShadedCube, lighten, darken } from './CellShading'
import { drawDoricColumn, drawArch, drawWindow, drawDoor } from './ArchitectureDetails'
import { drawRoofTiles } from './TextureGen'

export interface BuildingConfig {
    width: number
    depth: number
    baseColor: string
    accentColor: string
    roofColor: string
}

function drawStickFigure(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    scale: number = 1,
    hasWeapon: boolean = false
) {
    const s = scale
    ctx.fillStyle = '#f4c2a8'
    ctx.beginPath()
    ctx.arc(x, y - 6 * s, 2 * s, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = color
    ctx.lineWidth = 1.5 * s
    ctx.beginPath()
    ctx.moveTo(x, y - 4 * s)
    ctx.lineTo(x, y + 2 * s)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x - 3 * s, y - 2 * s)
    ctx.lineTo(x + 3 * s, y - 2 * s)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x, y + 2 * s)
    ctx.lineTo(x - 2 * s, y + 6 * s)
    ctx.moveTo(x, y + 2 * s)
    ctx.lineTo(x + 2 * s, y + 6 * s)
    ctx.stroke()

    if (hasWeapon) {
        ctx.strokeStyle = '#9e9e9e'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x + 3 * s, y - 2 * s)
        ctx.lineTo(x + 6 * s, y - 5 * s)
        ctx.stroke()
    }
}

export function renderGymnasium(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 150
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    const centerX = 75, centerY = 95

    drawCellShadedCube(ctx, centerX, centerY, 120, 70, 6, lighten(config.baseColor, 15), 2)

    for (let i = 0; i < 7; i++) {
        const colX = centerX - 50 + i * 17
        drawDoricColumn(ctx, colX, centerY + 25, 30, config.baseColor)
    }

    ctx.fillStyle = '#8d6e63'
    ctx.fillRect(centerX - 20, centerY - 3, 10, 6)
    ctx.fillRect(centerX + 10, centerY - 3, 10, 6)

    for (let i = 0; i < 4; i++) {
        drawStickFigure(ctx, centerX - 30 + i * 20, centerY, config.accentColor)
    }

    drawRoofTiles(ctx, centerX - 60, centerY - 35, 120, 30, config.roofColor)
    return canvas
}

export function renderScholae(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 130
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    const centerX = 65, centerY = 95

    drawCellShadedCube(ctx, centerX, centerY, 100, 60, 20, config.baseColor, 3)

    ctx.fillStyle = lighten(config.baseColor, 30)
    ctx.fillRect(centerX - 20, centerY - 10, 40, 25)

    ctx.fillStyle = config.accentColor
    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
    ctx.fill()

    for (let i = 0; i < 4; i++) {
        const archX = centerX - 35 + i * 24
        drawArch(ctx, archX, centerY + 20, 8, 12, darken(config.baseColor, 15))
    }

    for (let i = 0; i < 5; i++) {
        drawStickFigure(ctx, centerX - 15 + i * 8, centerY + 2, lighten(config.accentColor, 30), 0.6)
    }

    drawRoofTiles(ctx, centerX - 50, centerY - 45, 100, 50, config.roofColor)
    return canvas
}

export function renderLudus(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 140
    canvas.height = 130
    const ctx = canvas.getContext('2d')!
    const centerX = 70, centerY = 100

    drawCellShadedCube(ctx, centerX, centerY, 110, 70, 12, darken(config.baseColor, 10), 3)

    ctx.fillStyle = '#d4a574'
    ctx.fillRect(centerX - 30, centerY - 6, 60, 35)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(centerX - 30, centerY - 6, 60, 35)

    ctx.fillStyle = '#5d4037'
    ctx.fillRect(centerX - 50, centerY - 6, 8, 12)
    ctx.fillRect(centerX + 42, centerY - 6, 8, 12)

    for (let i = 0; i < 3; i++) {
        drawStickFigure(ctx, centerX - 20 + i * 20, centerY + 10, '#ef4444', 1, true)
    }

    for (let cell = 0; cell < 5; cell++) {
        drawWindow(ctx, centerX - 45 + cell * 22, centerY - 30, 4, 6, false)
    }

    drawRoofTiles(ctx, centerX - 55, centerY - 50, 110, 55, config.roofColor)

    ctx.font = 'bold 8px serif'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.fillText('LUDUS', centerX, centerY - 55)

    return canvas
}

export function renderArmory(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 110
    const ctx = canvas.getContext('2d')!
    const centerX = 50, centerY = 88

    for (let floor = 0; floor < 2; floor++) {
        const floorY = centerY - floor * 28
        drawCellShadedCube(ctx, centerX, floorY, 70, 50, 28, darken(config.baseColor, floor * 10), 3)

        for (let slit = 0; slit < 4; slit++) {
            const slitX = centerX - 25 + slit * 17
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(slitX, floorY - 15, 2, 8)
        }
    }

    for (let shield = 0; shield < 3; shield++) {
        const sx = centerX - 20 + shield * 20
        const sy = centerY - 20

        ctx.fillStyle = '#c62828'
        ctx.beginPath()
        ctx.arc(sx, sy, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#c9b037'
        ctx.lineWidth = 1.5
        ctx.stroke()
    }

    drawDoor(ctx, centerX - 8, centerY, 16, 20, '#3e2723')
    drawRoofTiles(ctx, centerX - 35, centerY - 70, 70, 45, darken(config.roofColor, 20))

    return canvas
}

export function renderTrophyHall(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 110
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    const centerX = 55, centerY = 80

    drawCellShadedCube(ctx, centerX, centerY, 85, 55, 25, lighten(config.baseColor, 10), 3)

    const colPositions = [
        [centerX - 30, centerY - 20],
        [centerX + 30, centerY - 20],
        [centerX - 30, centerY + 15],
        [centerX + 30, centerY + 15],
    ]

    colPositions.forEach(([cx, cy]) => {
        drawDoricColumn(ctx, cx, cy, 30, '#e8e8e8')
    })

    for (let wreath = 0; wreath < 3; wreath++) {
        const wx = centerX - 20 + wreath * 20
        const wy = centerY - 18

        ctx.strokeStyle = '#4caf50'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(wx, wy, 5, 0, Math.PI * 2)
        ctx.stroke()
    }

    ctx.fillStyle = '#c9b037'
    ctx.fillRect(centerX - 5, centerY - 8, 3, 8)
    ctx.fillRect(centerX - 5, centerY - 12, 3, 3)

    ctx.fillStyle = lighten(config.baseColor, 20)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 45)
    ctx.lineTo(centerX + 45, centerY - 25)
    ctx.lineTo(centerX - 45, centerY - 25)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.stroke()

    return canvas
}

export const ADDITIONAL_RENDERERS = {
    gymnasium: renderGymnasium,
    scholae: renderScholae,
    ludus: renderLudus,
    armory: renderArmory,
    trophy_hall: renderTrophyHall,
}
