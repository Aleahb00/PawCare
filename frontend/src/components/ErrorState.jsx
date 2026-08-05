import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message = 'Could not load this. Please try again.', onRetry }) {
  return (
    <div className="card flex flex-col items-center text-center py-12">
      <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
      <p className="font-semibold text-slate-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">Try again</button>
      )}
    </div>
  );
}
