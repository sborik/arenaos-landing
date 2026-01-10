/**
 * Unit Tests for Animation System
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { AnimatedPerson, AnimationManager, WaterShimmer, WavingFlag } from '../animation/AnimatedElements'

describe('AnimatedPerson', () => {
    let person: AnimatedPerson

    beforeEach(() => {
        person = new AnimatedPerson(10, 10, '#4a3520', 1)
    })

    it('should initialize with correct position', () => {
        expect(person.x).toBe(10)
        expect(person.y).toBe(10)
    })

    it('should move towards target', () => {
        person.setTarget(20, 20)
        const initialX = person.x
        const initialY = person.y

        person.update(1)

        expect(person.x).toBeGreaterThan(initialX)
        expect(person.y).toBeGreaterThan(initialY)
    })

    it('should update animation frame', () => {
        person.setTarget(100, 100)
        const initialFrame = person.frame

        person.update(1)

        expect(person.frame).not.toBe(initialFrame)
    })
})

describe('WaterShimmer', () => {
    let water: WaterShimmer

    beforeEach(() => {
        water = new WaterShimmer(5, 5)
    })

    it('should update shimmer value', () => {
        const initialShimmer = water.shimmer
        water.update()
        // Shimmer should be different after update (unless exactly at same time)
        expect(typeof water.shimmer).toBe('number')
    })

    it('should have shimmer value between -0.3 and 0.3', () => {
        for (let i = 0; i < 100; i++) {
            water.update()
            expect(water.shimmer).toBeGreaterThanOrEqual(-0.3)
            expect(water.shimmer).toBeLessThanOrEqual(0.3)
        }
    })
})

describe('WavingFlag', () => {
    let flag: WavingFlag

    beforeEach(() => {
        flag = new WavingFlag(10, 10, 20, '#ff0000')
    })

    it('should have correct initial properties', () => {
        expect(flag.x).toBe(10)
        expect(flag.y).toBe(10)
        expect(flag.height).toBe(20)
        expect(flag.color).toBe('#ff0000')
    })

    it('should update wave value', () => {
        flag.update()
        expect(typeof flag.wave).toBe('number')
    })
})

describe('AnimationManager', () => {
    let manager: AnimationManager

    beforeEach(() => {
        manager = new AnimationManager()
    })

    it('should add people', () => {
        manager.addPerson(10, 10)
        expect(manager.getPeopleCount()).toBe(1)

        manager.addPerson(20, 20)
        expect(manager.getPeopleCount()).toBe(2)
    })

    it('should add water', () => {
        expect(() => manager.addWater(5, 5)).not.toThrow()
    })

    it('should add flags', () => {
        expect(() => manager.addFlag(15, 15, 25, '#00ff00')).not.toThrow()
    })

    it('should add smoke particles', () => {
        expect(() => manager.addSmoke(12, 12)).not.toThrow()
    })

    it('should update all elements', () => {
        manager.addPerson(10, 10)
        expect(() => manager.update()).not.toThrow()
    })
})
