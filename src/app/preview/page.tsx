'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const SceneContainer = dynamic(
  () => import('@/components/scenes/SceneContainer').then(mod => ({ default: mod.SceneContainer })),
  { ssr: false }
)

const DepthParallaxSequence = dynamic(
  () => import('@/components/scenes/DepthParallax').then(mod => ({ default: mod.DepthParallaxSequence })),
  { ssr: false }
)

function PreviewContent() {
  const searchParams = useSearchParams()
  const clipName = searchParams.get('clip')
  const [frameCount, setFrameCount] = useState(10)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to detect frame count by checking which frames exist
    const checkFrames = async () => {
      if (!clipName) return
      
      let count = 0
      for (let i = 1; i <= 30; i++) {
        const frameNum = i.toString().padStart(3, '0')
        try {
          const res = await fetch(`/processed/${clipName}/frames/frame_${frameNum}.jpg`, { method: 'HEAD' })
          if (res.ok) count = i
          else break
        } catch {
          break
        }
      }
      
      if (count > 0) {
        setFrameCount(count)
      } else {
        setError('No frames found. Make sure the clip has been processed.')
      }
    }
    
    checkFrames()
  }, [clipName])

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

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4 text-red-400">Error</h1>
          <p className="text-gray-400">{error}</p>
          <a href="/curator" className="text-cyan-400 hover:underline mt-4 block">
            Go to Curator →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Preview: {clipName}</h1>
            <p className="text-sm text-gray-400">{frameCount} frames • Move mouse for parallax</p>
          </div>
          <div className="flex gap-2">
            <a 
              href="/curator"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              ← Back to Curator
            </a>
            <a 
              href="/"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
            >
              Add to Landing Page
            </a>
            <a
              href={`/wireframe?clip=${clipName}`}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              Wireframe View
            </a>
          </div>
        </div>
      </header>

      {/* 3D Scene */}
      <SceneContainer 
        cameraPosition={[0, 0, 3]} 
        autoRotate={false}
        className="h-screen w-full"
      >
        <DepthParallaxSequence
          basePath={`/processed/${clipName}`}
          frameCount={frameCount}
          fps={2}
          scale={1.5}
          parallaxStrength={0.4}
        />
        
        {/* Ambient effects */}
        <fog attach="fog" args={['#000000', 3, 10]} />
      </SceneContainer>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center">
        <div className="bg-black/80 rounded-lg p-4 flex gap-4 items-center">
          <label className="text-sm text-gray-400">
            Parallax Strength:
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              defaultValue="0.4"
              className="ml-2 w-24"
            />
          </label>
          <label className="text-sm text-gray-400">
            FPS:
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1" 
              defaultValue="2"
              className="ml-2 w-24"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
