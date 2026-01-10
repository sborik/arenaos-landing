'use client'

/**
 * Procedural Roman City - Complete Integration
 * Borderlands-style cell-shaded procedural city with caching
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildingCache, DistrictTheme } from './render/BuildingCache'
import { AnimationManager } from './animation/AnimatedElements'

type BuildingType =
    | 'temple' | 'colosseum' | 'forum' | 'library' | 'observatory'
    | 'scholae' | 'gymnasium' | 'ludus' | 'armory' | 'trophy_hall'
    | 'tabularium' | 'aqueduct' | 'engineer'
    | 'villa' | 'insula' | 'bathhouse' | 'market' | 'warehouse'

interface RomanBuilding {
    id: string
    type: BuildingType
    x: number
    y: number
    district: string | null
}

interface District {
    id: string
    name: string
    centerX: number
    centerY: number
    radius: number
    color: string
    theme: DistrictTheme
    themeLabel: string
    status: 'proposed' | 'interested' | 'exploring' | 'partnered'
}

const TILE_W = 64
const TILE_H = 32

const DISTRICTS: District[] = [
    { id: 'education', name: 'Education Partners', centerX: 25, centerY: 25, radius: 10, color: '#00d084', theme: 'education', themeLabel: 'Academy District', status: 'proposed' },
    { id: 'games', name: 'Game Studios', centerX: 50, centerY: 60, radius: 12, color: '#ff4136', theme: 'arena', themeLabel: 'Arena District', status: 'interested' },
    { id: 'compute', name: 'Compute Infrastructure', centerX: 70, centerY: 30, radius: 9, color: '#0074d9', theme: 'compute', themeLabel: 'Innovation Quarter', status: 'proposed' },
    { id: 'research', name: 'Research Labs', centerX: 75, centerY: 70, radius: 8, color: '#b10dc9', theme: 'research', themeLabel: 'Research Acropolis', status: 'exploring' },
    { id: 'arvr', name: 'AR/VR Platforms', centerX: 20, centerY: 65, radius: 7, color: '#a463f2', theme: 'arvr', themeLabel: 'AR/VR Sanctuary', status: 'exploring' },
    { id: 'manufacturing', name: 'Manufacturing', centerX: 30, centerY: 80, radius: 6, color: '#ff851b', theme: 'manufacturing', themeLabel: 'Fabrication District', status: 'proposed' },
]

const STATUS_CONFIG = {
    proposed: { color: '#9ca3af', label: 'Proposed' },
    interested: { color: '#f59e0b', label: 'Interested' },
    exploring: { color: '#8b5cf6', label: 'Exploring' },
    partnered: { color: '#10b981', label: 'Partnered' },
}

function generateCity(): RomanBuilding[] {
    const buildings: RomanBuilding[] = []
    let id = 0

    for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
            const distFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2))
            if (distFromCenter > 45) continue

            let district: District | null = null
            let isLandmark = false

            for (const d of DISTRICTS) {
                const dist = Math.sqrt(Math.pow(x - d.centerX, 2) + Math.pow(y - d.centerY, 2))
                if (dist < d.radius) {
                    district = d
                    if (dist < 2) isLandmark = true
                    break
                }
            }

            const densityThreshold = district?.id === 'games' || district?.id === 'education' ? 0.65 : 0.55
            if (Math.random() > densityThreshold && !isLandmark) continue

            let type: BuildingType

            if (isLandmark) {
                type = district?.id === 'games' ? 'colosseum' :
                    district?.id === 'education' ? 'library' :
                        district?.id === 'compute' ? 'forum' :
                            district?.id === 'research' ? 'observatory' :
                                district?.id === 'arvr' ? 'temple' : 'forum'
            } else if (district) {
                const typeMap: Record<string, BuildingType[]> = {
                    education: ['scholae', 'gymnasium', 'library', 'villa'],
                    games: ['ludus', 'armory', 'trophy_hall', 'insula'],
                    compute: ['tabularium', 'aqueduct', 'engineer', 'villa'],
                    research: ['library', 'villa', 'bathhouse'],
                    arvr: ['temple', 'villa', 'bathhouse'],
                    manufacturing: ['warehouse', 'engineer', 'market', 'insula'],
                }
                const types = typeMap[district.id] || ['villa', 'insula']
                type = types[Math.floor(Math.random() * types.length)]
            } else {
                type = ['insula', 'villa', 'market', 'warehouse'][Math.floor(Math.random() * 4)] as BuildingType
            }

            buildings.push({ id: `b_${id++}`, type, x, y, district: district?.id || null })
        }
    }

    return buildings
}

export default function ProceduralRomanCity() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<AnimationManager>(new AnimationManager())
    const [buildings] = useState(() => generateCity())
    const [cacheReady, setCacheReady] = useState(false)
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
    const [zoom, setZoom] = useState(0.7)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    // Initialize building cache
    useEffect(() => {
        buildingCache.initializeCache()
        setCacheReady(true)

        // Populate animated elements
        const anim = animationRef.current
        for (let i = 0; i < 50; i++) {
            const x = 20 + Math.random() * 60
            const y = 20 + Math.random() * 60
            anim.addPerson(x, y, '#4a3520', 0.8)
        }

        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2
            const x = 50 + Math.cos(angle) * 35
            const y = 50 + Math.sin(angle) * 35
            anim.addWater(x, y)
        }

        DISTRICTS.forEach(d => {
            anim.addFlag(d.centerX, d.centerY, 25, d.color)
        })
    }, [])

    const toIso = useCallback((x: number, y: number) => ({
        x: (x - y) * TILE_W * zoom + offset.x,
        y: (x + y) * TILE_H * zoom + offset.y,
    }), [zoom, offset])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !cacheReady) return
        const ctx = canvas.getContext('2d')!

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#87CEEB')
        gradient.addColorStop(1, '#6BA3D0')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Sort buildings by depth
        const sorted = [...buildings].sort((a, b) => (a.x + a.y) - (b.x + b.y))

        // Draw buildings
        sorted.forEach(building => {
            const iso = toIso(building.x, building.y)
            const district = DISTRICTS.find(d => d.id === building.district)
            const theme = district?.theme || 'generic'
            const cached = buildingCache.getBuilding(building.type, theme)

            if (cached) {
                const isHighlighted = building.district === hoveredDistrict || building.district === selectedDistrict
                const scale = ['colosseum', 'temple', 'forum', 'library', 'observatory'].includes(building.type) ? 1.2 : 0.8

                ctx.save()
                if (isHighlighted) {
                    ctx.shadowColor = '#fbbf24'
                    ctx.shadowBlur = 30
                }
                ctx.drawImage(
                    cached,
                    iso.x - (cached.width * scale * zoom) / 2,
                    iso.y - cached.height * scale * zoom,
                    cached.width * scale * zoom,
                    cached.height * scale * zoom
                )
                ctx.restore()
            }
        })

        // Draw animated elements
        animationRef.current.drawAll(ctx, toIso)

        // District labels
        DISTRICTS.forEach(d => {
            const iso = toIso(d.centerX, d.centerY)
            const isActive = d.id === hoveredDistrict || d.id === selectedDistrict

            ctx.font = isActive ? `bold ${18 * zoom}px sans-serif` : `bold ${14 * zoom}px sans-serif`
            ctx.fillStyle = '#ffffff'
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 5
            ctx.textAlign = 'center'

            ctx.strokeText(d.themeLabel, iso.x, iso.y - 40)
            ctx.fillText(d.themeLabel, iso.x, iso.y - 40)

            ctx.fillStyle = STATUS_CONFIG[d.status].color
            ctx.beginPath()
            ctx.arc(iso.x, iso.y - 20, 8 * zoom, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 2
            ctx.stroke()
        })
    }, [buildings, toIso, cacheReady, hoveredDistrict, selectedDistrict, zoom])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        setOffset({ x: window.innerWidth / 2 - 1200, y: window.innerHeight / 2 - 600 })
    }, [])

    useEffect(() => {
        const animate = () => {
            animationRef.current.update()
            draw()
            requestAnimationFrame(animate)
        }
        const id = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(id)
    }, [draw])

    const selectedInfo = DISTRICTS.find(d => d.id === selectedDistrict)

    return (
        <div className="w-full h-full relative">
            {!cacheReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-300 to-sky-500">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">🏛️</div>
                        <p className="text-white font-bold text-xl">Generating Procedural Roman City...</p>
                        <p className="text-white/80 text-sm mt-2">Building {buildingCache.getStats().totalBuildings} variants...</p>
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                style={{ imageRendering: 'pixelated' }}
                onMouseDown={(e) => {
                    setIsDragging(true)
                    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
                }}
                onMouseMove={(e) => {
                    if (isDragging) {
                        setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
                    }
                }}
                onMouseUp={() => setIsDragging(false)}
                onWheel={(e) => {
                    e.preventDefault()
                    const delta = e.deltaY > 0 ? -0.05 : 0.05
                    setZoom(Math.max(0.4, Math.min(1.5, zoom + delta)))
                }}
            />

            {/* UI overlays remain the same as before */}
            <div className="absolute top-4 left-4 bg-white/95 border-2 border-black p-4 max-w-sm shadow-2xl rounded">
                <h3 className="font-bold text-xl mb-2">arenaOS Ecosystem</h3>
                <p className="text-xs italic mb-3">Procedurally Generated</p>
                {DISTRICTS.map(d => (
                    <div
                        key={d.id}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
                        onMouseEnter={() => setHoveredDistrict(d.id)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        onClick={() => setSelectedDistrict(d.id === selectedDistrict ? null : d.id)}
                    >
                        <div className="w-4 h-4 border-2 border-black" style={{ backgroundColor: d.color }} />
                        <div className="flex-1 text-xs">{d.name}</div>
                    </div>
                ))}
            </div>

            <a href="/" className="absolute top-4 right-4 bg-white/95 border-2 border-black px-4 py-2 font-bold hover:bg-gray-100">
                ← Home
            </a>

            <AnimatePresence>
                {selectedInfo && (
                    <motion.div
                        className="absolute bottom-4 right-4 bg-white/95 border-2 border-black p-5 max-w-md shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold text-lg">{selectedInfo.name}</h3>
                            <button onClick={() => setSelectedDistrict(null)} className="font-bold">✕</button>
                        </div>
                        <p className="text-sm mb-3">{selectedInfo.themeLabel}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs">Status:</span>
                            <span className="font-bold" style={{ color: STATUS_CONFIG[selectedInfo.status].color }}>
                                {STATUS_CONFIG[selectedInfo.status].label}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
