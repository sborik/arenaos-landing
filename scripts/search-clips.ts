#!/usr/bin/env npx ts-node

/**
 * YouTube Clip Search Script
 * 
 * Searches for esports clips using yt-dlp and outputs JSON for the curator UI.
 * 
 * Usage: npx ts-node scripts/search-clips.ts
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export interface ClipResult {
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

// Search queries for different games
export const SEARCH_QUERIES = [
  // Smash Bros
  { query: 'smash bros melee tournament highlight', game: 'Smash Bros Melee', maxResults: 10 },
  { query: 'smash ultimate combo compilation', game: 'Smash Bros Ultimate', maxResults: 10 },
  { query: 'evo smash finals best moments', game: 'Smash Bros', maxResults: 5 },
  
  // League of Legends
  { query: 'league of legends worlds best plays', game: 'League of Legends', maxResults: 10 },
  { query: 'lol faker outplay highlight', game: 'League of Legends', maxResults: 5 },
  { query: 'league pro play teamfight', game: 'League of Legends', maxResults: 5 },
  
  // WoW Arena
  { query: 'wow arena tournament 3v3', game: 'WoW Arena', maxResults: 10 },
  { query: 'world of warcraft pvp highlight', game: 'WoW Arena', maxResults: 5 },
  { query: 'wow arena world championship', game: 'WoW Arena', maxResults: 5 },
]

function searchYouTube(query: string, maxResults: number): string {
  try {
    // Use yt-dlp to search YouTube and get JSON output
    const cmd = `yt-dlp "ytsearch${maxResults}:${query}" --dump-json --flat-playlist --no-download 2>/dev/null`
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    })
    return output
  } catch (error) {
    console.error(`Error searching for: ${query}`)
    return ''
  }
}

export function parseResults(jsonLines: string, game: string, searchQuery: string): ClipResult[] {
  const results: ClipResult[] = []
  
  const lines = jsonLines.trim().split('\n').filter(line => line.trim())
  
  for (const line of lines) {
    try {
      const data = JSON.parse(line)
      
      // Skip live streams and very long videos (>15 min)
      const duration = data.duration || 0
      if (duration > 900 || data.is_live) continue
      
      results.push({
        id: data.id,
        title: data.title || 'Untitled',
        url: `https://www.youtube.com/watch?v=${data.id}`,
        thumbnail: data.thumbnail || `https://img.youtube.com/vi/${data.id}/mqdefault.jpg`,
        duration: formatDuration(duration),
        views: formatViews(data.view_count),
        channel: data.channel || data.uploader || 'Unknown',
        uploadDate: data.upload_date || '',
        game,
        searchQuery
      })
    } catch (e) {
      // Skip malformed JSON lines
    }
  }
  
  return results
}

export function formatDuration(seconds: number): string {
  if (!seconds) return '?:??'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatViews(views: number | undefined): string {
  if (!views) return '? views'
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
  return `${views} views`
}

async function main() {
  console.log('🔍 Searching for esports clips...\n')
  
  const allResults: ClipResult[] = []
  
  for (const { query, game, maxResults } of SEARCH_QUERIES) {
    console.log(`  Searching: "${query}"`)
    const output = searchYouTube(query, maxResults)
    const results = parseResults(output, game, query)
    allResults.push(...results)
    console.log(`    Found ${results.length} clips`)
  }
  
  // Deduplicate by video ID
  const seen = new Set<string>()
  const uniqueResults = allResults.filter(clip => {
    if (seen.has(clip.id)) return false
    seen.add(clip.id)
    return true
  })
  
  // Sort by views (most popular first)
  uniqueResults.sort((a, b) => {
    const aViews = parseFloat(a.views) || 0
    const bViews = parseFloat(b.views) || 0
    return bViews - aViews
  })
  
  // Save to JSON file
  const outputPath = join(__dirname, '..', 'public', 'clips-data.json')
  writeFileSync(outputPath, JSON.stringify(uniqueResults, null, 2))
  
  console.log(`\n✅ Found ${uniqueResults.length} unique clips`)
  console.log(`📁 Saved to: ${outputPath}`)
  console.log('\n🚀 Run `npm run dev` and go to http://localhost:3000/curator')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error)
}
