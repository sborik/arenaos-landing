import { describe, it, expect } from '@jest/globals'
import * as THREE from 'three'
import {
    createTiberRiver,
    createRoads,
    createGardens,
    createBridges
} from '../geometry/Environment'

describe('Environment Geometry', () => {
    describe('createTiberRiver', () => {
        it('should create a river with water and banks', () => {
            const river = createTiberRiver()
            expect(river).toBeInstanceOf(THREE.Group)
            expect(river.children.length).toBeGreaterThanOrEqual(2) // Water + bank
        })
    })

    describe('createRoads', () => {
        it('should create intersecting roads', () => {
            const roads = createRoads()
            expect(roads).toBeInstanceOf(THREE.Group)
            expect(roads.children.length).toBeGreaterThanOrEqual(2) // NS + EW roads
        })
    })

    describe('createGardens', () => {
        it('should create multiple trees', () => {
            const gardens = createGardens()
            expect(gardens).toBeInstanceOf(THREE.Group)
            expect(gardens.children.length).toBe(20) // 20 cypress trees
        })

        it('should distribute trees randomly', () => {
            const gardens = createGardens()
            const positions = gardens.children.map(tree => tree.position)

            // Check that trees are not all at same position
            const uniquePositions = new Set(positions.map(p => `${p.x},${p.z}`))
            expect(uniquePositions.size).toBeGreaterThan(1)
        })
    })

    describe('createBridges', () => {
        it('should create 3 bridges', () => {
            const bridges = createBridges()
            expect(bridges).toBeInstanceOf(THREE.Group)
            expect(bridges.children.length).toBe(3)
        })
    })
})
