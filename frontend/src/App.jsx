
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/posts`)
      ]);

      setUsers(usersResponse.data);
      setPosts(postsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not load data. Check the backend server.'
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUserSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${API_URL}/users`, {
        name: userName,
        email: userEmail
      });

      const newUser = response.data.user;

      setUserName('');
      setUserEmail('');
      setUserId(newUser._id);
      setMessage('User created successfully!');

      await loadData();
      setUserId(newUser._id);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not create user.'
      );
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post(`${API_URL}/posts`, {
        title,
        content,
        userId
      });

      setTitle('');
      setContent('');
      setMessage('Post created successfully!');

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not create post.'
      );
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">REACT + EXPRESS + MONGOOSE</p>
        <h1>User &amp; Post Manager</h1>
        <p>
          Create users, connect posts to their authors, and
          explore referenced MongoDB data.
        </p>
      </header>

      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}

      <section className="forms">
        <form className="panel" onSubmit={handleUserSubmit}>
          <h2>Create a user</h2>

          <label htmlFor="name">Full name</label>
          <input
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <button type="submit">Add user</button>
        </form>

        <form className="panel" onSubmit={handlePostSubmit}>
          <h2>Create a post</h2>

          <label htmlFor="title">Post title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />

          <label htmlFor="content">Post content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            rows="4"
            required
          />

          <label htmlFor="author">Select author</label>
          <select
            id="author"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">Choose a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button type="submit" disabled={users.length === 0}>
            Publish post
          </button>

          {users.length === 0 && (
            <p className="hint">
              Create a user first to publish a post.
            </p>
          )}
        </form>
      </section>

      <section className="posts-section">
        <div className="section-heading">
          <div>
            <h2>Published posts</h2>
            <p>Each post displays its referenced author.</p>
          </div>
          <button
            className="refresh-button"
            type="button"
            onClick={loadData}
          >
            Refresh
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Create a user and publish your first post.</p>
          </div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post._id}>
                <span className="tag">POST</span>
                <h3>{post.title}</h3>
                <p className="post-content">{post.content}</p>

                <div className="author">
                  <div className="avatar">
                    {post.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <strong>
                      {post.user?.name || 'Unknown user'}
                    </strong>
                    <p>{post.user?.email || 'No email available'}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
