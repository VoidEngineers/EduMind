import { Brain, GraduationCap, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import XAIPrediction from './components/XAIPrediction'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prediction'>('dashboard')

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-brand">
          <GraduationCap className="brand-icon" size={28} />
          <span className="brand-text">EduMind</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'prediction' ? 'active' : ''}`}
            onClick={() => setActiveTab('prediction')}
          >
            <Brain size={18} />
            <span>Risk Prediction</span>
          </button>
        </div>
      </nav>
      <main className="app-content">
        {activeTab === 'dashboard' ? <Dashboard /> : <XAIPrediction />}
      </main>
    </div>
  )
}

export default App