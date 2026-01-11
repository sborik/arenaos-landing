'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Home as HomeIcon, Cpu, Gamepad2, DollarSign, Package, Moon, Sun, Github } from 'lucide-react'
import { IconHouse, IconMicrochip, IconGamepad, IconDollar, IconLampLight, IconLampDark, IconGithub } from '@/components/icons/NucleoIcons'
import MarbleBOM from '@/components/TerminalBOM'
import { SUMO_BOM, SCHOOL_BOM, AERIAL_BOM, TOURNAMENT_BOM } from './boms'
import CoreStackPanel from '@/components/scenes/CoreStackPanel'
import MusicPlayer from '@/components/MusicPlayer'

const GAME_MODES = [
    { genre: 'Fighting (Sumo)', examples: 'Street Fighter, Tekken', cables: 'No', cost: '$6k', tier: 'Tier 1' },
    { genre: 'Fighting (Aerial)', examples: 'Smash Bros, Rivals', cables: 'Yes', cost: '$7.5k', tier: 'Tier 2' },
    { genre: 'FPS (Tactical)', examples: 'Valorant, CS:GO', cables: 'No', cost: '$6k', tier: 'Tier 1' },
    { genre: 'MOBA', examples: 'League, Dota 2', cables: 'No', cost: '$6k', tier: 'Tier 3' },
]

const TECH_SPECS = [
    { label: 'Platform', value: 'ToddlerBot (30 DoF, $6k)' },
    { label: 'Control', value: 'Quest VR teleoperation' },
    { label: 'Latency', value: '<20ms (direct motor)' },
    { label: 'Safety', value: 'Magnetic bumpers + breakaway joints' },
]

const TODDLERBOT_STATS = [
    { label: 'Robot Cost', value: '<$6,000', detail: '90% motors + compute' },
    { label: 'Degrees of Freedom', value: '30 DoF', detail: 'Full loco-manipulation' },
    { label: 'Build Time', value: '3 days', detail: 'Non-expert assembly' },
    { label: 'Repair Time', value: '35 min', detail: '21min print + 14min build' },
    { label: 'Onboard Compute', value: '2.5 TFLOPS', detail: 'Jetson Orin NX' },
    { label: 'Manipulation Success', value: '90%', detail: '60 demos, 20 trials' },
    { label: 'Sim-to-Real', value: 'Zero-shot', detail: 'High-fidelity digital twin' },
    { label: 'Policy Transfer', value: 'Cross-instance', detail: 'Standardized competition' },
]

const TIERS = [
    { tier: '0', name: 'Validation', funding: '$12.5k', time: '2-3 months', output: '2 bots, sumo demo' },
    { tier: '1', name: 'Prototype', funding: '$100k', time: '6 months', output: '10 bots, 3 schools' },
    { tier: '2', name: 'Early Stage', funding: '$1M', time: '12 months', output: '50 bots, cable rigs' },
    { tier: '3', name: 'Series A', funding: '$5M', time: '18 months', output: 'Regional leagues' },
]

const POC_BOM = [
    { item: 'ToddlerBot #1', spec: '30 DoF humanoid', cost: '$6,000' },
    { item: 'ToddlerBot #2', spec: '30 DoF humanoid', cost: '$6,000' },
    { item: 'Arena Mat', spec: '2m × 2m foam', cost: '$50' },
    { item: 'Tracking Camera', spec: 'USB 1080p', cost: '$50' },
    { item: 'Arena Computer', spec: 'Raspberry Pi 5', cost: '$100' },
    { item: 'AprilTags', spec: 'Position markers', cost: '$10' },
    { item: 'Misc', spec: 'Wiring, mounts', cost: '$240' },
]

export default function Home() {
    const [activeBOMTier, setActiveBOMTier] = useState(0)
    const [darkMode, setDarkMode] = useState(true)
    const [scrollProgress, setScrollProgress] = useState(0)
    const scrollRef = useRef<HTMLElement>(null)

    // Scroll to section within the horizontal scroll container
    const scrollToSection = (sectionId: string) => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return
        const section = document.getElementById(sectionId)
        if (!section) return

        // Calculate horizontal position of the section within the scroll container
        const containerRect = scrollEl.getBoundingClientRect()
        const sectionRect = section.getBoundingClientRect()
        const scrollLeft = scrollEl.scrollLeft + (sectionRect.left - containerRect.left) - 32 // 32px padding

        scrollEl.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme-mode', darkMode ? 'dark' : 'light')
    }, [darkMode])

    useEffect(() => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return

        const handleScroll = () => {
            const scrollLeft = scrollEl.scrollLeft
            const scrollWidth = scrollEl.scrollWidth - scrollEl.clientWidth
            const progress = scrollLeft / scrollWidth
            setScrollProgress(progress)
        }

        scrollEl.addEventListener('scroll', handleScroll)
        return () => scrollEl.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="relative flex h-screen flex-col overflow-hidden"
            style={{
                backgroundImage: 'var(--marble-bg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>

            {/* Outer container with padding for shell frame */}
            <div className="relative mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col p-4 lg:p-6">

                {/* Unified shell frame container */}
                <div className="relative flex min-h-0 flex-1 flex-col">

                    {/* === TOP SHELL (Marble bar) === */}
                    <div className="shell-top relative z-20 flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6">
                        {/* Left: arenaOS Logo - positioned absolutely to not affect navbar width */}
                        <div className="absolute -left-2 lg:left-0 top-1/2 -translate-y-1/2 z-10">
                            <img
                                src={darkMode ? "/textures/black-logo-arenaos.png" : "/textures/white-logo-arenaos.png"}
                                alt="arenaOS"
                                className="h-[108px] lg:h-[162px] w-auto"
                                style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))' }}
                            />
                        </div>

                        {/* Center: Brand - 3D Text Logo */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <img
                                src={darkMode ? "/textures/arena-os-text-dark.png" : "/textures/arena-os-text.png"}
                                alt="arenaOS"
                                className="h-12 lg:h-32 w-auto"
                                style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))' }}
                            />
                        </div>

                        {/* Right: GitHub + Theme Toggle */}
                        <div className="ml-auto flex items-center gap-3">
                            <a href="https://github.com/sborik/arenaOS"
                                target="_blank"
                                className="p-2 rounded-full border hover:opacity-70 transition"
                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                                <IconGithub size="20px" style={{ color: 'var(--color-muted)' }} />
                            </a>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-full border transition hover:opacity-70"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-muted)'
                                }}>
                                {darkMode ? <IconLampLight size="20px" /> : <IconLampDark size="20px" />}
                            </button>
                        </div>
                    </div>

                    {/* === MIDDLE SECTION: Left Sidebar + Carbon Content === */}
                    <div className="relative flex min-h-0 flex-1">

                        {/* === LEFT SIDEBAR (Marble) === */}
                        <aside className="shell-left hidden w-[180px] shrink-0 flex-col gap-4 overflow-auto p-5 pt-10 lg:flex"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
                                style={{ color: 'var(--color-muted)' }}>
                                NAVIGATION
                            </div>
                            <nav className="space-y-1 text-sm">
                                <button
                                    onClick={() => scrollToSection('hero')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-[var(--glass-bg)] hover:backdrop-blur-sm text-left"
                                    style={{ color: 'var(--color-muted)' }}>
                                    <IconHouse size="20px" />
                                    <span>Overview</span>
                                </button>
                                <button
                                    onClick={() => scrollToSection('foundation')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-[var(--glass-bg)] hover:backdrop-blur-sm text-left"
                                    style={{ color: 'var(--color-muted)' }}>
                                    <IconMicrochip size="20px" />
                                    <span>ToddlerBot</span>
                                </button>
                                <button
                                    onClick={() => scrollToSection('modes')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-[var(--glass-bg)] hover:backdrop-blur-sm text-left"
                                    style={{ color: 'var(--color-muted)' }}>
                                    <IconGamepad size="20px" />
                                    <span>Game Modes</span>
                                </button>
                                <button
                                    onClick={() => scrollToSection('poc')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-[var(--glass-bg)] hover:backdrop-blur-sm text-left"
                                    style={{ color: 'var(--color-muted)' }}>
                                    <IconMicrochip size="20px" />
                                    <span>Proof of Concept</span>
                                </button>
                                <button
                                    onClick={() => scrollToSection('tiers')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-[var(--glass-bg)] hover:backdrop-blur-sm text-left"
                                    style={{ color: 'var(--color-muted)' }}>
                                    <IconDollar size="20px" />
                                    <span>Funding Tiers</span>
                                </button>
                            </nav>
                        </aside>

                        {/* === CARBON CONTENT AREA === */}
                        <main ref={scrollRef} className="carbon-content relative flex-1 min-h-0 overflow-y-auto lg:overflow-y-hidden lg:overflow-x-auto scroll-smooth lg:snap-x lg:snap-mandatory"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                marginRight: '-200px',
                                paddingRight: '200px',
                                scrollPaddingLeft: '32px',
                                WebkitOverflowScrolling: 'touch'
                            } as any}>

                            {/* Left edge fade overlay - only visible when scrolled */}
                            {scrollProgress > 0.02 && (
                                <div
                                    className="hidden lg:block absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(to right, var(--color-bg) 0%, transparent 100%)',
                                        borderRadius: '24px 0 0 24px',
                                        opacity: Math.min(1, scrollProgress * 10)
                                    }}
                                />
                            )}

                            <div className="relative z-10 flex flex-col lg:flex-row h-auto lg:h-full p-4 lg:p-0 gap-4 lg:gap-0">

                                {/* MERGED HERO & SPECS PANEL */}
                                <motion.section
                                    id="hero"
                                    className="glass-card p-6 lg:p-8 flex-shrink-0 lg:snap-start overflow-y-auto w-full lg:w-[600px] lg:ml-8 lg:ml-8"
                                    style={{
                                        height: 'auto',
                                        minHeight: 'auto',
                                        margin: '0 lg:2rem'
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}>

                                    {/* Vision Section */}
                                    <div className="mb-12">
                                        <h2 className="text-xl lg:text-2xl font-bold mb-4 uppercase tracking-wide"
                                            style={{ color: 'var(--color-text)' }}>
                                            Mixed-Reality Robot Esports
                                        </h2>
                                        <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'var(--color-text)' }}>
                                            A vision for a new platform layer for robot esports. Existing games translated to physical robot competition—or new ones built native to the platform. An open ecosystem where students build, educators teach, and sponsors invest. A new education-to-economy pipeline.
                                        </p>
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="border-t pt-8" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-lg font-bold mb-6 uppercase tracking-wide"
                                            style={{ color: 'var(--color-text)' }}>
                                            Technical Specifications
                                        </h3>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                                            {TECH_SPECS.map((spec, i) => (
                                                <div key={i} className="border-l-2 pl-4"
                                                    style={{ borderColor: 'var(--color-accent)' }}>
                                                    <div className="text-xs uppercase tracking-wider mb-1"
                                                        style={{ color: 'var(--color-muted)' }}>
                                                        {spec.label}
                                                    </div>
                                                    <div className="text-sm font-mono font-medium"
                                                        style={{ color: 'var(--color-text)' }}>
                                                        {spec.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.section>

                                {/* TODDLERBOT FOUNDATION */}
                                <motion.section
                                    id="foundation"
                                    className="glass-card p-6 lg:p-8 flex-shrink-0 lg:snap-start overflow-y-auto w-full lg:w-[600px] lg:ml-8"
                                    style={{ height: 'auto', margin: '0' }}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}>
                                    <h2 className="text-xl font-bold mb-2 uppercase tracking-wide"
                                        style={{ color: 'var(--color-text)' }}>
                                        Built on ToddlerBot
                                    </h2>
                                    <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
                                        Open-source humanoid platform from Stanford
                                    </p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {TODDLERBOT_STATS.map((stat, i) => (
                                            <div key={i} className="border-l-2 pl-3 py-1"
                                                style={{ borderColor: 'var(--color-accent)' }}>
                                                <div className="text-lg font-mono font-bold"
                                                    style={{ color: 'var(--color-text)' }}>
                                                    {stat.value}
                                                </div>
                                                <div className="text-xs uppercase tracking-wider"
                                                    style={{ color: 'var(--color-muted)' }}>
                                                    {stat.label}
                                                </div>
                                                <div className="text-xs mt-0.5"
                                                    style={{ color: 'var(--color-muted)', opacity: 0.7 }}>
                                                    {stat.detail}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Academic Papers */}
                                    <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-sm font-bold mb-4 uppercase tracking-wider"
                                            style={{ color: 'var(--color-text)' }}>
                                            Research Foundation
                                        </h3>
                                        <div className="space-y-3">
                                            <a href="https://arxiv.org/abs/2502.00893"
                                                target="_blank"
                                                className="block p-3 rounded border hover:opacity-80 transition"
                                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                                                <div className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                                                    ToddlerBot (2025)
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                                    Open-Source ML-Compatible Humanoid Platform for Loco-Manipulation
                                                </div>
                                                <div className="text-xs mt-1 font-mono" style={{ color: 'var(--color-accent)' }}>
                                                    arXiv:2502.00893
                                                </div>
                                            </a>
                                            <a href="https://arxiv.org/abs/2601.03607"
                                                target="_blank"
                                                className="block p-3 rounded border hover:opacity-80 transition"
                                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                                                <div className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                                                    Locomotion Beyond Feet (2026)
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                                    Multi-skill whole-body locomotion system
                                                </div>
                                                <div className="text-xs mt-1 font-mono" style={{ color: 'var(--color-accent)' }}>
                                                    arXiv:2601.03607
                                                </div>
                                            </a>
                                        </div>
                                        <div className="mt-4 text-xs" style={{ color: 'var(--color-muted)' }}>
                                            Funded by NSF • Stanford HAI • Stanford Wu Tsai Human Performance Alliance
                                        </div>
                                    </div>
                                </motion.section>

                                {/* GAME MODES */}
                                <motion.section
                                    id="modes"
                                    className="glass-card p-6 lg:p-8 flex-shrink-0 lg:snap-start overflow-y-auto w-full lg:w-[600px] lg:ml-8"
                                    style={{ height: 'auto', margin: '0' }}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}>
                                    <h2 className="text-xl font-bold mb-6 uppercase tracking-wide"
                                        style={{ color: 'var(--color-text)' }}>
                                        Supported Game Modes
                                    </h2>
                                    <div className="space-y-5">
                                        {GAME_MODES.map((mode, i) => (
                                            <div key={i} className="border-l-2 pl-6 py-2"
                                                style={{ borderColor: 'var(--color-accent)' }}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold"
                                                        style={{ color: 'var(--color-text)' }}>
                                                        {mode.genre}
                                                    </h3>
                                                    <div className="text-xs uppercase tracking-wider"
                                                        style={{ color: 'var(--color-muted)' }}>
                                                        {mode.tier}
                                                    </div>
                                                </div>
                                                <div className="text-sm mb-3"
                                                    style={{ color: 'var(--color-muted)' }}>
                                                    {mode.examples}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-xs">
                                                    <div>
                                                        <span className="uppercase tracking-wider block mb-1"
                                                            style={{ color: 'var(--color-muted)' }}>
                                                            Cables
                                                        </span>
                                                        <span style={{ color: 'var(--color-text)' }}>
                                                            {mode.cables}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="uppercase tracking-wider block mb-1"
                                                            style={{ color: 'var(--color-muted)' }}>
                                                            Cost/Bot
                                                        </span>
                                                        <span style={{ color: 'var(--color-accent)' }} className="font-mono font-bold">
                                                            {mode.cost}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>

                                {/* CORE STACK ARCHITECTURE */}
                                <motion.section
                                    className="glass-card p-6 lg:p-8 flex-shrink-0 lg:snap-start overflow-y-auto w-full lg:w-[600px] lg:ml-8"
                                    style={{ height: 'auto', margin: '0' }}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <CoreStackPanel />
                                </motion.section>

                                {/* PROOF OF CONCEPT */}
                                <motion.section
                                    id="poc"
                                    className="glass-card p-6 lg:p-8 flex-shrink-0 lg:snap-start overflow-y-auto w-full lg:w-[600px] lg:ml-8" style={{ height: 'auto', margin: '0' }}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}>
                                    <h2 className="text-xl font-bold mb-6 uppercase tracking-wide"
                                        style={{ color: 'var(--color-text)' }}>
                                        Phase 1 Proof of Concept
                                    </h2>

                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold mb-4"
                                            style={{ color: 'var(--color-text)' }}>
                                            $12,500 Validation
                                        </h3>
                                        <p style={{ color: 'var(--color-muted)' }} className="mb-6">
                                            Two ToddlerBots in sumo ring-out. Prove robots survive competition.
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {POC_BOM.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center border-b pb-3"
                                                style={{ borderColor: 'var(--color-border)' }}>
                                                <div>
                                                    <div className="text-sm font-bold"
                                                        style={{ color: 'var(--color-text)' }}>
                                                        {item.item}
                                                    </div>
                                                    <div className="text-xs"
                                                        style={{ color: 'var(--color-muted)' }}>
                                                        {item.spec}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold font-mono"
                                                    style={{ color: 'var(--color-accent)' }}>
                                                    {item.cost}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-3">
                                            <div className="text-lg font-bold"
                                                style={{ color: 'var(--color-text)' }}>
                                                TOTAL
                                            </div>
                                            <div className="text-lg font-bold font-mono"
                                                style={{ color: 'var(--color-accent)' }}>
                                                $12,450
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8 pb-8 border-t pt-8"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="text-xs uppercase tracking-wider mb-2"
                                            style={{ color: 'var(--color-muted)' }}>
                                            Deliverable
                                        </div>
                                        <div className="text-sm"
                                            style={{ color: 'var(--color-text)' }}>
                                            60-second demo video of adversarial robot competition
                                        </div>
                                    </div>

                                    <div className="border-t pt-8"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="text-xs uppercase tracking-wider mb-4"
                                            style={{ color: 'var(--color-muted)' }}>
                                            Full BOMs (3e8 Blueprint)
                                        </div>

                                        {/* BOM Tier Tabs */}
                                        <div className="flex gap-2 mb-6 border-b pb-2"
                                            style={{ borderColor: 'var(--color-border)' }}>
                                            {['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'].map((tier, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveBOMTier(idx)}
                                                    className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                                                    style={{
                                                        backgroundColor: activeBOMTier === idx ? 'var(--color-accent)' : 'transparent',
                                                        color: activeBOMTier === idx ? 'white' : 'var(--color-muted)',
                                                        border: `1px solid ${activeBOMTier === idx ? 'var(--color-accent)' : 'var(--color-border)'}`
                                                    }}>
                                                    {tier}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tier 0 BOM */}
                                        {activeBOMTier === 0 && (
                                            <MarbleBOM
                                                title="Tier 0: Validation Arena"
                                                tier="0"
                                                budget="$12,500"
                                                items={SUMO_BOM}
                                                total={SUMO_BOM.reduce((acc, item) => acc + item.totalCost, 0)}
                                                correctedTotal={337}
                                                notes={[
                                                    "3e8 Blueprint estimate was excellent - only minor price adjustments needed",
                                                    "Add $12,000 for 2 ToddlerBot kits (from Stanford replication guide)",
                                                    "Grand total with robots: $12,337 + 10% contingency = $12,460"
                                                ]}
                                            />
                                        )}

                                        {/* Tier 1 BOM */}
                                        {activeBOMTier === 1 && (
                                            <MarbleBOM
                                                title="Tier 1: School Robot Arena Kit"
                                                tier="1"
                                                budget="$100k (with bots)"
                                                items={SCHOOL_BOM}
                                                total={SCHOOL_BOM.reduce((acc, item) => acc + item.totalCost, 0)}
                                                correctedTotal={5000}
                                                notes={[
                                                    "Self-contained portable kit for schools",
                                                    "Targeting sub-$5k per arena to allow budget for 10-12 robots per kit",
                                                    "Includes extensive LED and scoreboard elements for esports feel"
                                                ]}
                                            />
                                        )}

                                        {/* Tier 2 BOM */}
                                        {activeBOMTier === 2 && (
                                            <MarbleBOM
                                                title="Tier 2: Aerial Robot Suspension System"
                                                tier="2"
                                                budget="$1M (50 bots)"
                                                items={AERIAL_BOM}
                                                total={AERIAL_BOM.reduce((acc, item) => acc + item.totalCost, 0)}
                                                correctedTotal={45000}
                                                notes={[
                                                    "High-torque cable system for full aerial combat",
                                                    "Industrial motion control (Mesa/LinuxCNC) for <20ms latency",
                                                    "Safety critical: Breakaway connectors and high-strength Dyneema"
                                                ]}
                                            />
                                        )}

                                        {/* Tier 3 BOM */}
                                        {activeBOMTier === 3 && (
                                            <MarbleBOM
                                                title="Tier 3: Portable Tournament Arena System"
                                                tier="3"
                                                budget="$5M (Regional Leagues)"
                                                items={TOURNAMENT_BOM}
                                                total={TOURNAMENT_BOM.reduce((acc, item) => acc + item.totalCost, 0)}
                                                correctedTotal={65000}
                                                notes={[
                                                    "Full broadcast production capability (4K/60fps)",
                                                    "Modular bleachers and soundproofing for live audience",
                                                    "Redundant power and fiber networking for reliability"
                                                ]}
                                            />
                                        )}
                                    </div>
                                </motion.section>

                                {/* FUNDING TIERS */}
                                <motion.section
                                    id="tiers"
                                    className="glass-card p-6 lg:p-8 flex-shrink-0 lg:snap-start overflow-y-auto w-full lg:w-[600px] lg:ml-8"
                                    style={{ height: 'auto', margin: '0' }}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}>
                                    <h2 className="text-xl font-bold mb-6 uppercase tracking-wide"
                                        style={{ color: 'var(--color-text)' }}>
                                        Funding Tiers
                                    </h2>
                                    <div className="space-y-4">
                                        {TIERS.map((t, i) => (
                                            <div key={i}
                                                className="border rounded-xl p-6 transition-colors hover:border-[var(--color-accent)]"
                                                style={{
                                                    borderColor: 'var(--color-border)',
                                                    backgroundColor: 'var(--color-surface)'
                                                }}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="text-3xl font-bold font-mono"
                                                        style={{ color: 'var(--color-accent)' }}>
                                                        {t.tier}
                                                    </div>
                                                    <div className="text-xs uppercase tracking-wider"
                                                        style={{ color: 'var(--color-muted)' }}>
                                                        {t.funding} / {t.time}
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold mb-2"
                                                    style={{ color: 'var(--color-text)' }}>
                                                    {t.name}
                                                </div>
                                                <div className="text-sm"
                                                    style={{ color: 'var(--color-text)' }}>
                                                    {t.output}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>

                                {/* SPACER to ensure last panel is fully viewable */}
                                <div className="flex-shrink-0" style={{ width: '200px', height: '1px' }} />

                            </div>
                        </main>

                    </div>

                    {/* === BOTTOM SHELL (Marble bar) === */}
                    <div className="shell-bottom relative z-20 flex items-center justify-center px-8 py-4">

                        {/* Scroll Navigation - Desktop only */}
                        <div className="hidden lg:flex gap-4 items-center">
                            {/* Left Arrow */}
                            <button
                                onClick={() => {
                                    if (scrollRef.current) {
                                        // Card width (600px) + left margin (32px)
                                        const panelWidth = 600 + 32;
                                        const currentScroll = scrollRef.current.scrollLeft;
                                        // Calculate which panel we're on and go to the previous one
                                        const currentPanel = Math.round(currentScroll / panelWidth);
                                        const targetPanel = Math.max(0, currentPanel - 1);
                                        scrollRef.current.scrollTo({
                                            left: targetPanel * panelWidth,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                disabled={scrollProgress < 0.05}
                                className="px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-30"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    cursor: scrollProgress < 0.05 ? 'not-allowed' : 'pointer'
                                }}>
                                ← Prev
                            </button>

                            {/* Progress Bar */}
                            <div className="flex-1 h-2 rounded-full overflow-hidden"
                                style={{ backgroundColor: 'var(--color-border)', maxWidth: '200px' }}>
                                <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                        width: `${scrollProgress * 100}%`,
                                        backgroundColor: 'var(--color-accent)'
                                    }}
                                />
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => {
                                    if (scrollRef.current) {
                                        // Card width (600px) + left margin (32px)
                                        const panelWidth = 600 + 32;
                                        const currentScroll = scrollRef.current.scrollLeft;
                                        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                                        // Calculate which panel we're on and go to the next one
                                        const currentPanel = Math.round(currentScroll / panelWidth);
                                        const targetPanel = currentPanel + 1;
                                        const targetScroll = Math.min(maxScroll, targetPanel * panelWidth);
                                        scrollRef.current.scrollTo({
                                            left: targetScroll,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                disabled={scrollProgress > 0.95}
                                className="px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-30"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    cursor: scrollProgress > 0.95 ? 'not-allowed' : 'pointer'
                                }}>
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Software Architecture Modal */}
            {/* Removed in favor of CoreStackPanel */}

            {/* Custom Music Player */}
            <MusicPlayer darkMode={darkMode} />
        </div>
    )
}
