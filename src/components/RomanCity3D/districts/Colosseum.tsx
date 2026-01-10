'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createColosseum } from '../geometry/Districts'

interface ColosseumProps {
    position?: [number, number, number]
    onClick?: () => void
    status?: 'proposed' | 'interested' | 'exploring' | 'partnered'
    isHovered?: boolean
}

export default function Colosseum({
    position = [0, 0, 0],
    onClick,
    status = 'interested',
    isHovered = false
}: ColosseumProps) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current && isHovered) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
        } else if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1)
        }
    })

    return (
        <group ref={groupRef} position={position} onClick={onClick}>
            <primitive object={createColosseum(100, 80, 40)} />

            {/* Torch ring (interested status) */}
            {status === 'interested' && (
                <>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2
                        return (
                            <pointLight
                                key={i}
                                position={[Math.cos(angle) * 45, 35, Math.sin(angle) * 35]}
                                intensity={0.5}
                                distance={20}
                                color="#d97706"
                            />
                        )
                    })}
                </>
            )}

            {isHovered && (
                <pointLight
                    position={[0, 20, 0]}
                    intensity={2}
                    distance={80}
                    color="#d97706"
                />
            )}
        </group>
    )
}
