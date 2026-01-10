'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ProceduralRomanCity = dynamic(() => import('@/components/RomanCity3D/ProceduralScene'), { ssr: false })

export default function EcosystemPage() {
    return (
        <div className="w-screen h-screen overflow-hidden">
            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-300 to-sky-500">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">🏛️</div>
                        <p className="text-white font-bold text-xl">Loading Procedural City...</p>
                    </div>
                </div>
            }>
                <ProceduralRomanCity />
            </Suspense>
        </div>
    )
}
