import { useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { caregiversApi } from '../../api';
import EmptyState from '../EmptyState';

export default function SharingTab({ petId }) {
  const [access, setAccess] = useState(null);
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('view');
  const [error, setError] = useState(null);

  const load = () => caregiversApi.list().then((res) => {
    const all = res.data.results ?? res.data;
    setAccess(all.filter((a) => a.pet === petId));
  });
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await caregiversApi.create({ pet: petId, caregiver_username: username, permission });
      setUsername('');
      load();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Could not add caregiver.');
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this person\'s access?')) return;
    await caregiversApi.remove(id);
    load();
  };

  if (access === null) return null;

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-3">Give someone access</h3>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            placeholder="Their PawCare username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <select className="input sm:w-40" value={permission} onChange={(e) => setPermission(e.target.value)}>
            <option value="view">View only</option>
            <option value="edit">Can edit</option>
          </select>
          <button type="submit" className="btn-primary shrink-0">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2">They need an existing PawCare account. Great for family members or a pet sitter.</p>
      </div>

      {access.length === 0 ? (
        <EmptyState icon={Users} title="Not shared with anyone yet" />
      ) : (
        <div className="space-y-2">
          {access.map((a) => (
            <div key={a.id} className="card flex items-center justify-between !py-3">
              <div>
                <p className="font-medium text-slate-800">{a.caregiver.username}</p>
                <span className="badge bg-accent-50 text-accent-700">{a.permission === 'edit' ? 'Can edit' : 'View only'}</span>
              </div>
              <button onClick={() => handleRemove(a.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
