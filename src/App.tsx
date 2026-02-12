import { useState, useEffect } from 'react'
import './App.css'

interface SystemStats {
  cpu: number
  memory: {
    total: number
    used: number
    percentage: number
  }
  disk: {
    total: number
    used: number
    percentage: number
  }
}

function App() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: { total: 0, used: 0, percentage: 0 },
    disk: { total: 0, used: 0, percentage: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    try {
      if (window.__TAURI__) {
        const newStats = await window.__TAURI__.invoke<SystemStats>('get_system_stats')
        setStats(newStats)
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 1000) // Update every second
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1>SystPulse</h1>
        <p>Loading system stats...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>SystPulse</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>CPU Usage</h3>
          <div className="stat-value">{stats.cpu.toFixed(1)}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill cpu-progress" 
              style={{ width: `${stats.cpu}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <h3>Memory</h3>
          <div className="stat-value">{stats.memory.percentage.toFixed(1)}%</div>
          <div className="stat-detail">
            {formatBytes(stats.memory.used)} / {formatBytes(stats.memory.total)}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill memory-progress" 
              style={{ width: `${stats.memory.percentage}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <h3>Disk Space</h3>
          <div className="stat-value">{stats.disk.percentage.toFixed(1)}%</div>
          <div className="stat-detail">
            {formatBytes(stats.disk.used)} / {formatBytes(stats.disk.total)}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill disk-progress" 
              style={{ width: `${stats.disk.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App