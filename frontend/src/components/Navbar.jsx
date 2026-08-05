import { NavLink, useNavigate } from 'react-router-dom';
import { PawPrint, LayoutDashboard, Users, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <header className="no-print sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="flex items-center gap-2 font-extrabold text-lg text-brand-600">
            <PawPrint className="w-6 h-6" />
            PawCare
          </NavLink>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </NavLink>
            <NavLink to="/pets" className={linkClass}>
              <PawPrint className="w-4 h-4" /> My Pets
            </NavLink>
            <NavLink to="/community" className={linkClass}>
              <MessageCircle className="w-4 h-4" /> Community
            </NavLink>
            <NavLink to="/caregivers" className={linkClass}>
              <Users className="w-4 h-4" /> Sharing
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-slate-500">
            {user?.username}
          </span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="btn-secondary !px-3 !py-1.5"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>
      <nav className="md:hidden flex items-center gap-1 px-2 pb-2 overflow-x-auto">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/pets" className={linkClass}>My Pets</NavLink>
        <NavLink to="/community" className={linkClass}>Community</NavLink>
        <NavLink to="/caregivers" className={linkClass}>Sharing</NavLink>
      </nav>
    </header>
  );
}
