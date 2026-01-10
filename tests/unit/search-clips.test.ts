import { describe, expect, it } from 'vitest'

import { formatDuration, formatViews, parseResults } from '../../scripts/search-clips'

describe('formatDuration', () => {
  it('formats minutes and seconds', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(0)).toBe('?:??')
  })
})

describe('formatViews', () => {
  it('formats view counts with suffixes', () => {
    expect(formatViews(1_500_000)).toBe('1.5M views')
    expect(formatViews(1200)).toBe('1.2K views')
    expect(formatViews(undefined)).toBe('? views')
  })
})

describe('parseResults', () => {
  it('parses yt-dlp output and filters out live/long clips', () => {
    const jsonLines = [
      JSON.stringify({
        id: '1',
        title: 'Clip One',
        duration: 120,
        view_count: 1234,
        thumbnail: 'thumb1',
        channel: 'Channel One',
        upload_date: '20240101',
      }),
      JSON.stringify({ id: '2', title: 'Too Long', duration: 1200, view_count: 5000 }),
      JSON.stringify({ id: '3', title: 'Live Clip', duration: 60, is_live: true }),
      'not-json',
      JSON.stringify({ id: '4', title: 'No Meta' }),
    ].join('\n')

    const results = parseResults(jsonLines, 'League of Legends', 'lol highlights')

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({
      id: '1',
      title: 'Clip One',
      duration: '2:00',
      views: '1.2K views',
      game: 'League of Legends',
      searchQuery: 'lol highlights',
      channel: 'Channel One',
      uploadDate: '20240101',
      thumbnail: 'thumb1',
    })

    expect(results[1]).toMatchObject({
      id: '4',
      title: 'No Meta',
      duration: '?:??',
      views: '? views',
      thumbnail: 'https://img.youtube.com/vi/4/mqdefault.jpg',
    })
  })
})
