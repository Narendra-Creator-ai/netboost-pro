import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Menu, Bell, Settings, LogOut, Search, TrendingUp, Users, Activity, Zap } from 'lucide-react'

const dashboardData = [
  { name: 'Jan', value: 4000, users: 2400 },
  { name: 'Feb', value: 3000, users: 1398 },
  { name: 'Mar', value: 2000, users: 9800 },
  { name: 'Apr', value: 2780, users: 3908 },
  { name: 'May', value: 1890, users: 4800 },
  { name: 'Jun', value: 2390, users: 3800 },
]

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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState('dark')

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} min-h-screen`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-700 rounded-lg">
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
                className={`bg-transparent outline-none w-32 ${theme === 'dark' ? 'placeholder-slate-400' : 'placeholder-slate-500'}`}
              />
            </div>
            <button className="p-2 hover:bg-slate-700 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-slate-700 rounded-lg">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} w-64 border-r ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6 hidden md:block`}>
            <nav className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase">Menu</div>
              <a href="#" className="block px-4 py-2 rounded-lg bg-blue-500 text-white">Dashboard</a>
              <a href="#" className={`block px-4 py-2 rounded-lg hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>Analytics</a>
              <a href="#" className={`block px-4 py-2 rounded-lg hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>Reports</a>
              <a href="#" className={`block px-4 py-2 rounded-lg hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>Settings</a>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart */}
            <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                  <XAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <h2 className="text-lg font-semibold mb-4">User Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                  <XAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
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