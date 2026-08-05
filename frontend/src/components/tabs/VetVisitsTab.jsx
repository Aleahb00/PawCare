import { useEffect, useState } from 'react';
import { Plus, Trash2, HeartPulse, CheckCircle2, Circle } from 'lucide-react';
import { vetVisitsApi } from '../../api';
import EmptyState from '../EmptyState';

const emptyForm = { visit_date: '', reason: '', vet_name: '', description: '', follow_up_date: '' };

export default function VetVisitsTab({ petId, canEdit }) {
  const [visits, setVisits] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => vetVisitsApi.list(petId).then((res) => setVisits(res.data.results ?? res.data));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await vetVisitsApi.create({ ...form, pet: petId });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vet visit?')) return;
    await vetVisitsApi.remove(id);
    load();
  };

  const toggleFollowUpCompleted = async (v) => {
    await vetVisitsApi.update(v.id, { follow_up_completed: !v.follow_up_completed });
    load();
  };

  if (visits === null) return null;

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <Plus className="w-4 h-4" /> Log a visit
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Visit date</label>
              <input type="date" className="input" value={form.visit_date} onChange={update('visit_date')} required />
            </div>
            <div>
              <label className="label">Follow-up date (optional)</label>
              <input type="date" className="input" value={form.follow_up_date} onChange={update('follow_up_date')} />
            </div>
          </div>
          <div>
            <label className="label">Reason (short title)</label>
            <input className="input" maxLength={25} value={form.reason} onChange={update('reason')} required placeholder="e.g. Annual checkup" />
          </div>
          <div>
            <label className="label">Veterinarian</label>
            <input className="input" value={form.vet_name} onChange={update('vet_name')} required />
          </div>
          <div>
            <label className="label">Details</label>
            <textarea className="input" rows={3} value={form.description} onChange={update('description')} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save visit</button>
          </div>
        </form>
      )}

      {visits.length === 0 ? (
        <EmptyState icon={HeartPulse} title="No vet visits logged" description="Keep a history of check-ups and treatments." />
      ) : (
        <div className="space-y-3">
          {visits.map((v) => (
            <div key={v.id} className="card flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{v.reason}</p>
                <p className="text-sm text-slate-500">{v.vet_name} &middot; {v.visit_date}</p>
                {v.description && <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{v.description}</p>}
                {v.follow_up_date && (
                  <div className="flex items-center gap-2 mt-2">
                    {canEdit ? (
                      <button
                        onClick={() => toggleFollowUpCompleted(v)}
                        className="flex items-center gap-1.5 text-xs"
                        title={v.follow_up_completed ? 'Mark follow-up as not completed' : 'Mark follow-up as completed'}
                      >
                        {v.follow_up_completed ? (
                          <CheckCircle2 className="w-4 h-4 text-brand-700" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                        <span className={v.follow_up_completed ? 'text-slate-400 line-through' : 'text-brand-700'}>
                          Follow-up: {v.follow_up_date}
                        </span>
                      </button>
                    ) : (
                      <span className={`text-xs ${v.follow_up_completed ? 'text-slate-400 line-through' : 'text-brand-700'}`}>
                        Follow-up: {v.follow_up_date}
                      </span>
                    )}
                    {v.follow_up_completed && <span className="badge bg-accent-50 text-accent-700">Completed</span>}
                  </div>
                )}
              </div>
              {canEdit && (
                <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-500 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
