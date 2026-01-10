const { mkdirSync, writeFileSync, existsSync, readFileSync } = require('fs')
const { dirname, join } = require('path')

const SAMPLE_CLIP_NAME = 'sample-clip'
const JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAgAAAQABAAD//gAQTGF2YzYyLjExLjEwMAD/2wBDAAgEBAQEBAUFBQUFBQYGBgYGBgYGBgYGBgYHBwcICAgHBwcGBgcHCAgICAkJCQgICAgJCQoKCgwMCwsODg4RERT/xABMAAEBAAAAAAAAAAAAAAAAAAAABgEBAQAAAAAAAAAAAAAAAAAAAAEQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/wAARCAC0AUADASIAAhEAAxEA/9oADAMBAAIRAxEAPwCDARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//Z'

function writeImage(filePath) {
  const buffer = Buffer.from(JPEG_BASE64, 'base64')
  writeFileSync(filePath, buffer)
}

function seedSampleClip() {
  const processedDir = join(__dirname, '..', 'public', 'processed', SAMPLE_CLIP_NAME)
  const framesDir = join(processedDir, 'frames')
  const depthDir = join(processedDir, 'depth')

  mkdirSync(framesDir, { recursive: true })
  mkdirSync(depthDir, { recursive: true })

  for (let i = 1; i <= 3; i++) {
    const frameId = i.toString().padStart(3, '0')
    writeImage(join(framesDir, `frame_${frameId}.jpg`))
    writeImage(join(depthDir, `frame_${frameId}_depth.jpg`))
  }

  const clipsPath = join(__dirname, '..', 'public', 'clips-data.json')
  if (existsSync(clipsPath)) {
    try {
      const data = JSON.parse(readFileSync(clipsPath, 'utf-8'))
      const hasSample = data.some(c => c.id === SAMPLE_CLIP_NAME)
      if (!hasSample) {
        data.unshift({
          id: SAMPLE_CLIP_NAME,
          title: 'Sample Arena Clip (fixture)',
          url: 'https://example.com/sample-clip',
          thumbnail: `/processed/${SAMPLE_CLIP_NAME}/frames/frame_001.jpg`,
          duration: '0:03',
          views: 'Fixture',
          channel: 'Local Fixture',
          uploadDate: '',
          game: 'League of Legends',
          searchQuery: 'fixture',
        })
        writeFileSync(clipsPath, JSON.stringify(data, null, 2))
      }
    } catch {
      // If parsing fails, leave the file untouched.
    }
  }

  return SAMPLE_CLIP_NAME
}

module.exports = { seedSampleClip }

if (require.main === module) {
  seedSampleClip()
  console.log(`Seeded sample clip at /processed/${SAMPLE_CLIP_NAME}`)
}
