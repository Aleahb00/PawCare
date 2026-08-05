import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { communityApi } from '../api';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';

export default function Community() {
  const [posts, setPosts] = useState(null);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);

  const load = (q) => {
    setError(null);
    communityApi.listPosts(q)
      .then((res) => setPosts(res.data.results ?? res.data))
      .catch(() => setError('Could not load community posts. Check your connection and try again.'));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(query);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await communityApi.createPost(form);
    setForm({ title: '', content: '' });
    setShowForm(false);
    load(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">Community</h1>
          <p className="text-slate-500 mt-1">Ask questions and share advice with other pet owners.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-secondary">Search</button>
      </form>

      {error ? (
        <ErrorState message={error} onRetry={() => load(query)} />
      ) : posts === null ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No posts yet" description="Be the first to start a conversation." />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Link key={p.id} to={`/community/${p.id}`} className="card block hover:shadow-md transition-shadow">
              <p className="font-semibold text-slate-800">{p.title}</p>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.content}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                <span>{p.author?.username || 'Unknown'}</span>
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
                <span>{p.comment_count} comment{p.comment_count === 1 ? '' : 's'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showForm && (
        <Modal title="New community post" onClose={() => setShowForm(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Content</label>
              <textarea className="input" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Post</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
