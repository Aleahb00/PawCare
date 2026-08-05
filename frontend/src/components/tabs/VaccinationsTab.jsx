import { useEffect, useState } from 'react';
import { Plus, Trash2, Syringe, CheckCircle2, Circle } from 'lucide-react';
import { vaccinationsApi } from '../../api';
import EmptyState from '../EmptyState';

const emptyForm = { vaccine_name: '', date_administered: '', next_due_date: '' };
const today = () => new Date().toISOString().slice(0, 10);

export default function VaccinationsTab({ petId, canEdit }) {
  const [items, setItems] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => vaccinationsApi.list(petId).then((res) => setItems(res.data.results ?? res.data));
  useEffect(() => { load(); }, [petId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await vaccinationsApi.create({ ...form, pet: petId });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vaccination record?')) return;
    await vaccinationsApi.remove(id);
    load();
  };

  const toggleCompleted = async (v) => {
    await vaccinationsApi.update(v.id, { is_completed: !v.is_completed });
    load();
  };

  if (items === null) return null;
  const now = today();

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add vaccination
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div>
            <label className="label">Vaccine name</label>
            <input className="input" value={form.vaccine_name} onChange={update('vaccine_name')} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Date administered</label>
              <input type="date" className="input" value={form.date_administered} onChange={update('date_administered')} required />
            </div>
            <div>
              <label className="label">Next due date</label>
              <input type="date" className="input" value={form.next_due_date} onChange={update('next_due_date')} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyState icon={Syringe} title="No vaccinations recorded" description="Add vaccinations to track when boosters are due." />
      ) : (
        <div className="space-y-3">
          {items.map((v) => {
            const overdue = !v.is_completed && v.next_due_date && v.next_due_date < now;
            return (
              <div key={v.id} className={`card flex items-start justify-between gap-4 ${v.is_completed ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  {canEdit && (
                    <button
                      onClick={() => toggleCompleted(v)}
                      className="mt-0.5 text-slate-300 hover:text-brand-700 shrink-0"
                      title={v.is_completed ? 'Mark as not completed' : 'Mark as completed'}
                    >
                      {v.is_completed ? <CheckCircle2 className="w-5 h-5 text-brand-700" /> : <Circle className="w-5 h-5" />}
                    </button>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-slate-800 ${v.is_completed ? 'line-through' : ''}`}>{v.vaccine_name}</p>
                      {v.is_completed && <span className="badge bg-accent-50 text-accent-700">Completed</span>}
                      {overdue && <span className="badge bg-red-50 text-red-600">Overdue</span>}
                    </div>
                    <p className="text-sm text-slate-500">Given {v.date_administered}</p>
                    {v.next_due_date && (
                      <p className={`text-sm mt-1 ${overdue ? 'text-red-600' : 'text-brand-700'}`}>
                        Next due {v.next_due_date}
                      </p>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-500 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
