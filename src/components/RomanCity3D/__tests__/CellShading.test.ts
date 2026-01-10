/**
 * Unit Tests for Cell Shading Utilities
 */

import { describe, it, expect } from '@jest/globals'
import { hexToRgb, rgbToHex, lighten, darken, toIsometric } from '../render/CellShading'

describe('CellShading Utilities', () => {
    describe('hexToRgb', () => {
        it('should convert hex to RGB correctly', () => {
            expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
            expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
            expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
            expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
            expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
        })

        it('should handle hex without hash', () => {
            expect(hexToRgb('808080')).toEqual({ r: 128, g: 128, b: 128 })
        })
    })

    describe('rgbToHex', () => {
        it('should convert RGB to hex correctly', () => {
            expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
            expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
            expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
        })

        it('should clamp values to 0-255 range', () => {
            expect(rgbToHex({ r: 300, g: -10, b: 128 })).toBe('#ff0080')
        })
    })

    describe('lighten', () => {
        it('should lighten colors correctly', () => {
            const result = hexToRgb(lighten('#808080', 20))
            expect(result.r).toBe(148)
            expect(result.g).toBe(148)
            expect(result.b).toBe(148)
        })

        it('should not exceed 255', () => {
            const result = hexToRgb(lighten('#ffffff', 50))
            expect(result.r).toBe(255)
            expect(result.g).toBe(255)
            expect(result.b).toBe(255)
        })
    })

    describe('darken', () => {
        it('should darken colors correctly', () => {
            const result = hexToRgb(darken('#808080', 20))
            expect(result.r).toBe(108)
            expect(result.g).toBe(108)
            expect(result.b).toBe(108)
        })

        it('should not go below 0', () => {
            const result = hexToRgb(darken('#000000', 50))
            expect(result.r).toBe(0)
            expect(result.g).toBe(0)
            expect(result.b).toBe(0)
        })
    })

    describe('toIsometric', () => {
        it('should convert grid to isometric coordinates', () => {
            const result = toIsometric(0, 0, 64, 32)
            expect(result.x).toBe(0)
            expect(result.y).toBe(0)
        })

        it('should handle positive grid coordinates', () => {
            const result = toIsometric(10, 5, 64, 32)
            expect(result.x).toBe(320) // (10-5) * 64
            expect(result.y).toBe(480) // (10+5) * 32
        })

        it('should handle negative grid coordinates', () => {
            const result = toIsometric(-5, 5, 64, 32)
            expect(result.x).toBe(-640) // (-5-5) * 64
            expect(result.y).toBe(0) // (-5+5) * 32
        })
    })
})
