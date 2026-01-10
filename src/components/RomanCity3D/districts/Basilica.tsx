'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createBasilica } from '../geometry/Districts'

interface BasilicaProps {
    position?: [number, number, number]
    onClick?: () => void
    status?: 'proposed' | 'interested' | 'exploring' | 'partnered'
    isHovered?: boolean
}

export default function Basilica({
    position = [0, 0, 0],
    onClick,
    status = 'exploring',
    isHovered = false
}: BasilicaProps) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current && isHovered) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
        } else if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1)
        }
    })

    const getStatusColor = () => {
        switch (status) {
            case 'interested': return '#d97706'
            case 'exploring': return '#8b4789'
            case 'partnered': return '#166534'
            default: return '#ffffff'
        }
    }

    return (
        <group ref={groupRef} position={position} onClick={onClick}>
            <primitive object={createBasilica(50, 20, 18)} />

            {/* Interior glow (exploring status) */}
            {status === 'exploring' && (
                <pointLight
                    position={[0, 10, 0]}
                    intensity={0.8}
                    distance={40}
                    color="#8b4789"
                />
            )}

            {isHovered && (
                <pointLight
                    position={[0, 15, 0]}
                    intensity={1.5}
                    distance={50}
                    color={getStatusColor()}
                />
            )}
        </group>
    )
}
