'use client'

import { useState, useEffect } from 'react'

interface Clip {
  id: string
  title: string
  url: string
  thumbnail: string
  duration: string
  views: string
  channel: string
  uploadDate: string
  game: string
  searchQuery: string
}

const GAME_COLORS: Record<string, string> = {
  'Smash Bros Melee': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Smash Bros Ultimate': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Smash Bros': 'bg-red-500/20 text-red-400 border-red-500/30',
  'League of Legends': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'WoW Arena': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export default function CuratorPage() {
  const [clips, setClips] = useState<Clip[]>([])
  const [selectedClips, setSelectedClips] = useState<Set<string>>(new Set())
  const [filterGame, setFilterGame] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [processedClips, setProcessedClips] = useState<string[]>([])

  useEffect(() => {
    fetch('/clips-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Run the search script first: npx ts-node scripts/search-clips.ts')
        return res.json()
      })
      .then(data => {
        setClips(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedClips(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredClips = filterGame === 'all' 
    ? clips 
    : clips.filter(c => c.game === filterGame)

  const games = [...new Set(clips.map(c => c.game))]

  const copyDownloadCommands = () => {
    const selected = clips.filter(c => selectedClips.has(c.id))
    const commands = selected.map(c => 
      `yt-dlp "${c.url}" -o "public/clips/${c.game.replace(/\s+/g, '-').toLowerCase()}-${c.id}.%(ext)s" --format "best[height<=720]"`
    ).join('\n')
    
    navigator.clipboard.writeText(commands)
    alert(`Copied ${selected.length} download commands to clipboard!\n\nPaste into terminal to download.`)
  }

  const processClip = async (clip: Clip) => {
    const name = `${clip.game.replace(/\s+/g, '-').toLowerCase()}-${clip.id}`
    setProcessing(clip.id)
    
    try {
      const res = await fetch('/api/process-clip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: clip.url, name })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setProcessedClips(prev => [...prev, clip.id])
        alert(`Processed! View at: /preview?clip=${data.name}`)
      } else {
        alert(`Error: ${data.error}\n${data.details || ''}`)
      }
    } catch (err) {
      alert(`Failed to process: ${err}`)
    } finally {
      setProcessing(null)
    }
  }

  const processAllSelected = async () => {
    const selected = clips.filter(c => selectedClips.has(c.id))
    for (const clip of selected) {
      await processClip(clip)
    }
  }

  const exportSelected = () => {
    const selected = clips.filter(c => selectedClips.has(c.id))
    const json = JSON.stringify(selected, null, 2)
    navigator.clipboard.writeText(json)
    alert(`Copied ${selected.length} selected clips as JSON!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading clips...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">Error loading clips</div>
          <div className="text-gray-400 mb-6">{error}</div>
          <code className="block bg-gray-900 p-4 rounded text-sm text-left">
            npx ts-node scripts/search-clips.ts
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clip Curator</h1>
            <p className="text-gray-400 text-sm">
              {filteredClips.length} clips • {selectedClips.size} selected
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Game filter */}
            <select
              value={filterGame}
              onChange={e => setFilterGame(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Games</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
            
            {/* Actions */}
            {selectedClips.size > 0 && (
              <>
                <button
                  onClick={exportSelected}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                >
                  Export JSON
                </button>
                <button
                  onClick={copyDownloadCommands}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                >
                  Copy Download Commands
                </button>
                <button
                  onClick={processAllSelected}
                  disabled={processing !== null}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded text-sm font-medium"
                >
                  {processing ? 'Processing...' : `Process ${selectedClips.size} Clips`}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Clips grid */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClips.map(clip => (
            <div
              key={clip.id}
              onClick={() => toggleSelect(clip.id)}
              className={`
                relative rounded-lg overflow-hidden cursor-pointer transition-all
                border-2 ${selectedClips.has(clip.id) 
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30' 
                  : 'border-gray-800 hover:border-gray-600'}
              `}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs">
                  {clip.duration}
                </div>
                {selectedClips.has(clip.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="p-3 bg-gray-900">
                <h3 className="font-medium text-sm line-clamp-2 mb-2" title={clip.title}>
                  {clip.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{clip.views}</span>
                  <span className={`px-2 py-0.5 rounded border ${GAME_COLORS[clip.game] || 'bg-gray-800'}`}>
                    {clip.game}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{clip.channel}</div>
              </div>
              
              {/* Preview link */}
              <a
                href={clip.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="absolute top-2 left-2 bg-black/80 hover:bg-black px-2 py-1 rounded text-xs"
              >
                Preview ↗
              </a>
              
              {/* Process button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  processClip(clip)
                }}
                disabled={processing === clip.id}
                className={`absolute bottom-12 right-2 px-2 py-1 rounded text-xs font-medium transition-all
                  ${processedClips.includes(clip.id) 
                    ? 'bg-green-600 text-white' 
                    : processing === clip.id
                    ? 'bg-yellow-600 text-black animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
              >
                {processedClips.includes(clip.id) 
                  ? '✓ Processed' 
                  : processing === clip.id 
                  ? 'Processing...' 
                  : 'Process →'}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Selected clips summary */}
      {selectedClips.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">Selected:</span>
              {clips.filter(c => selectedClips.has(c.id)).map(clip => (
                <div
                  key={clip.id}
                  className="flex items-center gap-2 bg-gray-800 rounded px-2 py-1 text-sm whitespace-nowrap"
                >
                  <img src={clip.thumbnail} className="w-8 h-5 object-cover rounded" />
                  <span className="max-w-[150px] truncate">{clip.title}</span>
                  <button
                    onClick={() => toggleSelect(clip.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
