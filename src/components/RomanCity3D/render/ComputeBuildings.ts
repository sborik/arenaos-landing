/**
 * Compute & Research Building Renderers
 */

import { drawCellShadedCube, lighten, darken } from './CellShading'
import { drawDoricColumn, drawArch, drawWindow } from './ArchitectureDetails'
import { drawRoofTiles } from './TextureGen'
import { BuildingConfig } from './BuildingRenderers'

export function renderTabularium(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 120
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    const centerX = 60, centerY = 95

    drawCellShadedCube(ctx, centerX, centerY, 90, 60, 35, config.baseColor, 3)

    // Archive shelves visible through windows
    for (let floor = 0; floor < 2; floor++) {
        for (let win = 0; win < 4; win++) {
            drawWindow(ctx, centerX - 30 + win * 20, centerY - floor * 20 - 15, 6, 8, true)
        }
    }

    drawRoofTiles(ctx, centerX - 45, centerY - 50, 90, 50, config.roofColor)
    return canvas
}

export function renderAqueduct(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 130
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    const centerX = 65, centerY = 80

    // Arched bridge
    for (let arch = 0; arch < 3; arch++) {
        const ax = centerX - 30 + arch * 30
        drawArch(ctx, ax, centerY, 12, 20, config.baseColor)
    }

    // Water channel on top
    ctx.fillStyle = config.accentColor
    ctx.fillRect(centerX - 40, centerY - 25, 80, 8)

    return canvas
}

export function renderEngineer(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    const centerX = 50, centerY = 80

    drawCellShadedCube(ctx, centerX, centerY, 75, 55, 25, config.baseColor, 2)

    // Gear/machinery visible
    ctx.strokeStyle = '#8d6e63'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX - 15, centerY - 10, 8, 0, Math.PI * 2)
    ctx.stroke()

    drawRoofTiles(ctx, centerX - 38, centerY - 40, 75, 45, config.roofColor)
    return canvas
}

export function renderObservatory(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 90
    canvas.height = 140
    const ctx = canvas.getContext('2d')!
    const centerX = 45, centerY = 110

    // Tower base
    drawCellShadedCube(ctx, centerX, centerY, 50, 50, 40, config.baseColor, 3)

    // Tower shaft
    for (let seg = 0; seg < 3; seg++) {
        drawCellShadedCube(ctx, centerX, centerY - 40 - seg * 18, 40 - seg * 5, 40 - seg * 5, 18, lighten(config.baseColor, seg * 8), 2)
    }

    // Dome observatory
    ctx.fillStyle = lighten(config.baseColor, 20)
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 100, 20, 12, 0, 0, Math.PI, true)
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.stroke()

    return canvas
}

export function renderBathhouse(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 110
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    const centerX = 55, centerY = 80

    drawCellShadedCube(ctx, centerX, centerY, 80, 60, 20, config.baseColor, 3)

    // Dome
    ctx.fillStyle = lighten(config.baseColor, 15)
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 20, 35, 20, 0, 0, Math.PI, true)
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.stroke()

    // Pool (blue water)
    ctx.fillStyle = config.accentColor
    ctx.fillRect(centerX - 15, centerY - 5, 30, 15)

    return canvas
}

export function renderMarket(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 85
    canvas.height = 75
    const ctx = canvas.getContext('2d')!
    const centerX = 42, centerY = 60

    // Stall base
    drawCellShadedCube(ctx, centerX, centerY, 60, 45, 8, '#8d6e63', 2)

    // Awning
    ctx.fillStyle = config.roofColor
    ctx.beginPath()
    ctx.moveTo(centerX - 30, centerY - 8)
    ctx.lineTo(centerX + 30, centerY - 8)
    ctx.lineTo(centerX + 30, centerY - 20)
    ctx.lineTo(centerX - 30, centerY - 20)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.stroke()

    // Goods
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = ['#ff9800', '#4caf50', '#9c27b0'][i]
        ctx.fillRect(centerX - 15 + i * 15, centerY - 4, 8, 6)
    }

    return canvas
}

export function renderWarehouse(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 95
    canvas.height = 90
    const ctx = canvas.getContext('2d')!
    const centerX = 47, centerY = 75

    drawCellShadedCube(ctx, centerX, centerY, 70, 50, 30, darken(config.baseColor, 15), 2)

    // Large doors
    ctx.fillStyle = '#3e2723'
    ctx.fillRect(centerX - 15, centerY, 30, 25)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(centerX - 15, centerY, 30, 25)

    // Crates visible
    ctx.fillStyle = '#8d6e63'
    ctx.fillRect(centerX - 20, centerY - 10, 12, 12)
    ctx.fillRect(centerX + 8, centerY - 10, 12, 12)

    return canvas
}

export const COMPUTE_RESEARCH_RENDERERS = {
    tabularium: renderTabularium,
    aqueduct: renderAqueduct,
    engineer: renderEngineer,
    observatory: renderObservatory,
    bathhouse: renderBathhouse,
    market: renderMarket,
    warehouse: renderWarehouse,
}
