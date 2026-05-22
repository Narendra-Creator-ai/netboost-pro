import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { url } = req.body
  const apiKey = process.env.VIRUSTOTAL_API_KEY

  if (!url || !apiKey) {
    return res.status(400).json({ error: 'Missing url or VIRUSTOTAL_API_KEY environment variable' })
  }

  try {
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    // VirusTotal uses SHA-256 hash of URL as identifier
    const encoder = new TextEncoder()
    const data = encoder.encode(normalizedUrl)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const urlId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Try to get URL report
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      method: 'GET',
      headers: {
        'x-apikey': apiKey,
      },
    })

    if (response.ok) {
      const data = await response.json()
      const stats = data.data.attributes.last_analysis_stats || {
        malicious: 0,
        suspicious: 0,
        undetected: 0,
        harmless: 0,
      }
      return res.status(200).json({
        success: true,
        url: normalizedUrl,
        stats,
        status: 'completed',
      })
    }

    // If not found, submit for scanning
    if (response.status === 404) {
      const formData = new URLSearchParams()
      formData.append('url', normalizedUrl)

      const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
        },
        body: formData,
      })

      if (submitResponse.ok) {
        return res.status(200).json({
          success: true,
          url: normalizedUrl,
          stats: { malicious: 0, suspicious: 0, undetected: 0, harmless: 0 },
          status: 'pending',
          message: 'URL submitted for scanning. Scan in progress...',
        })
      }
      
      const errorText = await submitResponse.text()
      return res.status(400).json({ error: `Failed to submit URL: ${errorText}` })
    }

    const errorText = await response.text()
    return res.status(400).json({ error: `API returned ${response.status}: ${errorText}` })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ 
      error: 'Failed to scan URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
