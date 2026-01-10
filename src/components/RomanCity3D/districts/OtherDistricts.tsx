'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createAcademy, createPantheon, createWorkshop } from '../geometry/Districts'

interface AcademyProps {
    position?: [number, number, number]
    onClick?: () => void
    status?: 'proposed' | 'interested' | 'exploring' | 'partnered'
    isHovered?: boolean
}

export function Academy({
    position = [0, 0, 0],
    onClick,
    status = 'proposed',
    isHovered = false
}: AcademyProps) {
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
            <primitive object={createAcademy(30, 30, 15)} />

            {status === 'proposed' && (
                <pointLight
                    position={[0, 12, 0]}
                    intensity={0.5}
                    distance={30}
                    color="#4a7aaa"
                />
            )}
        </group>
    )
}

interface PantheonProps {
    position?: [number, number, number]
    onClick?: () => void
    status?: 'proposed' | 'interested' | 'exploring' | 'partnered'
    isHovered?: boolean
}

export function Pantheon({
    position = [0, 0, 0],
    onClick,
    status = 'exploring',
    isHovered = false
}: PantheonProps) {
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
            <primitive object={createPantheon(40)} />

            {/* Sunbeam through oculus */}
            <spotLight
                position={[0, 35, 0]}
                angle={0.3}
                penumbra={0.5}
                intensity={2}
                distance={50}
                color="#ffedd5"
                castShadow
            />

            {status === 'exploring' && (
                <pointLight
                    position={[0, 20, 0]}
                    intensity={0.8}
                    distance={40}
                    color="#6b46c1"
                />
            )}
        </group>
    )
}

interface WorkshopProps {
    position?: [number, number, number]
    onClick?: () => void
    status?: 'proposed' | 'interested' | 'exploring' | 'partnered'
    isHovered?: boolean
}

export function Workshop({
    position = [0, 0, 0],
    onClick,
    status = 'proposed',
    isHovered = false
}: WorkshopProps) {
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
            <primitive object={createWorkshop(20, 15, 8)} />

            {/* Forge glow */}
            <pointLight
                position={[0, 4, 0]}
                intensity={0.7}
                distance={15}
                color="#ff6b35"
            />
        </group>
    )
}
