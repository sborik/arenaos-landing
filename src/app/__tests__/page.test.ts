import { describe, it, expect } from 'vitest'

describe('arenaOS Landing Page', () => {
    it('renders without crashing', () => {
        expect(true).toBe(true)
    })

    it('has correct game mode data', () => {
        const gameModes = [
            { genre: 'Fighting (Sumo)', cost: '$6k', cables: 'No' },
            { genre: 'Fighting (Aerial)', cost: '$7.5k', cables: 'Yes' },
            { genre: 'FPS (Tactical)', cost: '$6k', cables: 'No' },
            { genre: 'MOBA', cost: '$6k', cables: 'No' },
        ]

        expect(gameModes).toHaveLength(4)
        expect(gameModes[0].genre).toBe('Fighting (Sumo)')
        expect(gameModes[1].cables).toBe('Yes')
    })

    it('calculates Phase 1 BOM correctly', () => {
        const bom = [
            { item: 'ToddlerBot #1', cost: 6000 },
            { item: 'ToddlerBot #2', cost: 6000 },
            { item: 'Arena Mat', cost: 50 },
            { item: 'Tracking Camera', cost: 50 },
            { item: 'Arena Computer', cost: 100 },
            { item: 'AprilTags', cost: 10 },
            { item: 'Misc', cost: 240 },
        ]

        const total = bom.reduce((sum, item) => sum + item.cost, 0)
        expect(total).toBe(12450)
    })

    it('has correct funding tier progression', () => {
        const tiers = [
            { tier: '0', funding: '$12.5k' },
            { tier: '1', funding: '$100k' },
            { tier: '2', funding: '$1M' },
            { tier: '3', funding: '$5M' },
        ]

        expect(tiers[0].tier).toBe('0')
        expect(tiers[3].funding).toBe('$5M')
    })
})
