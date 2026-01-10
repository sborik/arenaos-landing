import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const execMock = vi.hoisted(() =>
  vi.fn((command: string, options?: unknown, callback?: (...args: any[]) => void) => {
    const cb = typeof options === 'function' ? options : callback
    cb?.(null, { stdout: 'ok', stderr: '' })
  })
)

vi.mock('child_process', () => ({
  __esModule: true,
  exec: execMock,
  default: { exec: execMock },
}))

// Import the handler after mocks are in place
import { POST } from '../../src/app/api/process-clip/route'

const buildRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/process-clip', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

afterEach(() => {
  vi.clearAllMocks()
  execMock.mockImplementation((command: string, options?: unknown, callback?: (...args: any[]) => void) => {
    const cb = typeof options === 'function' ? options : callback
    cb?.(null, { stdout: 'ok', stderr: '' })
  })
})

describe('POST /api/process-clip', () => {
  it('returns 400 when url or name is missing', async () => {
    const res = await POST(buildRequest({ name: 'test' }))
    const payload = await res.json()

    expect(res.status).toBe(400)
    expect(payload.error).toContain('Missing url or name')
    expect(execMock).not.toHaveBeenCalled()
  })

  it('sanitizes name and calls the processing script', async () => {
    const res = await POST(buildRequest({ url: 'https://youtube.com/watch?v=abc', name: 'My Clip!' }))
    const payload = await res.json()

    expect(res.status).toBe(200)
    expect(payload).toMatchObject({
      success: true,
      name: 'my-clip-',
      basePath: '/processed/my-clip-',
    })

    expect(execMock).toHaveBeenCalledTimes(1)
    const [command] = execMock.mock.calls[0]
    expect(command).toContain('process-clip.sh')
    expect(command).toContain('my-clip-')
  })

  it('returns 500 when the processing script fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    execMock.mockImplementationOnce((command: string, options?: unknown, callback?: (...args: any[]) => void) => {
      const cb = typeof options === 'function' ? options : callback
      const error = Object.assign(new Error('boom'), { stderr: 'fail' })
      cb?.(error)
    })

    const res = await POST(buildRequest({ url: 'https://youtube.com/watch?v=abc', name: 'bad clip' }))
    const payload = await res.json()

    expect(res.status).toBe(500)
    expect(payload.error).toContain('boom')
    expect(payload.details).toBe('fail')

    consoleSpy.mockRestore()
  })
})
