'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, ShaderMaterial, Mesh, Vector2 } from 'three'
import { useTexture } from '@react-three/drei'

interface DepthParallaxProps {
  framePath: string      // e.g., "/processed/smash-combo-1/frames/frame_001.jpg"
  depthPath: string      // e.g., "/processed/smash-combo-1/depth/frame_001_depth.jpg"
  position?: [number, number, number]
  scale?: number
  parallaxStrength?: number
}

// Vertex shader - displaces vertices based on depth map
const vertexShader = `
  varying vec2 vUv;
  uniform sampler2D depthMap;
  uniform float parallaxStrength;
  uniform vec2 mousePos;
  
  void main() {
    vUv = uv;
    
    // Sample depth
    float depth = texture2D(depthMap, uv).r;
    
    // Calculate displacement based on mouse position and depth
    vec3 displaced = position;
    displaced.x += (mousePos.x - 0.5) * depth * parallaxStrength;
    displaced.y += (mousePos.y - 0.5) * depth * parallaxStrength;
    displaced.z += depth * parallaxStrength * 0.5;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

// Fragment shader - renders the color texture
const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D colorMap;
  uniform float vignetteStrength;
  
  void main() {
    vec4 color = texture2D(colorMap, vUv);
    
    // Add vignette effect
    vec2 center = vUv - 0.5;
    float vignette = 1.0 - dot(center, center) * vignetteStrength;
    color.rgb *= vignette;
    
    // Add slight holographic tint
    color.rgb += vec3(0.0, 0.02, 0.05);
    
    gl_FragColor = color;
  }
`

export function DepthParallax({
  framePath,
  depthPath,
  position = [0, 0, 0],
  scale = 1,
  parallaxStrength = 0.3
}: DepthParallaxProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const [mousePos] = useState(() => new Vector2(0.5, 0.5))
  
  // Load textures
  const colorMap = useTexture(framePath)
  const depthMap = useTexture(depthPath)
  
  // Update mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX / window.innerWidth
      mousePos.y = 1 - (e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mousePos])
  
  // Animate
  useFrame((state) => {
    if (materialRef.current) {
      // Subtle auto-movement when mouse isn't moving
      const autoX = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.5
      const autoY = Math.cos(state.clock.elapsedTime * 0.3) * 0.1 + 0.5
      
      materialRef.current.uniforms.mousePos.value.lerp(
        new Vector2(
          mousePos.x * 0.7 + autoX * 0.3,
          mousePos.y * 0.7 + autoY * 0.3
        ),
        0.05
      )
    }
  })
  
  // Calculate aspect ratio from texture
  const img = colorMap.image as HTMLImageElement | undefined
  const aspect = img?.width && img?.height ? img.width / img.height : 16/9
  
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[aspect * 2, 2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          colorMap: { value: colorMap },
          depthMap: { value: depthMap },
          mousePos: { value: new Vector2(0.5, 0.5) },
          parallaxStrength: { value: parallaxStrength },
          vignetteStrength: { value: 1.5 }
        }}
      />
    </mesh>
  )
}

// Animated sequence version - cycles through frames
interface DepthParallaxSequenceProps {
  basePath: string  // e.g., "/processed/smash-combo-1"
  frameCount: number
  fps?: number
  position?: [number, number, number]
  scale?: number
  parallaxStrength?: number
}

export function DepthParallaxSequence({
  basePath,
  frameCount,
  fps = 2,
  position = [0, 0, 0],
  scale = 1,
  parallaxStrength = 0.3
}: DepthParallaxSequenceProps) {
  const [currentFrame, setCurrentFrame] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(f => (f % frameCount) + 1)
    }, 1000 / fps)
    return () => clearInterval(interval)
  }, [frameCount, fps])
  
  const frameNum = currentFrame.toString().padStart(3, '0')
  const framePath = `${basePath}/frames/frame_${frameNum}.jpg`
  const depthPath = `${basePath}/depth/frame_${frameNum}_depth.jpg`
  
  return (
    <DepthParallax
      framePath={framePath}
      depthPath={depthPath}
      position={position}
      scale={scale}
      parallaxStrength={parallaxStrength}
    />
  )
}
