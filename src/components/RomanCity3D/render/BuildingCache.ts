/**
 * Building Cache System
 * Pre-renders all building types to off-screen canvases for fast runtime rendering
 */

import { BUILDING_RENDERERS } from './BuildingRenderers'
import { ADDITIONAL_RENDERERS } from './AdditionalBuildings'
import { COMPUTE_RESEARCH_RENDERERS } from './ComputeBuildings'

export const VIVID_PALETTES = {
    education: {
        baseColor: '#00d084',
        accentColor: '#ffd700',
        roofColor: '#ff6b35',
    },
    arena: {
        baseColor: '#ff4136',
        accentColor: '#ffdc00',
        roofColor: '#b8390e',
    },
    compute: {
        baseColor: '#0074d9',
        accentColor: '#7fdbff',
        roofColor: '#001f3f',
    },
    research: {
        baseColor: '#b10dc9',
        accentColor: '#f012be',
        roofColor: '#85144b',
    },
    arvr: {
        baseColor: '#a463f2',
        accentColor: '#d946ef',
        roofColor: '#7c3aed',
    },
    manufacturing: {
        baseColor: '#ff851b',
        accentColor: '#ffdc00',
        roofColor: '#b8390e',
    },
    generic: {
        baseColor: '#e8d5c4',
        accentColor: '#87CEEB',
        roofColor: '#cd853f',
    },
}

export type BuildingType = keyof typeof ALL_RENDERERS
export type DistrictTheme = keyof typeof VIVID_PALETTES

const ALL_RENDERERS = {
    ...BUILDING_RENDERERS,
    ...ADDITIONAL_RENDERERS,
    ...COMPUTE_RESEARCH_RENDERERS,
}

export class BuildingCache {
    private cache: Map<string, HTMLCanvasElement> = new Map()
    private loaded: boolean = false

    /**
     * Pre-render all building types with all district color schemes
     */
    initializeCache() {
        console.log('Building cache: Generating procedural buildings...')

        Object.entries(ALL_RENDERERS).forEach(([buildingType, renderer]) => {
            Object.entries(VIVID_PALETTES).forEach(([theme, palette]) => {
                const cacheKey = `${buildingType}_${theme}`

                try {
                    const canvas = renderer({
                        width: 100,
                        depth: 60,
                        ...palette,
                    })

                    this.cache.set(cacheKey, canvas)
                } catch (error) {
                    console.warn(`Failed to render ${cacheKey}:`, error)
                }
            })
        })

        this.loaded = true
        console.log(`Building cache: Generated ${this.cache.size} building variants`)
    }

    /**
     * Get a cached building canvas
     */
    getBuilding(buildingType: string, theme: DistrictTheme = 'generic'): HTMLCanvasElement | null {
        const cacheKey = `${buildingType}_${theme}`
        return this.cache.get(cacheKey) || this.cache.get(`${buildingType}_generic`) || null
    }

    /**
     * Check if cache is ready
     */
    isLoaded(): boolean {
        return this.loaded
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            totalBuildings: this.cache.size,
            buildingTypes: Object.keys(ALL_RENDERERS).length,
            themes: Object.keys(VIVID_PALETTES).length,
            loaded: this.loaded,
        }
    }
}

// Singleton instance
export const buildingCache = new BuildingCache()
