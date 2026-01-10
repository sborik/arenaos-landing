'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useEffect, useMemo } from 'react'
import { Color, DataTexture, PMREMGenerator, RGBAFormat, SRGBColorSpace } from 'three'

interface SceneContainerProps {
    children: React.ReactNode
    cameraPosition?: [number, number, number]
    autoRotate?: boolean
    autoRotateSpeed?: number
    className?: string
    enableZoom?: boolean
    enablePan?: boolean
}

export function SceneContainer({
    children,
    cameraPosition = [3, 3, 3],
    autoRotate = true,
    autoRotateSpeed = 0.5,
    className = "h-screen w-full",
    enableZoom = false,
    enablePan = false
}: SceneContainerProps) {
    return (
        <div className={className}>
            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
                    <OrbitControls
                        autoRotate={autoRotate}
                        autoRotateSpeed={autoRotateSpeed}
                        enableZoom={enableZoom}
                        enablePan={enablePan}
                        maxPolarAngle={Math.PI / 2.2}
                        minPolarAngle={Math.PI / 4}
                    />
                    <ProceduralEnvironment />
                    <color attach="background" args={['#000000']} />
                    <ambientLight intensity={0.2} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4488ff" />
                    {children}
                </Suspense>
            </Canvas>
        </div>
    )
}

function ProceduralEnvironment() {
    const { gl, scene } = useThree()
    const pmrem = useMemo(() => new PMREMGenerator(gl), [gl])

    useEffect(() => {
        const data = new Uint8Array([
            28, 36, 64, 255, 8, 8, 12, 255,
            62, 74, 118, 255, 12, 14, 20, 255,
        ])
        const texture = new DataTexture(data, 2, 2, RGBAFormat)
        texture.colorSpace = SRGBColorSpace
        texture.needsUpdate = true

        const env = pmrem.fromEquirectangular(texture).texture
        scene.environment = env
        scene.background = new Color('#05060b')

        return () => {
            scene.environment = null
            env.dispose?.()
            texture.dispose()
            pmrem.dispose()
        }
    }, [pmrem, scene])

    return null
}
