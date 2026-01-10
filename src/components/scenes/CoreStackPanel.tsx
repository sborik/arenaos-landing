
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

            {/* Verified Pillars - Based on Actual Code Audit */}
            <div className="flex-1 space-y-5 overflow-y-auto pr-2">

                {/* Safety Envelope */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Safety Envelope</h3>
                    <div className="pl-3.5">
                        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
                            Robot safety: speed limits, motor temps, battery, geofencing.
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <div className="px-2 py-1 rounded border text-[10px] font-mono"
                                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--color-muted)' }}>
                                safety-assertions
                            </div>
                        </div>
                    </div>
                </div>

                {/* Education & Learning Analytics */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Education & Learning Analytics</h3>
                    <div className="pl-3.5">
                        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
                            Private ingestion of student LLM conversations. Educators gain insights into learning patterns without seeing raw data. Skill progression framework with badge-gated curriculum modules.
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <div className="px-2 py-1 rounded border text-[10px] font-mono"
                                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--color-muted)' }}>
                                PATINA
                            </div>
                            <div className="px-2 py-1 rounded border text-[10px] font-mono"
                                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--color-muted)' }}>
                                Jungle Gym
                            </div>
                        </div>
                    </div>
                </div>

                {/* Telemetry & Broadcast */}
                <div className="group">
                    <h3 className="font-bold mb-2 border-l-2 border-orange-500 pl-3" style={{ color: 'var(--color-text)' }}>Telemetry & Broadcast</h3>
                    <div className="pl-3.5">
                        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
                            SQLite storage for robot telemetry (battery, motor temps, position). Robot health adapter for live dashboards and replay storage.
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <div className="px-2 py-1 rounded border text-[10px] font-mono"
                                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--color-muted)' }}>
                                Telemetry Store
                            </div>
                            <div className="px-2 py-1 rounded border text-[10px] font-mono"
                                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--color-muted)' }}>
                                Robot Adapter
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
