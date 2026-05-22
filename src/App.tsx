import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Menu, Bell, Settings, LogOut, Search, TrendingUp, Users, Activity, Zap, Home, BarChart3, FileText, Sun, Moon } from 'lucide-react'

const dashboardData = [
  { name: 'Jan', value: 4000, users: 2400 },
  { name: 'Feb', value: 3000, users: 1398 },
  { name: 'Mar', value: 2000, users: 9800 },
  { name: 'Apr', value: 2780, users: 3908 },
  { name: 'May', value: 1890, users: 4800 },
  { name: 'Jun', value: 2390, users: 3800 },
]

const pieData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 200 },
  { name: 'Product D', value: 100 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const stats = [
  { icon: Users, label: 'Total Users', value: '24,598', change: '+12.5%', color: 'bg-blue-500' },
  { icon: Activity, label: 'Active Sessions', value: '1,234', change: '+8.2%', color: 'bg-green-500' },
  { icon: Zap, label: 'Performance', value: '94.2%', change: '+2.1%', color: 'bg-yellow-500' },
  { icon: TrendingUp, label: 'Revenue', value: '$45,231', change: '+23.5%', color: 'bg-purple-500' },
]

const recentActivity = [
  { id: 1, action: 'New user registered', time: '2 hours ago' },
  { id: 2, action: 'System update completed', time: '4 hours ago' },
  { id: 3, action: 'Database backup finished', time: '6 hours ago' },
  { id: 4, action: 'Server maintenance scheduled', time: '1 day ago' },
]

const reports = [
  { id: 1, name: 'Q1 Performance Report', date: '2026-03-31', status: 'Completed' },
  { id: 2, name: 'User Engagement Analysis', date: '2026-04-15', status: 'In Progress' },
  { id: 3, name: 'Revenue Forecast Q2', date: '2026-04-20', status: 'Completed' },
  { id: 4, name: 'System Health Check', date: '2026-05-22', status: 'In Progress' },
]

function Dashboard({ theme }) {
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
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className={`flex items-center justify-between py-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} last:border-0`}>
              <span>{activity.action}</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Analytics({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Analytics & Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
              <Bar dataKey="users" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

function Reports({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Reports</h2>
      <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className="px-6 py-3 text-left text-sm font-semibold">Report Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <td className="px-6 py-4">{report.name}</td>
                  <td className="px-6 py-4">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-500 hover:text-blue-700 font-semibold">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Settings({ theme }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value="admin@netboost.com" readOnly className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" value="Admin User" readOnly className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'}`} />
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4">Update Profile</button>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Email Notifications</label>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Push Notifications</label>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Weekly Reports</label>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mt-4">Save Preferences</button>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(3)

  const handleLogout = () => {
    alert('Logged out successfully!')
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} min-h-screen`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
              <Menu size={20} />
            </button>
            <h1 className="text-2xl font-bold">Netboost Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none w-32 ${theme === 'dark' ? 'placeholder-slate-400' : 'placeholder-slate-500'}`}
              />
            </div>
            <button className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg relative`}>
              <Bell size={20} />
              {notifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className={`p-2 hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} w-64 border-r ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
            <nav className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase">Menu</div>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'dashboard' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Home size={18} /> Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('analytics')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'analytics' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <BarChart3 size={18} /> Analytics
              </button>
              <button
                onClick={() => setCurrentPage('reports')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'reports' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <FileText size={18} /> Reports
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${currentPage === 'settings' ? 'bg-blue-500 text-white' : `hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}`}
              >
                <Settings size={18} /> Settings
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentPage === 'dashboard' && <Dashboard theme={theme} />}
          {currentPage === 'analytics' && <Analytics theme={theme} />}
          {currentPage === 'reports' && <Reports theme={theme} />}
          {currentPage === 'settings' && <Settings theme={theme} />}
        </main>
      </div>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t mt-8 py-6 px-6 text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        <p>© 2026 Netboost Pro. All rights reserved. | Contact: cyberadviser.naren@gmail.com</p>
      </footer>
    </div>
  )
}

export default App 