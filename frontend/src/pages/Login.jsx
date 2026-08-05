import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.username, form.password);
    if (ok) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center font-extrabold text-xl text-brand-600 mb-6">
          <PawPrint className="w-7 h-7" /> PawCare
        </div>
        <div className="card">
          <h1 className="page-title !text-xl mb-4">Log in</h1>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account? <Link to="/register" className="text-brand-600 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
