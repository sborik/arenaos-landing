'use client'

import { useState } from 'react'

interface BOMItem {
    name: string
    description: string
    quantity: number
    unitCost: number
    totalCost: number
    url: string
    notes?: string
}

interface BOMDisplayProps {
    title: string
    tier: string
    budget: string
    items: BOMItem[]
    total: number
    correctedTotal?: number
    notes?: string[]
}

export default function MarbleBOM({ title, tier, budget, items, total, correctedTotal, notes }: BOMDisplayProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="border rounded-xl relative p-6"
            style={{
                borderColor: 'var(--glass-border)',
                backgroundColor: 'var(--color-surface)'
            }}>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-2"
                        style={{ color: 'var(--color-muted)' }}>
                        BILL OF MATERIALS
                    </div>
                    <h3 className="text-lg mb-1" style={{ color: 'var(--color-text)' }}>
                        {title}
                    </h3>
                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
                </div>

                {/* System Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                    <div className="border-l-2 pl-3" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>
                            Tier
                        </div>
                        <div style={{ color: 'var(--color-text)' }}>{tier}</div>
                    </div>
                    <div className="border-l-2 pl-3" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>
                            Budget
                        </div>
                        <div style={{ color: 'var(--color-text)' }}>{budget}</div>
                    </div>
                    <div className="border-l-2 pl-3" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>
                            Status
                        </div>
                        <div style={{ color: 'var(--color-accent)' }}>3e8 Generated</div>
                    </div>
                    <div className="border-l-2 pl-3" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>
                            Verified
                        </div>
                        <div style={{ color: 'var(--color-accent)' }}>
                            {correctedTotal ? 'Corrected' : 'As-Is'}
                        </div>
                    </div>
                </div>

                {/* Components List */}
                <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-3"
                        style={{ color: 'var(--color-muted)' }}>
                        Components [{items.length}]
                    </div>

                    {!expanded && (
                        <div className="space-y-2">
                            {items.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-start gap-3 text-xs py-2 border-b"
                                    style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="w-4 text-right" style={{ color: 'var(--color-muted)' }}>
                                        {i + 1}.
                                    </div>
                                    <div className="flex-1" style={{ color: 'var(--color-text)' }}>
                                        {item.name}
                                    </div>
                                    <div className="font-mono" style={{ color: 'var(--color-accent)' }}>
                                        ${item.totalCost.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {items.length > 5 && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="text-xs mt-2 border-b transition-colors"
                                    style={{
                                        color: 'var(--color-accent)',
                                        borderColor: 'var(--color-accent)'
                                    }}>
                                    Show {items.length - 5} more items →
                                </button>
                            )}
                        </div>
                    )}

                    {expanded && (
                        <div className="space-y-2 max-h-96 overflow-y-auto"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}>
                            {items.map((item, i) => (
                                <div key={i} className="border rounded-lg p-3 relative"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        backgroundColor: 'rgba(var(--color-surface-rgb), 0.5)'
                                    }}>

                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                                            {item.name}
                                        </span>
                                        <span className="text-xs font-mono" style={{ color: 'var(--color-accent)' }}>
                                            ${item.totalCost.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-[10px] mb-2" style={{ color: 'var(--color-muted)' }}>
                                        {item.description}
                                    </div>
                                    <div className="flex gap-4 text-[10px]" style={{ color: 'var(--color-muted)' }}>
                                        <span>QTY: {item.quantity}</span>
                                        <span>@${item.unitCost.toFixed(2)}</span>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                                                className="border-b transition-colors"
                                                style={{
                                                    color: 'var(--color-accent)',
                                                    borderColor: 'var(--color-accent)'
                                                }}>
                                                Source →
                                            </a>
                                        )}
                                    </div>
                                    {item.notes && (
                                        <div className="text-[10px] mt-2 italic" style={{ color: '#d97706' }}>
                                            ⚠ {item.notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => setExpanded(false)}
                                className="text-xs mt-2 border-b transition-colors"
                                style={{
                                    color: 'var(--color-accent)',
                                    borderColor: 'var(--color-accent)'
                                }}>
                                ← Collapse
                            </button>
                        </div>
                    )}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                            3e8 Estimate
                        </span>
                        <span className={correctedTotal ? 'line-through' : 'font-mono font-bold'}
                            style={{ color: correctedTotal ? 'var(--color-muted)' : 'var(--color-text)' }}>
                            ${total.toLocaleString()}
                        </span>
                    </div>
                    {correctedTotal && (
                        <>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                                    Corrected Total
                                </span>
                                <span className="font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                                    ${correctedTotal.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                                <span style={{ color: 'var(--color-muted)' }}>
                                    + Contingency (20%)
                                </span>
                                <span className="font-mono" style={{ color: 'var(--color-muted)' }}>
                                    ${(correctedTotal * 0.2).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline pt-2 border-t"
                                style={{ borderColor: 'var(--color-border)' }}>
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                                    Recommended Budget
                                </span>
                                <span className="font-mono font-bold text-lg" style={{ color: 'var(--color-accent)' }}>
                                    ${(correctedTotal * 1.2).toLocaleString()}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Notes */}
                {notes && notes.length > 0 && (
                    <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="text-[10px] uppercase tracking-[0.2em] mb-2"
                            style={{ color: 'var(--color-muted)' }}>
                            Technical Notes
                        </div>
                        <div className="space-y-1">
                            {notes.map((note, i) => (
                                <div key={i} className="text-[10px] leading-relaxed"
                                    style={{ color: 'var(--color-muted)' }}>
                                    <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
                                        {i + 1}.
                                    </span> {note}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t pt-3 mt-4 text-center" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="text-[9px] uppercase tracking-[0.15em]" style={{ color: 'var(--color-muted)' }}>
                        Generated by 3e8 Blueprint
                    </div>
                </div>
            </div>
        </div>
    )
}
