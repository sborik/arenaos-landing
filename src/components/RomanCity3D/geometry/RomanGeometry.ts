import * as THREE from 'three'

/**
 * Create a Doric-style column with proper proportions
 * Based on classical Roman architecture
 */
export function createDoricColumn(height: number = 6, diameter: number = 0.6) {
    const group = new THREE.Group()

    // Base (3 tiers)
    const baseHeight = height * 0.05
    const baseDiameter = diameter * 1.15
    const base = new THREE.CylinderGeometry(baseDiameter, baseDiameter * 1.1, baseHeight, 16)
    const baseMesh = new THREE.Mesh(base, new THREE.MeshStandardMaterial({ color: 0xf5f5f0 }))
    baseMesh.position.y = baseHeight / 2
    group.add(baseMesh)

    // Shaft with entasis (slight curve)
    const shaftHeight = height * 0.85
    const shaftSegments = 32
    const shaft = new THREE.CylinderGeometry(
        diameter * 0.9, // top (narrower)
        diameter, // bottom
        shaftHeight,
        shaftSegments,
        1
    )

    // Add flutes (vertical grooves)
    const flutesCount = 20
    const positions = shaft.attributes.position
    for (let i = 0; i < positions.count; i++) {
        const angle = Math.atan2(positions.getY(i), positions.getX(i))
        const flute = Math.sin(angle * flutesCount / 2) * 0.02
        const x = positions.getX(i)
        const z = positions.getZ(i)
        const length = Math.sqrt(x * x + z * z)
        positions.setX(i, x + x / length * flute)
        positions.setZ(i, z + z / length * flute)
    }
    positions.needsUpdate = true
    shaft.computeVertexNormals()

    const shaftMesh = new THREE.Mesh(shaft, new THREE.MeshStandardMaterial({
        color: 0xe8d5c4, // Warm travertine
        roughness: 0.8,
        metalness: 0.1
    }))
    shaftMesh.position.y = baseHeight + shaftHeight / 2
    group.add(shaftMesh)

    // Capital (top decoration)
    const capitalHeight = height * 0.1
    const capitalDiameter = diameter * 1.3

    // Echinus (curved part)
    const echinus = new THREE.CylinderGeometry(
        capitalDiameter,
        diameter * 0.95,
        capitalHeight * 0.6,
        16
    )
    const echinusMesh = new THREE.Mesh(echinus, new THREE.MeshStandardMaterial({ color: 0xf5f5f0 }))
    echinusMesh.position.y = baseHeight + shaftHeight + capitalHeight * 0.3
    group.add(echinusMesh)

    // Abacus (square top)
    const abacus = new THREE.BoxGeometry(capitalDiameter * 1.1, capitalHeight * 0.3, capitalDiameter * 1.1)
    const abacusMesh = new THREE.Mesh(abacus, new THREE.MeshStandardMaterial({ color: 0xf5f5f0 }))
    abacusMesh.position.y = baseHeight + shaftHeight + capitalHeight * 0.75
    group.add(abacusMesh)

    return group
}

/**
 * Create a triangular pediment (roof decoration)
 */
export function createPediment(width: number = 10, height: number = 2, depth: number = 0.8) {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(width / 2, height)
    shape.lineTo(width, 0)
    shape.closePath()

    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    const material = new THREE.MeshStandardMaterial({
        color: 0xd4a574, // Terracotta
        roughness: 0.7
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.y = Math.PI / 2
    return mesh
}

/**
 * Create a fountain with basin
 */
export function createFountain(diameter: number = 4) {
    const group = new THREE.Group()

    // Basin
    const basinOuter = new THREE.CylinderGeometry(diameter / 2, diameter / 2, 0.5, 32)
    const basinInner = new THREE.CylinderGeometry(diameter / 2 - 0.2, diameter / 2 - 0.2, 0.6, 32)

    const basinMesh = new THREE.Mesh(basinOuter, new THREE.MeshStandardMaterial({
        color: 0xf5f5f0,
        roughness: 0.3,
        metalness: 0.1
    }))
    group.add(basinMesh)

    // Water (with transparency)
    const water = new THREE.CylinderGeometry(diameter / 2 - 0.25, diameter / 2 - 0.25, 0.3, 32)
    const waterMesh = new THREE.Mesh(water, new THREE.MeshStandardMaterial({
        color: 0x4a7aaa,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.3
    }))
    waterMesh.position.y = 0.1
    group.add(waterMesh)

    // Central pedestal
    const pedestal = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 16)
    const pedestalMesh = new THREE.Mesh(pedestal, new THREE.MeshStandardMaterial({ color: 0xe8d5c4 }))
    pedestalMesh.position.y = 0.75
    group.add(pedestalMesh)

    return group
}

/**
 * Create marble floor tiles
 */
export function createMarbleFloor(width: number = 40, depth: number = 40) {
    const geometry = new THREE.PlaneGeometry(width, depth)

    // Create subtle texture pattern
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.fillStyle = '#f5f5f0'
        ctx.fillRect(0, 0, 512, 512)

        // Add tile lines
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        ctx.lineWidth = 2
        for (let i = 0; i < 512; i += 64) {
            ctx.beginPath()
            ctx.moveTo(i, 0)
            ctx.lineTo(i, 512)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, i)
            ctx.lineTo(512, i)
            ctx.stroke()
        }

        // Add veining
        ctx.strokeStyle = 'rgba(200,190,180,0.3)'
        ctx.lineWidth = 1
        for (let i = 0; i < 20; i++) {
            ctx.beginPath()
            ctx.moveTo(Math.random() * 512, Math.random() * 512)
            ctx.quadraticCurveTo(
                Math.random() * 512, Math.random() * 512,
                Math.random() * 512, Math.random() * 512
            )
            ctx.stroke()
        }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.2
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true

    return mesh
}

/**
 * Create a simple temple building
 */
export function createTemple(width: number = 15, depth: number = 10, height: number = 12) {
    const group = new THREE.Group()

    // Platform/stylobate (elevated base)
    const platform = new THREE.BoxGeometry(width, 0.8, depth)
    const platformMesh = new THREE.Mesh(platform, new THREE.MeshStandardMaterial({ color: 0xf0e9dc }))
    platformMesh.position.y = 0.4
    platformMesh.castShadow = true
    platformMesh.receiveShadow = true
    group.add(platformMesh)

    // Columns (6 across front, prostyle)
    const columnHeight = height * 0.6
    const columnSpacing = width / 7

    for (let i = 0; i < 6; i++) {
        const column = createDoricColumn(columnHeight, 0.6)
        column.position.set(
            -width / 2 + columnSpacing * (i + 1),
            0.8,
            depth / 2 - 0.5
        )
        column.castShadow = true
        group.add(column)
    }

    // Entablature (horizontal beam on top of columns)
    const entablature = new THREE.BoxGeometry(width, height * 0.1, 1)
    const entablatureMesh = new THREE.Mesh(entablature, new THREE.MeshStandardMaterial({ color: 0xf5f5f0 }))
    entablatureMesh.position.set(0, 0.8 + columnHeight + height * 0.05, depth / 2 - 0.5)
    entablatureMesh.castShadow = true
    group.add(entablatureMesh)

    // Pediment
    const pediment = createPediment(width, height * 0.15, 1)
    pediment.position.set(0, 0.8 + columnHeight + height * 0.1, depth / 2 - 1)
    pediment.castShadow = true
    group.add(pediment)

    // Cella (inner chamber - simple box)
    const cella = new THREE.BoxGeometry(width * 0.8, columnHeight * 0.9, depth - 2)
    const cellaMesh = new THREE.Mesh(cella, new THREE.MeshStandardMaterial({
        color: 0xe8d5c4,
        roughness: 0.8
    }))
    cellaMesh.position.set(0, 0.8 + columnHeight * 0.45, -0.5)
    cellaMesh.castShadow = true
    cellaMesh.receiveShadow = true
    group.add(cellaMesh)

    // Roof
    const roof = new THREE.ConeGeometry(width * 0.6, height * 0.2, 4)
    const roofMesh = new THREE.Mesh(roof, new THREE.MeshStandardMaterial({
        color: 0xd4a574, // Terracotta
        roughness: 0.7
    }))
    roofMesh.rotation.y = Math.PI / 4
    roofMesh.position.set(0, 0.8 + columnHeight + height * 0.25, -0.5)
    roofMesh.castShadow = true
    group.add(roofMesh)

    return group
}
