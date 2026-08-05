import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surface the real error in the console so it's easy to diagnose instead of a silent blank page.
    console.error('PawCare crashed while rendering:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="card max-w-md text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">Something went wrong</p>
            <p className="text-sm text-slate-500 mt-1">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <p className="text-xs text-slate-400 mt-3">
              Check the browser console (F12) for details, then try reloading the page.
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
