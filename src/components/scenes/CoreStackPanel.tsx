
export default function CoreStackPanel() {
    return (
        <div className="flex flex-col h-full">
            {/* Minimal Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>arenaOS Core</h2>
                <p className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>
                    Physical Esports Control Plane
                </p>
            </div>

            {/* Core Pillars */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">

                {/* Safety Envelope */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Safety Envelope</h3>
                    <div className="pl-3.5">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                            Runtime safety for robots in competition: speed limits, motor temperature monitoring, battery thresholds, and geofenced play areas.
                        </p>
                    </div>
                </div>

                {/* Education & Learning */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Education & Learning</h3>
                    <div className="pl-3.5">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                            Private skill assessment from student interactions. Educators see learning patterns and progression, not raw data. Badge-gated curriculum unlocks advanced modules.
                        </p>
                    </div>
                </div>

                {/* Telemetry & Broadcast */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Telemetry & Broadcast</h3>
                    <div className="pl-3.5">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                            Live robot state capture for spectators and operators. Battery, position, and motor health feed directly into broadcast overlays and match replay systems.
                        </p>
                    </div>
                </div>

                {/* Competition Engine */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Competition Engine</h3>
                    <div className="pl-3.5">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                            Match orchestration, scoring rules, and referee tooling. Standard protocols so any arena can host official league matches.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
