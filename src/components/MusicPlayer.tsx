'use client'

import { useState, useRef, useEffect } from 'react'

interface MusicPlayerProps {
    darkMode: boolean
}

export default function MusicPlayer({ darkMode }: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60)
        const secs = Math.floor(time % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div
            className="fixed bottom-3 right-3 z-50 rounded-xl overflow-hidden"
            style={{
                backgroundImage: `url(${darkMode ? '/textures/eden-marble-dark.png' : '/textures/eden-marble.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '5px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
            }}>

            <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                style={{
                    backgroundColor: darkMode ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)'
                }}>

                {/* Album Art */}
                <img
                    src="/textures/to-the-arena-cover.jpg"
                    alt="To the Arena"
                    className="w-10 h-10 rounded-md object-cover"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                />

                {/* Track Info & Controls */}
                <div className="flex flex-col min-w-0">
                    <div className="text-xs font-medium truncate"
                        style={{ color: darkMode ? '#fff' : '#000', maxWidth: '120px' }}>
                        to-the-arena!
                    </div>
                    <div className="text-[10px] truncate"
                        style={{ color: darkMode ? '#aaa' : '#666' }}>
                        A-RAM
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono" style={{ color: darkMode ? '#888' : '#666' }}>
                        {formatTime(currentTime)}
                    </span>
                    <div
                        className="w-12 h-1 rounded-full overflow-hidden cursor-pointer"
                        style={{ backgroundColor: darkMode ? '#444' : '#ddd' }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const x = e.clientX - rect.left
                            const percent = x / rect.width
                            if (audioRef.current) {
                                audioRef.current.currentTime = percent * duration
                            }
                        }}>
                        <div
                            className="h-full transition-all"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: '#1DB954'
                            }}
                        />
                    </div>
                </div>

                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-105"
                    style={{
                        backgroundColor: '#1DB954',
                        color: '#000'
                    }}>
                    {isPlaying ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Spotify Link */}
                <a
                    href="https://open.spotify.com/track/1T4lPfwh8KfUL5shueHil4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition"
                    title="Listen on Spotify">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                </a>
            </div>

            <audio ref={audioRef} src="/textures/to-the-arena-mastered.wav" preload="metadata" loop />
        </div>
    )
}
