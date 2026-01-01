
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { BookingStatus, Client, ServiceRequest, BlogPost, Villa, HomePageContent, FAQItem, PremiumService, GuideItem, Booking, InventoryItem, MaintenanceTicket, StaffMember, UserRole, Expense, Supplier, MarketingCampaign } from '../../types';
import { DollarSign, Calendar, Users, AlertCircle, TrendingUp } from 'lucide-react';

// This component now ONLY renders the Overview. 
// Other modules have been moved to their respective files in components/admin/...
export const AdminDashboardOverview: React.FC = () => {
    // Mock functions for now - these will be replaced with actual context providers
    const t = (key: string) => key;
    const bookings: any[] = [];
    const villas: any[] = [];
    const clients: any[] = [];
    const tickets: any[] = [];
    const serviceRequests: any[] = [];

    // Calculate Real KPIs
    const totalRevenue = bookings
        .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED)
        .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    
    const activeBookings = bookings.filter(b => b.status === BookingStatus.CHECKED_IN).length;
    const totalVillas = villas.length;
    const occupancyRate = totalVillas > 0 ? Math.round((activeBookings / totalVillas) * 100) : 0;
    const activeClients = clients.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;

    // Generate Dynamic Activity Data (Last 7 Days)
    const activityData = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
        
        // Mock random variations for visual demo based on base data
        return {
            name: dayName,
            bookings: Math.floor(Math.random() * 3) + (i % 2),
            revenue: Math.floor(Math.random() * 1000) + 500
        };
    });

    // Recent Activity Logs
    const recentLogs = [
        ...bookings.slice(0, 3).map(b => ({ user: b.clientName, action: 'Réservation créée', time: 'Récemment', type: 'BOOKING' })),
        ...tickets.slice(0, 2).map(t => ({ user: t.reportedBy, action: `Ticket ${t.category}`, time: 'Aujourd\'hui', type: 'OPS' })),
        ...serviceRequests.slice(0, 2).map(s => ({ user: s.clientName, action: `Demande: ${s.serviceType}`, time: 'En attente', type: 'REQ' }))
    ];

    return (
        <div className="p-8 animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="font-serif text-3xl text-slate-900">{t('admin_nav_overview')}</h1>
                    <p className="text-slate-500 text-sm mt-1">Vue d'ensemble de l'activité en temps réel.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold uppercase text-slate-400">{t('label_date')}</p>
                    <p className="font-bold text-slate-800">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded shadow-sm border border-stone-200 flex items-center hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('admin_kpi_revenue')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalRevenue.toLocaleString()} €</p>
                        <p className="text-xs text-green-600 font-bold flex items-center mt-1"><TrendingUp size={10} className="mr-1"/> +12% vs N-1</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow-sm border border-stone-200 flex items-center hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('admin_kpi_occupancy')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{occupancyRate}%</p>
                        <p className="text-xs text-slate-400 mt-1">{activeBookings} villas</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow-sm border border-stone-200 flex items-center hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('admin_kpi_guests')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{activeClients}</p>
                        <p className="text-xs text-slate-400 mt-1">Actifs</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow-sm border border-stone-200 flex items-center hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('admin_kpi_issues')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{openTickets}</p>
                        <p className="text-xs text-red-500 font-bold mt-1">Maintenance</p>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 rounded shadow-sm border border-stone-200">
                <h3 className="font-bold text-slate-800 mb-6">{t('admin_chart_weekly')}</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="bookings" name="Réservations" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar yAxisId="right" dataKey="revenue" name="Revenu (€)" fill="#d97706" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white p-6 rounded shadow-sm border border-stone-200">
                <h3 className="font-bold text-slate-800 mb-4">{t('admin_chart_recent')}</h3>
                <div className="space-y-4">
                    {recentLogs.map((log, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mr-3 ${
                                    log.type === 'BOOKING' ? 'bg-green-100 text-green-700' :
                                    log.type === 'OPS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {log.type.substring(0,2)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{log.action}</p>
                                    <p className="text-xs text-slate-500">Par {log.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
// Re-export strictly for legacy support if needed, but App uses AdminPage
export const AdminDashboard = AdminDashboardOverview;
