import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Menu, Bell, Settings, LogOut, Search, Home, Shield, Activity, Lock, Server, AlertTriangle, CheckCircle, Clock, Trash2, Plus, Sun, Moon, Wifi, Download, Upload } from 'lucide-react'

const queryData = [
  { time: '00:00', blocked: 24, allowed: 120 },
  { time: '04:00', blocked: 18, allowed: 95 },
  { time: '08:00', blocked: 42, allowed: 240 },
  { time: '12:00', blocked: 65, allowed: 380 },
  { time: '16:00', blocked: 89, allowed: 450 },
  { time: '20:00', blocked: 103, allowed: 520 },
]

const threatData = [
  { name: 'Malware', value: 234 },
  { name: 'Phishing', value: 187 },
  { name: 'Ads', value: 456 },
  { name: 'Trackers', value: 312 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6']

const recentQueries = [
  { id: 1, domain: 'malicious-site.com', type: 'Malware', status: 'Blocked', time: '2 mins ago' },
  { id: 2, domain: 'facebook.com', type: 'Tracker', status: 'Blocked', time: '5 mins ago' },
  { id: 3, domain: 'github.com', type: 'Safe', status: 'Allowed', time: '8 mins ago' },
  { id: 4, domain: 'phishing-bank.xyz', type: 'Phishing', status: 'Blocked', time: '12 mins ago' },
  { id: 5, domain: 'google.com', type: 'Safe', status: 'Allowed', time: '15 mins ago' },
]

const devices = [
  { id: 1, name: 'Laptop (Windows)', ip: '192.168.1.100', status: 'Protected', lastSeen: '2 mins ago' },
  { id: 2, name: 'Phone (iOS)', ip: '192.168.1.101', status: 'Protected', lastSeen: '1 hour ago' },
  { id: 3, name: 'Tablet (Android)', ip: '192.168.1.102', status: 'Protected', lastSeen: '3 hours ago' },
]

const dnsServers = [
  { id: 1, name: 'Netboost Primary', ip: '1.1.1.1', type: 'Primary', status: 'Active' },
  { id: 2, name: 'Netboost Secondary', ip: '1.0.0.1', type: 'Secondary', status: 'Active' },
  { id: 3, name: 'Custom Server', ip: '8.8.8.8', type: 'Custom', status: 'Inactive' },
]

function Dashboard({ theme }) {
  const stats = [
    { label: 'Queries Today', value: '12,450', icon: Activity, color: 'bg-blue-500' },
    { label: 'Threats Blocked', value: '1,234', icon: Shield, color: 'bg-red-500' },
    { label: 'Devices Protected', value: '3', icon: Wifi, color: 'bg-green-500' },
    { label: 'Uptime', value: '99.9%', icon: CheckCircle, color: 'bg-purple-500' },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className="text-lg font-semibold mb-4">DNS Queries (24h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={queryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
              <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} name="Blocked" />
              <Line type="monotone" dataKey="allowed" stroke="#10b981" strokeWidth={2} name="Allowed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className="text-lg font-semibold mb-4">Threats Detected</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={threatData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {threatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
        <h2 className="text-lg font-semibold mb-4">Recent DNS Queries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className="px-4 py-3 text-left text-sm font-semibold">Domain</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentQueries.map((query) => (
                <tr key={query.id} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <td className="px-4 py-3"><code className="text-xs">{query.domain}</code></td>
                  <td className="px-4 py-3"><span className="text-sm">{query.type}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${query.status === 'Blocked' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                      {query.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{query.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Protection({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Protection Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Shield size={20} /> Malware Protection</h3>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Block malicious websites and downloads</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle size={20} /> Phishing Protection</h3>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Prevent phishing and credential theft</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Lock size={20} /> Ad & Tracker Blocking</h3>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Block ads, analytics, and trackers</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Server size={20} /> Safe Browsing</h3>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Real-time threat detection</p>
        </div>
      </div>
    </>
  )
}

function Devices({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Protected Devices</h2>
      <div className="space-y-4">
        {devices.map((device) => (
          <div key={device.id} className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{device.name}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>IP: {device.ip}</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Last seen: {device.lastSeen}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">{device.status}</span>
                <button className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
        <Plus size={20} /> Add Device
      </button>
    </>
  )
}

function QueryLogs({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">DNS Query Logs</h2>
      <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} mb-6`}>
        <div className="flex gap-4">
          <select className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'}`}>
            <option>All Queries</option>
            <option>Blocked Only</option>
            <option>Allowed Only</option>
          </select>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
            <Download size={18} /> Export Log
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className={`w-full`}>
          <thead>
            <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <th className="px-4 py-3 text-left text-sm font-semibold">Domain</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Device</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentQueries.map((query) => (
              <tr key={query.id} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <td className="px-4 py-3"><code className="text-xs">{query.domain}</code></td>
                <td className="px-4 py-3 text-sm">Laptop (Windows)</td>
                <td className="px-4 py-3 text-sm">{query.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${query.status === 'Blocked' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {query.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{query.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function DNSServers({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">DNS Servers</h2>
      <div className="space-y-4 mb-6">
        {dnsServers.map((server) => (
          <div key={server.id} className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{server.name}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{server.ip}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${server.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{server.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
        <Plus size={20} /> Add Custom DNS
      </button>
    </>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} min-h-screen`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Shield size={28} className="text-blue-500" />
              <h1 className="text-2xl font-bold">Netboost Pro</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none w-32 ${theme === 'dark' ? 'placeholder-slate-400' : 'placeholder-slate-500'}`}
              />
            </div>
            <button className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
              <Bell size={20} />
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} w-64 border-r ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
            <nav className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-4">Navigation</div>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'dashboard' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Home size={18} /> Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('protection')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'protection' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Shield size={18} /> Protection
              </button>
              <button
                onClick={() => setCurrentPage('devices')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'devices' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Wifi size={18} /> Devices
              </button>
              <button
                onClick={() => setCurrentPage('queries')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'queries' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Activity size={18} /> Query Logs
              </button>
              <button
                onClick={() => setCurrentPage('dns')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'dns' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Server size={18} /> DNS Servers
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentPage === 'dashboard' && <Dashboard theme={theme} />}
          {currentPage === 'protection' && <Protection theme={theme} />}
          {currentPage === 'devices' && <Devices theme={theme} />}
          {currentPage === 'queries' && <QueryLogs theme={theme} />}
          {currentPage === 'dns' && <DNSServers theme={theme} />}
        </main>
      </div>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t mt-8 py-6 px-6 text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        <p>© 2026 Netboost Pro DNS Protection. All rights reserved. | Contact: cyberadviser.naren@gmail.com</p>
      </footer>
    </div>
  )
}

export default App 