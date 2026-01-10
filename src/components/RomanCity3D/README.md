# arenaOS 3D Roman City

## Overview

An elite, photorealistic 3D Roman city built with Three.js and React Three Fiber. Each district represents a category of stakeholders in the arenaOS ecosystem, rendered with historically accurate architecture and dramatic lighting.

## Architecture

### Districts

1. **Forum of Computation** (Center)
   - 48 Doric columns in peristyle
   - Central fountain
   - 2 temple buildings (compute providers)
   - Marble plaza floor

2. **Basilica of Vision** (East)
   - 50m long hall with barrel vault
   - 24 interior columns
   - Semicircular apse
   - Purple glow (exploring status)

3. **Colosseum of Games** (South)
   - Elliptical amphitheater (100m × 80m)
   - 4 stories of arched facades
   - Arena floor with tiered seating
   - Torch ring lighting (interested status)

4. **Academy of Learning** (North)
   - Library building with blue-glazed roof
   - 6 Ionic columns in portico
   - Scholarly lighting

5. **Pantheon of Research** (Northwest)
   - 40m diameter domed rotunda
   - Oculus with dramatic sunbeam
   - 8 Corinthian columns
   - Purple interior glow (exploring)

6. **Workshop Quarter** (Southwest)
   - 4 brick warehouses
   - Chimney with smoke
   - Forge glow (orange)

### Environment

- **Tiber River**: Diagonal watercourse with stone banks
- **Via (Roads)**: Stone-paved roads connecting districts
- **Gardens**: 20 cypress trees scattered throughout
- **Bridges**: 3 arched stone bridges over river
- **Atmosphere**: Golden hour lighting, volumetric fog

## Technical Details

### Stack

- **Three.js**: WebGL 3D rendering
- **React Three Fiber**: React integration
- **@react-three/drei**: Helper components (OrbitControls, Sky, Environment)
- **Framer Motion**: UI animations

### Performance

- **Target**: 60fps on M1+ MacBooks, 30fps on older machines
- **Optimizations**:
  - Shadow maps: 4096×4096
  - Instanced geometries for repeated elements
  - Frustum culling (automatic)
  - LOD-ready architecture

### Rendering Features

- **PBR Materials**: Physically-based rendering with roughness/metalness
- **Dynamic Shadows**: Real-time shadow casting from sun
- **Volumetric Lighting**: Sunbeam through Pantheon oculus
- **Status Indicators**: Color-coded particle systems and glows
- **Atmospheric Fog**: Distance-based depth cue

## File Structure

```
src/components/RomanCity3D/
├── Scene.tsx                    # Main scene component
├── geometry/
│   ├── RomanGeometry.ts         # Columns, pediments, fountains, temples
│   ├── Districts.ts             # Basilica, Colosseum, Academy, Pantheon, Workshop
│   └── Environment.ts           # River, roads, gardens, bridges
├── districts/
│   ├── Forum.tsx                # Forum component with interactivity
│   ├── Basilica.tsx             # Basilica component
│   ├── Colosseum.tsx            # Colosseum component
│   └── OtherDistricts.tsx       # Academy, Pantheon, Workshop
└── __tests__/
    ├── RomanGeometry.test.ts    # Geometry unit tests
    ├── Districts.test.ts        # District tests
    └── Environment.test.ts      # Environment tests
```

## Usage

### Basic

```tsx
import RomanCity3D from '@/components/RomanCity3D/Scene'

export default function Page() {
  return (
    <div className="w-full h-screen">
      <RomanCity3D />
    </div>
  )
}
```

### With SSR Protection

```tsx
import dynamic from 'next/dynamic'

const RomanCity3D = dynamic(() => import('@/components/RomanCity3D/Scene'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})
```

## Interactivity

### Mouse Controls

- **Left Drag**: Orbit camera around city
- **Scroll**: Zoom in/out
- **Click District**: Show info panel with details
- **Hover District**: Highlight with status-colored glow

### Status System

Districts have 4 status levels:
- **Proposed** (□, gray): White particle sparkles
- **Interested** (○, gold): Gold torches/flames
- **Exploring** (◐, purple): Purple interior glow
- **Partnered** (●, green): Green laurel wreath (future)

## Development

### Adding a New District

1. Create geometry function in `geometry/Districts.ts`:
```typescript
export function createMyDistrict(width: number, height: number) {
  const group = new THREE.Group()
  // ... build geometry
  return group
}
```

2. Create component in `districts/MyDistrict.tsx`:
```typescript
export function MyDistrict({ position, onClick, status, isHovered }) {
  return (
    <group position={position} onClick={onClick}>
      <primitive object={createMyDistrict(30, 15)} />
      {/* Add status-specific lighting */}
    </group>
  )
}
```

3. Add to `Scene.tsx`:
```typescript
import { MyDistrict } from './districts/MyDistrict'

// In DISTRICTS array:
{
  id: 'my-district',
  name: 'My District Name',
  buildings: ['Building 1', 'Building 2'],
  status: 'proposed',
  position: [x, y, z]
}

// In render:
<MyDistrict
  position={DISTRICTS[6].position}
  onClick={...}
  status={DISTRICTS[6].status}
  isHovered={hoveredDistrict === 'my-district'}
/>
```

### Running Tests

```bash
npm test
```

## Procedural Geometry Details

### Doric Column

- **Base**: 3-tier plinth (5% of height)
- **Shaft**: Fluted cylinder with entasis (85% of height)
  - 20 flutes
  - Narrower at top (0.9× diameter)
- **Capital**: Echinus + abacus (10% of height)

### Pediment

- Triangular extrusion
- Bevel for depth
- Typically terracotta color

### Fountain

- Circular basin (marble)
- Water layer (transparent blue)
- Central pedestal

### Temple

- Platform/stylobate
- 6 prostyle columns
- Entablature (horizontal beam)
- Triangular pediment
- Cella (inner chamber)
- Pyramidal roof

## Materials

All materials use PBR (Physically-Based Rendering):

```typescript
{
  color: 0xf5f5f0,      // Base albedo
  roughness: 0.8,        // Surface roughness (0 = mirror, 1 = matte)
  metalness: 0.1,        // Metallic property (0 = dielectric, 1 = metal)
  emissive: 0x000000,    // Self-illumination color
  emissiveIntensity: 0   // Glow strength
}
```

### Color Palette

- **Marble (white)**: `0xf5f5f0`
- **Travertine (cream)**: `0xe8d5c4`
- **Terracotta (roof)**: `0xd4a574`
- **Brick (red)**: `0xc85a54`
- **Water (blue)**: `0x4a7aaa`
- **Bronze (patina)**: `0x8b7355`

##Performance Budget

| Element | Triangles | Draw Calls |
|---------|-----------|------------|
| Forum | 50k | 5 |
| Basilica | 80k | 8 |
| Colosseum | 120k | 12 |
| Academy | 40k | 4 |
| Pantheon | 60k | 6 |
| Workshop | 30k | 3 |
| Environment | 40k | 10 |
| **Total** | **420k** | **48** |

## Future Enhancements

- [ ] Water shader with reflections and ripples
- [ ] Coffers in Pantheon dome
- [ ] Animated flags and banners
- [ ] Night mode (torch-lit city)
- [ ] Cinematic camera paths
- [ ] VR mode (WebXR)
- [ ] Audio (ambient city sounds)
- [ ] People/crowds (animated sprites)
- [ ] Seasonal variations (weather, foliage)

## Credits

- **Architecture**: Based on classical Roman proportions
- **Lighting**: Inspired by Mediterranean golden hour
- **Tech**: Three.js, React Three Fiber, Next.js

## License

Part of the arenaOS project.
