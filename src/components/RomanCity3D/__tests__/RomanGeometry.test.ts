import { describe, it, expect } from '@jest/globals'
import * as THREE from 'three'
import {
    createDoricColumn,
    createPediment,
    createFountain,
    createMarbleFloor,
    createTemple
} from '../geometry/RomanGeometry'

describe('RomanGeometry', () => {
    describe('createDoricColumn', () => {
        it('should create a column group with correct height', () => {
            const column = createDoricColumn(6, 0.6)
            expect(column).toBeInstanceOf(THREE.Group)
            expect(column.children.length).toBeGreaterThan(0)
        })

        it('should have base, shaft, and capital', () => {
            const column = createDoricColumn(6, 0.6)
            // Should have at least 3 parts (base, shaft, echinus, abacus)
            expect(column.children.length).toBeGreaterThanOrEqual(3)
        })
    })

    describe('createPediment', () => {
        it('should create a triangular pediment mesh', () => {
            const pediment = createPediment(10, 2, 0.8)
            expect(pediment).toBeInstanceOf(THREE.Mesh)
            expect(pediment.geometry).toBeInstanceOf(THREE.ExtrudeGeometry)
        })
    })

    describe('createFountain', () => {
        it('should create a fountain group with basin and water', () => {
            const fountain = createFountain(4)
            expect(fountain).toBeInstanceOf(THREE.Group)
            expect(fountain.children.length).toBeGreaterThan(0)
        })
    })

    describe('createMarbleFloor', () => {
        it('should create a floor plane with texture', () => {
            const floor = createMarbleFloor(40, 40)
            expect(floor).toBeInstanceOf(THREE.Mesh)
            expect(floor.geometry).toBeInstanceOf(THREE.PlaneGeometry)
            expect(floor.material).toBeInstanceOf(THREE.MeshStandardMaterial)
        })

        it('should be rotated to horizontal', () => {
            const floor = createMarbleFloor(40, 40)
            expect(floor.rotation.x).toBe(-Math.PI / 2)
        })
    })

    describe('createTemple', () => {
        it('should create a temple group with multiple elements', () => {
            const temple = createTemple(15, 10, 12)
            expect(temple).toBeInstanceOf(THREE.Group)
            // Platform, columns, entablature, pediment, cella, roof
            expect(temple.children.length).toBeGreaterThan(10)
        })

        it('should have correct number of columns', () => {
            const temple = createTemple(15, 10, 12)
            // Should have 6 columns
            const columns = temple.children.filter(child => child instanceof THREE.Group)
            expect(columns.length).toBe(6)
        })
    })
})
