import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, PawPrint } from 'lucide-react';
import { petsApi } from '../api';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import PetFormModal from '../components/PetFormModal';

export default function Pets() {
  const [pets, setPets] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    petsApi.list()
      .then((res) => setPets(res.data.results ?? res.data))
      .catch(() => setError('Could not load your pets. Check your connection and try again.'));
  };

  useEffect(() => { load(); }, []);

  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><ErrorState message={error} onRetry={load} /></div>;
  if (pets === null) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">My Pets</h1>
          <p className="text-slate-500 mt-1">Profiles for everyone you take care of.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add pet
        </button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Add your first pet to start tracking their health records."
          action={<button onClick={() => setShowForm(true)} className="btn-primary">Add a pet</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet) => (
            <Link key={pet.id} to={`/pets/${pet.id}`} className="card hover:shadow-md transition-shadow flex gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center overflow-hidden shrink-0">
                {pet.image ? (
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <PawPrint className="w-7 h-7 text-brand-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{pet.name}</p>
                <p className="text-sm text-slate-500 truncate">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                {pet.my_permission && pet.my_permission !== 'owner' && (
                  <span className="badge bg-accent-50 text-accent-700 mt-2">Shared with you</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showForm && (
        <PetFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}
