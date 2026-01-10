'use client'

import { SceneContainer } from './SceneContainer'
import { ArenaPlatform } from './ArenaPlatform'
import { PlaceholderRobot } from './PlaceholderRobot'
import { DamageText } from './DamageText'

// Robot positions - mid-combat scenario
// Blue team attacking from left, Red team defending from right
const ROBOTS = [
  { 
    pos: [0.9, 0, 0.3] as [number, number, number], 
    rot: [0, -Math.PI * 0.6, 0] as [number, number, number], 
    team: 'blue' as const, 
    damage: 42,
    variant: 'speedster' as const
  },
  { 
    pos: [-0.7, 0, -0.5] as [number, number, number], 
    rot: [0, Math.PI * 0.3, 0] as [number, number, number], 
    team: 'blue' as const, 
    damage: 87,
    variant: 'brawler' as const
  },
  { 
    pos: [0.2, 0, 0.9] as [number, number, number], 
    rot: [0, -Math.PI * 0.8, 0] as [number, number, number], 
    team: 'red' as const, 
    damage: 65,
    variant: 'tactician' as const
  },
  { 
    pos: [-0.3, 0, -0.9] as [number, number, number], 
    rot: [0, Math.PI * 0.1, 0] as [number, number, number], 
    team: 'red' as const, 
    damage: 23,
    variant: 'speedster' as const
  },
]

export function HeroScene() {
  return (
    <SceneContainer 
      cameraPosition={[2.5, 2, 2.5]} 
      autoRotate={true}
      autoRotateSpeed={0.3}
    >
      {/* Arena */}
      <ArenaPlatform radius={1.4} edgeColor="#00ccff" />
      
      {/* Robots with damage indicators */}
      {ROBOTS.map((robot, i) => (
        <group key={i}>
          <PlaceholderRobot
            position={robot.pos}
            rotation={robot.rot}
            teamColor={robot.team}
            variant={robot.variant}
            scale={0.35}
          />
          <DamageText
            percentage={robot.damage}
            position={[robot.pos[0], robot.pos[1] + 0.35, robot.pos[2]]}
            teamColor={robot.team}
          />
        </group>
      ))}
      
      {/* Atmospheric fog */}
      <fog attach="fog" args={['#000011', 5, 15]} />
    </SceneContainer>
  )
}
