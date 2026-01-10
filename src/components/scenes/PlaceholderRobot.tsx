'use client'

import { useRef } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'

interface PlaceholderRobotProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  teamColor: 'blue' | 'red'
  variant?: 'speedster' | 'brawler' | 'tactician'
  scale?: number
}

const TEAM_COLORS = {
  blue: '#3388ff',
  red: '#ff4444'
}

const VARIANT_SCALES = {
  speedster: { body: [0.5, 0.15, 0.4], top: [0.35, 0.08, 0.25] },
  brawler: { body: [0.6, 0.2, 0.5], top: [0.45, 0.12, 0.35] },
  tactician: { body: [0.55, 0.18, 0.45], top: [0.4, 0.1, 0.3] }
}

export function PlaceholderRobot({ 
  position, 
  rotation = [0, 0, 0], 
  teamColor,
  variant = 'speedster',
  scale = 0.3
}: PlaceholderRobotProps) {
  const groupRef = useRef<Group>(null)
  const baseY = position[1]
  
  // Subtle hover animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.015
    }
  })

  const sizes = VARIANT_SCALES[variant]
  const color = TEAM_COLORS[teamColor]

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main body */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={sizes.body as [number, number, number]} />
        <meshStandardMaterial 
          color="#1a1a1f" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Top shell with team color */}
      <mesh castShadow position={[0, 0.24, 0]}>
        <boxGeometry args={sizes.top as [number, number, number]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.6} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Accent stripe */}
      <mesh position={[0, 0.12, sizes.body[2] as number / 2 + 0.01]}>
        <planeGeometry args={[sizes.body[0] as number * 0.8, 0.05]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
      
      {/* Wheels (4x mecanum style) */}
      {[
        [-0.25, 0.05, 0.2],
        [0.25, 0.05, 0.2],
        [-0.25, 0.05, -0.2],
        [0.25, 0.05, -0.2],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Wheel hub */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Wheel rim glow */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.065, 0.008, 8, 16]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* Sensor dome */}
      <mesh castShadow position={[0.12, 0.32, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color="#111111"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Sensor dome light */}
      <mesh position={[0.12, 0.36, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Front indicator */}
      <mesh position={[0, 0.15, sizes.body[2] as number / 2 + 0.01]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial 
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
