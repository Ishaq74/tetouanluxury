
import React from 'react';

// --- ADMIN SKELETON ---
export const AdminSkeleton = () => (
  <div className="flex h-screen bg-stone-50 font-sans overflow-hidden">
    {/* Sidebar Skeleton */}
    <div className="w-64 bg-slate-900 flex-shrink-0 flex flex-col border-r border-slate-800 h-full p-6 space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
      </div>
      <div className="space-y-4 flex-1">
        <div className="h-3 w-16 bg-slate-800/50 rounded animate-pulse mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-full bg-slate-800/30 rounded animate-pulse" style={{ opacity: 1 - i * 0.15 }}></div>
        ))}
        <div className="h-3 w-16 bg-slate-800/50 rounded animate-pulse mt-8 mb-4"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={`b-${i}`} className="h-10 w-full bg-slate-800/30 rounded animate-pulse" style={{ opacity: 1 - i * 0.1 }}></div>
        ))}
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shadow-sm shrink-0">
        <div className="h-4 w-32 bg-stone-200 rounded animate-pulse"></div>
        <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse"></div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-8 overflow-y-auto bg-stone-50">
        <div className="flex justify-between items-end">
           <div className="space-y-2">
               <div className="h-8 w-48 bg-stone-200 rounded animate-pulse"></div>
               <div className="h-4 w-64 bg-stone-100 rounded animate-pulse"></div>
           </div>
           <div className="h-4 w-24 bg-stone-200 rounded animate-pulse"></div>
        </div>
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => (
             <div key={i} className="bg-white p-6 rounded shadow-sm border border-stone-200 h-32 flex items-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-stone-100 mr-4"></div>
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-20 bg-stone-100 rounded"></div>
                    <div className="h-6 w-32 bg-stone-200 rounded"></div>
                </div>
             </div>
           ))}
        </div>
        
        {/* Chart Area */}
        <div className="bg-white p-6 rounded shadow-sm border border-stone-200 h-80 animate-pulse">
            <div className="h-6 w-48 bg-stone-100 rounded mb-8"></div>
            <div className="flex items-end space-x-4 h-56">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 bg-stone-100 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                ))}
            </div>
        </div>
      </div>
    </div>
  </div>
);

// --- PORTAL SKELETON ---
export const PortalSkeleton = () => (
    <div className="bg-stone-50 min-h-screen font-sans">
        <div className="h-72 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
            <div className="absolute bottom-6 left-6 space-y-3">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                <div className="h-10 w-56 bg-white/20 rounded animate-pulse"></div>
            </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 space-y-8 pb-24">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 h-48 animate-pulse">
                <div className="flex justify-between mb-4">
                    <div className="h-6 w-32 bg-stone-100 rounded"></div>
                    <div className="h-6 w-20 bg-stone-100 rounded-full"></div>
                </div>
                <div className="h-12 w-full bg-stone-100 rounded mt-8"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white h-24 rounded-xl border border-stone-200 shadow-sm animate-pulse flex flex-col items-center justify-center space-y-2">
                        <div className="w-8 h-8 bg-stone-100 rounded-full"></div>
                        <div className="w-16 h-3 bg-stone-100 rounded"></div>
                    </div>
                ))}
            </div>
            <div className="flex space-x-4 overflow-hidden">
                {[1,2,3].map(i => (
                    <div key={i} className="min-w-[200px] h-32 bg-white rounded-xl border border-stone-200 animate-pulse"></div>
                ))}
            </div>
        </div>
        {/* Bottom Nav Skeleton */}
        <div className="fixed bottom-0 left-0 w-full h-20 bg-white border-t border-stone-200 flex justify-between items-center px-8">
            {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 bg-stone-100 rounded animate-pulse"></div>)}
        </div>
    </div>
);

// --- OPERATIONS SKELETON ---
export const OperationsSkeleton = () => (
    <div className="bg-stone-50 min-h-screen p-6 font-sans">
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
                <div className="h-8 w-40 bg-stone-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-stone-100 rounded animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl border border-stone-200 animate-pulse"></div>)}
        </div>
        <div className="space-y-4">
            <div className="h-4 w-32 bg-stone-200 rounded animate-pulse mb-2"></div>
            {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-white rounded-xl border border-stone-200 animate-pulse p-4 space-y-3">
                    <div className="flex justify-between">
                        <div className="h-4 w-24 bg-stone-100 rounded"></div>
                        <div className="h-4 w-12 bg-stone-100 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-stone-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-stone-100 rounded"></div>
                </div>
            ))}
        </div>
    </div>
);
