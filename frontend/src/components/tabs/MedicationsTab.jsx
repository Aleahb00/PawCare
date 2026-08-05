import { useEffect, useState } from 'react';
import { Plus, Trash2, Pill } from 'lucide-react';
import { medicationsApi } from '../../api';
import EmptyState from '../EmptyState';

const emptyForm = {
  name: '', dosage: '', frequency: 'once_daily', start_date: '', end_date: '', next_dose_date: '', notes: '',
};
const frequencies = [
  ['once_daily', 'Once daily'], ['twice_daily', 'Twice daily'], ['weekly', 'Weekly'],
  ['monthly', 'Monthly'], ['as_needed', 'As needed'], ['custom', 'Custom'],
];

export default function MedicationsTab({ petId, canEdit }) {
  const [items, setItems] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => medicationsApi.list(petId).then((res) => setItems(res.data.results ?? res.data));
  useEffect(() => { load(); }, [petId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await medicationsApi.create({ ...form, pet: petId, end_date: form.end_date || null, next_dose_date: form.next_dose_date || null });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const toggleActive = async (m) => {
    await medicationsApi.update(m.id, { is_active: !m.is_active });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this medication?')) return;
    await medicationsApi.remove(id);
    load();
  };

  if (items === null) return null;

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add medication
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Medication name</label>
              <input className="input" value={form.name} onChange={update('name')} required />
            </div>
            <div>
              <label className="label">Dosage</label>
              <input className="input" value={form.dosage} onChange={update('dosage')} placeholder="e.g. 1 tablet" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Frequency</label>
              <select className="input" value={form.frequency} onChange={update('frequency')}>
                {frequencies.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Next dose date</label>
              <input type="date" className="input" value={form.next_dose_date} onChange={update('next_dose_date')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Start date</label>
              <input type="date" className="input" value={form.start_date} onChange={update('start_date')} required />
            </div>
            <div>
              <label className="label">End date (optional)</label>
              <input type="date" className="input" value={form.end_date} onChange={update('end_date')} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={update('notes')} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyState icon={Pill} title="No medications tracked" description="Add ongoing or as-needed medications with a dosing schedule." />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="card flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">{m.name}</p>
                  <span className={`badge ${m.is_active ? 'bg-accent-50 text-accent-700' : 'bg-slate-100 text-slate-500'}`}>
                    {m.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {m.dosage ? `${m.dosage} · ` : ''}{frequencies.find(([v]) => v === m.frequency)?.[1] || m.frequency}
                </p>
                {m.next_dose_date && <p className="text-sm text-brand-600 mt-1">Next dose {m.next_dose_date}</p>}
                {m.notes && <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{m.notes}</p>}
              </div>
              {canEdit && (
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleActive(m)} className="text-xs text-brand-600 font-medium">
                    Mark {m.is_active ? 'inactive' : 'active'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
