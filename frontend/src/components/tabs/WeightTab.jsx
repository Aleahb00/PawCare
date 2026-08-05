import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, Scale } from 'lucide-react';
import { weightApi } from '../../api';
import EmptyState from '../EmptyState';

const emptyForm = { weight: '', unit: 'lb', recorded_date: '', notes: '' };

export default function WeightTab({ petId, canEdit }) {
  const [records, setRecords] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => weightApi.list(petId).then((res) => {
    const data = res.data.results ?? res.data;
    setRecords([...data].sort((a, b) => a.recorded_date.localeCompare(b.recorded_date)));
  });
  useEffect(() => { load(); }, [petId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await weightApi.create({ ...form, pet: petId });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this weight entry?')) return;
    await weightApi.remove(id);
    load();
  };

  if (records === null) return null;

  const chartData = records.map((r) => ({ date: r.recorded_date, weight: parseFloat(r.weight) }));

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <Plus className="w-4 h-4" /> Log weight
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Weight</label>
              <input type="number" step="0.01" min="0" className="input" value={form.weight} onChange={update('weight')} required />
            </div>
            <div>
              <label className="label">Unit</label>
              <select className="input" value={form.unit} onChange={update('unit')}>
                <option value="lb">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" value={form.recorded_date} onChange={update('recorded_date')} required />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <input className="input" value={form.notes} onChange={update('notes')} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      )}

      {records.length === 0 ? (
        <EmptyState icon={Scale} title="No weight history yet" description="Log weight over time to see growth or trends on a chart." />
      ) : (
        <>
          <div className="card h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {[...records].reverse().map((r) => (
              <div key={r.id} className="card flex items-center justify-between !py-3">
                <div>
                  <span className="font-medium text-slate-800">{r.weight} {r.unit}</span>
                  <span className="text-sm text-slate-500 ml-2">{r.recorded_date}</span>
                  {r.notes && <span className="text-sm text-slate-400 ml-2">· {r.notes}</span>}
                </div>
                {canEdit && (
                  <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
