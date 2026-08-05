import { useState } from 'react';
import Modal from './Modal';
import { petsApi } from '../api';

const emptyForm = {
  name: '', species: '', breed: '', age: '', allergies: '',
  personality: '', daily_routine: '', care_instructions: '',
};

export default function PetFormModal({ pet, onClose, onSaved }) {
  const [form, setForm] = useState(pet ? {
    name: pet.name || '', species: pet.species || '', breed: pet.breed || '',
    age: pet.age ?? '', allergies: pet.allergies || '', personality: pet.personality || '',
    daily_routine: pet.daily_routine || '', care_instructions: pet.care_instructions || '',
  } : emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value ?? ''));
      if (imageFile) data.append('image', imageFile);

      if (pet) {
        await petsApi.update(pet.id, data);
      } else {
        await petsApi.create(data);
      }
      onSaved();
    } catch {
      setError('Could not save pet. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={pet ? `Edit ${pet.name}` : 'Add a pet'} onClose={onClose}>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={update('name')} required />
          </div>
          <div>
            <label className="label">Species</label>
            <input className="input" value={form.species} onChange={update('species')} required placeholder="Dog, Cat..." />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Breed</label>
            <input className="input" value={form.breed} onChange={update('breed')} />
          </div>
          <div>
            <label className="label">Age</label>
            <input type="number" min="0" className="input" value={form.age} onChange={update('age')} />
          </div>
        </div>
        <div>
          <label className="label">Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
        </div>
        <div>
          <label className="label">Allergies</label>
          <textarea className="input" rows={2} value={form.allergies} onChange={update('allergies')} />
        </div>
        <div>
          <label className="label">Personality</label>
          <textarea className="input" rows={2} value={form.personality} onChange={update('personality')} />
        </div>
        <div>
          <label className="label">Daily routine</label>
          <textarea className="input" rows={2} value={form.daily_routine} onChange={update('daily_routine')} />
        </div>
        <div>
          <label className="label">Care instructions</label>
          <textarea className="input" rows={2} value={form.care_instructions} onChange={update('care_instructions')} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : pet ? 'Save changes' : 'Add pet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
