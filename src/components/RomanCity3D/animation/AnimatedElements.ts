/**
 * Animated Elements - People, Water, Flags, Smoke
 */

export class AnimatedPerson {
    public x: number
    public y: number
    public targetX: number
    public targetY: number
    public velocity = { x: 0, y: 0 }
    public frame = 0
    public color: string
    public scale: number

    constructor(x: number, y: number, color: string = '#4a3520', scale: number = 1) {
        this.x = x
        this.y = y
        this.targetX = x
        this.targetY = y
        this.color = color
        this.scale = scale
    }

    setTarget(x: number, y: number) {
        this.targetX = x
        this.targetY = y
    }

    update(deltaTime: number) {
        // Move towards target
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 1) {
            const speed = 0.3 * deltaTime
            this.velocity.x = (dx / dist) * speed
            this.velocity.y = (dy / dist) * speed

            this.x += this.velocity.x
            this.y += this.velocity.y

            this.frame = (this.frame + 0.1 * deltaTime) % 4
        } else {
            // Reached target, pick new random target
            this.targetX = this.x + (Math.random() - 0.5) * 20
            this.targetY = this.y + (Math.random() - 0.5) * 20
        }
    }

    draw(ctx: CanvasRenderingContext2D, isoX: number, isoY: number) {
        const s = this.scale
        const walkOffset = Math.floor(this.frame) % 2 === 0 ? 1 : -1

        // Head
        ctx.fillStyle = '#f4c2a8'
        ctx.beginPath()
        ctx.arc(isoX, isoY - 6 * s, 1.5 * s, 0, Math.PI * 2)
        ctx.fill()

        // Body
        ctx.strokeStyle = this.color
        ctx.lineWidth = 1.5 * s
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(isoX, isoY - 4 * s)
        ctx.lineTo(isoX, isoY + 2 * s)
        ctx.stroke()

        // Arms
        ctx.beginPath()
        ctx.moveTo(isoX - 2 * s, isoY - 2 * s)
        ctx.lineTo(isoX + 2 * s, isoY - 2 * s)
        ctx.stroke()

        // Legs (walking animation)
        ctx.beginPath()
        ctx.moveTo(isoX, isoY + 2 * s)
        ctx.lineTo(isoX - 1.5 * s * walkOffset, isoY + 6 * s)
        ctx.moveTo(isoX, isoY + 2 * s)
        ctx.lineTo(isoX + 1.5 * s * walkOffset, isoY + 6 * s)
        ctx.stroke()
    }
}

export class WaterShimmer {
    public x: number
    public y: number
    public offset: number
    public shimmer: number = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.offset = Math.random() * Math.PI * 2
    }

    update() {
        this.shimmer = Math.sin(Date.now() * 0.002 + this.offset) * 0.3
    }

    draw(ctx: CanvasRenderingContext2D, isoX: number, isoY: number, baseColor: string) {
        const alpha = 0.5 + this.shimmer
        ctx.fillStyle = baseColor
        ctx.globalAlpha = alpha
        ctx.fillRect(isoX - 2, isoY - 1, 4, 2)
        ctx.globalAlpha = 1
    }
}

export class WavingFlag {
    public x: number
    public y: number
    public height: number
    public color: string
    public wave: number = 0

    constructor(x: number, y: number, height: number, color: string) {
        this.x = x
        this.y = y
        this.height = height
        this.color = color
    }

    update() {
        this.wave = Math.sin(Date.now() * 0.003) * 3
    }

    draw(ctx: CanvasRenderingContext2D, isoX: number, isoY: number) {
        // Pole
        ctx.strokeStyle = '#8d6e63'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(isoX, isoY)
        ctx.lineTo(isoX, isoY - this.height)
        ctx.stroke()

        // Flag (waving)
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.moveTo(isoX, isoY - this.height)
        ctx.quadraticCurveTo(
            isoX + 8 + this.wave,
            isoY - this.height + 4,
            isoX + 12,
            isoY - this.height + 8
        )
        ctx.lineTo(isoX, isoY - this.height + 8)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.stroke()
    }
}

export class SmokeParticle {
    public x: number
    public y: number
    public startY: number
    public opacity: number = 1
    public radius: number

    constructor(x: number, y: number) {
        this.x = x + (Math.random() - 0.5) * 3
        this.y = y
        this.startY = y
        this.radius = 2 + Math.random() * 2
    }

    update() {
        this.y -= 0.5
        this.opacity -= 0.01

        if (this.opacity <= 0) {
            this.reset()
        }
    }

    reset() {
        this.y = this.startY
        this.opacity = 1
        this.x = this.x + (Math.random() - 0.5) * 2
    }

    draw(ctx: CanvasRenderingContext2D, isoX: number, isoY: number) {
        ctx.fillStyle = `rgba(100, 100, 100, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(isoX, isoY, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}

export class AnimationManager {
    private people: AnimatedPerson[] = []
    private water: WaterShimmer[] = []
    private flags: WavingFlag[] = []
    private smoke: SmokeParticle[] = []
    private lastUpdate: number = Date.now()

    addPerson(x: number, y: number, color?: string, scale?: number) {
        this.people.push(new AnimatedPerson(x, y, color, scale))
    }

    addWater(x: number, y: number) {
        this.water.push(new WaterShimmer(x, y))
    }

    addFlag(x: number, y: number, height: number, color: string) {
        this.flags.push(new WavingFlag(x, y, height, color))
    }

    addSmoke(x: number, y: number) {
        for (let i = 0; i < 5; i++) {
            this.smoke.push(new SmokeParticle(x, y))
        }
    }

    update() {
        const now = Date.now()
        const deltaTime = Math.min((now - this.lastUpdate) / 16.67, 2) // Cap at 2x speed
        this.lastUpdate = now

        this.people.forEach(p => p.update(deltaTime))
        this.water.forEach(w => w.update())
        this.flags.forEach(f => f.update())
        this.smoke.forEach(s => s.update())
    }

    drawAll(
        ctx: CanvasRenderingContext2D,
        toIso: (x: number, y: number) => { x: number; y: number }
    ) {
        this.water.forEach(w => {
            const iso = toIso(w.x, w.y)
            w.draw(ctx, iso.x, iso.y, '#7fdbff')
        })

        this.people.forEach(p => {
            const iso = toIso(p.x, p.y)
            p.draw(ctx, iso.x, iso.y)
        })

        this.flags.forEach(f => {
            const iso = toIso(f.x, f.y)
            f.draw(ctx, iso.x, iso.y)
        })

        this.smoke.forEach(s => {
            const iso = toIso(s.x, s.y - (s.startY - s.y))
            s.draw(ctx, iso.x, iso.y)
        })
    }

    getPeopleCount() {
        return this.people.length
    }
}
