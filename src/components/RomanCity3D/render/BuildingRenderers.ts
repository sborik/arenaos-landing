/**
 * Procedural Building Type Renderers
 * Each function renders a complete building to an off-screen canvas
 */

import {
    drawCellShadedCube,
    drawCellShadedDiamond,
    lighten,
    darken,
} from './CellShading'
import {
    drawDoricColumn,
    drawCorinthianColumn,
    drawArch,
    drawPediment,
    drawWindow,
    drawDoor,
    drawStatue,
} from './ArchitectureDetails'
import { drawRoofTiles, drawStoneTexture } from './TextureGen'

export interface BuildingConfig {
    width: number
    depth: number
    baseColor: string
    accentColor: string
    roofColor: string
}

/**
 * Render Temple (Large landmark)
 */
export function renderTemple(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext('2d')!

    const centerX = 100
    const centerY = 150

    // Platform (3 tiers)
    for (let tier = 0; tier < 3; tier++) {
        const tierW = 90 - tier * 5
        const tierD = 50 - tier * 3
        drawCellShadedCube(ctx, centerX, centerY - tier * 4, tierW, tierD, 4, config.baseColor, 3)
    }

    // Columns (6 Corinthian)
    const platformY = centerY - 12
    for (let i = 0; i < 6; i++) {
        const colX = centerX - 40 + i * 16
        drawCorinthianColumn(ctx, colX, platformY, 50, config.baseColor)
    }

    // Pediment
    drawPediment(ctx, centerX, platformY - 50, 100, 20, config.baseColor)

    // Roof
    const roofY = platformY - 60
    drawRoofTiles(ctx, centerX - 45, roofY, 90, 30, config.roofColor)

    // Entrance
    drawDoor(ctx, centerX - 8, platformY - 8, 16, 24, darken(config.baseColor, 40))

    // Statues on platform
    drawStatue(ctx, centerX - 50, platformY, 12, '#e8e8e8')
    drawStatue(ctx, centerX + 50, platformY, 12, '#e8e8e8')

    return canvas
}

/**
 * Render Colosseum (Arena landmark)
 */
export function renderColosseum(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 220
    canvas.height = 180
    const ctx = canvas.getContext('2d')!

    const centerX = 110
    const centerY = 140

    // Elliptical tiers (3 levels)
    for (let tier = 0; tier < 3; tier++) {
        const radiusX = 90 - tier * 10
        const radiusY = 50 - tier * 6
        const tierY = centerY - tier * 20

        // Outer wall
        ctx.fillStyle = tier === 0 ? config.baseColor : lighten(config.baseColor, tier * 10)
        ctx.beginPath()
        ctx.ellipse(centerX, tierY, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.stroke()

        // Arched facade (24 arches per tier)
        for (let arch = 0; arch < 24; arch++) {
            const angle = (arch / 24) * Math.PI * 2
            const archX = centerX + Math.cos(angle) * (radiusX - 8)
            const archY = tierY + Math.sin(angle) * (radiusY - 4)

            drawArch(ctx, archX, archY, 6, 10, darken(config.baseColor, tier * 15))
        }
    }

    // Arena floor
    ctx.fillStyle = '#d4a574' // Sand
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, 50, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.stroke()

    return canvas
}

/**
 * Render Forum Building (Compute landmark)
 */
export function renderForum(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 180
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    const centerX = 90
    const centerY = 130

    // Courtyard base
    drawCellShadedCube(ctx, centerX, centerY, 140, 80, 8, config.baseColor, 3)

    // Colonnade (all 4 sides)
    const colSpacing = 14

    // Front colonnade
    for (let i = 0; i < 9; i++) {
        const colX = centerX - 60 + i * colSpacing
        const colY = centerY + 30
        drawDoricColumn(ctx, colX, colY, 35, config.baseColor)
    }

    // Left colonnade
    for (let i = 0; i < 5; i++) {
        const colX = centerX - 60
        const colY = centerY + 30 - i * colSpacing
        drawDoricColumn(ctx, colX, colY, 35, config.baseColor)
    }

    // Roof (tiled)
    const roofY = centerY - 50
    drawRoofTiles(ctx, centerX - 70, roofY, 140, 60, config.roofColor)

    // Central fountain
    ctx.fillStyle = config.accentColor
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 4, 10, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.stroke()

    return canvas
}

/**
 * Render Library (Education/Research)
 */
export function renderLibrary(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 140
    canvas.height = 150
    const ctx = canvas.getContext('2d')!

    const centerX = 70
    const centerY = 120

    // Multi-story building (3 floors)
    for (let floor = 0; floor < 3; floor++) {
        const floorY = centerY - floor * 30
        drawCellShadedCube(ctx, centerX, floorY, 100, 50, 30, lighten(config.baseColor, floor * 8), 3)

        // Windows on each floor (5 windows per floor)
        for (let win = 0; win < 5; win++) {
            const winX = centerX - 40 + win * 20
            const winY = floorY - 20
            drawWindow(ctx, winX, winY, 6, 8, Math.random() > 0.5)
        }

        // Arched openings on ground floor
        if (floor === 0) {
            for (let arch = 0; arch < 3; arch++) {
                const archX = centerX - 30 + arch * 30
                drawArch(ctx, archX, centerY, 10, 15, darken(config.baseColor, 15))
            }
        }
    }

    // Roof
    drawRoofTiles(ctx, centerX - 50, centerY - 90, 100, 50, config.roofColor)

    // Balcony on 2nd floor
    ctx.fillStyle = darken(config.baseColor, 10)
    ctx.fillRect(centerX - 45, centerY - 60, 90, 4)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(centerX - 45, centerY - 60, 90, 4)

    return canvas
}

/**
 * Render Villa (Medium housing)
 */
export function renderVilla(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 110
    canvas.height = 110
    const ctx = canvas.getContext('2d')!

    const centerX = 55
    const centerY = 85

    // Courtyard style
    drawCellShadedCube(ctx, centerX, centerY, 80, 50, 20, config.baseColor, 2)

    // Inner courtyard
    ctx.fillStyle = lighten(config.baseColor, 25)
    ctx.fillRect(centerX - 15, centerY - 10, 30, 20)

    // Small fountain in courtyard
    ctx.fillStyle = config.accentColor
    ctx.beginPath()
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
    ctx.fill()

    // Columns at entrance
    drawDoricColumn(ctx, centerX - 20, centerY + 15, 20, config.baseColor)
    drawDoricColumn(ctx, centerX + 20, centerY + 15, 20, config.baseColor)

    // Roof
    drawRoofTiles(ctx, centerX - 40, centerY - 40, 80, 40, config.roofColor)

    // Windows
    for (let i = 0; i < 3; i++) {
        const winX = centerX - 25 + i * 25
        drawWindow(ctx, winX, centerY - 15, 4, 6, false)
    }

    return canvas
}

/**
 * Render Insula (Small apartment)
 */
export function renderInsula(config: BuildingConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 90
    canvas.height = 100
    const ctx = canvas.getContext('2d')!

    const centerX = 45
    const centerY = 80

    // Rectangular building (3 floors)
    for (let floor = 0; floor < 3; floor++) {
        const floorY = centerY - floor * 22
        drawCellShadedCube(ctx, centerX, floorY, 60, 40, 22, lighten(config.baseColor, floor * 5), 2)

        // Windows
        for (let win = 0; win < 3; win++) {
            const winX = centerX - 20 + win * 20
            drawWindow(ctx, winX, floorY - 12, 4, 5, Math.random() > 0.6)
        }

        // Balcony every other floor
        if (floor > 0 && floor % 2 === 0) {
            ctx.fillStyle = darken(config.baseColor, 15)
            ctx.fillRect(centerX - 25, floorY, 50, 3)
        }
    }

    // Roof
    drawRoofTiles(ctx, centerX - 30, centerY - 66, 60, 35, config.roofColor)

    // Entrance door
    drawDoor(ctx, centerX - 6, centerY, 12, 16, '#5d4037')

    return canvas
}

/**
 * Render more building types...
 * (Continuing with all 20 types following same pattern)
 */

// Export all renderers
export const BUILDING_RENDERERS = {
    temple: renderTemple,
    colosseum: renderColosseum,
    forum: renderForum,
    library: renderLibrary,
    villa: renderVilla,
    insula: renderInsula,
    // ... more will be added
}
