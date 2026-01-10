'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useScroll } from 'framer-motion'

// Column - simple procedural geometry
function Column({ position, height = 4 }: { position: [number, number, number]; height?: number }) {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
                <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Shaft */}
            <mesh position={[0, height / 2 + 0.4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.28, 0.32, height, 8]} />
                <meshStandardMaterial color="#3a4a5a" roughness={0.5} metalness={0.15} />
            </mesh>
            {/* Capital */}
            <mesh position={[0, height + 0.6, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.5, 0.3, 0.4, 8]} />
                <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.2} />
            </mesh>
        </group>
    )
}

// Ground plane with grid
function ArenaGround() {
    return (
        <group>
            {/* Main floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <circleGeometry args={[15, 64]} />
                <meshStandardMaterial
                    color="#1a2030"
                    roughness={0.3}
                    metalness={0.4}
                />
            </mesh>
            {/* Center ring - blue team */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <ringGeometry args={[3, 3.3, 64]} />
                <meshBasicMaterial color="#4a7aaa" transparent opacity={0.8} />
            </mesh>
            {/* Inner ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[1.8, 2, 64]} />
                <meshBasicMaterial color="#aa4a5a" transparent opacity={0.6} />
            </mesh>
        </group>
    )
}

// Slow orbiting camera
function OrbitCamera({ scrollProgress }: { scrollProgress: number }) {
    const { camera } = useThree()
    const angleRef = useRef(0)

    useFrame(() => {
        angleRef.current += 0.001 // Very slow

        const radius = 18 - scrollProgress * 4
        const x = Math.sin(angleRef.current) * radius * 0.6 + 8 // Offset right
        const z = Math.cos(angleRef.current) * radius
        const y = 7 + scrollProgress * 2

        camera.position.set(x, y, z)
        camera.lookAt(0, 1, 0)
    })

    return null
}

export function ProductVisionScene({ mode = 'hero' }: { mode?: 'hero' | 'docs' }) {
    const { scrollYProgress } = useScroll()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        return scrollYProgress.on('change', (v) => setProgress(v))
    }, [scrollYProgress])

    // Columns in a semicircle on the right side
    const columns = useMemo(() => {
        const result: [number, number, number][] = []
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI - Math.PI / 4 // Semicircle
            result.push([
                Math.sin(angle) * 12,
                0,
                Math.cos(angle) * 12,
            ])
        }
        return result
    }, [])

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault fov={40} />

                    {/* Atmosphere */}
                    <fog attach="fog" args={['#0d1520', 20, 45]} />

                    {/* Blue team light - left */}
                    <spotLight
                        position={[-15, 12, 5]}
                        angle={0.5}
                        penumbra={0.5}
                        intensity={300}
                        color="#4a7aaa"
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Red team light - right */}
                    <spotLight
                        position={[15, 12, -5]}
                        angle={0.5}
                        penumbra={0.5}
                        intensity={300}
                        color="#aa4a6a"
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Fill light */}
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[0, 10, 10]} intensity={0.5} color="#8090a0" />

                    {/* Arena */}
                    <ArenaGround />

                    {/* Columns */}
                    {columns.map((pos, i) => (
                        <Column key={i} position={pos} height={3.5 + (i % 3) * 0.5} />
                    ))}

                    {/* Background - deep cobalt */}
                    <color attach="background" args={['#0d1520']} />

                    <OrbitCamera scrollProgress={progress} />
                </Suspense>
            </Canvas>
        </div>
    )
}
