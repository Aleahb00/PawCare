import { useEffect, useState } from 'react';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import { documentsApi } from '../../api';
import EmptyState from '../EmptyState';

const emptyForm = { title: '', document_type: 'other', notes: '' };
const types = [
  ['lab_result', 'Lab result'], ['vet_report', 'Vet report'], ['insurance', 'Insurance'], ['other', 'Other'],
];

export default function DocumentsTab({ petId, canEdit }) {
  const [docs, setDocs] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);

  const load = () => documentsApi.list(petId).then((res) => setDocs(res.data.results ?? res.data));
  useEffect(() => { load(); }, [petId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const data = new FormData();
    data.append('pet', petId);
    data.append('title', form.title);
    data.append('document_type', form.document_type);
    data.append('notes', form.notes);
    data.append('file', file);
    await documentsApi.create(data);
    setForm(emptyForm);
    setFile(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    await documentsApi.remove(id);
    load();
  };

  if (docs === null) return null;

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <Plus className="w-4 h-4" /> Upload document
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={update('title')} required />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.document_type} onChange={update('document_type')}>
                {types.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required className="text-sm" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={update('notes')} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Upload</button>
          </div>
        </form>
      )}

      {docs.length === 0 ? (
        <EmptyState icon={FileText} title="No documents uploaded" description="Store lab results, vet reports, and insurance documents here." />
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-8 h-8 text-brand-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 truncate">{d.title}</p>
                  <p className="text-xs text-slate-500">{types.find(([v]) => v === d.document_type)?.[1]} &middot; {new Date(d.uploaded_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a href={d.file} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-600">
                  <Download className="w-4 h-4" />
                </a>
                {canEdit && (
                  <button onClick={() => handleDelete(d.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
