
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type ToastType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'INFO') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000); // Auto remove after 4 seconds
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getIcon = (type: ToastType) => {
      switch(type) {
          case 'SUCCESS': return <CheckCircle size={20} className="text-green-500" />;
          case 'ERROR': return <AlertOctagon size={20} className="text-red-500" />;
          case 'WARNING': return <AlertTriangle size={20} className="text-amber-500" />;
          default: return <Info size={20} className="text-blue-500" />;
      }
  };

  const getBorderColor = (type: ToastType) => {
      switch(type) {
          case 'SUCCESS': return 'border-green-500';
          case 'ERROR': return 'border-red-500';
          case 'WARNING': return 'border-amber-500';
          default: return 'border-blue-500';
      }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white border-l-4 ${getBorderColor(toast.type)} shadow-2xl rounded-r p-4 flex items-center min-w-[300px] max-w-md transform transition-all duration-300 animate-slide-up`}
          >
            <div className="mr-3">{getIcon(toast.type)}</div>
            <p className="flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
