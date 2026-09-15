import { useState } from "react";
import "./index.css";

const GITHUB_API = "https://api.github.com";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <a
      className="repo-card"
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="repo-card-header">
        <h3>{repo.name}</h3>
        {repo.language && <span className="repo-lang">{repo.language}</span>}
      </div>
      <p className="repo-desc">{repo.description || "No description provided."}</p>
      <div className="repo-meta">
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </a>
  );
}

export default function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  async function searchUser(e) {
    e.preventDefault();
    const query = username.trim();
    if (!query) return;

    setLoading(true);
    setError("");
    setProfile(null);
    setRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API}/users/${query}`),
        fetch(`${GITHUB_API}/users/${query}/repos?per_page=100`),
      ]);

      if (!userRes.ok) {
        throw new Error(
          userRes.status === 404 ? "No GitHub user found with that username." : "Something went wrong. Please try again."
        );
      }

      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      setProfile(userData);
      setRepos(Array.isArray(reposData) ? reposData : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  return (
    <div className="app">
      <header className="hero">
        <h1>GitHub Profile Explorer</h1>
        <p>Search any GitHub username to view their profile and repositories.</p>

        <form className="search-form" onSubmit={searchUser}>
          <input
            type="text"
            placeholder="e.g. nitinmalhotra001"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </header>

      {profile && (
        <main className="results">
          <section className="profile-card">
            <img src={profile.avatar_url} alt={profile.login} className="avatar" />
            <div className="profile-info">
              <h2>{profile.name || profile.login}</h2>
              <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="username-link">
                @{profile.login}
              </a>
              {profile.bio && <p className="bio">{profile.bio}</p>}
              <div className="meta-row">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.company && <span>🏢 {profile.company}</span>}
                {profile.blog && (
                  <a href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer">
                    🔗 {profile.blog}
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="stats-row">
            <StatCard label="Repositories" value={profile.public_repos} />
            <StatCard label="Followers" value={profile.followers} />
            <StatCard label="Following" value={profile.following} />
            <StatCard label="Gists" value={profile.public_gists} />
          </section>

          <section className="repos-section">
            <div className="repos-header">
              <h3>Repositories ({repos.length})</h3>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="updated">Recently updated</option>
                <option value="stars">Most stars</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            {repos.length === 0 ? (
              <p className="empty-state">This user has no public repositories yet.</p>
            ) : (
              <div className="repo-grid">
                {sortedRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      <footer>
        Built with React + the GitHub REST API — by Nitin Malhotra
      </footer>
    </div>
  );
}
