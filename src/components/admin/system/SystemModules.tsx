
import React, { useState, useEffect } from 'react';
import { Settings, Users, Shield, Bell, Save, Activity, Lock, Plus, X, Trash2, Edit, CheckCircle, AlertTriangle, Search, Filter, Terminal } from 'lucide-react';
// Les données et actions sont désormais passées en props depuis Astro
import { UserRole, StaffMember, SystemLog } from '../../../../types';
import { Modal } from '../AdminShared';

// --- SYSTEM MODULES ---

type SettingsManagerProps = {
    showToast: (msg: string, type?: string) => void;
    resetData: () => void;
    staff: StaffMember[];
};
export const SettingsManager = ({ showToast, resetData, staff }: SettingsManagerProps) => {
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'USERS' | 'LOGS'>('GENERAL');
    
    // --- GENERAL SETTINGS STATE ---
    const [config, setConfig] = useState({
        maintenanceMode: false,
        adminEmail: 'admin@tetouanvillas.ma',
        currency: 'EUR',
        language: 'FR',
        backupFrequency: 'DAILY'
    });

    // --- USERS STATE ---
    // Merging existing staff with mock admins for this view
    const [systemUsers, setSystemUsers] = useState<StaffMember[]>([
        ...staff,
        { id: 'ADM-001', name: 'Admin Principal', role: UserRole.ADMIN, email: 'admin@villas.ma', phone: '', status: 'ACTIVE', schedule: [], lastLogin: 'Aujourd\'hui 10:42' },
        { id: 'MGR-001', name: 'Sarah Manager', role: UserRole.MANAGER, email: 'sarah@villas.ma', phone: '', status: 'ACTIVE', schedule: [], lastLogin: 'Hier 14:20' }
    ]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState<Partial<StaffMember>>({ role: UserRole.STAFF_CLEANING, status: 'ACTIVE' });

    // --- LOGS STATE ---
    const [logs, setLogs] = useState<SystemLog[]>([
        { id: 1, action: 'LOGIN_SUCCESS', user: 'Admin', ip: '192.168.1.1', time: '10:42', type: 'INFO' },
        { id: 2, action: 'UPDATE_PRICE', user: 'Admin', ip: '192.168.1.1', time: '10:45', details: 'Villa Malabata: 350->400', type: 'INFO' },
        { id: 3, action: 'LOGIN_FAILED', user: 'Unknown', ip: '45.32.12.9', time: '11:02', details: 'Wrong password 3x', type: 'WARNING' },
        { id: 4, action: 'CREATE_USER', user: 'Admin', ip: '192.168.1.1', time: '11:15', details: 'New Staff: Ahmed', type: 'INFO' },
        { id: 5, action: 'DELETE_INVOICE', user: 'Sarah', ip: '192.168.1.5', time: 'Hier', details: 'Inv #4422', type: 'ERROR' },
    ]);
    const [logSearch, setLogSearch] = useState('');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newUser.name || !newUser.email) return showToast('Champs requis manquants', 'ERROR');
        
        const userToAdd: StaffMember = {
            id: `USR-${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role || UserRole.STAFF_CLEANING,
            phone: newUser.phone || '',
            status: 'ACTIVE',
            schedule: [],
            lastLogin: 'Jamais'
        };
        
        setSystemUsers([...systemUsers, userToAdd]);
        setLogs([ { id: Date.now(), action: 'CREATE_USER', user: 'Admin', ip: 'Local', time: 'Now', type: 'INFO' }, ...logs ]);
        showToast('Utilisateur créé avec succès', 'SUCCESS');
        setShowUserModal(false);
        setNewUser({ role: UserRole.STAFF_CLEANING, status: 'ACTIVE' });
    };

    const handleDeleteUser = (id: string) => {
        if(confirm('Supprimer cet utilisateur ? Cette action est irréversible.')) {
            setSystemUsers(systemUsers.filter(u => u.id !== id));
            showToast('Utilisateur supprimé', 'WARNING');
        }
    };

    return (
        <div className="p-8 animate-fade-in relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="font-serif text-2xl text-slate-900">Paramètres Système</h2>
                    <p className="text-slate-500 text-sm">Configuration globale, sécurité et utilisateurs.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="bg-stone-100 p-1 rounded-md flex">
                        <button onClick={() => setActiveTab('GENERAL')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition ${activeTab === 'GENERAL' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Général</button>
                        <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition ${activeTab === 'USERS' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Utilisateurs</button>
                        <button onClick={() => setActiveTab('LOGS')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition ${activeTab === 'LOGS' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Logs</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden flex flex-col">
                
                {/* --- TAB: GENERAL --- */}
                {activeTab === 'GENERAL' && (
                    <div className="p-8 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-800 border-b border-stone-100 pb-2 mb-4 flex items-center"><Settings size={18} className="mr-2 text-amber-600"/> Configuration du Site</h3>
                                
                                <div className="flex items-center justify-between p-4 bg-stone-50 rounded border border-stone-200">
                                    <div>
                                        <p className="font-bold text-sm text-slate-700">Mode Maintenance</p>
                                        <p className="text-xs text-slate-500">Désactive l'accès public au site (Page d'attente).</p>
                                    </div>
                                    <button 
                                        onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                                        className={`w-12 h-6 rounded-full transition relative ${config.maintenanceMode ? 'bg-amber-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${config.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div>
                                    <label className="label-xs">Email Notification Admin</label>
                                    <input 
                                        type="email" 
                                        value={config.adminEmail} 
                                        onChange={e => setConfig({...config, adminEmail: e.target.value})} 
                                        className="input-std" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-xs">Devise par défaut</label>
                                        <select className="input-std" value={config.currency} onChange={e => setConfig({...config, currency: e.target.value})}>
                                            <option value="EUR">Euro (€)</option>
                                            <option value="MAD">Dirham (MAD)</option>
                                            <option value="USD">Dollar ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-xs">Fréquence Backup</label>
                                        <select className="input-std" value={config.backupFrequency} onChange={e => setConfig({...config, backupFrequency: e.target.value})}>
                                            <option value="DAILY">Quotidien</option>
                                            <option value="WEEKLY">Hebdomadaire</option>
                                            <option value="REALTIME">Temps Réel (DB)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-800 border-b border-stone-100 pb-2 mb-4 flex items-center"><Shield size={18} className="mr-2 text-red-600"/> Zone de Danger</h3>
                                
                                <div className="bg-red-50 border border-red-100 p-4 rounded text-sm text-red-800">
                                    <p className="font-bold mb-2">Réinitialisation des Données</p>
                                    <p className="mb-4 text-xs">Attention: Cette action effacera toutes les données locales (réservations, clients, logs) et restaurera les données de démonstration.</p>
                                    <button onClick={resetData} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-xs font-bold uppercase hover:bg-red-100 transition shadow-sm">
                                        Réinitialiser Tout
                                    </button>
                                </div>

                                <div className="bg-stone-50 border border-stone-200 p-4 rounded text-sm text-slate-600">
                                    <p className="font-bold mb-2 text-slate-800">Exportation Données (GDPR)</p>
                                    <p className="mb-4 text-xs">Télécharger une archive JSON complète de la base de données.</p>
                                    <button className="bg-white border border-stone-300 text-slate-700 px-4 py-2 rounded text-xs font-bold uppercase hover:bg-stone-100 transition shadow-sm">
                                        Exporter JSON
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-stone-200 flex justify-end">
                            <button onClick={() => showToast('Configuration sauvegardée', 'SUCCESS')} className="btn-primary">
                                <Save size={16} className="mr-2"/> Enregistrer les modifications
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TAB: USERS --- */}
                {activeTab === 'USERS' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 text-sm">Gestion des Accès ({systemUsers.length})</h3>
                            <button onClick={() => setShowUserModal(true)} className="btn-primary py-1.5"><Plus size={16} className="mr-2"/> Nouvel Utilisateur</button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4">Utilisateur</th>
                                        <th className="p-4">Rôle</th>
                                        <th className="p-4">Statut</th>
                                        <th className="p-4">Dernière Connexion</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {systemUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-stone-50 group">
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 mr-3 text-xs">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                                                        <p className="text-xs text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                                    u.role === UserRole.MANAGER ? 'bg-blue-100 text-blue-700' :
                                                    'bg-stone-100 text-stone-600'
                                                }`}>
                                                    {u.role.replace('STAFF_', '')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center text-xs font-bold ${u.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-slate-500 font-mono">{u.lastLogin || '-'}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-300 hover:text-red-600 transition"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TAB: LOGS --- */}
                {activeTab === 'LOGS' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Terminal size={16} className="text-slate-400"/>
                                <input 
                                    placeholder="Filtrer les logs..." 
                                    className="bg-transparent border-none text-sm outline-none w-64"
                                    value={logSearch}
                                    onChange={(e) => setLogSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-2 text-xs">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Info</span>
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div> Warning</span>
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Error</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-300 font-mono text-xs p-4">
                            {logs.filter(l => JSON.stringify(l).toLowerCase().includes(logSearch.toLowerCase())).map((log) => (
                                <div key={log.id} className="mb-2 flex items-start hover:bg-slate-800 p-1 rounded transition">
                                    <span className="text-slate-500 mr-4 shrink-0">[{log.time}]</span>
                                    <span className={`font-bold mr-4 shrink-0 w-24 ${
                                        log.type === 'ERROR' ? 'text-red-400' : 
                                        log.type === 'WARNING' ? 'text-amber-400' : 'text-blue-400'
                                    }`}>{log.action}</span>
                                    <span className="mr-4 text-slate-400 w-20 shrink-0">{log.user}</span>
                                    <span className="text-slate-300 break-all">{log.details || '-'} <span className="text-slate-600 ml-2">({log.ip})</span></span>
                                </div>
                            ))}
                            {logs.length === 0 && <div className="text-slate-600 italic">Aucun log système disponible.</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL USER */}
            {showUserModal && (
                <Modal title="Nouvel Utilisateur" onClose={() => setShowUserModal(false)}>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div><label className="label-xs">Nom Complet</label><input className="input-std" required value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Ex: Jean Dupont"/></div>
                        <div><label className="label-xs">Email</label><input className="input-std" type="email" required value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="jean@villas.ma"/></div>
                        <div>
                            <label className="label-xs">Rôle</label>
                            <select className="input-std" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                                <option value={UserRole.STAFF_CLEANING}>Staff Ménage</option>
                                <option value={UserRole.STAFF_MAINTENANCE}>Maintenance</option>
                                <option value={UserRole.MANAGER}>Manager</option>
                                <option value={UserRole.ADMIN}>Admin</option>
                            </select>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="btn-primary w-full justify-center">Créer le Compte</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};
