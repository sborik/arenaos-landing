'use client'

import { useRef } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { useFrame } from '@react-three/fiber'

interface ArenaPlatformProps {
  radius?: number
  edgeColor?: string
}

export function ArenaPlatform({ radius = 1.5, edgeColor = "#00ccff" }: ArenaPlatformProps) {
  const edgeRef = useRef<Mesh>(null)
  
  // Subtle pulse animation on edge
  useFrame((state) => {
    if (edgeRef.current) {
      const material = edgeRef.current.material as MeshStandardMaterial
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5
      }
    }
  })

  return (
    <group>
      {/* Main platform */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.1, 64]} />
        <meshStandardMaterial 
          color="#0a0a0f" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner ring detail */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.7, 0.01, 8, 64]} />
        <meshStandardMaterial 
          color="#222233"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Glowing edge ring */}
      <mesh ref={edgeRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.04, 16, 100]} />
        <meshStandardMaterial 
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Grid lines on platform */}
      <gridHelper 
        args={[radius * 2, 20, "#1a1a2e", "#111122"]} 
        position={[0, 0.01, 0]} 
      />
      
      {/* Center marker */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.08, 32]} />
        <meshStandardMaterial 
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
