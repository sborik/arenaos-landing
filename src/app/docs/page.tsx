'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef } from 'react'

import { motion } from 'framer-motion'

const ProductVisionScene = dynamic(
    () => import('@/components/scenes/ProductVisionScene').then(mod => ({ default: mod.ProductVisionScene })),
    { ssr: false, loading: () => <div className="fixed inset-0 bg-[#05070c]" /> }
)

function Section({ title, body }: { title: string; body: string }) {
    return (
        <section className="bg-[#0b0f15]/80 border border-[#111827] rounded-2xl p-6 text-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <h2 className="text-xl font-semibold text-cyan-200 mb-3">{title}</h2>
            <p className="text-gray-300 leading-relaxed">{body}</p>
        </section>
    )
}

export default function DocsPage() {
    return (
        <main className="min-h-[200vh] bg-[#05070c] text-white">
            <ProductVisionScene mode="docs" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-20">
                <header className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-sm uppercase tracking-[0.4em] text-green-400 font-bold">The Ecosystem Stack</p>
                        <h1 className="text-6xl font-black text-white mt-2">Technology</h1>
                    </motion.div>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        arenaOS is an open platform for mixed-reality robot competitions.
                        It abstracts the complexity of physical hardware, allowing developers to focus on strategy, gameplay, and broadcast.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    <Section
                        title="arenaForge"
                        body="CAD/BOM specifications for high-stakes robotics. Standardized for FOC (Field Oriented Control) Brushless drive-trains, vector-thrust flight modules, and sub-millisecond hardware watchdogs."
                    />
                    <Section
                        title="arenaSim"
                        body="The Digital Twin for Embodied AI. A high-fidelity physics environment where agents train via Reinforcement Learning to master complex maneuvers—like Smash Melee-level dash dancing—before meatspace deployment."
                    />
                    <Section
                        title="arenaHub"
                        body="The global orchestration engine funneling the output of educational giants (Karpathy/3B1B tier) into competitive leagues. Manages neural-link pilot authentication and global ELO rankings."
                    />
                    <Section
                        title="arenaCast"
                        body="The production layer for physical esports. Delivers 1st-person FPV VR streams with haptic telemetry to pilots, and cinematic AR overlays to millions of spectators."
                    />
                </div>

                <section className="bg-black/40 border border-green-900/30 rounded-3xl p-10 font-mono text-sm">
                    <h3 className="text-green-400 mb-6 font-bold text-lg uppercase tracking-wider">The Precision Pipeline</h3>
                    <div className="space-y-2 text-gray-400">
                        <p className="text-white">Pilot (VR + Haptics) ──▶ Low Latency gRPC Control Channel</p>
                        <div className="pl-8 border-l border-green-900/50 py-4 space-y-2">
                            <p>├──▶ Sub-1ms Control Loop (FOC Motor Precision)</p>
                            <p>├──▶ Haptic Telemetry Feedback (Impact & Friction Sensing)</p>
                            <p>└──▶ Vector-Thrust Stabilization (Jetpack/Aero Dynamics)</p>
                        </div>
                        <p className="text-white">World State ──▶ Digital Twin Mirror ──▶ Global Broadcast Feed</p>
                    </div>
                </section>

                <section className="pt-20 border-t border-white/10">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Technical Status</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500" />
                                    <div className="text-sm">
                                        <p className="font-bold text-gray-200">77+ Subsystems Built</p>
                                        <p className="text-gray-400">Desktop main services and session server routing is complete.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500" />
                                    <div className="text-sm">
                                        <p className="font-bold text-gray-200">274 Tests Passing</p>
                                        <p className="text-gray-400">Validated unit and integration coverage for the entire mission pipeline.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="text-sm">
                                        <p className="font-bold text-gray-200">Gap: Hardware Ingest</p>
                                        <p className="text-gray-400">Funding needed for ROS2/AprilTag adapters and motor control safety envelopes.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Repository</h3>
                            <p className="text-gray-400 mb-6 font-mono text-sm leading-relaxed">
                                /Users/stev/Dev/stateroom/arenaos-landing
                                <br />
                                branch: main
                            </p>
                            <a
                                href="https://github.com/sborik/stateroom"
                                target="_blank"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all font-mono"
                            >
                                <span>git checkout</span> arenaos-v1
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
