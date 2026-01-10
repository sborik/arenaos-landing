import * as THREE from 'three'
import { createDoricColumn, createPediment } from './RomanGeometry'

/**
 * Create a Basilica (long hall with apse)
 */
export function createBasilica(length: number = 50, width: number = 20, height: number = 18) {
    const group = new THREE.Group()

    // Main hall walls
    const wallThickness = 0.8

    // Side walls
    const sideWall = new THREE.BoxGeometry(wallThickness, height, length)
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0e9dc,
        roughness: 0.8
    })

    const leftWall = new THREE.Mesh(sideWall, wallMaterial)
    leftWall.position.set(-width / 2, height / 2, 0)
    leftWall.castShadow = true
    leftWall.receiveShadow = true
    group.add(leftWall)

    const rightWall = new THREE.Mesh(sideWall, wallMaterial)
    rightWall.position.set(width / 2, height / 2, 0)
    rightWall.castShadow = true
    rightWall.receiveShadow = true
    group.add(rightWall)

    // Interior columns (2 rows of 12)
    const colSpacing = length / 13
    for (let i = 1; i <= 12; i++) {
        const col1 = createDoricColumn(height * 0.8, 0.5)
        col1.position.set(-width / 4, 0, -length / 2 + colSpacing * i)
        group.add(col1)

        const col2 = createDoricColumn(height * 0.8, 0.5)
        col2.position.set(width / 4, 0, -length / 2 + colSpacing * i)
        group.add(col2)
    }

    // Barrel vault ceiling
    const vaultGeometry = new THREE.CylinderGeometry(width / 2, width / 2, length, 32, 1, true, 0, Math.PI)
    const vaultMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8d5c4,
        side: THREE.DoubleSide,
        roughness: 0.7
    })
    const vault = new THREE.Mesh(vaultGeometry, vaultMaterial)
    vault.rotation.z = Math.PI / 2
    vault.rotation.y = Math.PI / 2
    vault.position.set(0, height, 0)
    vault.castShadow = true
    vault.receiveShadow = true
    group.add(vault)

    // Apse (semicircular end)
    const apseRadius = width / 2
    const apseCurve = new THREE.EllipseCurve(0, 0, apseRadius, apseRadius, 0, Math.PI, false, 0)
    const apsePoints = apseCurve.getPoints(20)
    const apseShape = new THREE.Shape(apsePoints)
    const apseGeometry = new THREE.ExtrudeGeometry(apseShape, { depth: height, bevelEnabled: false })
    const apse = new THREE.Mesh(apseGeometry, wallMaterial)
    apse.rotation.x = Math.PI / 2
    apse.rotation.z = Math.PI
    apse.position.set(0, 0, length / 2)
    apse.castShadow = true
    group.add(apse)

    return group
}

/**
 * Create Colosseum (elliptical amphitheater)
 */
export function createColosseum(majorAxis: number = 100, minorAxis: number = 80, height: number = 40) {
    const group = new THREE.Group()

    // Outer elliptical wall with arches
    const stories = 4
    const storyHeight = height / stories
    const archesPerStory = 20

    for (let story = 0; story < stories; story++) {
        for (let i = 0; i < archesPerStory; i++) {
            const angle = (i / archesPerStory) * Math.PI * 2
            const x = Math.cos(angle) * (majorAxis / 2)
            const z = Math.sin(angle) * (minorAxis / 2)

            // Pier (pillar between arches)
            const pier = new THREE.BoxGeometry(2, storyHeight, 2)
            const pierMesh = new THREE.Mesh(pier, new THREE.MeshStandardMaterial({
                color: 0xe8d5c4,
                roughness: 0.9
            }))
            pierMesh.position.set(x, story * storyHeight + storyHeight / 2, z)
            pierMesh.lookAt(0, pierMesh.position.y, 0)
            pierMesh.castShadow = true
            group.add(pierMesh)
        }
    }

    // Arena floor
    const arenaFloor = new THREE.CylinderGeometry(minorAxis / 2 - 5, minorAxis / 2 - 5, 0.5, 32)
    const floorMesh = new THREE.Mesh(arenaFloor, new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        roughness: 1
    }))
    floorMesh.position.y = 0.25
    floorMesh.receiveShadow = true
    group.add(floorMesh)

    // Seating tiers
    const tierCount = 20
    const tierHeight = 0.5
    for (let i = 0; i < tierCount; i++) {
        const tierRadius = minorAxis / 2 - 5 + i * 1.5
        const tier = new THREE.CylinderGeometry(tierRadius, tierRadius, tierHeight, 32)
        const tierMesh = new THREE.Mesh(tier, new THREE.MeshStandardMaterial({
            color: 0xf0e9dc,
            roughness: 0.8
        }))
        tierMesh.position.y = 0.5 + i * tierHeight
        tierMesh.receiveShadow = true
        group.add(tierMesh)
    }

    return group
}

/**
 * Create Academy/Library building
 */
export function createAcademy(width: number = 30, depth: number = 30, height: number = 15) {
    const group = new THREE.Group()

    // Main building
    const building = new THREE.BoxGeometry(width, height, depth)
    const buildingMesh = new THREE.Mesh(building, new THREE.MeshStandardMaterial({
        color: 0xf5f5f0,
        roughness: 0.6
    }))
    buildingMesh.position.y = height / 2
    buildingMesh.castShadow = true
    buildingMesh.receiveShadow = true
    group.add(buildingMesh)

    // Portico (6 Ionic columns)
    const porticoDepth = 5
    for (let i = 0; i < 6; i++) {
        const col = createDoricColumn(height * 0.6, 0.5)
        col.position.set(-width / 2 + (width / 7) * (i + 1), 0, depth / 2 + porticoDepth / 2)
        group.add(col)
    }

    // Roof
    const roof = new THREE.BoxGeometry(width + 2, 1, depth + 2)
    const roofMesh = new THREE.Mesh(roof, new THREE.MeshStandardMaterial({
        color: 0x4a7aaa, // Blue glazed tiles
        roughness: 0.3,
        metalness: 0.2
    }))
    roofMesh.position.set(0, height + 0.5, 0)
    roofMesh.castShadow = true
    group.add(roofMesh)

    return group
}

/**
 * Create Pantheon (domed rotunda)
 */
export function createPantheon(diameter: number = 40) {
    const group = new THREE.Group()

    // Cylindrical drum
    const drumHeight = 15
    const drum = new THREE.CylinderGeometry(diameter / 2, diameter / 2, drumHeight, 32)
    const drumMesh = new THREE.Mesh(drum, new THREE.MeshStandardMaterial({
        color: 0xf0e9dc,
        roughness: 0.7
    }))
    drumMesh.position.y = drumHeight / 2
    drumMesh.castShadow = true
    drumMesh.receiveShadow = true
    group.add(drumMesh)

    // Dome
    const dome = new THREE.SphereGeometry(diameter / 2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2)
    const domeMesh = new THREE.Mesh(dome, new THREE.MeshStandardMaterial({
        color: 0xd1c7b7,
        roughness: 0.8
    }))
    domeMesh.position.y = drumHeight
    domeMesh.castShadow = true
    group.add(domeMesh)

    // Oculus (opening at top)
    const oculusRadius = 4.5
    const oculus = new THREE.CylinderGeometry(oculusRadius, oculusRadius, 2, 32)
    const oculusMesh = new THREE.Mesh(oculus, new THREE.MeshStandardMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.3
    }))
    oculusMesh.position.y = drumHeight + diameter / 2 - 1
    group.add(oculusMesh)

    // Portico (8 Corinthian columns)
    const porticoWidth = diameter * 0.8
    for (let i = 0; i < 8; i++) {
        const col = createDoricColumn(12, 0.6)
        col.position.set(-porticoWidth / 2 + (porticoWidth / 9) * (i + 1), 0, diameter / 2 + 5)
        group.add(col)
    }

    return group
}

/**
 * Create Workshop building
 */
export function createWorkshop(width: number = 20, depth: number = 15, height: number = 8) {
    const group = new THREE.Group()

    // Main structure (brick)
    const building = new THREE.BoxGeometry(width, height, depth)
    const buildingMesh = new THREE.Mesh(building, new THREE.MeshStandardMaterial({
        color: 0xc85a54, // Red brick
        roughness: 0.9
    }))
    buildingMesh.position.y = height / 2
    buildingMesh.castShadow = true
    buildingMesh.receiveShadow = true
    group.add(buildingMesh)

    // Roof (clay tiles)
    const roof = new THREE.ConeGeometry(width * 0.7, height * 0.3, 4)
    const roofMesh = new THREE.Mesh(roof, new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        roughness: 0.8
    }))
    roofMesh.rotation.y = Math.PI / 4
    roofMesh.position.y = height + height * 0.15
    roofMesh.castShadow = true
    group.add(roofMesh)

    // Chimney
    const chimney = new THREE.CylinderGeometry(0.5, 0.5, height * 0.4, 8)
    const chimneyMesh = new THREE.Mesh(chimney, new THREE.MeshStandardMaterial({ color: 0x8b4513 }))
    chimneyMesh.position.set(width / 4, height + height * 0.4, 0)
    chimneyMesh.castShadow = true
    group.add(chimneyMesh)

    return group
}
