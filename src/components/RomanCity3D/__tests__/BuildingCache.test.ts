/**
 * Unit Tests for Building Cache
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { BuildingCache, VIVID_PALETTES } from '../render/BuildingCache'

describe('BuildingCache', () => {
    let cache: BuildingCache

    beforeEach(() => {
        cache = new BuildingCache()
    })

    describe('initialization', () => {
        it('should start unloaded', () => {
            expect(cache.isLoaded()).toBe(false)
        })

        it('should initialize all building variants', () => {
            cache.initializeCache()
            expect(cache.isLoaded()).toBe(true)

            const stats = cache.getStats()
            expect(stats.totalBuildings).toBeGreaterThan(0)
            expect(stats.loaded).toBe(true)
        })
    })

    describe('getBuilding', () => {
        beforeEach(() => {
            cache.initializeCache()
        })

        it('should return cached building canvas', () => {
            const temple = cache.getBuilding('temple', 'education')
            expect(temple).not.toBeNull()
            expect(temple).toBeInstanceOf(HTMLCanvasElement)
        })

        it('should fallback to generic theme if not found', () => {
            const building = cache.getBuilding('temple')
            expect(building).not.toBeNull()
        })

        it('should return null for invalid building type', () => {
            const invalid = cache.getBuilding('nonexistent', 'education')
            expect(invalid).toBeNull()
        })

        it('should return different canvases for different themes', () => {
            const educationTemple = cache.getBuilding('temple', 'education')
            const arenaTemple = cache.getBuilding('temple', 'arena')

            expect(educationTemple).not.toBe(arenaTemple)
        })
    })

    describe('getStats', () => {
        it('should return accurate statistics', () => {
            cache.initializeCache()
            const stats = cache.getStats()

            expect(stats.buildingTypes).toBeGreaterThan(0)
            expect(stats.themes).toBe(Object.keys(VIVID_PALETTES).length)
            expect(stats.totalBuildings).toBe(stats.buildingTypes * stats.themes)
        })
    })
})
