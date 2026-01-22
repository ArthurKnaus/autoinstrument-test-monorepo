import { useState, useEffect } from 'react';
import ChatUI from './ChatUI';

function App() {
  const [greeting, setGreeting] = useState(null);
  const [health, setHealth] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(console.error);
  }, []);

  const fetchGreeting = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/greeting${name ? `?name=${encodeURIComponent(name)}` : ''}`);
      const data = await res.json();
      setGreeting(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="gradient-bg" />
      <div className="noise" />
      
      <main className="container">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Monorepo</span>
          </div>
          <div className="badge">Express + React</div>
        </header>

        <section className="hero">
          <h1 className="title">
            Full-Stack
            <span className="gradient-text"> JavaScript </span>
            Monorepo
          </h1>
          <p className="subtitle">
            A modern boilerplate with Express backend and React frontend, 
            connected via npm workspaces.
          </p>
        </section>

        <section className="cards">
          <div className="card status-card">
            <div className="card-header">
              <span className="card-icon">⚡</span>
              <h3>API Status</h3>
            </div>
            <div className="card-content">
              {health ? (
                <>
                  <div className="status-indicator online">
                    <span className="dot" />
                    Online
                  </div>
                  <code className="timestamp">{health.timestamp}</code>
                </>
              ) : (
                <div className="status-indicator offline">
                  <span className="dot" />
                  Connecting...
                </div>
              )}
            </div>
          </div>

          <div className="card greeting-card">
            <div className="card-header">
              <span className="card-icon">👋</span>
              <h3>Greeting API</h3>
            </div>
            <div className="card-content">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchGreeting()}
                />
                <button onClick={fetchGreeting} disabled={loading}>
                  {loading ? '...' : 'Say Hello'}
                </button>
              </div>
              {greeting && (
                <div className="greeting-result">
                  <p className="message">{greeting.message}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="chat-section">
          <ChatUI />
        </section>

        <section className="features">
          <h2>Stack Features</h2>
          <div className="feature-grid">
            <div className="feature">
              <span className="feature-icon">📦</span>
              <h4>npm Workspaces</h4>
              <p>Unified dependency management across packages</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔥</span>
              <h4>Vite Dev Server</h4>
              <p>Lightning-fast HMR for React development</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <h4>API Proxy</h4>
              <p>Seamless frontend-backend communication</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <h4>ES Modules</h4>
              <p>Modern JavaScript throughout the stack</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>Built with Express.js & React • npm workspaces monorepo</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
