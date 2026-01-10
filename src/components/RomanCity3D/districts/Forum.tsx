'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
    createDoricColumn,
    createFountain,
    createMarbleFloor,
    createTemple
} from '../geometry/RomanGeometry'

interface ForumProps {
    position?: [number, number, number]
    onClick?: () => void
    status?: 'proposed' | 'interested' | 'exploring' | 'partnered'
    isHovered?: boolean
}

export default function Forum({
    position = [0, 0, 0],
    onClick,
    status = 'proposed',
    isHovered = false
}: ForumProps) {
    const groupRef = useRef<THREE.Group>(null)

    // Gentle rotation animation when hovered
    useFrame((state) => {
        if (groupRef.current && isHovered) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
        } else if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1)
        }
    })

    // Status particle effect
    const getStatusColor = () => {
        switch (status) {
            case 'interested': return '#d97706' // Gold
            case 'exploring': return '#8b4789' // Purple
            case 'partnered': return '#166534' // Green
            default: return '#ffffff' // White
        }
    }

    return (
        <group ref={groupRef} position={position} onClick={onClick}>
            {/* Marble plaza floor */}
            <primitive object={createMarbleFloor(40, 40)} />

            {/* Central fountain */}
            <primitive object={createFountain(4)} position={[0, 0, 0]} />

            {/* Colonnade - 48 columns in peristyle (12 per side) */}
            {/* North side */}
            {Array.from({ length: 12 }).map((_, i) => (
                <primitive
                    key={`north-${i}`}
                    object={createDoricColumn(6, 0.5)}
                    position={[-18 + i * 3, 0, 18]}
                />
            ))}

            {/* East side */}
            {Array.from({ length: 12 }).map((_, i) => (
                <primitive
                    key={`east-${i}`}
                    object={createDoricColumn(6, 0.5)}
                    position={[18, 0, 18 - i * 3]}
                />
            ))}

            {/* South side */}
            {Array.from({ length: 12 }).map((_, i) => (
                <primitive
                    key={`south-${i}`}
                    object={createDoricColumn(6, 0.5)}
                    position={[18 - i * 3, 0, -18]}
                />
            ))}

            {/* West side */}
            {Array.from({ length: 12 }).map((_, i) => (
                <primitive
                    key={`west-${i}`}
                    object={createDoricColumn(6, 0.5)}
                    position={[-18, 0, -18 + i * 3]}
                />
            ))}

            {/* Temple buildings */}
            {/* Decentralized Compute temple */}
            <primitive
                object={createTemple(15, 10, 12)}
                position={[-10, 0, -10]}
            />

            {/* Edge Inference temple */}
            <primitive
                object={createTemple(12, 8, 10)}
                position={[10, 0, -10]}
            />

            {/* Status indicator particles */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={100}
                        array={new Float32Array(
                            Array.from({ length: 100 }, () => [
                                (Math.random() - 0.5) * 40,
                                Math.random() * 15,
                                (Math.random() - 0.5) * 40
                            ]).flat()
                        )}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.1}
                    color={getStatusColor()}
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>

            {/* Hover glow */}
            {isHovered && (
                <pointLight
                    position={[0, 5, 0]}
                    intensity={1}
                    distance={50}
                    color={getStatusColor()}
                />
            )}
        </group>
    )
}
