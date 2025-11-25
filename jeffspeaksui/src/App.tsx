import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.css'
import About from './components/About'
import { ApiProvider } from './contexts/ApiContext'
import Home from './routes/Home'

function App() {
  return (
    <Router>
      <ApiProvider>
        <div className="app">
          <header className="app-header">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1>jeffspeaks.ai</h1>
            </Link>
            <div className="header-bottom">
              <p className="subtitle">Using AI to sort through the gross world of Jeffrey Epstein 🤮</p>
              <div className="header-buttons">
                <Link to="/about">
                  <button className="header-button">About</button>
                </Link>
                <button
                  className="header-button"
                  onClick={() => window.open('#', '_blank')}
                >
                  Buy us coffee
                </button>
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </ApiProvider>
    </Router>
  )
}

export default App