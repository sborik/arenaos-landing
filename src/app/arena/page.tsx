'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { defaultArenaConfig } from '@/config/arena'
import { getArenaConfig, scenePresets } from '@/config/arenaPresets'

const ArenaShowcase = dynamic(
    () => import('@/components/scenes/ArenaShowcase').then((mod) => mod.ArenaShowcase),
    { ssr: false }
)

function ArenaContent() {
    const searchParams = useSearchParams()
    const clipName = searchParams.get('clip') || defaultArenaConfig.clipName
    const sceneId = searchParams.get('scene')
    const config = getArenaConfig(sceneId, clipName)

    return (
        <>
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <a
                    href="/"
                    className="px-3 py-2 bg-gray-900 text-white border border-gray-800 rounded hover:bg-gray-800 text-sm"
                >
                    ← Landing
                </a>
                <a
                    href="/curator"
                    className="px-3 py-2 bg-gray-900 text-white border border-gray-800 rounded hover:bg-gray-800 text-sm"
                >
                    Curator
                </a>
                <a
                    href={`/preview?clip=${clipName}`}
                    className="px-3 py-2 bg-gray-900 text-white border border-gray-800 rounded hover:bg-gray-800 text-sm"
                >
                    Preview
                </a>
                <a
                    href={`/wireframe?clip=${clipName}`}
                    className="px-3 py-2 bg-gray-900 text-white border border-gray-800 rounded hover:bg-gray-800 text-sm"
                >
                    Wireframe
                </a>
                <div className="flex gap-1">
                    {scenePresets.map((s) => (
                        <a
                            key={s.id}
                            href={`/arena?clip=${clipName}&scene=${s.id}`}
                            className={`px-3 py-2 rounded text-sm border ${sceneId === s.id || (!sceneId && s.id === scenePresets[0].id)
                                    ? 'bg-cyan-600 border-cyan-500 text-white'
                                    : 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'
                                }`}
                        >
                            {s.label}
                        </a>
                    ))}
                </div>
            </div>
            <ArenaShowcase config={config} />
        </>
    )
}

export default function ArenaPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    Loading arena…
                </div>
            }
        >
            <ArenaContent />
        </Suspense>
    )
}
