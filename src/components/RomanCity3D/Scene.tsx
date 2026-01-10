'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type BuildingType =
    // Landmarks
    | 'temple' | 'colosseum' | 'forum'
    // Education
    | 'scholae' | 'gymnasium' | 'library'
    // Combat
    | 'ludus' | 'armory' | 'trophy_hall'
    // Compute
    | 'tabularium' | 'aqueduct' | 'engineer'
    // Research
    | 'observatory'
    // Existing
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
    theme: string
    status: 'proposed' | 'interested' | 'exploring' | 'partnered'
}

const TILE_W = 64
const TILE_H = 32

const LANDMARKS: District[] = [
    { id: 'education', name: 'Education Partners', centerX: 25, centerY: 25, radius: 10, color: '#10b981', theme: 'Academy District', status: 'proposed' },
    { id: 'games', name: 'Game Studios', centerX: 50, centerY: 60, radius: 12, color: '#ef4444', theme: 'Arena District', status: 'interested' },
    { id: 'compute', name: 'Compute Infrastructure', centerX: 70, centerY: 30, radius: 9, color: '#6b7280', theme: 'Innovation Quarter', status: 'proposed' },
    { id: 'research', name: 'Research Labs', centerX: 75, centerY: 70, radius: 8, color: '#a855f7', theme: 'Research Acropolis', status: 'exploring' },
    { id: 'arvr', name: 'AR/VR Platforms', centerX: 20, centerY: 65, radius: 7, color: '#8b5cf6', theme: 'AR/VR Sanctuary', status: 'exploring' },
    { id: 'manufacturing', name: 'Manufacturing', centerX: 30, centerY: 80, radius: 6, color: '#f59e0b', theme: 'Fabrication District', status: 'proposed' },
]

const STATUS_CONFIG = {
    proposed: { color: '#9ca3af', label: 'Proposed' },
    interested: { color: '#f59e0b', label: 'Interested' },
    exploring: { color: '#8b5cf6', label: 'Exploring' },
    partnered: { color: '#10b981', label: 'Partnered' },
}

function generateRomanCity(): RomanBuilding[] {
    const buildings: RomanBuilding[] = []
    let id = 0

    for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
            const distFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2))
            if (distFromCenter > 45) continue

            let district: District | null = null
            let isLandmark = false
            let distFromLandmark = 999

            for (const landmark of LANDMARKS) {
                const dist = Math.sqrt(Math.pow(x - landmark.centerX, 2) + Math.pow(y - landmark.centerY, 2))
                if (dist < landmark.radius) {
                    district = landmark
                    distFromLandmark = dist
                    if (dist < 2) isLandmark = true
                    break
                }
            }

            // Density based on district
            const densityThreshold = district?.id === 'games' || district?.id === 'education' ? 0.65 :
                district?.id === 'compute' || district?.id === 'manufacturing' ? 0.55 :
                    0.45

            if (Math.random() > densityThreshold && !isLandmark) continue

            let type: BuildingType

            if (isLandmark) {
                // Central landmark for each district
                type = district?.id === 'games' ? 'colosseum' :
                    district?.id === 'education' ? 'library' :
                        district?.id === 'compute' ? 'forum' :
                            district?.id === 'research' ? 'observatory' :
                                district?.id === 'arvr' ? 'temple' :
                                    'forum'
            } else if (district) {
                // Thematic buildings per district
                if (district.id === 'education') {
                    const types: BuildingType[] = ['scholae', 'gymnasium', 'library', 'villa']
                    type = types[Math.floor(Math.random() * types.length)]
                } else if (district.id === 'games') {
                    const types: BuildingType[] = ['ludus', 'armory', 'trophy_hall', 'insula', 'market']
                    type = types[Math.floor(Math.random() * types.length)]
                } else if (district.id === 'compute') {
                    const types: BuildingType[] = ['tabularium', 'aqueduct', 'engineer', 'villa']
                    type = types[Math.floor(Math.random() * types.length)]
                } else if (district.id === 'research') {
                    const types: BuildingType[] = ['library', 'villa', 'bathhouse']
                    type = types[Math.floor(Math.random() * types.length)]
                } else if (district.id === 'arvr') {
                    const types: BuildingType[] = ['temple', 'villa', 'bathhouse']
                    type = types[Math.floor(Math.random() * types.length)]
                } else {
                    const types: BuildingType[] = ['warehouse', 'engineer', 'market', 'insula']
                    type = types[Math.floor(Math.random() * types.length)]
                }
            } else {
                // Generic city buildings
                const types: BuildingType[] = ['insula', 'villa', 'market', 'warehouse']
                type = types[Math.floor(Math.random() * types.length)]
            }

            buildings.push({ id: `building_${id++}`, type, x, y, district: district?.id || null })
        }
    }

    return buildings
}

export default function RomanStakeholderMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [buildings] = useState(() => generateRomanCity())
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
    const [zoom, setZoom] = useState(0.7)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [sprites, setSprites] = useState<Record<string, HTMLImageElement>>({})
    const [spritesLoaded, setSpritesLoaded] = useState(false)

    useEffect(() => {
        const spriteFiles = {
            // Landmarks
            temple: '/assets/roman/roman_temple_large_1767993044094.png',
            colosseum: '/assets/roman/roman_colosseum_1767993056224.png',
            forum: '/assets/roman/roman_forum_building_1767993069275.png',
            // Education
            scholae: '/assets/roman/roman_scholae_school_1767993838658.png',
            gymnasium: '/assets/roman/roman_gymnasium_1767993851584.png',
            library: '/assets/roman/roman_grand_library_1767993864831.png',
            // Combat
            ludus: '/assets/roman/roman_ludus_school_1767993888185.png',
            armory: '/assets/roman/roman_armory_1767993901349.png',
            trophy_hall: '/assets/roman/roman_trophy_hall_1767993915571.png',
            // Compute
            tabularium: '/assets/roman/roman_tabularium_1767993939348.png',
            aqueduct: '/assets/roman/roman_aqueduct_terminal_1767993952540.png',
            engineer: '/assets/roman/roman_engineer_workshop_1767993965951.png',
            // Research
            observatory: '/assets/roman/roman_observatory_1767993992068.png',
            // Existing
            villa: '/assets/roman/roman_villa_medium_1767993092139.png',
            insula: '/assets/roman/roman_insula_small_1767993104159.png',
            bathhouse: '/assets/roman/roman_bathhouse_1767993116814.png',
            market: '/assets/roman/roman_market_stall_1767993138878.png',
            fountain: '/assets/roman/roman_fountain_1767993152580.png',
            tree: '/assets/roman/roman_cypress_tree_1767993165261.png',
            warehouse: '/assets/roman/roman_insula_small_1767993104159.png',
        }

        const loaded: Record<string, HTMLImageElement> = {}
        let count = 0
        const total = Object.keys(spriteFiles).length

        Object.entries(spriteFiles).forEach(([key, path]) => {
            const img = new Image()
            img.onload = () => {
                loaded[key] = img
                count++
                if (count === total) {
                    setSprites(loaded)
                    setSpritesLoaded(true)
                }
            }
            img.onerror = () => {
                count++
                if (count === total) {
                    setSprites(loaded)
                    setSpritesLoaded(true)
                }
            }
            img.src = path
        })
    }, [])

    const toIso = useCallback((x: number, y: number) => {
        return {
            x: (x - y) * TILE_W * zoom + offset.x,
            y: (x + y) * TILE_H * zoom + offset.y
        }
    }, [zoom, offset])

    const drawBuilding = useCallback((ctx: CanvasRenderingContext2D, building: RomanBuilding, isHighlighted: boolean) => {
        const sprite = sprites[building.type]
        if (!sprite) return

        const iso = toIso(building.x, building.y)

        // Scale based on building type
        const isLandmark = ['colosseum', 'temple', 'forum', 'library', 'observatory'].includes(building.type)
        const isMedium = ['scholae', 'gymnasium', 'ludus', 'armory', 'tabularium', 'aqueduct', 'bathhouse', 'trophy_hall'].includes(building.type)
        const scale = zoom * (isLandmark ? 1.3 : isMedium ? 0.9 : 0.7)

        const w = sprite.width * scale
        const h = sprite.height * scale

        ctx.save()
        if (isHighlighted) {
            ctx.shadowColor = '#fbbf24'
            ctx.shadowBlur = 25
            ctx.globalAlpha = 1
        } else {
            ctx.globalAlpha = 0.95
        }
        ctx.drawImage(sprite, iso.x - w / 2, iso.y - h, w, h)
        ctx.restore()
    }, [sprites, toIso, zoom])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !spritesLoaded) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#87CEEB')
        gradient.addColorStop(1, '#6BA3D0')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Sort buildings for proper depth
        const sorted = [...buildings].sort((a, b) => (a.x + a.y) - (b.x + b.y))

        // Draw buildings
        sorted.forEach(building => {
            const isHighlighted = building.district === hoveredDistrict || building.district === selectedDistrict
            drawBuilding(ctx, building, isHighlighted)
        })

        // Decorative elements (trees and fountains)
        if (sprites.tree && sprites.fountain) {
            for (let i = 0; i < 40; i++) {
                const angle = (i / 40) * Math.PI * 2
                const radius = 20 + Math.random() * 25
                const x = 50 + Math.cos(angle) * radius
                const y = 50 + Math.sin(angle) * radius

                const iso = toIso(x, y)
                const sprite = Math.random() > 0.7 ? sprites.fountain : sprites.tree
                const scale = zoom * 0.5
                ctx.globalAlpha = 0.8
                ctx.drawImage(sprite, iso.x - sprite.width * scale / 2, iso.y - sprite.height * scale, sprite.width * scale, sprite.height * scale)
                ctx.globalAlpha = 1
            }
        }

        // Draw district labels with theme names
        LANDMARKS.forEach(landmark => {
            const iso = toIso(landmark.centerX, landmark.centerY)
            const isActive = landmark.id === hoveredDistrict || landmark.id === selectedDistrict

            // District theme label
            ctx.font = isActive ? `bold ${16 * zoom}px sans-serif` : `bold ${13 * zoom}px sans-serif`
            ctx.fillStyle = '#ffffff'
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 4
            ctx.textAlign = 'center'

            ctx.strokeText(landmark.theme, iso.x, iso.y - 30)
            ctx.fillText(landmark.theme, iso.x, iso.y - 30)

            // Status indicator
            ctx.fillStyle = STATUS_CONFIG[landmark.status].color
            ctx.beginPath()
            ctx.arc(iso.x, iso.y - 15, 8 * zoom, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 2
            ctx.stroke()
        })
    }, [buildings, toIso, drawBuilding, hoveredDistrict, selectedDistrict, zoom, spritesLoaded, sprites])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        setOffset({ x: window.innerWidth / 2 - 1200, y: window.innerHeight / 2 - 600 })
    }, [])

    useEffect(() => {
        draw()
    }, [draw])

    const selectedInfo = LANDMARKS.find(d => d.id === selectedDistrict)

    return (
        <div className="w-full h-full relative bg-gray-100">
            {!spritesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-300 to-sky-500">
                    <div className="text-center">
                        <div className="text-5xl mb-4 animate-bounce">🏛️</div>
                        <p className="text-white font-bold text-lg">Loading arenaOS Ecosystem...</p>
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

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white/95 border border-gray-300 p-4 max-w-sm text-sm shadow-xl rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1 text-lg">arenaOS Ecosystem</h3>
                <p className="text-xs text-gray-500 mb-3 italic">A New Economy for Physical Competition</p>

                <div className="space-y-2 mb-3 text-xs border-t border-gray-200 pt-2">
                    <div className="font-semibold text-gray-700">Engagement Status</div>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                            <span className="text-gray-600">{config.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 border-t border-gray-200 pt-2">
                    {LANDMARKS.map(landmark => (
                        <div
                            key={landmark.id}
                            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                            onMouseEnter={() => setHoveredDistrict(landmark.id)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            onClick={() => setSelectedDistrict(landmark.id === selectedDistrict ? null : landmark.id)}
                        >
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: landmark.color }} />
                            <div className="flex-1">
                                <div className="text-gray-900 text-xs font-medium">{landmark.name}</div>
                                <div className="text-[10px] text-gray-500">{landmark.theme}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_CONFIG[landmark.status].color }} />
                        </div>
                    ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 text-[10px] text-gray-500">
                    <div>🖱️ Drag to pan • Scroll to zoom</div>
                    <div className="mt-1">📍 Click districts for details</div>
                </div>
            </div>

            {/* Nav */}
            <div className="absolute top-4 right-4 flex gap-2">
                <a href="/" className="bg-white/95 border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg shadow font-medium">
                    ← Home
                </a>
            </div>

            {/* Info Panel */}
            <AnimatePresence>
                {selectedInfo && (
                    <motion.div
                        className="absolute bottom-4 right-4 bg-white/95 border border-gray-300 p-5 max-w-md shadow-xl rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{selectedInfo.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{selectedInfo.theme}</p>
                            </div>
                            <button
                                onClick={() => setSelectedDistrict(null)}
                                className="text-gray-400 hover:text-gray-900 text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="text-xs text-gray-600 leading-relaxed mb-4 border-l-4 pl-3" style={{ borderColor: selectedInfo.color }}>
                            {selectedInfo.id === 'education' && 'K-12 curriculum, skill certification, and content creation. The foundation of learning in the new economy.'}
                            {selectedInfo.id === 'games' && 'Fighting, FPS, and MOBA game studios. Where physical competition meets digital innovation.'}
                            {selectedInfo.id === 'compute' && 'Decentralized compute, edge servers, and GPU clusters. The backbone of real-time mixed-reality sports.'}
                            {selectedInfo.id === 'research' && 'Academic labs and ML datasets. Advancing the science of human-robot interaction.'}
                            {selectedInfo.id === 'arvr' && 'AR spectating and VR teleoperation platforms. Immersive experiences for players and fans.'}
                            {selectedInfo.id === 'manufacturing' && 'Hardware fabrication and component supply. Building the physical robots that compete.'}
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500 font-medium">Current Status:</span>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_CONFIG[selectedInfo.status].color }} />
                                <span className="text-sm font-semibold" style={{ color: STATUS_CONFIG[selectedInfo.status].color }}>
                                    {STATUS_CONFIG[selectedInfo.status].label}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
