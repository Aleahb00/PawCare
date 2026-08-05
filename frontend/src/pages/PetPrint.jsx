import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, PawPrint } from 'lucide-react';
import { petsApi } from '../api';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';

const fields = [
  ['breed', 'Breed'],
  ['age', 'Age'],
  ['allergies', 'Allergies'],
  ['personality', 'Personality'],
  ['daily_routine', 'Daily routine'],
  ['care_instructions', 'Care instructions'],
];

export default function PetPrint() {
  const { petId } = useParams();
  const id = Number(petId);
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    petsApi.get(id)
      .then((res) => setPet(res.data))
      .catch(() => setError('Could not load this pet.'));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (pet === null) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="no-print flex items-center justify-between mb-6">
        <Link to={`/pets/${id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </Link>
        <button onClick={() => window.print()} className="btn-primary">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 print:border-0 print:rounded-none print:shadow-none">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center overflow-hidden shrink-0">
            {pet.image ? (
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-9 h-9 text-brand-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{pet.name}</h1>
            <p className="text-slate-500">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}{pet.age ? ` · ${pet.age} yrs` : ''}</p>
            <p className="text-xs text-slate-400 mt-1">Owner: {pet.owner?.first_name} {pet.owner?.last_name} ({pet.owner?.username})</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {fields.map(([key, label]) => (
            <div key={key}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{pet[key] || '—'}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-10 border-t border-slate-200 pt-4">
          Generated from PawCare on {new Date().toLocaleDateString()}.
        </p>
      </div>
    </div>
  );
}
