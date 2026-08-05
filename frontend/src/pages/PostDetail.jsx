import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { communityApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';

export default function PostDetail() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');

  const load = () => {
    setError(null);
    communityApi.getPost(postId)
      .then((res) => setPost(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("This post doesn't exist or was deleted.");
        } else {
          setError('Could not load this post. Check your connection and try again.');
        }
      });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await communityApi.createComment({ post: postId, content: comment });
    setComment('');
    load();
  };

  const handleDeletePost = async () => {
    if (!confirm('Delete this post?')) return;
    await communityApi.removePost(postId);
    navigate('/community');
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('Delete this comment?')) return;
    await communityApi.removeComment(id);
    load();
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/community" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to community
        </Link>
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (post === null) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/community" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to community
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900">{post.title}</h1>
          {post.author?.username === user?.username && (
            <button onClick={handleDeletePost} className="text-slate-400 hover:text-red-500 shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {post.author?.username || 'Unknown'} &middot; {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p className="text-slate-700 mt-4 whitespace-pre-wrap">{post.content}</p>
      </div>

      <h2 className="font-semibold text-slate-800 mb-3">{post.comments.length} Comment{post.comments.length === 1 ? '' : 's'}</h2>
      <form onSubmit={handleComment} className="flex gap-2 mb-5">
        <input
          className="input flex-1"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">Reply</button>
      </form>

      <div className="space-y-3">
        {post.comments.map((c) => (
          <div key={c.id} className="card !py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">{c.author?.username}</p>
              <p className="text-sm text-slate-600 mt-1">{c.content}</p>
            </div>
            {c.author?.username === user?.username && (
              <button onClick={() => handleDeleteComment(c.id)} className="text-slate-400 hover:text-red-500 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
