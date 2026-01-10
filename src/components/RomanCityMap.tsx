'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// Stakeholder district types - generic categories, not specific people
interface District {
    id: string
    name: string
    x: number
    y: number
    color: string
    buildings: Building[]
    status: 'interested' | 'exploring' | 'partnered' | 'proposed'
}

interface Building {
    id: string
    type: 'compute' | 'ar_vr' | 'game' | 'education' | 'media' | 'research' | 'manufacturing'
    name: string
    x: number
    y: number
    width: number
    height: number
    depth: number
}

// Roman-themed stakeholder districts
const DISTRICTS: District[] = [
    {
        id: 'forum-compute',
        name: 'Forum of Computation',
        x: 2,
        y: 2,
        color: '#6a8caf',
        status: 'proposed',
        buildings: [
            { id: 'b1', type: 'compute', name: 'Decentralized Compute', x: 2, y: 2, width: 2, height: 2, depth: 3 },
            { id: 'b2', type: 'compute', name: 'Edge Inference', x: 4, y: 2, width: 1, height: 2, depth: 2 },
        ]
    },
    {
        id: 'basilica-ar',
        name: 'Basilica of Vision',
        x: 6,
        y: 2,
        color: '#8faadc',
        status: 'exploring',
        buildings: [
            { id: 'b3', type: 'ar_vr', name: 'AR Spectating', x: 6, y: 2, width: 2, height: 2, depth: 4 },
            { id: 'b4', type: 'ar_vr', name: 'VR Teleoperation', x: 8, y: 2, width: 1, height: 1, depth: 2 },
        ]
    },
    {
        id: 'colosseum-games',
        name: 'Colosseum of Games',
        x: 2,
        y: 6,
        color: '#c55a5a',
        status: 'interested',
        buildings: [
            { id: 'b5', type: 'game', name: 'Fighting IP', x: 2, y: 6, width: 3, height: 3, depth: 5 },
            { id: 'b6', type: 'game', name: 'FPS IP', x: 5, y: 6, width: 2, height: 2, depth: 3 },
            { id: 'b7', type: 'game', name: 'MOBA IP', x: 7, y: 6, width: 2, height: 2, depth: 4 },
        ]
    },
    {
        id: 'academy-education',
        name: 'Academy of Learning',
        x: 10,
        y: 6,
        color: '#70ad47',
        status: 'proposed',
        buildings: [
            { id: 'b8', type: 'education', name: 'K-12 Curriculum', x: 10, y: 6, width: 2, height: 2, depth: 3 },
            { id: 'b9', type: 'education', name: 'Content Creators', x: 12, y: 6, width: 1, height: 2, depth: 2 },
            { id: 'b10', type: 'education', name: 'Skill Certification', x: 10, y: 8, width: 2, height: 1, depth: 2 },
        ]
    },
    {
        id: 'pantheon-research',
        name: 'Pantheon of Research',
        x: 6,
        y: 10,
        color: '#9e7fb8',
        status: 'exploring',
        buildings: [
            { id: 'b11', type: 'research', name: 'Academic Labs', x: 6, y: 10, width: 3, height: 2, depth: 4 },
            { id: 'b12', type: 'research', name: 'ML Datasets', x: 9, y: 10, width: 2, height: 2, depth: 3 },
        ]
    },
    {
        id: 'workshop-manufacturing',
        name: 'Workshop Quarter',
        x: 2,
        y: 10,
        color: '#a69c8e',
        status: 'proposed',
        buildings: [
            { id: 'b13', type: 'manufacturing', name: 'Hardware Fabrication', x: 2, y: 10, width: 2, height: 2, depth: 2 },
            { id: 'b14', type: 'manufacturing', name: 'Component Supply', x: 4, y: 10, width: 1, height: 2, depth: 2 },
        ]
    },
]

// Status colors and symbols
const STATUS_CONFIG = {
    interested: { color: '#ffd700', symbol: '○', label: 'Interested' },
    exploring: { color: '#4a7aaa', symbol: '◐', label: 'Exploring' },
    partnered: { color: '#70ad47', symbol: '●', label: 'Partnered' },
    proposed: { color: '#8a90a0', symbol: '□', label: 'Proposed' },
}

export default function RomanCityMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    // Isometric conversion
    const toIso = useCallback((x: number, y: number) => {
        const TILE_WIDTH = 64
        const TILE_HEIGHT = 32
        return {
            x: (x - y) * (TILE_WIDTH / 2) * zoom + offset.x,
            y: (x + y) * (TILE_HEIGHT / 2) * zoom + offset.y,
        }
    }, [zoom, offset])

    const drawCity = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw marble texture background (use actual texture)
        ctx.fillStyle = '#f5f5f0'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw grid (subtle)
        ctx.strokeStyle = 'rgba(0,0,0,0.05)'
        ctx.lineWidth = 1
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                const iso = toIso(x, y)
                ctx.beginPath()
                ctx.moveTo(iso.x, iso.y)
                ctx.lineTo(iso.x + 32 * zoom, iso.y + 16 * zoom)
                ctx.lineTo(iso.x, iso.y + 32 * zoom)
                ctx.lineTo(iso.x - 32 * zoom, iso.y + 16 * zoom)
                ctx.closePath()
                ctx.stroke()
            }
        }

        // Draw districts and buildings
        DISTRICTS.forEach(district => {
            const isSelected = selectedDistrict === district.id
            const isHovered = hoveredDistrict === district.id

            district.buildings.forEach(building => {
                const iso = toIso(building.x, building.y)

                // Building base (isometric cube)
                const w = building.width * 32 * zoom
                const h = building.height * 32 * zoom
                const d = building.depth * 20 * zoom

                // Top face
                ctx.fillStyle = district.color
                ctx.beginPath()
                ctx.moveTo(iso.x, iso.y - d)
                ctx.lineTo(iso.x + w / 2, iso.y - d + h / 4)
                ctx.lineTo(iso.x, iso.y - d + h / 2)
                ctx.lineTo(iso.x - w / 2, iso.y - d + h / 4)
                ctx.closePath()
                ctx.fill()

                // Left face (darker)
                ctx.fillStyle = adjustBrightness(district.color, -20)
                ctx.beginPath()
                ctx.moveTo(iso.x - w / 2, iso.y - d + h / 4)
                ctx.lineTo(iso.x - w / 2, iso.y + h / 4)
                ctx.lineTo(iso.x, iso.y + h / 2)
                ctx.lineTo(iso.x, iso.y - d + h / 2)
                ctx.closePath()
                ctx.fill()

                // Right face (lighter)
                ctx.fillStyle = adjustBrightness(district.color, -10)
                ctx.beginPath()
                ctx.moveTo(iso.x + w / 2, iso.y - d + h / 4)
                ctx.lineTo(iso.x + w / 2, iso.y + h / 4)
                ctx.lineTo(iso.x, iso.y + h / 2)
                ctx.lineTo(iso.x, iso.y - d + h / 2)
                ctx.closePath()
                ctx.fill()

                // Outline
                ctx.strokeStyle = isSelected || isHovered ? '#1a1a1a' : 'rgba(0,0,0,0.3)'
                ctx.lineWidth = isSelected || isHovered ? 2 : 1
                ctx.beginPath()
                ctx.moveTo(iso.x, iso.y - d)
                ctx.lineTo(iso.x + w / 2, iso.y - d + h / 4)
                ctx.lineTo(iso.x + w / 2, iso.y + h / 4)
                ctx.lineTo(iso.x, iso.y + h / 2)
                ctx.lineTo(iso.x - w / 2, iso.y + h / 4)
                ctx.lineTo(iso.x - w / 2, iso.y - d + h / 4)
                ctx.lineTo(iso.x, iso.y - d)
                ctx.stroke()
            })
        })
    }, [toIso, selectedDistrict, hoveredDistrict])

    // Render on mount and when dependencies change
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = canvas.clientWidth * window.devicePixelRatio
        canvas.height = canvas.clientHeight * window.devicePixelRatio
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }

        // Center the view
        setOffset({ x: canvas.clientWidth / 2, y: 100 })

        drawCity()
    }, [drawCity])

    // Mouse handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)))
    }

    return (
        <div className="relative w-full h-full"
            style={{
                backgroundImage: 'url(/textures/eden-marble.png)',
                backgroundSize: 'cover',
            }}
        >
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
            />

            {/* Legend */}
            <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-sm border border-[#1a1a1a]/20 p-6 max-w-sm">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Stakeholder Ecosystem</h3>

                <div className="space-y-2 mb-6">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-3 text-sm">
                            <span style={{ color: config.color }} className="text-xl">{config.symbol}</span>
                            <span className="text-[#666]">{config.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    {DISTRICTS.map(district => {
                        const status = STATUS_CONFIG[district.status]
                        return (
                            <motion.div
                                key={district.id}
                                className="flex items-center gap-3 text-sm cursor-pointer p-2 rounded hover:bg-black/5"
                                onMouseEnter={() => setHoveredDistrict(district.id)}
                                onMouseLeave={() => setHoveredDistrict(null)}
                                onClick={() => setSelectedDistrict(district.id === selectedDistrict ? null : district.id)}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: district.color }} />
                                <span className="text-[#1a1a1a]  flex-1">{district.name}</span>
                                <span style={{ color: status.color }}>{status.symbol}</span>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-[#e2e2e2] text-xs text-[#999]">
                    <p>Scroll to zoom • Drag to pan</p>
                </div>
            </div>

            {/* Selected District Info */}
            {selectedDistrict && (
                <motion.div
                    className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm border border-[#1a1a1a]/20 p-6 max-w-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {(() => {
                        const district = DISTRICTS.find(d => d.id === selectedDistrict)
                        if (!district) return null

                        return (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-[#1a1a1a]">{district.name}</h3>
                                    <button
                                        onClick={() => setSelectedDistrict(null)}
                                        className="text-[#666] hover:text-[#1a1a1a]"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {district.buildings.map(building => (
                                        <div key={building.id} className="border-l-2 pl-3" style={{ borderColor: district.color }}>
                                            <div className="text-sm font-bold text-[#1a1a1a]">{building.name}</div>
                                            <div className="text-xs text-[#666] capitalize">{building.type.replace('_', '/')}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
                                    <div className="text-xs text-[#999] uppercase tracking-wider mb-1">Status</div>
                                    <div className="text-sm text-[#1a1a1a]" style={{ color: STATUS_CONFIG[district.status].color }}>
                                        {STATUS_CONFIG[district.status].label}
                                    </div>
                                </div>
                            </>
                        )
                    })()}
                </motion.div>
            )}
        </div>
    )
}

// Helper function
function adjustBrightness(color: string, amount: number): string {
    const hex = color.replace('#', '')
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
