import { Link } from 'react-router-dom'
import './About.css'

export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <Link to="/" className="back-button" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Chat
        </Link>
        <h1>About Us</h1>

        <div className="about-section">
          <h2>Credits</h2>
          <div className="credits">
            <p>Hope</p>
            <p>Josh</p>
            <p>Ryan</p>
          </div>
        </div>

        <div className="about-section">
          <h2>Links</h2>
          <div className="about-links">
            <a href="#" className="about-link">
              Report a Bug (we made this in a couple days)
            </a>
            <a href="#" className="about-link">
              Buy us a coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

