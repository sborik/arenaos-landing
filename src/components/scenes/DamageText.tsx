'use client'

import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group } from 'three'

interface DamageTextProps {
  percentage: number
  position: [number, number, number]
  teamColor: 'blue' | 'red'
}

const TEAM_COLORS = {
  blue: '#3388ff',
  red: '#ff4444'
}

export function DamageText({ percentage, position, teamColor }: DamageTextProps) {
  const groupRef = useRef<Group>(null)
  
  // Subtle float animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02
    }
  })
  
  const color = TEAM_COLORS[teamColor]
  // Higher damage = more intense color
  const intensity = 0.5 + (percentage / 100) * 1.5
  
  return (
    <group ref={groupRef} position={position}>
      <Billboard follow={true}>
        {/* Background glow */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.25, 0.12]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.5}
          />
        </mesh>
        
        <Text
          fontSize={0.1}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#000000"
          material-toneMapped={false}
          material-emissive={color}
          material-emissiveIntensity={intensity}
        >
          {percentage}%
        </Text>
      </Billboard>
    </group>
  )
}
