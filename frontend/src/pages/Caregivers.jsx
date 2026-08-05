import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { petsApi } from '../api';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

export default function Caregivers() {
  const [pets, setPets] = useState(null);

  useEffect(() => {
    petsApi.list().then((res) => setPets(res.data.results ?? res.data));
  }, []);

  if (pets === null) return <Spinner />;

  const owned = pets.filter((p) => p.my_permission === 'owner');
  const sharedWithMe = pets.filter((p) => p.my_permission && p.my_permission !== 'owner');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="page-title">Sharing</h1>
        <p className="text-slate-500 mt-1">Manage who can see or edit your pets' profiles.</p>
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Your pets</h2>
        {owned.length === 0 ? (
          <EmptyState icon={Users} title="You don't own any pets yet" />
        ) : (
          <div className="space-y-2">
            {owned.map((p) => (
              <Link key={p.id} to={`/pets/${p.id}`} className="card flex items-center justify-between !py-3 hover:shadow-md transition-shadow">
                <span className="font-medium text-slate-800">{p.name}</span>
                <span className="text-sm text-brand-600 flex items-center gap-1">
                  Manage access <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Shared with you</h2>
        {sharedWithMe.length === 0 ? (
          <EmptyState icon={Users} title="No pets have been shared with you" description="When a family member or client gives you access to a pet, it will show up here." />
        ) : (
          <div className="space-y-2">
            {sharedWithMe.map((p) => (
              <Link key={p.id} to={`/pets/${p.id}`} className="card flex items-center justify-between !py-3 hover:shadow-md transition-shadow">
                <div>
                  <span className="font-medium text-slate-800">{p.name}</span>
                  <span className="text-sm text-slate-500 ml-2">owned by {p.owner?.username}</span>
                </div>
                <span className="badge bg-accent-50 text-accent-700">{p.my_permission === 'edit' ? 'Can edit' : 'View only'}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
