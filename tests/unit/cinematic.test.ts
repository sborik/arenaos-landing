import { describe, it, expect } from 'vitest'
import { calculateCameraPosition } from '../../src/components/scenes/ProductVisionScene'

describe('Cinematic Camera System', () => {
    it('calculates the correct radius based on device type', () => {
        const desktopPos = calculateCameraPosition(0, false)
        const mobilePos = calculateCameraPosition(0, true)

        // At progress 0, radius should be baseRadius
        // Desktop: 5, Mobile: 8
        const desktopRadius = Math.sqrt(desktopPos.position[0] ** 2 + desktopPos.position[2] ** 2)
        const mobileRadius = Math.sqrt(mobilePos.position[0] ** 2 + mobilePos.position[2] ** 2)

        expect(desktopRadius).toBeCloseTo(5, 1)
        expect(mobileRadius).toBeCloseTo(8, 1)
    })

    it('increases height and radius as user scrolls', () => {
        const start = calculateCameraPosition(0, false)
        const end = calculateCameraPosition(1, false)

        expect(end.position[1]).toBeGreaterThan(start.position[1])

        const startRadius = Math.sqrt(start.position[0] ** 2 + start.position[2] ** 2)
        const endRadius = Math.sqrt(end.position[0] ** 2 + end.position[2] ** 2)

        expect(endRadius).toBeGreaterThan(startRadius)
    })

    it('paints a cinematic arc (angle change)', () => {
        const start = calculateCameraPosition(0, false)
        const mid = calculateCameraPosition(0.5, false)
        const end = calculateCameraPosition(1, false)

        const startAngle = Math.atan2(start.position[0], start.position[2])
        const midAngle = Math.atan2(mid.position[0], mid.position[2])
        const endAngle = Math.atan2(end.position[0], end.position[2])

        // Check that angle is progressing
        expect(midAngle).toBeGreaterThan(startAngle)
        expect(endAngle).toBeGreaterThan(midAngle)
    })

    it('lowers focus point for a more dramatic lookup', () => {
        const start = calculateCameraPosition(0, false)
        const end = calculateCameraPosition(1, false)

        // focusY should move from 1.2 to 0.6
        expect(start.target[1]).toBe(1.2)
        expect(end.target[1]).toBe(0.6)
    })
})
