import { describe, it, expect } from '@jest/globals'
import * as THREE from 'three'
import {
    createBasilica,
    createColosseum,
    createAcademy,
    createPantheon,
    createWorkshop
} from '../geometry/Districts'

describe('Districts Geometry', () => {
    describe('createBasilica', () => {
        it('should create a basilica with walls and vault', () => {
            const basilica = createBasilica(50, 20, 18)
            expect(basilica).toBeInstanceOf(THREE.Group)
            expect(basilica.children.length).toBeGreaterThan(20) // Walls + columns + vault + apse
        })
    })

    describe('createColosseum', () => {
        it('should create an elliptical amphitheater', () => {
            const colosseum = createColosseum(100, 80, 40)
            expect(colosseum).toBeInstanceOf(THREE.Group)
            // Should have many piers (4 stories × 20 arches) + floor + seating
            expect(colosseum.children.length).toBeGreaterThan(80)
        })

        it('should have arena floor at ground level', () => {
            const colosseum = createColosseum(100, 80, 40)
            const floor = colosseum.children.find(child =>
                child instanceof THREE.Mesh && child.position.y < 1
            )
            expect(floor).toBeDefined()
        })
    })

    describe('createAcademy', () => {
        it('should create an academy with portico columns', () => {
            const academy = createAcademy(30, 30, 15)
            expect(academy).toBeInstanceOf(THREE.Group)
            // Building + 6 columns + roof
            expect(academy.children.length).toBeGreaterThanOrEqual(8)
        })
    })

    describe('createPantheon', () => {
        it('should create a domed rotunda', () => {
            const pantheon = createPantheon(40)
            expect(pantheon).toBeInstanceOf(THREE.Group)
            // Drum + dome + oculus + 8 portico columns
            expect(pantheon.children.length).toBeGreaterThanOrEqual(11)
        })

        it('should have oculus at top of dome', () => {
            const pantheon = createPantheon(40)
            const oculus = pantheon.children.find(child =>
                child instanceof THREE.Mesh && child.position.y > 20
            )
            expect(oculus).toBeDefined()
        })
    })

    describe('createWorkshop', () => {
        it('should create a workshop with chimney', () => {
            const workshop = createWorkshop(20, 15, 8)
            expect(workshop).toBeInstanceOf(THREE.Group)
            // Building + roof + chimney
            expect(workshop.children.length).toBeGreaterThanOrEqual(3)
        })
    })
})
