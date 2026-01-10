'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function formatFrame(num: number) {
    return num.toString().padStart(4, '0')
}

function WireframeContent() {
    const searchParams = useSearchParams()
    const clipName = searchParams.get('clip')
    const basePath = useMemo(
        () => (clipName ? `/processed/${clipName}` : null),
        [clipName]
    )

    const [stillAvailable, setStillAvailable] = useState<boolean | null>(null)
    const [turntableFrames, setTurntableFrames] = useState(0)
    const [currentFrame, setCurrentFrame] = useState(1)

    useEffect(() => {
        let mounted = true
        if (!basePath) return

        const checkAssets = async () => {
            try {
                const head = await fetch(`${basePath}/wireframe.png`, { method: 'HEAD' })
                if (mounted) setStillAvailable(head.ok)
            } catch {
                if (mounted) setStillAvailable(false)
            }

            // Probe turntable frames tt_0001.png ... tt_0096.png
            let count = 0
            for (let i = 1; i <= 96; i++) {
                const frameId = formatFrame(i)
                try {
                    const res = await fetch(`${basePath}/wireframe_turntable/tt_${frameId}.png`, {
                        method: 'HEAD',
                    })
                    if (res.ok) count = i
                    else break
                } catch {
                    break
                }
            }
            if (mounted) setTurntableFrames(count)
        }

        checkAssets()
        return () => {
            mounted = false
        }
    }, [basePath])

    useEffect(() => {
        if (!turntableFrames) return
        const id = setInterval(() => {
            setCurrentFrame((prev) => (prev % turntableFrames) + 1)
        }, 120)
        return () => clearInterval(id)
    }, [turntableFrames])

    if (!clipName) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl mb-4">No clip specified</h1>
                    <p className="text-gray-400">Add ?clip=name to the URL</p>
                    <a href="/curator" className="text-cyan-400 hover:underline mt-4 block">
                        Go to Curator →
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800 p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Wireframe Viewer</h1>
                        <p className="text-sm text-gray-400">{clipName}</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={`/preview?clip=${clipName}`}
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                        >
                            ← Back to Preview
                        </a>
                        <a
                            href="/curator"
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                        >
                            Curator
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 space-y-8">
                <section className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Wireframe Still</h2>
                        {stillAvailable === false && (
                            <span className="text-sm text-red-400">Not found</span>
                        )}
                    </div>

                    {stillAvailable ? (
                        <div className="bg-black border border-gray-800 rounded overflow-hidden">
                            <img
                                src={`${basePath}/wireframe.png`}
                                alt="Wireframe render"
                                className="w-full h-auto"
                            />
                        </div>
                    ) : stillAvailable === false ? (
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>Generate a wireframe render for this clip:</p>
                            <code className="block bg-gray-950 text-gray-100 p-3 rounded text-xs overflow-auto">
                                /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender_wireframe.py
                                -- --base public/processed/{clipName} --frame frame_001 --out
                                public/processed/{clipName}/wireframe.png --turntable 24
                            </code>
                            <p className="text-gray-500">
                                Ensure the clip has frames and depth maps under
                                {' '}<span className="text-gray-300">/processed/{clipName}/frames</span> and
                                {' '}<span className="text-gray-300">/processed/{clipName}/depth</span>.
                            </p>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm">Checking for wireframe.png…</div>
                    )}
                </section>

                <section className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Turntable</h2>
                        <span className="text-sm text-gray-400">
                            {turntableFrames > 0 ? `${turntableFrames} frames` : 'Not found'}
                        </span>
                    </div>

                    {turntableFrames > 0 ? (
                        <div className="bg-black border border-gray-800 rounded overflow-hidden">
                            <img
                                src={`${basePath}/wireframe_turntable/tt_${formatFrame(currentFrame)}.png`}
                                alt="Wireframe turntable"
                                className="w-full h-auto"
                            />
                        </div>
                    ) : (
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>No turntable frames detected.</p>
                            <p className="text-gray-500">
                                Include <span className="text-gray-300">--turntable &lt;frames&gt;</span> in the Blender
                                command to generate a spinning sequence.
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default function WireframePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading viewer…</div>}>
            <WireframeContent />
        </Suspense>
    )
}
