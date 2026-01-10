import { ArenaConfig } from './arena'

const cameraPathStandard: ArenaConfig['cameraPath'] = [
    { position: [0, 2.4, 4], target: [0, 0.6, 0], duration: 3.5 },
    { position: [-2, 1.6, 2], target: [0, 0.8, -0.5], duration: 3.5 },
    { position: [2.2, 1.8, 2.5], target: [0, 0.7, 0], duration: 3.5 },
]

export const scenePresets: { id: string; label: string; config: ArenaConfig }[] = [
    {
        id: 'cinematic_slowmo',
        label: 'Cinematic Slow-Mo',
        config: {
            clipName: 'sample-clip',
            screenSize: { width: 3, height: 1.7 },
            wireframeOverlay: true,
            characters: [
                {
                    name: 'Jhin',
                    position: [-1.4, 0.35, 0.6],
                    color: '#4fd1c5',
                    modelPath: '/models/jhin/shan_hai_scrolls_jhin.glb',
                    sequence: ['Spell4_Idle'],
                    sequenceDuration: 6.0,
                    holdPose: true,
                    wireframe: true,
                },
                {
                    name: 'Lee Sin',
                    position: [0.4, 0.3, 0.9],
                    color: '#fbbf24',
                    modelPath: '/models/lee_sin/dragon_fist_lee_sin.glb',
                    sequence: ['Spell3'],
                    sequenceDuration: 6.0,
                    holdPose: true,
                    wireframe: true,
                },
                {
                    name: 'Ahri',
                    position: [1.6, 0.35, -0.2],
                    color: '#a78bfa',
                    modelPath: '/models/ahri/midnight_ahri.glb',
                    sequence: ['Spell4'],
                    sequenceDuration: 6.0,
                    holdPose: true,
                    wireframe: true,
                },
                {
                    name: 'Jarvan',
                    position: [0, 0.32, -0.6],
                    color: '#f97316',
                    modelPath: '/models/jarvan/ssg_jarvan_iv.glb',
                    sequence: ['Spell3'],
                    sequenceDuration: 6.0,
                    holdPose: true,
                    wireframe: true,
                },
            ],
            cameraPath: [
                { position: [-2.8, 2.0, 3.6], target: [-0.8, 0.8, 0.5], duration: 4.2 },
                { position: [0.5, 1.6, 3.0], target: [0.5, 0.8, 0.9], duration: 3.6 },
                { position: [2.8, 1.8, 3.2], target: [1.4, 0.8, -0.2], duration: 3.8 },
                { position: [0, 2.0, 3.8], target: [0, 0.8, -0.1], duration: 4.0 },
            ],
        },
    },
    {
        id: 'trio_spells',
        label: 'LoL Trio (Jhin/Lee/Ahri)',
        config: {
            clipName: 'sample-clip',
            screenSize: { width: 3, height: 1.7 },
            characters: [
                {
                    name: 'Jhin',
                    position: [-1.6, 0.2, 0],
                    color: '#4fd1c5',
                    modelPath: '/models/jhin/shan_hai_scrolls_jhin.glb',
                    sequence: ['Spell4', 'Spell4_Idle', 'Spell2', 'Spell1'],
                    sequenceDuration: 4.0,
                },
                {
                    name: 'Lee Sin',
                    position: [0, 0.2, 0],
                    color: '#fbbf24',
                    modelPath: '/models/lee_sin/dragon_fist_lee_sin.glb',
                    sequence: ['Spell3', 'Spell2', 'Spell1_B', 'Attack2'],
                    sequenceDuration: 3.8,
                },
                {
                    name: 'Ahri',
                    position: [1.6, 0.2, 0],
                    color: '#a78bfa',
                    modelPath: '/models/ahri/midnight_ahri.glb',
                    sequence: ['Spell4', 'Spell2', 'Spell1', 'Attack1'],
                    sequenceDuration: 3.8,
                },
            ],
            cameraPath: [
                { position: [0, 2.0, 6], target: [0, 0.7, 0], duration: 6 },
            ],
        },
    },
    {
        id: 'jarvan_combo',
        label: 'Jarvan Engage',
        config: {
            clipName: 'sample-clip',
            screenSize: { width: 3, height: 1.7 },
            characters: [
                {
                    name: 'Jarvan',
                    position: [0, 0.3, 0],
                    color: '#f97316',
                    modelPath: '/models/jarvan/ssg_jarvan_iv.glb',
                    sequence: ['Spell3', 'Spell1', 'Spell4', 'Spell2'],
                    sequenceDuration: 2.6,
                },
                {
                    name: 'Lee Sin',
                    position: [1.5, 0.3, 0.5],
                    color: '#fbbf24',
                    modelPath: '/models/lee_sin/dragon_fist_lee_sin.glb',
                    sequence: ['Spell3', 'Spell1', 'Spell4'],
                    sequenceDuration: 2.2,
                },
                {
                    name: 'Jhin',
                    position: [-1.5, 0.3, 0.5],
                    color: '#4fd1c5',
                    modelPath: '/models/jhin/shan_hai_scrolls_jhin.glb',
                    sequence: ['Spell4', 'Spell2', 'Spell1'],
                    sequenceDuration: 2.6,
                },
            ],
            cameraPath: [
                { position: [0, 2.1, 3.2], target: [0, 0.6, 0], duration: 3.2 },
                { position: [-2.2, 1.6, 1.6], target: [0, 0.8, 0], duration: 3.2 },
                { position: [2.2, 1.7, 1.8], target: [0, 0.7, 0], duration: 3.2 },
            ],
        },
    },
    {
        id: 'quad_showcase',
        label: 'LoL Quad Squad',
        config: {
            clipName: 'sample-clip',
            screenSize: { width: 3, height: 1.7 },
            characters: [
                {
                    name: 'Jhin',
                    position: [-1.4, 0.3, 0.6],
                    color: '#4fd1c5',
                    modelPath: '/models/jhin/shan_hai_scrolls_jhin.glb',
                    sequence: ['Spell4', 'Spell1'],
                    sequenceDuration: 2.4,
                },
                {
                    name: 'Lee Sin',
                    position: [0.4, 0.3, 0.8],
                    color: '#fbbf24',
                    modelPath: '/models/lee_sin/dragon_fist_lee_sin.glb',
                    sequence: ['Spell3', 'Spell4'],
                    sequenceDuration: 2.2,
                },
                {
                    name: 'Ahri',
                    position: [1.6, 0.3, -0.2],
                    color: '#a78bfa',
                    modelPath: '/models/ahri/midnight_ahri.glb',
                    sequence: ['Spell4', 'Spell2'],
                    sequenceDuration: 2.2,
                },
                {
                    name: 'Jarvan',
                    position: [-0.6, 0.3, -0.4],
                    color: '#f97316',
                    modelPath: '/models/jarvan/ssg_jarvan_iv.glb',
                    sequence: ['Spell3', 'Spell1', 'Spell4'],
                    sequenceDuration: 2.5,
                },
            ],
            cameraPath: cameraPathStandard,
        },
    },
]

export function getArenaConfig(sceneId: string | null | undefined, clipName: string | null | undefined): ArenaConfig {
    const preset = scenePresets.find((s) => s.id === sceneId) || scenePresets[0]
    return {
        ...preset.config,
        clipName: clipName || preset.config.clipName,
    }
}
