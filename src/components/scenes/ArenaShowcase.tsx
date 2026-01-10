'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useVideoTexture, useGLTF, useAnimations } from '@react-three/drei'
import { Suspense, useMemo, useEffect, useRef, useState } from 'react'
import { Color, MeshStandardMaterial, Vector3, Box3, DoubleSide } from 'three'
import { ArenaConfig, CharacterSlot, defaultArenaConfig } from '@/config/arena'

function CharacterBot({ slot }: { slot: CharacterSlot }) {
    const hover = useMemo(() => new Vector3(slot.position[0], slot.position[1] + 0.05, slot.position[2]), [slot.position])
    useFrame(({ clock, scene }) => {
        const t = clock.getElapsedTime()
        const mesh = scene.getObjectByName(slot.name)
        if (mesh) {
            mesh.position.y = slot.position[1] + Math.sin(t * 2) * 0.05
            mesh.rotation.y = Math.sin(t * 1.5) * 0.3
        }
    })

    return (
        <mesh position={slot.position} name={slot.name} castShadow>
            <boxGeometry args={[0.35, 0.6, 0.35]} />
            <meshStandardMaterial color={slot.color} metalness={0.2} roughness={0.35} />
        </mesh>
    )
}

function CharacterModel({ slot, wireframeOverlay }: { slot: CharacterSlot; wireframeOverlay?: boolean }) {
    const gltf = useGLTF(slot.modelPath || '')
    const fittedRef = useRef<boolean>(false)
    // Ensure materials respond to lights reasonably
    useEffect(() => {
        gltf.scene.traverse((obj: any) => {
            if (obj.isMesh && obj.material) {
                obj.castShadow = true
                obj.receiveShadow = true
                if (Array.isArray(obj.material)) {
                    obj.material.forEach((m: any) => {
                        m.metalness = Math.min(0.5, m.metalness ?? 0.3)
                        m.roughness = Math.max(0.25, m.roughness ?? 0.4)
                    })
                } else {
                    obj.material.metalness = Math.min(0.5, obj.material.metalness ?? 0.3)
                    obj.material.roughness = Math.max(0.25, obj.material.roughness ?? 0.4)
                }
            }
        })
    }, [gltf.scene])

    // Auto-fit scale/center so characters aren't gigantic
    useEffect(() => {
        if (fittedRef.current) return
        // Reset transforms before fitting
        gltf.scene.position.set(0, 0, 0)
        gltf.scene.rotation.set(0, 0, 0)
        gltf.scene.scale.setScalar(1)

        let box = new Box3().setFromObject(gltf.scene)
        const size = new Vector3()
        box.getSize(size)
        if (size.y > 0.0001) {
            const targetHeight = 1.0
            const rawScale = targetHeight / size.y
            const scale = Math.min(rawScale, 1) // cap but don't force a minimum
            gltf.scene.scale.setScalar(scale)
            // Recompute bounds after scaling to center properly
            box = new Box3().setFromObject(gltf.scene)
            const center = new Vector3()
            box.getCenter(center)
            gltf.scene.position.x = -center.x
            gltf.scene.position.z = -center.z
            gltf.scene.position.y = -box.min.y
        }
        fittedRef.current = true
    }, [gltf.scene])

    const { actions, names } = useAnimations(gltf.animations, gltf.scene)
    const [clipIndex, setClipIndex] = useState(0)
    useEffect(() => {
        if (!actions) return
        const sequence = slot.sequence && slot.sequence.length > 0 ? slot.sequence : names
        const clipName = slot.animationName || sequence[clipIndex % sequence.length]
        if (clipName && actions[clipName]) {
            const action = actions[clipName]
            action.reset().fadeIn(0.2)
            if (slot.holdPose) {
                action.play()
                action.paused = true
            } else {
                action.play()
            }
        }
        const duration = (slot.sequenceDuration || 2.5) * 1000
        const timer = setTimeout(() => setClipIndex((c) => c + 1), duration)
        return () => {
            clearTimeout(timer)
            Object.values(actions).forEach((a) => a?.stop())
        }
    }, [actions, names, slot.animationName, slot.sequence, slot.sequenceDuration, clipIndex])

    return (
        <group position={slot.position} name={slot.name} scale={1}>
            <primitive object={gltf.scene} />
            {wireframeOverlay && (
                <mesh>
                    <primitive object={gltf.scene.clone()} />
                    <meshBasicMaterial color={slot.color} wireframe transparent opacity={0.8} side={DoubleSide} />
                </mesh>
            )}
        </group>
    )
}

function Screen({ clipName, size }: { clipName: string; size: { width: number; height: number } }) {
    return (
        <group position={[0, 0.8, -2.2]}>
            <mesh receiveShadow>
                <planeGeometry args={[size.width, size.height]} />
                <meshStandardMaterial color="#2d3544" emissive={new Color('#1c2330')} emissiveIntensity={0.02} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
                <planeGeometry args={[size.width + 0.15, size.height + 0.15]} />
                <meshStandardMaterial color="#121826" metalness={0.4} roughness={0.2} />
            </mesh>
        </group>
    )
}

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[12, 12, 1, 1]} />
            <meshStandardMaterial color="#232a36" roughness={0.82} metalness={0.05} />
        </mesh>
    )
}

function GridLines() {
    return (
        <gridHelper args={[12, 12, '#0f131b', '#0f131b']} position={[0, 0.01, 0]} />
    )
}

function CameraRig({ cameraPath }: { cameraPath?: ArenaConfig['cameraPath'] }) {
    const { camera, clock } = useThree()
    const targetRef = useRef(new Vector3(0, 0.7, 0))
    const idxRef = useRef(0)
    const startRef = useRef(0)

    useFrame(() => {
        const path =
            cameraPath && cameraPath.length
                ? cameraPath
                : [
                    { position: [0, 2.2, 4], target: [0, 0.7, 0], duration: 4 },
                    { position: [-2.5, 1.8, 3], target: [0, 0.7, 0], duration: 4 },
                    { position: [2.5, 1.8, 3], target: [0, 0.7, 0], duration: 4 },
                ]
        if (path.length === 0) return
        const current = path[idxRef.current % path.length]
        const next = path[(idxRef.current + 1) % path.length]
        const elapsed = clock.elapsedTime - startRef.current
        const t = Math.min(elapsed / current.duration, 1)
        const pos = new Vector3().fromArray(current.position).lerp(new Vector3().fromArray(next.position), t)
        camera.position.lerp(pos, 0.08)
        targetRef.current.lerp(new Vector3().fromArray(next.target), 0.05)
        camera.lookAt(targetRef.current)
        if (t >= 1) {
            idxRef.current = (idxRef.current + 1) % path.length
            startRef.current = clock.elapsedTime
        }
    })
    return null
}

export function ArenaShowcase({ config = defaultArenaConfig }: { config?: ArenaConfig }) {

    return (
        <div className="h-screen w-full bg-black">
            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 1.8, 5]} fov={45} />
                    <OrbitControls
                        autoRotate={false}
                        enablePan={false}
                        enableZoom={false}
                        minDistance={3}
                        maxDistance={6}
                        maxPolarAngle={Math.PI / 2.2}
                        minPolarAngle={Math.PI / 4}
                        target={[0, 0.6, 0]}
                    />

                    <color attach="background" args={['#242b36']} />
                    <hemisphereLight intensity={0.6} groundColor="#111827" />
                    <directionalLight
                        position={[3, 4, 2]}
                        intensity={1.2}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    <pointLight position={[-3, 2, -2]} intensity={0.6} color="#60a5fa" />

                    <Floor />
                    <GridLines />

                    {config.characters.map((slot) => (
                        slot.modelPath ? (
                            <CharacterModel
                                key={slot.name}
                                slot={slot}
                                wireframeOverlay={config.wireframeOverlay || slot.wireframe}
                            />
                        ) : (
                            <CharacterBot key={slot.name} slot={slot} />
                        )
                    ))}
                </Suspense>
            </Canvas>
        </div>
    )
}
