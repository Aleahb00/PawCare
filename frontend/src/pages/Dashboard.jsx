import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Syringe, Pill, HeartPulse, CheckCircle2 } from 'lucide-react';
import { remindersApi, petsApi } from '../api';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

function ReminderRow({ icon: Icon, title, subtitle, date, tone = 'default' }) {
  const toneClasses = {
    default: 'bg-brand-50 text-brand-600',
    danger: 'bg-red-50 text-red-600',
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
      <span className="text-xs font-medium text-slate-500 shrink-0">{date}</span>
    </div>
  );
}

export default function Dashboard() {
  const [reminders, setReminders] = useState(null);
  const [petCount, setPetCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([remindersApi.get(30), petsApi.list()])
      .then(([remindersRes, petsRes]) => {
        setReminders(remindersRes.data);
        const petsData = petsRes.data;
        setPetCount(petsData.count ?? petsData.results?.length ?? petsData.length ?? 0);
      })
      .catch(() => setError('Could not load your dashboard. Check your connection and try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><ErrorState message={error} onRetry={load} /></div>;

  const totalUpcoming =
    (reminders?.vaccinations_due?.length || 0) +
    (reminders?.vet_follow_ups_due?.length || 0) +
    (reminders?.medications_due?.length || 0);
  const totalOverdue = reminders?.vaccinations_overdue?.length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-slate-500 mt-1">What's coming up across {petCount === 0 ? 'your pets' : `your ${petCount} pet${petCount === 1 ? '' : 's'}`}.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Pets</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{petCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Due in next 30 days</p>
          <p className="text-3xl font-bold text-brand-600 mt-1">{totalUpcoming}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className={`text-3xl font-bold mt-1 ${totalOverdue > 0 ? 'text-red-600' : 'text-slate-900'}`}>{totalOverdue}</p>
        </div>
      </div>

      {totalOverdue > 0 && (
        <div className="card border-red-100 bg-red-50/40">
          <h2 className="font-semibold text-red-700 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Overdue vaccinations
          </h2>
          {reminders.vaccinations_overdue.map((v) => (
            <ReminderRow
              key={v.id}
              icon={Syringe}
              tone="danger"
              title={v.vaccine_name}
              subtitle="Vaccination overdue"
              date={v.next_due_date}
            />
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        <div className="card">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <Syringe className="w-4 h-4 text-brand-500" /> Vaccinations due
          </h2>
          {reminders.vaccinations_due.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">Nothing due soon.</p>
          ) : (
            reminders.vaccinations_due.map((v) => (
              <ReminderRow key={v.id} icon={Syringe} title={v.vaccine_name} subtitle="Vaccination" date={v.next_due_date} />
            ))
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <HeartPulse className="w-4 h-4 text-brand-500" /> Vet follow-ups
          </h2>
          {reminders.vet_follow_ups_due.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No follow-ups scheduled.</p>
          ) : (
            reminders.vet_follow_ups_due.map((v) => (
              <ReminderRow key={v.id} icon={HeartPulse} title={v.reason} subtitle={v.vet_name} date={v.follow_up_date} />
            ))
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <Pill className="w-4 h-4 text-brand-500" /> Medications due
          </h2>
          {reminders.medications_due.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">Nothing due soon.</p>
          ) : (
            reminders.medications_due.map((m) => (
              <ReminderRow key={m.id} icon={Pill} title={m.name} subtitle={m.dosage || 'Medication'} date={m.next_dose_date} />
            ))
          )}
        </div>
      </div>

      {totalUpcoming === 0 && totalOverdue === 0 && petCount > 0 && (
        <EmptyState
          icon={CheckCircle2}
          title="You're all caught up"
          description="No vaccinations, follow-ups, or medications due in the next 30 days."
        />
      )}

      {petCount === 0 && (
        <EmptyState
          title="Add your first pet"
          description="Create a pet profile to start tracking vaccinations, vet visits, and more."
          action={<Link to="/pets" className="btn-primary">Add a pet</Link>}
        />
      )}
    </div>
  );
}
