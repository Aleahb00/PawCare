import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { petsApi } from '../../api';
import PetFormModal from '../PetFormModal';

const fields = [
  ['breed', 'Breed'],
  ['age', 'Age'],
  ['allergies', 'Allergies'],
  ['personality', 'Personality'],
  ['daily_routine', 'Daily routine'],
  ['care_instructions', 'Care instructions'],
];

export default function OverviewTab({ pet, onChanged, onDeleted, canEdit }) {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Remove ${pet.name}'s profile? This deletes all of their records.`)) return;
    await petsApi.remove(pet.id);
    onDeleted();
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(true)} className="btn-secondary">
            <Pencil className="w-4 h-4" /> Edit profile
          </button>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="w-4 h-4" /> Delete pet
          </button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(([key, label]) => (
          <div key={key} className="card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{pet[key] || '—'}</p>
          </div>
        ))}
      </div>
      {editing && (
        <PetFormModal pet={pet} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); onChanged(); }} />
      )}
    </div>
  );
}
