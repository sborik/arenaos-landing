export interface CharacterSlot {
  name: string
  position: [number, number, number]
  color: string
  modelPath?: string
  animationName?: string
  sequence?: string[]
  sequenceDuration?: number
  wireframe?: boolean
  holdPose?: boolean
}

export interface ArenaConfig {
  clipName: string
  screenSize: { width: number; height: number }
  characters: CharacterSlot[]
  cameraPath?: {
    position: [number, number, number]
    target: [number, number, number]
    duration: number
  }[]
  wireframeOverlay?: boolean
}

export const defaultArenaConfig: ArenaConfig = {
  clipName: 'sample-clip',
  screenSize: { width: 3, height: 1.7 },
  characters: [],
}
