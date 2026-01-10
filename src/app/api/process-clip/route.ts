import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { url, name } = await request.json()
    
    if (!url || !name) {
      return NextResponse.json({ error: 'Missing url or name' }, { status: 400 })
    }
    
    // Sanitize name for filesystem
    const safeName = name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    
    const scriptPath = path.join(process.cwd(), 'scripts', 'process-clip.sh')
    
    // Run the processing script
    const { stdout, stderr } = await execAsync(
      `bash "${scriptPath}" "${url}" "${safeName}"`,
      { 
        cwd: process.cwd(),
        timeout: 300000 // 5 minute timeout
      }
    )
    
    return NextResponse.json({ 
      success: true, 
      name: safeName,
      output: stdout,
      basePath: `/processed/${safeName}`
    })
    
  } catch (error: unknown) {
    const err = error as { message?: string; stderr?: string }
    console.error('Processing error:', err)
    return NextResponse.json({ 
      error: err.message || 'Processing failed',
      details: err.stderr 
    }, { status: 500 })
  }
}
