import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Shield, 
  ShoppingBag, 
  Box, 
  FileText, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Key, 
  Plus, 
  X, 
  ChevronRight, 
  Filter, 
  Check, 
  Trash2, 
  History, 
  Globe, 
  File, 
  Copy, 
  Code, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Command,
  Layout,
  UserCheck,
  Menu,
  Sparkles,
  Info
} from 'lucide-react';
import { DJANGO_APPS, SIMULATED_RECORDS, CODE_FILES, RECENT_ACTIONS, ADMIN_USER } from './data';
import { ActiveScreen, SimulatedRecord, ToastMessage, CodeFile } from './types';

export default function App() {
  // Session States
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  // Simulated DB / Interactive States
  const [records, setRecords] = useState<SimulatedRecord[]>(SIMULATED_RECORDS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<keyof SimulatedRecord>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  // Command Palette
  const [paletteQuery, setPaletteQuery] = useState('');

  // Editing / Form States
  const [currentFormTab, setCurrentFormTab] = useState<'fields' | 'inlines'>('fields');
  const [editingRecord, setEditingRecord] = useState<SimulatedRecord | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active' as SimulatedRecord['status'],
    category: 'Staff',
    fileUploaded: null as File | null,
    filePreview: '' as string
  });
  
  // Custom Inline logs inside Form
  const [inlines, setInlines] = useState([
    { id: 1, action: 'Initialized profile Parameters', date: '2026-07-01' },
    { id: 2, action: 'Updated authorization key security', date: '2026-07-02' }
  ]);

  // Code Explorer States
  const [selectedFile, setSelectedFile] = useState<CodeFile>(CODE_FILES[4]); // default to base.html
  const [copySuccess, setCopySuccess] = useState(false);

  // Component catalog helper states
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [activePlaygroundTab, setActivePlaygroundTab] = useState('all');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add notification toast helper
  const addToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Synchronize Dark Mode and theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('nova_admin_theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('nova_admin_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      addToast('Switched to Dark Mode', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      addToast('Switched to Light Mode', 'info');
    }
  };

  // Keyboard listeners for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setShortcutsOpen(false);
        setUserMenuOpen(false);
        setNotificationMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Copy Code Helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    addToast('Source code copied to clipboard!', 'success');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Sorting Handler
  const handleSort = (field: keyof SimulatedRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtered records computed state
  const filteredRecords = records.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || r.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = tableSearch === '' || 
      r.name.toLowerCase().includes(tableSearch.toLowerCase()) || 
      (r.email && r.email.toLowerCase().includes(tableSearch.toLowerCase())) ||
      r.author.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  // Table Select Helper
  const toggleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.id));
    }
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected record(s)?`);
    if (confirm) {
      setRecords(prev => prev.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      addToast('Bulk delete operation completed successfully', 'success');
    }
  };

  const handleBulkStatusUpdate = (status: SimulatedRecord['status']) => {
    if (selectedIds.length === 0) return;
    setRecords(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status } : r));
    setSelectedIds([]);
    addToast(`Bulk updated status to: ${status}`, 'success');
  };

  // Form Submission
  const handleSaveForm = (e: React.FormEvent, close: boolean) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Name is a required field.', 'danger');
      return;
    }

    if (editingRecord) {
      // Edit Record
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? {
        ...r,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        category: formData.category,
        updatedAt: 'Just now'
      } : r));
      addToast(`Record "${formData.name}" successfully updated!`, 'success');
    } else {
      // Create Record
      const newRec: SimulatedRecord = {
        id: Math.max(...records.map(r => r.id)) + 1,
        name: formData.name,
        email: formData.email || 'guest@example.com',
        role: formData.role || 'Contributor',
        status: formData.status,
        category: formData.category,
        updatedAt: 'Just now',
        author: ADMIN_USER.username
      };
      setRecords(prev => [newRec, ...prev]);
      addToast(`New record "${formData.name}" successfully added!`, 'success');
    }

    if (close) {
      setActiveScreen('change_list');
    } else {
      // Save and continue editing: clear or reset
      setEditingRecord(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        status: 'Active',
        category: 'Staff',
        fileUploaded: null,
        filePreview: ''
      });
    }
  };

  // Initiate Form Editing
  const triggerEdit = (rec: SimulatedRecord) => {
    setEditingRecord(rec);
    setFormData({
      name: rec.name,
      email: rec.email || '',
      role: rec.role || '',
      status: rec.status,
      category: rec.category,
      fileUploaded: null,
      filePreview: ''
    });
    setCurrentFormTab('fields');
    setActiveScreen('change_form');
  };

  const triggerCreate = () => {
    setEditingRecord(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      status: 'Active',
      category: 'Staff',
      fileUploaded: null,
      filePreview: ''
    });
    setCurrentFormTab('fields');
    setActiveScreen('change_form');
  };

  const deleteSingleRecord = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setRecords(prev => prev.filter(r => r.id !== id));
      addToast(`Deleted "${name}"`, 'success');
      if (editingRecord && editingRecord.id === id) {
        setActiveScreen('change_list');
      }
    }
  };

  // Drag & drop handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, fileUploaded: file, filePreview: preview }));
      addToast(`Loaded file preview for: ${file.name}`, 'info');
    }
  };

  // Render proper status badges
  const renderBadge = (status: string) => {
    let classes = '';
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'success':
        classes = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30';
        break;
      case 'pending':
      case 'warning':
      case 'draft':
        classes = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30';
        break;
      case 'danger':
      case 'cancelled':
      case 'blocked':
      case 'inactive':
        classes = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30';
        break;
      default:
        classes = 'bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/30';
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {status}
      </span>
    );
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-900 ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* GLOBAL TOAST NOTIFIER SYSTEM */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg dark:bg-emerald-950">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : toast.type === 'danger' ? (
                <div className="p-1 bg-rose-50 text-rose-600 rounded-lg dark:bg-rose-950">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-950">
                  <Info className="w-5 h-5" />
                </div>
              )}
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{toast.text}</p>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* COMMAND PALETTE OVERLAY */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-20 flex justify-center items-start">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)}></div>
          
          <div className="relative mx-auto max-w-2xl w-full transform divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 transition-all mt-10">
            <div className="relative flex items-center px-4">
              <Search className="pointer-events-none h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                className="h-12 w-full border-0 bg-transparent pl-3 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-sm" 
                placeholder="Jump to Django model, template, style... (Esc to close)"
                autoFocus
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-3 text-xs text-slate-600 dark:text-slate-400">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Quick Operations & Views</p>
              <div className="mt-1.5 space-y-0.5">
                {[
                  { label: 'Admin Dashboard Overview', action: () => { setActiveScreen('dashboard'); setCommandPaletteOpen(false); } },
                  { label: 'Users Database Table (change_list.html)', action: () => { setActiveScreen('change_list'); setCommandPaletteOpen(false); } },
                  { label: 'Add New Record (change_form.html)', action: () => { triggerCreate(); setCommandPaletteOpen(false); } },
                  { label: 'Explore Package Source Code (Django Folder)', action: () => { setActiveScreen('explorer'); setCommandPaletteOpen(false); } },
                  { label: 'Tailwind Atomic Components Catalog', action: () => { setActiveScreen('playground'); setCommandPaletteOpen(false); } },
                  { label: 'Django Login Page Custom Override (login.html)', action: () => { setActiveScreen('login'); setCommandPaletteOpen(false); } },
                ].filter(item => item.label.toLowerCase().includes(paletteQuery.toLowerCase())).map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={item.action}
                    className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Command className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono">Navigate ↵</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR (Only visible if NOT in full-screen login screen) */}
        {activeScreen !== 'login' && (
          <aside className={`flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-premium z-30 shrink-0 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
            
            {/* BRANDING HEADER */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden" style={{ display: sidebarCollapsed ? 'none' : 'flex' }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 text-white">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                    Nova <span className="text-blue-600 dark:text-blue-400 font-medium">Admin</span>
                  </h1>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Control Center</p>
                </div>
              </div>
              
              {sidebarCollapsed && (
                <div className="mx-auto text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}

              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* QUICK SEARCH */}
            {!sidebarCollapsed && (
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Quick jump... (Ctrl+K)" 
                    readOnly 
                    onClick={() => setCommandPaletteOpen(true)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none cursor-pointer text-slate-500 dark:text-slate-400"
                  />
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            )}

            {/* SIDE NAVIGATION ITEMS */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
              
              {/* PRIMARY VIEWS LINK */}
              <div class-name="space-y-1">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${activeScreen === 'dashboard' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Layout className="w-4 h-4 text-blue-500" />
                  {!sidebarCollapsed && <span>Dashboard Overview</span>}
                </button>

                <button 
                  onClick={() => setActiveScreen('change_list')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${activeScreen === 'change_list' || activeScreen === 'change_form' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Users className="w-4 h-4 text-indigo-500" />
                  {!sidebarCollapsed && <span>Users (changelist)</span>}
                </button>

                <button 
                  onClick={() => setActiveScreen('explorer')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${activeScreen === 'explorer' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Code className="w-4 h-4 text-purple-500" />
                  {!sidebarCollapsed && <span>Package File Explorer</span>}
                </button>

                <button 
                  onClick={() => setActiveScreen('playground')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${activeScreen === 'playground' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Tag className="w-4 h-4 text-emerald-500" />
                  {!sidebarCollapsed && <span>Component Catalog</span>}
                </button>

                <button 
                  onClick={() => setActiveScreen('login')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${activeScreen === 'login' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Key className="w-4 h-4 text-amber-500" />
                  {!sidebarCollapsed && <span>Login Panel Override</span>}
                </button>
              </div>

              {/* COLLAPSIBLE DJANGO STANDARD APPLICATIONS LIST */}
              <div className="pt-6">
                {!sidebarCollapsed ? (
                  <p className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Django App Registry</p>
                ) : (
                  <div className="text-center text-slate-400 text-xs py-2">···</div>
                )}
                
                {DJANGO_APPS.map((app, appIdx) => (
                  <div key={appIdx} className="mb-4">
                    {!sidebarCollapsed && (
                      <p className="px-3 py-1 text-[11px] font-bold text-slate-400/80 dark:text-slate-500/80 truncate">{app.name}</p>
                    )}
                    <div className="mt-1 space-y-0.5">
                      {app.models.map((model, mIdx) => (
                        <button 
                          key={mIdx}
                          onClick={() => {
                            if (model.id === 'user') {
                              setActiveScreen('change_list');
                            } else {
                              addToast(`Simulation: Loaded registry view for "${model.name}"`, 'info');
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/25 ${model.id === 'user' && activeScreen === 'change_list' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                        >
                          {model.id === 'user' ? <Users className="w-3.5 h-3.5" /> : model.id === 'group' ? <Shield className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
                          {!sidebarCollapsed && <span className="truncate">{model.name}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </nav>

            {/* SIDEBAR FOOTER */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md shadow-blue-500/20">
                    {ADMIN_USER.initials}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{ADMIN_USER.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{ADMIN_USER.email}</p>
                  </div>
                </div>
              </div>
            )}

          </aside>
        )}

        {/* CORE CONTENT STAGE */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          
          {/* TOP NAVBAR (Only visible if not logged out / login screen) */}
          {activeScreen !== 'login' && (
            <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
              
              {/* Left Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="hover:text-blue-500 cursor-pointer" onClick={() => setActiveScreen('dashboard')}>Home</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {activeScreen === 'dashboard' && 'Dashboard'}
                  {activeScreen === 'change_list' && 'Users Table'}
                  {activeScreen === 'change_form' && (editingRecord ? 'Edit User Record' : 'Add New Record')}
                  {activeScreen === 'explorer' && 'Django Package Explorer'}
                  {activeScreen === 'playground' && 'Components Catalog'}
                </span>
              </div>

              {/* Right Menu Options */}
              <div className="flex items-center gap-2">
                
                {/* Search Activation Trigger */}
                <button 
                  onClick={() => setCommandPaletteOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-400 hover:text-slate-600 border border-slate-200/60 dark:border-slate-700 rounded-xl transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden md:inline font-semibold">Quick Search...</span>
                  <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-lg shadow-sm">⌘K</kbd>
                </button>

                {/* Dark Mode Switcher */}
                <button 
                  onClick={toggleTheme}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Toggle Light / Dark mode"
                >
                  {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
                </button>

                {/* Notification Dropdown Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
                    title="Alerts and Notifications"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  </button>

                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-bold text-xs">Nova Operations</span>
                        <button className="text-[10px] text-blue-600 hover:underline">Clear</button>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto">
                        <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">Django AppConfig compiled successfully</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">2 minutes ago · Systems</span>
                        </div>
                        <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">New User added to audit trail: <strong>Diana Prince</strong></p>
                          <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago · Operations</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile menu dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                      {ADMIN_USER.initials}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200">{ADMIN_USER.username}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 text-xs z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{ADMIN_USER.fullName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Django Superuser</p>
                      </div>
                      <button onClick={() => { setActiveScreen('explorer'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Code className="w-4 h-4 text-slate-400" />
                        <span>Package Explorer</span>
                      </button>
                      <button onClick={() => { setActiveScreen('login'); setUserMenuOpen(false); addToast('Logged out of Admin Simulation', 'info'); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold border-t border-slate-100 dark:border-slate-700/40 mt-1 pt-2">
                        <Key className="w-4 h-4 text-rose-400" />
                        <span>Logout Gateway</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </header>
          )}

          {/* ACTIVE CONTENT VIEW */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

            {/* 1. LOGIN OVERRIDE PREVIEW */}
            {activeScreen === 'login' && (
              <div className="flex-1 flex items-center justify-center min-h-[80vh] p-4">
                <div className="max-w-md w-full space-y-6 animate-fade-in">
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-950/40 mb-3 text-white">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 class-name="text-2xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                      Nova <span className="text-blue-600 dark:text-blue-400 font-medium">Admin</span>
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase font-mono tracking-widest">Administrative Gateway</p>
                  </div>

                  <div className="nova-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-custom">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-center">Django Package Simulation</h3>
                    <form onSubmit={(e) => { e.preventDefault(); setActiveScreen('dashboard'); addToast('Successfully authenticated admin', 'success'); }} className="space-y-4">
                      
                      <div>
                        <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Username</label>
                        <input 
                          type="text" 
                          defaultValue="admin"
                          required
                          className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                        <input 
                          type="password" 
                          defaultValue="password"
                          required
                          className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>

                      <div className="flex items-center justify-between text-xxs text-slate-400 font-semibold mt-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-slate-200 text-blue-600 focus:ring-0" />
                          <span>Remember connection</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Lost access?</a>
                      </div>

                      <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/15 transition-all mt-4 flex items-center justify-center gap-2">
                        <span>Authorize and Access</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center justify-between px-3 text-xxs text-slate-400">
                    <span>Active Security Protocol</span>
                    <button onClick={toggleTheme} className="hover:text-slate-600 dark:hover:text-slate-300 font-semibold uppercase tracking-wider">Change theme</button>
                  </div>

                </div>
              </div>
            )}

            {/* 2. MAIN DASHBOARD OVERVIEW */}
            {activeScreen === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Control Panel</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live metrics, application registries, system alerts, and activity timelines.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addToast('Simulated export initiated', 'info')} className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Export PDF Report</span>
                    </button>
                    <button onClick={triggerCreate} className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Add User Record</span>
                    </button>
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="nova-card p-5 bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Active Users</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,248</h3>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-xs">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">+12.4%</span>
                      <span className="text-slate-400">from last week</span>
                    </div>
                  </div>

                  <div className="nova-card p-5 bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Security Roles</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">14</h3>
                      </div>
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Shield className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-xs">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Stable</span>
                      <span className="text-slate-400">active configurations</span>
                    </div>
                  </div>

                  <div className="nova-card p-5 bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Avg Latency</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42ms</h3>
                      </div>
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-xs">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">-4% faster</span>
                      <span className="text-slate-400">execution</span>
                    </div>
                  </div>

                  <div className="nova-card p-5 bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">DB Storage</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1.04 GB</h3>
                      </div>
                      <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
                        <Box className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-xs">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold font-mono">74% capacity</span>
                      <span className="text-slate-400">Cloud SQL PG</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Chart + Log Timeline Column */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Custom SVG bar chart */}
                  <div className="nova-card p-5 bg-white dark:bg-slate-800 lg:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700/50">
                      <div>
                        <h3 class-name="text-xs font-bold font-display uppercase tracking-wider">System Activity Overview</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Real-time HTTP requests & user transactions</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">LIVE MONITORING</span>
                    </div>

                    <div className="h-56 flex items-end justify-between gap-4 pt-6">
                      {[
                        { day: 'Mon', value: 35, count: '350 req' },
                        { day: 'Tue', value: 55, count: '550 req' },
                        { day: 'Wed', value: 85, count: '850 req' },
                        { day: 'Thu', value: 95, count: '950 req' },
                        { day: 'Fri', value: 65, count: '650 req' },
                        { day: 'Sat', value: 40, count: '400 req' },
                        { day: 'Sun', value: 45, count: '450 req' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <div 
                            style={{ height: `${item.value}%` }}
                            className="w-full bg-blue-100 dark:bg-blue-950/40 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-t-lg transition-all duration-300 relative"
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-semibold shadow">
                              {item.count}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Actions timeline */}
                  <div className="nova-card p-5 bg-white dark:bg-slate-800 flex flex-col justify-between">
                    <div className="pb-4 border-b border-slate-100 dark:border-slate-700/50">
                      <h3 class-name="text-xs font-bold font-display uppercase tracking-wider">Recent Actions Log</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Audit log mapping the active django log tables</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pt-4">
                      {RECENT_ACTIONS.map(action => (
                        <div key={action.id} className="relative pl-5 border-l-2 border-slate-100 dark:border-slate-700">
                          <span className={`absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full ${action.type === 'add' ? 'bg-emerald-500' : action.type === 'delete' ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                          <div>
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                              {action.action} <strong className="text-slate-900 dark:text-white font-semibold">{action.objectRepr}</strong>
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">{action.model} · {action.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom modules details list */}
                <div className="nova-card p-6 bg-white dark:bg-slate-800">
                  <h3 className="text-xs font-bold font-display uppercase tracking-wider pb-4 border-b border-slate-100 dark:border-slate-700">Active Registries</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                    {DJANGO_APPS.map((app, appIdx) => (
                      <div key={appIdx} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">{app.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{app.appLabel}</p>
                        
                        <div className="mt-4 space-y-2">
                          {app.models.map((model, mIdx) => (
                            <div key={mIdx} className="flex justify-between items-center text-xs py-1">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">{model.name}</span>
                              <button 
                                onClick={() => {
                                  if (model.id === 'user') {
                                    setActiveScreen('change_list');
                                  } else {
                                    addToast(`Simulated Table Loader for "${model.name}"`, 'info');
                                  }
                                }}
                                className="px-2 py-0.5 text-[10px] bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                              >
                                View ({model.recordsCount})
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. CHANGE LIST TABLE SIMULATION */}
            {activeScreen === 'change_list' && (
              <div className="space-y-6">
                
                {/* Header context */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Users</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review database instances, execute bulk actions, filter tables, and export models.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={triggerCreate} className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Add User</span>
                    </button>
                  </div>
                </div>

                {/* Filters, search and layout switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 max-w-md relative">
                    <input 
                      type="text" 
                      placeholder="Search users by name, email or status..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
                      className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <Filter className="w-4 h-4 text-slate-400" />
                      <span>Filters</span>
                      {(statusFilter !== 'all' || categoryFilter !== 'all') && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Table display + right sidebar filter columns */}
                <div className="flex flex-col lg:flex-row items-start gap-6 relative">
                  
                  {/* Results grid panel */}
                  <div className="flex-1 w-full min-w-0 space-y-4">
                    
                    {/* Selected bulk action panels */}
                    {selectedIds.length > 0 && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{selectedIds.length} item(s) selected:</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleBulkDelete}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Selected</span>
                          </button>
                          <button 
                            onClick={() => handleBulkStatusUpdate('Active')}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-[10px] font-bold uppercase"
                          >
                            Set Active
                          </button>
                          <button 
                            onClick={() => handleBulkStatusUpdate('Blocked')}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-[10px] font-bold uppercase"
                          >
                            Set Blocked
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Change list table card */}
                    <div className="nova-card overflow-hidden shadow-premium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <th className="p-4 w-10">
                                <input 
                                  type="checkbox" 
                                  checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                                  onChange={toggleSelectAll}
                                  className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-0" 
                                />
                              </th>
                              <th className="p-4 cursor-pointer hover:text-slate-600" onClick={() => handleSort('id')}>ID {sortField === 'id' && (sortAsc ? '↑' : '↓')}</th>
                              <th className="p-4 cursor-pointer hover:text-slate-600" onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortAsc ? '↑' : '↓')}</th>
                              <th className="p-4 cursor-pointer hover:text-slate-600" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortAsc ? '↑' : '↓')}</th>
                              <th className="p-4 cursor-pointer hover:text-slate-600" onClick={() => handleSort('category')}>Role Group {sortField === 'category' && (sortAsc ? '↑' : '↓')}</th>
                              <th className="p-4 cursor-pointer hover:text-slate-600" onClick={() => handleSort('updatedAt')}>Updated At {sortField === 'updatedAt' && (sortAsc ? '↑' : '↓')}</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                            {filteredRecords.length > 0 ? (
                              filteredRecords.map(rec => (
                                <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors">
                                  <td className="p-4">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedIds.includes(rec.id)}
                                      onChange={() => toggleSelectRow(rec.id)}
                                      className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-0" 
                                    />
                                  </td>
                                  <td className="p-4 font-mono font-semibold">{rec.id}</td>
                                  <td className="p-4">
                                    <div>
                                      <p className="font-bold text-slate-800 dark:text-white">{rec.name}</p>
                                      {rec.email && <p className="text-[10px] text-slate-400">{rec.email}</p>}
                                    </div>
                                  </td>
                                  <td className="p-4">{renderBadge(rec.status)}</td>
                                  <td className="p-4">
                                    <div>
                                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase">{rec.category}</span>
                                      {rec.role && <p className="text-[10px] text-slate-400 mt-0.5">{rec.role}</p>}
                                    </div>
                                  </td>
                                  <td className="p-4 font-mono text-[10px] text-slate-400">{rec.updatedAt}</td>
                                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                    <button 
                                      onClick={() => triggerEdit(rec)}
                                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 font-bold text-[10px] uppercase transition-all"
                                    >
                                      Change
                                    </button>
                                    <button 
                                      onClick={() => deleteSingleRecord(rec.id, rec.name)}
                                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 transition-all inline-flex items-center"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="p-12 text-center text-slate-400">
                                  <div className="flex flex-col items-center justify-center">
                                    <Users className="w-10 h-10 text-slate-300 mb-3" />
                                    <p className="font-semibold text-xs text-slate-500">No matching user records found</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Clear filters or try another query search.</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                        <p className="text-slate-400">Showing {filteredRecords.length} of {records.length} registered records</p>
                        <div className="flex items-center gap-1.5">
                          <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 cursor-not-allowed text-slate-400" disabled>Previous</button>
                          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold">1</button>
                          <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50">Next</button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Filter Side Panel Column */}
                  {filterSidebarOpen && (
                    <aside className="w-full lg:w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-20 shadow-premium shrink-0 animate-fade-in">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-xs font-bold font-display uppercase tracking-wider">Table Filter Parameters</h3>
                        <button onClick={() => setFilterSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-5 mt-5">
                        {/* Status Filter list */}
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">By Status</h4>
                          <div className="space-y-1.5">
                            {['all', 'Active', 'Pending', 'Completed', 'Draft', 'Inactive', 'Blocked'].map((status) => (
                              <button
                                key={status}
                                onClick={() => setStatusFilter(status.toLowerCase())}
                                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${statusFilter === status.toLowerCase() ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/40'}`}
                              >
                                {status === 'all' ? 'All statuses' : status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Category Filter list */}
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">By Role Group</h4>
                          <div className="space-y-1.5">
                            {['all', 'Staff', 'Admin', 'Guest', 'VIP'].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat.toLowerCase())}
                                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${categoryFilter === cat.toLowerCase() ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/40'}`}
                              >
                                {cat === 'all' ? 'All groups' : cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Clear Button */}
                        <button 
                          onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setTableSearch(''); addToast('Filters cleared', 'info'); }}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold uppercase transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </aside>
                  )}

                </div>

              </div>
            )}

            {/* 4. CHANGE FORM DETAILS SIMULATION */}
            {activeScreen === 'change_form' && (
              <div className="space-y-6">
                
                {/* Header context */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                      {editingRecord ? `Edit User: ${editingRecord.name}` : 'New User Record'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure field elements, upload files, write nested tabular parameters, and track audit logs.</p>
                  </div>
                  {editingRecord && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => addToast('Simulated history audit trail loaded', 'info')} className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1.5">
                        <History className="w-4 h-4 text-slate-400" />
                        <span>History Timeline</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline vs Fields tab selector */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold w-fit">
                  <button 
                    type="button" 
                    onClick={() => setCurrentFormTab('fields')} 
                    className={`px-4 py-2 rounded-lg transition-all ${currentFormTab === 'fields' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Field Set Overview
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCurrentFormTab('inlines')} 
                    className={`px-4 py-2 rounded-lg transition-all ${currentFormTab === 'inlines' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Related Permissions ({inlines.length})
                  </button>
                </div>

                <form onSubmit={(e) => handleSaveForm(e, true)} className="max-w-4xl space-y-6">
                  
                  {/* Fields tab content container */}
                  {currentFormTab === 'fields' && (
                    <div className="space-y-6">
                      
                      {/* Main parameters fields card */}
                      <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-700">Account Credentials Set</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Full Name *</label>
                            <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter user name (e.g., Sarah Connor)"
                              className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </div>

                          <div>
                            <label className="block text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email Address</label>
                            <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Enter email contact"
                              className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Role / Job Title</label>
                            <input 
                              type="text" 
                              value={formData.role}
                              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                              placeholder="Architect, Manager, etc."
                              className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </div>

                          <div>
                            <label className="block text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status</label>
                            <select 
                              value={formData.status}
                              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as SimulatedRecord['status'] }))}
                              className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {['Active', 'Pending', 'Completed', 'Draft', 'Inactive', 'Blocked'].map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Role Category Group</label>
                            <select 
                              value={formData.category}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {['Staff', 'Admin', 'Guest', 'VIP'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                      </div>

                      {/* File Drag-and-drop Image preview widget card */}
                      <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-700">Verification & ID Uploads</h3>
                        
                        <div className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 transition-colors flex flex-col items-center justify-center text-center relative cursor-pointer">
                          <input 
                            type="file" 
                            id="file_uploader"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                          />
                          <Globe className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Drag & Drop verification parameters here, or click to browse</p>
                          <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG, or JSON logs (max 5MB)</p>
                        </div>

                        {formData.filePreview && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 inline-block">
                            <p className="text-[10px] font-bold text-slate-400 mb-1">Loaded File Attachment:</p>
                            <img src={formData.filePreview} alt="upload preview" className="max-h-24 w-auto object-cover rounded-lg" />
                            <p className="text-[10px] text-slate-500 mt-1">Object URL temporary binding</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Tabular inlines content container */}
                  {currentFormTab === 'inlines' && (
                    <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Related Permissions Logs (TabularInline)</h3>
                        <button 
                          type="button" 
                          onClick={() => {
                            setInlines(prev => [...prev, { id: Date.now(), action: 'Granted Custom Staff Permissions', date: 'Just now' }]);
                            addToast('Added inline permissions row', 'info');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Row</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                        {inlines.map((line, idx) => (
                          <div key={line.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-slate-400">0{idx + 1}</span>
                              <input 
                                type="text" 
                                defaultValue={line.action}
                                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs" 
                                placeholder="Audit activity statement..."
                              />
                              <span className="text-[10px] text-slate-400 font-mono">{line.date}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                setInlines(prev => prev.filter(item => item.id !== line.id));
                                addToast('Removed inline row', 'warning');
                              }}
                              className="text-rose-500 hover:text-rose-600 p-1 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Actions footer bar */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                    
                    {/* Left: Delete if editing */}
                    {editingRecord ? (
                      <button 
                        type="button"
                        onClick={() => deleteSingleRecord(editingRecord.id, editingRecord.name)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    ) : (
                      <div className="w-4"></div>
                    )}

                    {/* Right: Django Standard submit buttons combo */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setActiveScreen('change_list')}
                        className="px-4 py-2.5 bg-white hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleSaveForm(e, false)}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 rounded-xl"
                      >
                        Save and add another
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save and Continue</span>
                      </button>
                    </div>

                  </div>

                </form>

              </div>
            )}

            {/* 5. PACKAGE FILE EXPLORER */}
            {activeScreen === 'explorer' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Django Package Repository</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inspect the file hierarchy we generated. Select any file to preview, copy to your project, or review modular specifications.</p>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(selectedFile.content)} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Current File</span>
                  </button>
                </div>

                {/* Tree browser and terminal panel */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  
                  {/* Left directory tree explorer cards */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="nova-card p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400 mb-3">Package Files</h3>
                      <div className="space-y-1">
                        {CODE_FILES.map((file, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSelectedFile(file); addToast(`Loaded file: ${file.path}`, 'info'); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${selectedFile.path === file.path ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/55'}`}
                          >
                            <File className="w-4 h-4" />
                            <div className="truncate text-left">
                              <p className="font-semibold truncate">{file.label}</p>
                              <span className="text-[9px] font-mono opacity-60 truncate block">{file.path}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick installation instructions card */}
                    <div className="nova-card p-4 bg-slate-900 text-white border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider text-blue-400">Installation Guide</h4>
                      <p className="text-[10px] text-slate-300 leading-normal">To install the <strong>Nova Admin</strong> theme package in any local Django project:</p>
                      
                      <div className="p-2 bg-slate-950 rounded-lg text-[9px] font-mono text-slate-400 leading-relaxed border border-slate-800">
                        <span className="text-slate-500"># 1. Register App first</span><br />
                        INSTALLED_APPS = [<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">"nova_admin"</span>,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"django.contrib.admin",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;...<br />
                        ]
                      </div>
                      
                      <p className="text-[9px] text-slate-400 leading-normal">That's it! Standard Django template loaders will automatically prioritize Nova's modern Tailwind / Alpine elements.</p>
                    </div>
                  </div>

                  {/* Terminal Code Viewer Panel */}
                  <div className="lg:col-span-3 space-y-4">
                    
                    <div className="nova-card p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700/50 mb-3 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
                          <span className="font-mono text-[11px] text-slate-500">{selectedFile.path}</span>
                        </div>
                        <span className="uppercase text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-400">{selectedFile.language}</span>
                      </div>

                      {/* Code Area */}
                      <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-xs leading-relaxed max-h-[500px]">
                        <code>{selectedFile.content}</code>
                      </pre>
                    </div>

                    {/* Component Description block */}
                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 flex gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold">File Architectural Details:</h4>
                        <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                          {selectedFile.language === 'python' && 'This Python file hooks directly into Django’s extension framework to customize default behaviors, parse sidebar registered applications, evaluate user avatars, or map theme switches seamlessly.'}
                          {selectedFile.language === 'html' && 'This template uses Django Template Inheritance to override default Django layouts. Adding AlpineJS enables instant responsive drawer toggles, notification widgets, and Ctrl+K command portals without jQuery dependency.'}
                          {selectedFile.language === 'css' && 'This style file establishes the core colors, shadows, scrollbars, and radius mappings using custom properties. Perfect for simple dark-mode and light-mode switching.'}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* 6. ATOMIC COMPONENT CATALOG PLAYGROUND */}
            {activeScreen === 'playground' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Component Catalog</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Showcase of all custom-themed CSS components, Alpine interactions, and layout portals redesigns.</p>
                  </div>
                  <span className="px-3.5 py-1.5 text-xs font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-xl">Production Ready</span>
                </div>

                {/* Grid segment showcasing components */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Buttons segment */}
                  <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">Modern Buttons Library</h3>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button onClick={() => addToast('Primary click', 'success')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors">Primary Button</button>
                      <button onClick={() => addToast('Secondary click', 'info')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors dark:bg-slate-700 dark:text-slate-200">Secondary</button>
                      <button onClick={() => addToast('Outline click', 'info')} className="px-4 py-2 bg-transparent hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs transition-colors dark:text-slate-200 dark:hover:bg-slate-700/40">Outline</button>
                      <button onClick={() => addToast('Danger action committed', 'danger')} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors">Danger Action</button>
                      <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-not-allowed opacity-60">
                        <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span>Saving...</span>
                      </button>
                    </div>
                  </div>

                  {/* Alerts segment */}
                  <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">Interactive Status Alerts</h3>
                    
                    <div className="space-y-2 pt-2 text-xs">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                        <span className="font-semibold">Success Notice:</span> Operation executed with 0ms latency logs.
                      </div>
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                        <span className="font-semibold">Warning Warning:</span> Cloud database reaches 74% maximum capacity.
                      </div>
                    </div>
                  </div>

                  {/* Overlays (Modals & Drawers) segment */}
                  <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">Overlays (Modals & Drawers)</h3>
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Launch Center Modal
                      </button>
                      <button 
                        onClick={() => setDrawerOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Launch Right Drawer
                      </button>
                    </div>

                    {/* Simulated Modal Overlay inline rendering */}
                    {modalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 animate-fade-in border border-slate-200 dark:border-slate-700">
                          <h3 className="font-bold text-slate-900 dark:text-white font-display">Simulated Admin Modal</h3>
                          <p className="text-xs text-slate-500 mt-2">Overridden modal component inside Nova Admin. Supports Alpine’s click.outside closures and escrow state locks.</p>
                          <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setModalOpen(false)} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs">Dismiss</button>
                            <button onClick={() => { setModalOpen(false); addToast('Action confirmed from modal', 'success'); }} className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow">Confirm</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Simulated Drawer Overlay inline rendering */}
                    {drawerOpen && (
                      <div className="fixed inset-0 z-50 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
                        <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-fade-in">
                          <div>
                            <div className="flex justify-between items-center pb-3 border-b">
                              <h3 className="font-bold text-slate-900 dark:text-white font-display">System Drawer Panel</h3>
                              <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Elegant sliding drawers triggered dynamically. Ideal for complex filter arrays, model details timelines, and fast quick edits without leaving active tables.</p>
                          </div>
                          <button onClick={() => setDrawerOpen(false)} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs">Dismiss Drawer</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accents (Badges & Progress) */}
                  <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">Atomic Accents</h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap gap-2">
                        {renderBadge('Active')}
                        {renderBadge('Pending')}
                        {renderBadge('Blocked')}
                        {renderBadge('Draft')}
                      </div>
                      
                      {/* Animated progress bar mock */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xxs font-mono text-slate-400 font-semibold">
                          <span>CPU UTILIATION</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[42%] h-full bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accordion List Segment */}
                  <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">Collapsible Accordions</h3>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                      <button 
                        type="button"
                        onClick={() => setAccordionOpen(!accordionOpen)}
                        className="w-full flex justify-between items-center p-3 font-semibold bg-slate-50/50 dark:bg-slate-900/40 text-left border-b"
                      >
                        <span>How are Alpine/Tailwind variables imported?</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${accordionOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {accordionOpen && (
                        <div className="p-3 bg-white dark:bg-slate-800/20 text-slate-500 leading-normal border-b">
                          Nova overrides Django base.html templates, injecting a responsive Tailwind CSS variables structure. All theme updates are instant because they rely on root CSS custom properties.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Audit History Log timeline component */}
                  <div className="nova-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">Audit Timelines</h3>
                    
                    <div className="relative border-l-2 border-slate-100 dark:border-slate-700 pl-4 space-y-4 text-xs">
                      <div className="relative">
                        <span className="absolute -left-5.5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Updated staff security settings</p>
                        <span className="text-[10px] text-slate-400 font-mono">15 mins ago · Admin</span>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-5.5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Uploaded verification attachment</p>
                        <span className="text-[10px] text-slate-400 font-mono">3 hours ago · Editor</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="h-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-6 flex items-center justify-between text-xxs text-slate-400 shrink-0 z-20">
            <p>© 2026 Nova Admin. Reusable Django Admin Theme package.</p>
            <div className="flex gap-4">
              <span className="font-semibold hover:text-slate-600 cursor-pointer" onClick={() => addToast('Simulated documentation loaded', 'info')}>Online Docs</span>
              <span>·</span>
              <span className="font-semibold hover:text-slate-600 cursor-pointer" onClick={() => addToast('Support ticket portal opened', 'info')}>GitHub Repo</span>
            </div>
          </footer>

        </div>

      </div>

    </div>
  );
}
