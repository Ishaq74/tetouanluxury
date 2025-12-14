
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-red-100 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h1 className="font-serif text-2xl text-slate-900 mb-2">Une erreur est survenue</h1>
            <p className="text-slate-500 mb-6 text-sm">
                L'application a rencontré un problème inattendu. Nos équipes ont été notifiées.
            </p>
            <div className="bg-stone-100 p-3 rounded text-xs font-mono text-left mb-6 overflow-auto max-h-32 text-red-700">
                {this.state.error?.message}
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center hover:bg-slate-800 transition"
            >
                <RefreshCw size={16} className="mr-2" /> Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
