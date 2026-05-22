import { useState } from 'react'
import { Shield, Search, Plus, X, BarChart3 } from 'lucide-react'

interface ScanResult {
  url: string
  scanDate: string
  lastAnalysisStats: {
    malicious: number
    suspicious: number
    undetected: number
    harmless: number
  }
  safetyScore: number
  status: 'completed' | 'scanning' | 'pending'
}

function App() {
  const [theme, setTheme] = useState('dark')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('virusTotal_apiKey') || '')
  const [showApiModal, setShowApiModal] = useState(!apiKey)
  const [currentPage, setCurrentPage] = useState('scanner')
  const [urlInput, setUrlInput] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [comparisonUrls, setComparisonUrls] = useState<string[]>([])
  const [comparisonResults, setComparisonResults] = useState<ScanResult[]>([])

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('virusTotal_apiKey', apiKey)
      setShowApiModal(false)
    }
  }

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim() || !apiKey) {
      alert('Please enter a URL and API key')
      return
    }

    setScanning(true)
    try {
      // Normalize URL
      let normalizedUrl = urlInput.trim()
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl
      }

      // Get URL ID for VirusTotal
      const urlBuffer = new TextEncoder().encode(normalizedUrl)
      const hashBuffer = await crypto.subtle.digest('SHA-256', urlBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Try to get existing report first
      const response = await fetch(`https://www.virustotal.com/api/v3/urls/${btoa(normalizedUrl).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`, {
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
        const result: ScanResult = {
          url: normalizedUrl,
          scanDate: new Date().toLocaleString(),
          lastAnalysisStats: stats,
          safetyScore: calculateSafetyScore(stats),
          status: 'completed',
        }
        setScanResults([result, ...scanResults])
      } else {
        // Submit for scanning
        const formData = new FormData()
        formData.append('url', normalizedUrl)

        const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
          method: 'POST',
          headers: {
            'x-apikey': apiKey,
          },
          body: formData,
        })

        if (submitResponse.ok) {
          alert('URL submitted for analysis. It may take a moment to complete.')
          // Add a placeholder result
          const result: ScanResult = {
            url: normalizedUrl,
            scanDate: new Date().toLocaleString(),
            lastAnalysisStats: { malicious: 0, suspicious: 0, undetected: 0, harmless: 0 },
            safetyScore: 50,
            status: 'pending',
          }
          setScanResults([result, ...scanResults])
        } else {
          throw new Error('Failed to submit URL for scanning')
        }
      }
      setUrlInput('')
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Failed to scan URL'))
    } finally {
      setScanning(false)
    }
  }

  const calculateSafetyScore = (stats: any): number => {
    if (!stats) return 100
    const total = stats.malicious + stats.suspicious + stats.undetected + stats.harmless
    if (total === 0) return 100
    const threats = stats.malicious * 2 + stats.suspicious
    return Math.max(0, 100 - (threats / total) * 100)
  }

  const addToComparison = (url: string) => {
    if (!comparisonUrls.includes(url)) {
      setComparisonUrls([...comparisonUrls, url])
      const result = scanResults.find(r => r.url === url)
      if (result) {
        setComparisonResults([...comparisonResults, result])
      }
    }
  }

  const removeFromComparison = (url: string) => {
    setComparisonUrls(comparisonUrls.filter(u => u !== url))
    setComparisonResults(comparisonResults.filter(r => r.url !== url))
  }

  const ThreatLevel = ({ score }: { score: number }) => {
    if (score >= 80) return <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">SAFE</span>
    if (score >= 50) return <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">SUSPICIOUS</span>
    return <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">DANGEROUS</span>
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} min-h-screen`}>
      {/* API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full mx-4`}>
            <h2 className="text-2xl font-bold mb-4">VirusTotal API Key Required</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Get your free API key from <a href="https://www.virustotal.com/gui/home/upload" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">virustotal.com</a>
            </p>
            <input
              type="password"
              placeholder="Paste your API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border mb-4 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'}`}
            />
            <button
              onClick={saveApiKey}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={32} className="text-blue-500" />
            <h1 className="text-2xl font-bold">Netboost DNS Scanner</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('scanner')}
              className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 'scanner' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}`}
            >
              Scanner
            </button>
            <button
              onClick={() => setCurrentPage('compare')}
              className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 'compare' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}`}
            >
              Compare
            </button>
            <button
              onClick={() => setShowApiModal(true)}
              className={`px-4 py-2 rounded-lg font-semibold hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}
            >
              API Key
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Scanner Page */}
        {currentPage === 'scanner' && (
          <>
            {/* Scan Form */}
            <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} mb-8`}>
              <h2 className="text-2xl font-bold mb-6">Scan Website Security</h2>
              <form onSubmit={handleScan} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'}`}
                />
                <button
                  type="submit"
                  disabled={scanning}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
                >
                  <Search size={20} />
                  {scanning ? 'Scanning...' : 'Scan'}
                </button>
              </form>
            </div>

            {/* Scan Results */}
            {scanResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Recent Scans</h3>
                {scanResults.map((result, idx) => (
                  <div key={idx} className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg break-all">{result.url}</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {result.scanDate} • {result.status === 'pending' ? 'Pending Analysis' : 'Completed'}
                        </p>
                      </div>
                      <ThreatLevel score={result.safetyScore} />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                        <div className="text-2xl font-bold text-red-500">{result.lastAnalysisStats.malicious}</div>
                        <p className="text-xs text-slate-400">Malicious</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                        <div className="text-2xl font-bold text-yellow-500">{result.lastAnalysisStats.suspicious}</div>
                        <p className="text-xs text-slate-400">Suspicious</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                        <div className="text-2xl font-bold text-gray-500">{result.lastAnalysisStats.undetected}</div>
                        <p className="text-xs text-slate-400">Undetected</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                        <div className="text-2xl font-bold text-green-500">{result.lastAnalysisStats.harmless}</div>
                        <p className="text-xs text-slate-400">Harmless</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToComparison(result.url)}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Plus size={18} /> Add to Compare
                      </button>
                      <button
                        onClick={() => setScanResults(scanResults.filter((_, i) => i !== idx))}
                        className={`flex-1 border font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-50'}`}
                      >
                        <X size={18} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Compare Page */}
        {currentPage === 'compare' && (
          <>
            {comparisonUrls.length === 0 ? (
              <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-12 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} text-center`}>
                <BarChart3 size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-slate-400 mb-4">No websites added to comparison</p>
                <button
                  onClick={() => setCurrentPage('scanner')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Go to Scanner
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Website Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                        <th className="px-4 py-3 text-left font-semibold">Website</th>
                        <th className="px-4 py-3 text-center font-semibold">Safety Score</th>
                        <th className="px-4 py-3 text-center font-semibold">Malicious</th>
                        <th className="px-4 py-3 text-center font-semibold">Suspicious</th>
                        <th className="px-4 py-3 text-center font-semibold">Harmless</th>
                        <th className="px-4 py-3 text-center font-semibold">Status</th>
                        <th className="px-4 py-3 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonResults.map((result) => (
                        <tr key={result.url} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                          <td className="px-4 py-3">
                            <code className="text-sm break-all">{result.url}</code>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-lg">{result.safetyScore.toFixed(1)}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-semibold ${result.lastAnalysisStats.malicious > 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {result.lastAnalysisStats.malicious}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-semibold ${result.lastAnalysisStats.suspicious > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {result.lastAnalysisStats.suspicious}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-green-500">{result.lastAnalysisStats.harmless}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <ThreatLevel score={result.safetyScore} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => removeFromComparison(result.url)}
                              className="text-red-500 hover:text-red-700 font-semibold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Comparison Summary */}
                <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} mt-8`}>
                  <h3 className="text-lg font-bold mb-4">Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <p className="text-slate-400 text-sm mb-2">Total Scanned</p>
                      <p className="text-2xl font-bold">{comparisonResults.length}</p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <p className="text-slate-400 text-sm mb-2">Average Safety Score</p>
                      <p className="text-2xl font-bold text-green-500">
                        {(comparisonResults.reduce((acc, r) => acc + r.safetyScore, 0) / comparisonResults.length).toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <p className="text-slate-400 text-sm mb-2">Total Threats</p>
                      <p className="text-2xl font-bold text-red-500">
                        {comparisonResults.reduce((acc, r) => acc + r.lastAnalysisStats.malicious + r.lastAnalysisStats.suspicious, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t mt-16 py-6 px-6 text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        <p>© 2026 Netboost DNS Protection. Powered by VirusTotal. Contact: cyberadviser.naren@gmail.com</p>
      </footer>
    </div>
  )
}

export default App
