export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center text-center py-12">
      {Icon && <Icon className="w-10 h-10 text-slate-300 mb-3" />}
      <p className="font-semibold text-slate-700">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
