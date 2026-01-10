'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useGLTF, useAnimations } from '@react-three/drei'

function InspectorScene({ model }: { model: string }) {
    const gltf = useGLTF(model)
    const { animations } = gltf
    const [clipNames, setClipNames] = useState<string[]>([])
    const [durations, setDurations] = useState<number[]>([])

    useEffect(() => {
        setClipNames(animations.map((a) => a.name || '(unnamed)'))
        setDurations(animations.map((a) => (a.duration ? Number(a.duration.toFixed(2)) : 0)))
    }, [animations])

    return (
        <>
            <div className="absolute top-4 left-4 z-10 bg-black/70 text-white border border-gray-800 rounded p-3 max-w-xl text-sm">
                <div className="font-semibold mb-2">Animations</div>
                {clipNames.length === 0 && <div className="text-gray-400">None found.</div>}
                <ul className="space-y-1">
                    {clipNames.map((name, idx) => (
                        <li key={idx}>
                            <code className="text-cyan-300">{name}</code>
                            {durations[idx] ? <span className="text-gray-400 ml-2">{durations[idx]}s</span> : null}
                        </li>
                    ))}
                </ul>
            </div>
            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />
                    <OrbitControls enablePan={false} />
                    <color attach="background" args={['#05060b']} />
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
                    <primitive object={gltf.scene} />
                </Suspense>
            </Canvas>
        </>
    )
}

function InspectContent() {
    const params = useSearchParams()
    const model = params.get('model')

    if (!model) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center max-w-lg">
                    <h1 className="text-2xl font-bold mb-3">GLB Animation Inspector</h1>
                    <p className="text-gray-400 mb-4">Pass ?model=/models/your/model.glb to inspect.</p>
                    <div className="text-sm text-gray-300 space-y-2">
                        <div>Example:</div>
                        <code className="block bg-gray-900 p-3 rounded">
                            /arena/inspect?model=/models/jhin/shan_hai_scrolls_jhin.glb
                        </code>
                    </div>
                </div>
            </div>
        )
    }

    return <InspectorScene model={model} />
}

export default function InspectPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    Loading model…
                </div>
            }
        >
            <InspectContent />
        </Suspense>
    )
}
