import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(form);
    if (ok) navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center font-extrabold text-xl text-brand-600 mb-6">
          <PawPrint className="w-7 h-7" /> PawCare
        </div>
        <div className="card">
          <h1 className="page-title !text-xl mb-4">Create your account</h1>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First name</label>
                <input className="input" value={form.first_name} onChange={update('first_name')} required />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" value={form.last_name} onChange={update('last_name')} required />
              </div>
            </div>
            <div>
              <label className="label">Username</label>
              <input className="input" value={form.username} onChange={update('username')} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={update('email')} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={update('password')} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
