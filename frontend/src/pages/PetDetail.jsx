import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PawPrint, Printer } from 'lucide-react';
import { petsApi } from '../api';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import OverviewTab from '../components/tabs/OverviewTab';
import VetVisitsTab from '../components/tabs/VetVisitsTab';
import VaccinationsTab from '../components/tabs/VaccinationsTab';
import MedicationsTab from '../components/tabs/MedicationsTab';
import WeightTab from '../components/tabs/WeightTab';
import DocumentsTab from '../components/tabs/DocumentsTab';
import SharingTab from '../components/tabs/SharingTab';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'vet-visits', label: 'Vet Visits' },
  { key: 'vaccinations', label: 'Vaccinations' },
  { key: 'medications', label: 'Medications' },
  { key: 'weight', label: 'Weight' },
  { key: 'documents', label: 'Documents' },
  { key: 'sharing', label: 'Sharing', ownerOnly: true },
];

export default function PetDetail() {
  const { petId } = useParams();
  const id = Number(petId);
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  const load = () => {
    setError(null);
    petsApi.get(id)
      .then((res) => setPet(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("This pet doesn't exist, or you don't have access to it.");
        } else {
          setError('Could not load this pet. Check your connection and try again.');
        }
      });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/pets" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to pets
        </Link>
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (pet === null) return <Spinner />;

  const canEdit = pet.my_permission === 'owner' || pet.my_permission === 'edit';
  const isOwner = pet.my_permission === 'owner';
  const visibleTabs = TABS.filter((t) => !t.ownerOnly || isOwner);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/pets" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to pets
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center overflow-hidden shrink-0">
            {pet.image ? (
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-7 h-7 text-brand-400" />
            )}
          </div>
          <div>
            <h1 className="page-title">{pet.name}</h1>
            <p className="text-slate-500">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}{pet.age ? ` · ${pet.age} yrs` : ''}</p>
          </div>
        </div>
        <Link to={`/pets/${id}/print`} className="btn-secondary shrink-0">
          <Printer className="w-4 h-4" /> Print profile
        </Link>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 mb-6">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-brand-700 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <OverviewTab pet={pet} canEdit={canEdit} onChanged={load} onDeleted={() => navigate('/pets')} />
      )}
      {tab === 'vet-visits' && <VetVisitsTab petId={id} canEdit={canEdit} />}
      {tab === 'vaccinations' && <VaccinationsTab petId={id} canEdit={canEdit} />}
      {tab === 'medications' && <MedicationsTab petId={id} canEdit={canEdit} />}
      {tab === 'weight' && <WeightTab petId={id} canEdit={canEdit} />}
      {tab === 'documents' && <DocumentsTab petId={id} canEdit={canEdit} />}
      {tab === 'sharing' && isOwner && <SharingTab petId={id} />}
    </div>
  );
}
