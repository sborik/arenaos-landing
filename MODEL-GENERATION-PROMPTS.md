# Model Generation Prompts

Use these prompts with Meshy.ai, Tripo3D, or similar text-to-3D tools to generate models for the arenaOS landing page.

**Important:** Upload a Smash Bros character render as reference image for each archetype.

---

## Robots

### Speedster Robot (Fast/Aggressive)
**Reference image:** Fox McCloud Smash Bros render

```
Small combat mech robot standing upright, humanoid proportions, 
two legs with armored feet, slim athletic body frame,
Fox McCloud inspired design, pointed ear-like antenna on head,
visor face with glowing eyes, sleek angular armor plates,
ready-to-fight stance, fists clenched, leaning forward aggressively,
low-poly stylized, solid gray metal with blue accent lights,
video game character style, 30cm tall miniature robot warrior
```

### Brawler Robot (Heavy/Tank)
**Reference image:** Bowser Smash Bros render

```
Small combat mech robot standing upright, humanoid proportions,
two thick legs, bulky heavy armored body frame,
Bowser inspired design, spiked shell-like back armor,
intimidating horned head, glowing red eyes, heavy fists,
powerful stance with arms ready to punch, wide shoulders,
low-poly stylized, solid gray metal with red accent lights,
video game boss character style, 35cm tall miniature robot warrior
```

### Tactician Robot (Support/Utility)
**Reference image:** Palutena Smash Bros render

```
Small combat mech robot standing upright, humanoid proportions,
two elegant legs, slim graceful body frame,
Palutena inspired design, halo-like ring above head,
staff weapon in one hand, flowing cape-like back panels,
elegant floating pose, one arm extended casting,
low-poly stylized, solid gray metal with green accent lights,
video game magic character style, 30cm tall miniature robot warrior
```

### Fighter Robot (Balanced/All-rounder)
**Reference image:** Captain Falcon Smash Bros render

```
Small combat mech robot standing upright, humanoid proportions,
two athletic legs, muscular heroic body frame,
Captain Falcon inspired design, helmet with pointed visor,
scarf-like neck piece, racing suit styled armor,
dynamic fighting pose, one fist pulled back ready to punch,
low-poly stylized, solid gray metal with orange accent lights,
video game action hero style, 30cm tall miniature robot warrior
```

### Generic Arena Robot
**No reference needed**

```
Small combat mech robot standing upright on two legs,
humanoid proportions like an action figure, armored body,
round head with visor, simple arms with fist hands,
neutral standing pose, feet planted shoulder width apart,
low-poly stylized video game character, solid gray color,
cute but tough looking, 30cm tall miniature battle robot,
no wheels, bipedal standing robot warrior
```

---

## Arena Elements

### Circular Arena Platform
```
Circular floating platform, 3 meter diameter, sci-fi esports arena,
glowing cyan/teal edge ring, dark metallic surface with subtle grid lines,
center marker circle, slightly raised edge lip,
clean geometric design, tournament arena aesthetic,
low-poly style, dramatic lighting ready
```

### Arena Platform with Barriers
```
Circular arena platform, obstacles and cover elements,
two or three low walls/pillars for tactical gameplay,
glowing edge boundary, dark surface with grid pattern,
esports competition arena design, balanced layout,
low-poly style, 3 meter diameter
```

### Rectangular MOBA-style Arena
```
Rectangular arena platform, 4m x 3m, lane markings visible,
two base zones at opposite ends, jungle area in center,
objective capture point in middle, glowing boundaries,
League of Legends inspired layout, low-poly style,
dark metallic surface, team color zones (blue/red)
```

---

## Environment/Venue

### Esports Venue Interior
```
Small esports arena interior, tiered seating for 200-500 people,
central circular stage/arena floor, big LED screens on walls,
dramatic overhead lighting, haze/atmosphere effect,
low-poly crowd as simple colored shapes,
modern esports venue architecture, dark ambient lighting,
screens glowing, professional tournament venue feel
```

### Broadcast Production Desk
```
Esports caster desk setup, two chairs side by side,
multiple monitors on desk (3-5 screens), mixing board,
professional streaming equipment aesthetic,
dark ambient environment, monitors glowing,
over-the-shoulder camera angle composition,
low-poly style, no brand logos, generic broadcast desk
```

### VR Cockpit Frame
```
First-person VR cockpit interface frame, HUD elements around edges,
transparent center for gameplay view, health bar top left,
minimap bottom right, cooldown indicators bottom center,
sci-fi pilot interface aesthetic, holographic display style,
frame only (center is transparent), blue accent lighting
```

---

## Effects/UI Elements

### Holographic Health Bar
```
Floating holographic health bar, rectangular shape,
team color (blue or red) fill indicator,
slight glow effect, transparent background,
sci-fi UI element, approximately 20cm wide when scaled,
game HUD aesthetic, minimalist design
```

### Damage Percentage Display
```
Floating damage counter display, large numbers,
team colored glow (blue or red), 
Smash Bros style percentage indicator,
holographic/transparent effect, bold font style,
approximately 15cm tall when scaled
```

### Ability Cooldown Ring
```
Circular cooldown indicator, ring shape,
radial fill animation ready, team colored,
holographic glow effect, sci-fi UI style,
approximately 10cm diameter when scaled,
thin ring with segment markers
```

---

## Character Shells (Silhouettes)

These go on top of the robot base to evoke game characters without being them:

### Fighter Archetype (Smash-style)
```
Low-poly humanoid shell/armor piece, standing pose,
generic fighter silhouette, fists raised,
no specific character features, just archetype shape,
designed to mount on robot chassis, hollow interior,
approximately 20cm tall, bold simple shapes
```

### Mage/Caster Archetype
```
Low-poly humanoid shell/armor piece, casting pose,
robed silhouette with staff/wand shape,
no specific character features, just archetype shape,
designed to mount on robot chassis, hollow interior,
approximately 20cm tall, flowing shapes
```

### Tank/Warrior Archetype
```
Low-poly humanoid shell/armor piece, defensive stance,
bulky armored silhouette with shield shape,
no specific character features, just archetype shape,
designed to mount on robot chassis, hollow interior,
approximately 22cm tall, heavy blocky shapes
```

### Speedster/Assassin Archetype
```
Low-poly humanoid shell/armor piece, dynamic running pose,
sleek agile silhouette, forward lean,
no specific character features, just archetype shape,
designed to mount on robot chassis, hollow interior,
approximately 18cm tall, sharp angular shapes
```

---

## Tips for Best Results

1. **Add "low-poly" or "stylized"** - This helps avoid overly detailed models that won't fit the aesthetic

2. **Specify "no textures, solid colors"** - Easier to apply materials in Three.js/Blender

3. **Include scale reference** - "approximately 30cm" helps with proportions

4. **Use "game-ready mesh"** - Optimizes for real-time rendering

5. **Avoid brand names** - Don't say "League of Legends style", say "MOBA arena style"

6. **Request .glb or .obj export** - These work best with React Three Fiber

---

## After Generation

1. Download as .glb (preferred) or .obj
2. Place in `/public/models/` directory
3. Update component imports to use `useGLTF('/models/your-model.glb')`
4. Apply team color materials in the component code

---

## Placeholder Alternative

If AI generation isn't working well, the `PlaceholderRobot` component creates decent procedural robots using basic geometries. These can be used while iterating on AI-generated models.
