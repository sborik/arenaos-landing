import * as THREE from 'three'

/**
 * Create mountainous terrain with varied elevations
 * Zelda-style: compact but vertical
 */
export function createMountainousTerrain() {
    const group = new THREE.Group()

    // Central mountain peak (highest point)
    const peakGeometry = new THREE.ConeGeometry(30, 80, 8)
    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a7f6f,
        roughness: 0.95,
        metalness: 0
    })
    const peak = new THREE.Mesh(peakGeometry, rockMaterial)
    peak.position.set(0, 40, 0)
    peak.castShadow = true
    peak.receiveShadow = true
    group.add(peak)

    // Floating island platforms (for districts)
    const platforms = [
        { x: -60, y: 60, z: -40, radius: 25, height: 15 }, // Pantheon (highest)
        { x: 80, y: 45, z: 0, radius: 30, height: 12 },    // Basilica (mid-high)
        { x: -50, y: 35, z: 50, radius: 35, height: 10 },  // Colosseum (mid)
        { x: 50, y: 25, z: -50, radius: 20, height: 8 },   // Academy (low-mid)
        { x: -70, y: 15, z: 0, radius: 18, height: 6 },    // Workshop (low)
        { x: 0, y: 50, z: 0, radius: 22, height: 10 },     // Forum (on peak)
    ]

    platforms.forEach(({ x, y, z, radius, height }) => {
        // Platform base (cylinder)
        const platformGeo = new THREE.CylinderGeometry(radius, radius * 0.8, height, 16)
        const platform = new THREE.Mesh(platformGeo, new THREE.MeshStandardMaterial({
            color: 0xa69c8e,
            roughness: 0.9
        }))
        platform.position.set(x, y - height / 2, z)
        platform.castShadow = true
        platform.receiveShadow = true
        group.add(platform)

        // Grass/marble top
        const topGeo = new THREE.CylinderGeometry(radius, radius, 0.5, 32)
        const top = new THREE.Mesh(topGeo, new THREE.MeshStandardMaterial({
            color: 0xe8d5c4,
            roughness: 0.6
        }))
        top.position.set(x, y, z)
        top.receiveShadow = true
        group.add(top)
    })

    // Connecting cliffsides and natural bridges
    const cliffCount = 8
    for (let i = 0; i < cliffCount; i++) {
        const angle = (i / cliffCount) * Math.PI * 2
        const dist = 40 + Math.random() * 20
        const cliffHeight = 20 + Math.random() * 40

        const cliffGeo = new THREE.BoxGeometry(15, cliffHeight, 15)
        const cliff = new THREE.Mesh(cliffGeo, rockMaterial)
        cliff.position.set(
            Math.cos(angle) * dist,
            cliffHeight / 2,
            Math.sin(angle) * dist
        )
        cliff.rotation.y = angle
        cliff.castShadow = true
        cliff.receiveShadow = true
        group.add(cliff)
    }

    // Mist/clouds at lower elevations
    const mistGeo = new THREE.PlaneGeometry(200, 200)
    const mistMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    })
    const mist = new THREE.Mesh(mistGeo, mistMat)
    mist.rotation.x = -Math.PI / 2
    mist.position.y = 10
    group.add(mist)

    return group
}

/**
 * Create waterfalls cascading between platforms
 */
export function createWaterfalls() {
    const group = new THREE.Group()

    // Waterfall from Pantheon platform to Colosseum
    const waterfall1 = createWaterfall(25, { x: -60, y: 60, z: -40 }, { x: -50, y: 35, z: 50 })
    group.add(waterfall1)

    // Waterfall from Basilica to Academy
    const waterfall2 = createWaterfall(20, { x: 80, y: 45, z: 0 }, { x: 50, y: 25, z: -50 })
    group.add(waterfall2)

    // Central waterfall from Forum
    const waterfall3 = createWaterfall(30, { x: 0, y: 50, z: 0 }, { x: -20, y: 15, z: 20 })
    group.add(waterfall3)

    return group
}

function createWaterfall(height: number, from: { x: number, y: number, z: number }, to: { x: number, y: number, z: number }) {
    const group = new THREE.Group()

    // Calculate midpoint
    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2
    const midZ = (from.z + to.z) / 2

    // Create waterfall stream (thin cylinder)
    const length = Math.sqrt(
        Math.pow(to.x - from.x, 2) +
        Math.pow(to.y - from.y, 2) +
        Math.pow(to.z - from.z, 2)
    )

    const streamGeo = new THREE.CylinderGeometry(0.5, 1, length, 8)
    const streamMat = new THREE.MeshStandardMaterial({
        color: 0x4a7aaa,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        emissive: 0x1a3a5a,
        emissiveIntensity: 0.2
    })
    const stream = new THREE.Mesh(streamGeo, streamMat)
    stream.position.set(midX, midY, midZ)

    // Point stream toward destination
    stream.lookAt(to.x, to.y, to.z)
    stream.rotateX(Math.PI / 2)

    group.add(stream)

    // Splash particles at bottom
    const splash = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(
            Array.from({ length: 50 }, () => new THREE.Vector3(
                to.x + (Math.random() - 0.5) * 3,
                to.y + Math.random() * 2,
                to.z + (Math.random() - 0.5) * 3
            ))
        ),
        new THREE.PointsMaterial({
            size: 0.2,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        })
    )
    group.add(splash)

    return group
}

/**
 * Create rope/chain bridges connecting platforms
 */
export function createSkyBridges() {
    const group = new THREE.Group()

    const bridges = [
        { from: { x: 0, y: 50, z: 0 }, to: { x: 80, y: 45, z: 0 } },           // Forum to Basilica
        { from: { x: 80, y: 45, z: 0 }, to: { x: 50, y: 25, z: -50 } },        // Basilica to Academy
        { from: { x: -60, y: 60, z: -40 }, to: { x: -50, y: 35, z: 50 } },     // Pantheon to Colosseum
        { from: { x: -50, y: 35, z: 50 }, to: { x: 0, y: 50, z: 0 } },         // Colosseum to Forum
    ]

    bridges.forEach(({ from, to }) => {
        const bridge = createRopeBridge(from, to)
        group.add(bridge)
    })

    return group
}

function createRopeBridge(from: { x: number, y: number, z: number }, to: { x: number, y: number, z: number }) {
    const group = new THREE.Group()

    const length = Math.sqrt(
        Math.pow(to.x - from.x, 2) +
        Math.pow(to.y - from.y, 2) +
        Math.pow(to.z - from.z, 2)
    )

    // Walkway planks
    const plankCount = Math.floor(length / 2)
    for (let i = 0; i < plankCount; i++) {
        const t = i / plankCount
        const x = from.x + (to.x - from.x) * t
        const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 3 // Sag in middle
        const z = from.z + (to.z - from.z) * t

        const plankGeo = new THREE.BoxGeometry(1.5, 0.1, 0.8)
        const plank = new THREE.Mesh(plankGeo, new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.9
        }))
        plank.position.set(x, y, z)
        plank.lookAt(to.x, to.y, to.z)
        group.add(plank)
    }

    // Rope rails (2 on each side)
    const ropeGeo = new THREE.CylinderGeometry(0.05, 0.05, length, 8)
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 1 })

    const rope1 = new THREE.Mesh(ropeGeo, ropeMat)
    rope1.position.set((from.x + to.x) / 2, (from.y + to.y) / 2 + 1, (from.z + to.z) / 2)
    rope1.lookAt(to.x, to.y, to.z)
    rope1.rotateX(Math.PI / 2)
    group.add(rope1)

    return group
}

/**
 * Create floating rocks/debris for atmosphere
 */
export function createFloatingRocks() {
    const group = new THREE.Group()

    for (let i = 0; i < 30; i++) {
        const size = 0.5 + Math.random() * 2
        const rockGeo = new THREE.DodecahedronGeometry(size, 0)
        const rock = new THREE.Mesh(rockGeo, new THREE.MeshStandardMaterial({
            color: 0x8a7f6f,
            roughness: 1
        }))

        rock.position.set(
            (Math.random() - 0.5) * 150,
            20 + Math.random() * 60,
            (Math.random() - 0.5) * 150
        )
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )
        rock.castShadow = true
        group.add(rock)
    }

    return group
}

/**
 * Create epic sky with dynamic clouds
 */
export function createEpicSky() {
    const group = new THREE.Group()

    // Cloud layers at different heights
    const cloudLayers = [30, 50, 70]

    cloudLayers.forEach((height, layerIndex) => {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            const distance = 80 + Math.random() * 40

            const cloudGeo = new THREE.SphereGeometry(10 + Math.random() * 10, 8, 8)
            const cloud = new THREE.Mesh(cloudGeo, new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7 - layerIndex * 0.1,
                roughness: 1
            }))

            cloud.position.set(
                Math.cos(angle) * distance,
                height,
                Math.sin(angle) * distance
            )
            cloud.scale.set(1, 0.6, 1) // Flatten vertically
            group.add(cloud)
        }
    })

    return group
}
