'use client'
import React, { useState, useMemo } from 'react';
import {Header} from '../../../component/layout/index'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreVertical,
  ShieldAlert,
  Edit2,
  UserPlus,
  Power,
  MapPin,
  Layers,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Users,
  Briefcase,
  Building2,
  Map as MapIcon,
  RefreshCw
} from 'lucide-react';


const INITIAL_JURISDICTIONS = [
  {
    id: 'jur-state-1',
    name: 'Karnataka',
    type: 'State',
    parentId: null,
    parentName: '-',
    status: 'Active',
    officersCount: 42,
    projectsCount: 18,
    boundaryGeoJSON: 'POLYGON((12.9 77.5, 13.1 77.6, 13.0 77.8, 12.8 77.5))',
    adminId: 'usr-101',
    adminName: 'Rajesh Kumar (Nodal)',
    subJurisdictionIds: ['jur-dist-1', 'jur-dist-2']
  },
  {
    id: 'jur-dist-1',
    name: 'Bengaluru Urban',
    type: 'District',
    parentId: 'jur-state-1',
    parentName: 'Karnataka',
    status: 'Active',
    officersCount: 15,
    projectsCount: 8,
    boundaryGeoJSON: 'POLYGON((12.95 77.55, 13.05 77.62, 12.98 77.70))',
    adminId: 'usr-102',
    adminName: 'Priya Sharma (DRO)',
    subJurisdictionIds: ['jur-teh-1', 'jur-teh-2']
  },
  {
    id: 'jur-teh-1',
    name: 'Bengaluru North',
    type: 'Tehsil/Block',
    parentId: 'jur-dist-1',
    parentName: 'Bengaluru Urban',
    status: 'Active',
    officersCount: 6,
    projectsCount: 4,
    boundaryGeoJSON: 'POLYGON((13.00 77.56, 13.05 77.60, 13.02 77.64))',
    adminId: 'usr-103',
    adminName: 'Amit V. (Tahsildar)',
    subJurisdictionIds: ['jur-vil-1', 'jur-vil-2']
  },
  {
    id: 'jur-vil-1',
    name: 'Yelahanka Village',
    type: 'Village',
    parentId: 'jur-teh-1',
    parentName: 'Bengaluru North',
    status: 'Active',
    officersCount: 2,
    projectsCount: 2,
    boundaryGeoJSON: 'POLYGON((13.03 77.57, 13.05 77.59, 13.04 77.61))',
    adminId: 'usr-104',
    adminName: 'Suresh Gowda (VA)',
    subJurisdictionIds: []
  },
  {
    id: 'jur-vil-2',
    name: 'Hebbal West',
    type: 'Village',
    parentId: 'jur-teh-1',
    parentName: 'Bengaluru North',
    status: 'Inactive',
    officersCount: 1,
    projectsCount: 1,
    boundaryGeoJSON: 'POLYGON((13.01 77.58, 13.03 77.60, 13.02 77.62))',
    adminId: 'usr-105',
    adminName: 'Kavitha R. (VA)',
    subJurisdictionIds: []
  },
  {
    id: 'jur-teh-2',
    name: 'Anekal Tehsil',
    type: 'Tehsil/Block',
    parentId: 'jur-dist-1',
    parentName: 'Bengaluru Urban',
    status: 'Active',
    officersCount: 4,
    projectsCount: 2,
    boundaryGeoJSON: 'POLYGON((12.78 77.68, 12.82 77.72, 12.79 77.75))',
    adminId: 'usr-106',
    adminName: 'Mahesh Reddy (Tahsildar)',
    subJurisdictionIds: []
  },
  {
    id: 'jur-dist-2',
    name: 'Mysuru',
    type: 'District',
    parentId: 'jur-state-1',
    parentName: 'Karnataka',
    status: 'Active',
    officersCount: 12,
    projectsCount: 5,
    boundaryGeoJSON: 'POLYGON((12.29 76.63, 12.35 76.68, 12.30 76.72))',
    adminId: 'usr-107',
    adminName: 'Sunil Verma (DRO)',
    subJurisdictionIds: []
  }
];

// Available Officers for Assignment
const OFFICERS_LIST = [
  { id: 'usr-101', name: 'Rajesh Kumar (Nodal)' },
  { id: 'usr-102', name: 'Priya Sharma (DRO)' },
  { id: 'usr-103', name: 'Amit V. (Tahsildar)' },
  { id: 'usr-104', name: 'Suresh Gowda (VA)' },
  { id: 'usr-105', name: 'Kavitha R. (VA)' },
  { id: 'usr-106', name: 'Mahesh Reddy (Tahsildar)' },
  { id: 'usr-107', name: 'Sunil Verma (DRO)' },
  { id: 'usr-108', name: 'Ananya Rao (Survey Officer)' }
];

export default function AdminJurisdictionTab() {

  const [jurisdictions, setJurisdictions] = useState(INITIAL_JURISDICTIONS);
  
  // Access Control Simulation: Admin's scope restriction
  const [currentAdminRole, setCurrentAdminRole] = useState({
    name: 'Priya Sharma (DRO)',
    allowedScope: 'Bengaluru Urban', // Can only manage items under Bengaluru Urban
    unrestricted: false
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOfficer, setFilterOfficer] = useState('All');

  // Interactive UI states
  const [expandedRows, setExpandedRows] = useState(['jur-state-1', 'jur-dist-1']);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [viewModalData, setViewModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [assignModalData, setAssignModalData] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState(null);

  // Feedback Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const canManage = (item) => {
    if (currentAdminRole.unrestricted) return true;
    if (item.name === currentAdminRole.allowedScope) return true;
    if (item.parentName === currentAdminRole.allowedScope) return true;
    // Check deep ancestry (simplified check for mock)
    const parent = jurisdictions.find(j => j.id === item.parentId);
    if (parent && parent.parentName === currentAdminRole.allowedScope) return true;
    return false;
  };

  const metrics = useMemo(() => {
    const counts = { State: 0, District: 0, 'Tehsil/Block': 0, Village: 0 };
    let totalProjects = 0;
    let totalOfficers = 0;

    jurisdictions.forEach(j => {
      if (counts[j.type] !== undefined) counts[j.type]++;
      totalProjects += j.projectsCount;
      totalOfficers += j.officersCount;
    });

    return { ...counts, totalProjects, totalOfficers };
  }, [jurisdictions]);

  const filteredJurisdictions = useMemo(() => {
    return jurisdictions.filter(j => {
      const matchesSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            j.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || j.type === filterType;
      const matchesStatus = filterStatus === 'All' || j.status === filterStatus;
      const matchesOfficer = filterOfficer === 'All' || j.adminName === filterOfficer;

      return matchesSearch && matchesType && matchesStatus && matchesOfficer;
    });
  }, [jurisdictions, searchQuery, filterType, filterStatus, filterOfficer]);

  const toggleRowExpand = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = (item) => {
    if (!canManage(item)) {
      showToast('Access Denied: You cannot modify this jurisdiction scope.', 'error');
      setActiveMenuId(null);
      return;
    }

    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setConfirmModalData({
      title: `${nextStatus === 'Active' ? 'Activate' : 'Deactivate'} Jurisdiction`,
      message: `Are you sure you want to change status of "${item.name}" to ${nextStatus}?`,
      onConfirm: () => {
        setJurisdictions(prev =>
          prev.map(j => j.id === item.id ? { ...j, status: nextStatus } : j)
        );
        showToast(`Status updated to ${nextStatus} for ${item.name}`);
        setConfirmModalData(null);
      }
    });
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedName = formData.get('name');
    const updatedGeo = formData.get('boundaryGeoJSON');

    if (!updatedName) {
      showToast('Jurisdiction Name is required', 'error');
      return;
    }

    setJurisdictions(prev =>
      prev.map(j =>
        j.id === editModalData.id
          ? { ...j, name: updatedName, boundaryGeoJSON: updatedGeo }
          : j
      )
    );
    showToast(`Jurisdiction "${updatedName}" updated successfully.`);
    setEditModalData(null);
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedOfficerId = formData.get('officerId');
    const officerObj = OFFICERS_LIST.find(o => o.id === selectedOfficerId);

    if (!officerObj) return;

    setJurisdictions(prev =>
      prev.map(j =>
        j.id === assignModalData.id
          ? { ...j, adminId: officerObj.id, adminName: officerObj.name }
          : j
      )
    );
    showToast(`Assigned ${officerObj.name} to ${assignModalData.name}`);
    setAssignModalData(null);
  };

  // Render tree row recursively or linearly based on view
  const renderJurisdictionTree = (parentId = null, depth = 0) => {
    const nodes = filteredJurisdictions.filter(j => j.parentId === parentId);
    if (nodes.length === 0) return null;

    return nodes.map(node => {
      const hasChildren = jurisdictions.some(j => j.parentId === node.id);
      const isExpanded = expandedRows.includes(node.id);
      const isPermitted = canManage(node);

      return (
        <React.Fragment key={node.id}>
          <tr
            className={`border-b border-gray-100 hover:bg-slate-50 transition-colors ${
              selectedJurisdiction?.id === node.id ? 'bg-emerald-50/60' : ''
            }`}
          >
            {/* Name + Hierarchy indentation */}
            <td className="py-3 px-4">
              <div
                className="flex items-center space-x-2"
                style={{ paddingLeft: `${depth * 1.5}rem` }}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggleRowExpand(node.id)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-500"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <span className="w-6" />
                )}
                <span
                  onClick={() => setSelectedJurisdiction(node)}
                  className="font-medium text-slate-800 hover:text-emerald-600 cursor-pointer flex items-center space-x-1.5"
                >
                  <span>{node.name}</span>
                  {!isPermitted && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-normal">
                      Read-Only
                    </span>
                  )}
                </span>
              </div>
            </td>

            {/* Type */}
            <td className="py-3 px-4 text-sm">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                node.type === 'State' ? 'bg-purple-100 text-purple-700' :
                node.type === 'District' ? 'bg-blue-100 text-blue-700' :
                node.type === 'Tehsil/Block' ? 'bg-indigo-100 text-indigo-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {node.type}
              </span>
            </td>

            {/* Parent */}
            <td className="py-3 px-4 text-sm text-gray-600">{node.parentName}</td>

            {/* Projects */}
            <td className="py-3 px-4 text-sm text-gray-700 font-medium">
              <div className="flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span>{node.projectsCount}</span>
              </div>
            </td>

            {/* Officers */}
            <td className="py-3 px-4 text-sm text-gray-700">
              <div className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>{node.officersCount}</span>
              </div>
            </td>

            {/* Admin / Officer */}
            <td className="py-3 px-4 text-sm text-slate-700">
              <div className="text-xs font-medium text-slate-900">{node.adminName}</div>
            </td>

            {/* Status */}
            <td className="py-3 px-4 text-sm">
              <span className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                node.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span>{node.status}</span>
              </span>
            </td>

            {/* Actions */}
            <td className="py-3 px-4 text-sm text-right relative">
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => setViewModalData(node)}
                  className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* 3-Dot Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === node.id ? null : node.id)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === node.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-30 text-left py-1 animate-in fade-in duration-150">
                      <button
                        onClick={() => {
                          if (!isPermitted) {
                            showToast('Access Denied for editing this scope', 'error');
                            setActiveMenuId(null);
                            return;
                          }
                          setEditModalData(node);
                          setActiveMenuId(null);
                        }}
                        className={`w-full px-4 py-2 text-xs text-slate-700 flex items-center space-x-2 ${
                          isPermitted ? 'hover:bg-slate-50 hover:text-emerald-600' : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(node)}
                        className={`w-full px-4 py-2 text-xs text-slate-700 flex items-center space-x-2 ${
                          isPermitted ? 'hover:bg-slate-50 hover:text-amber-600' : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{node.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!isPermitted) {
                            showToast('Access Denied for assigning officers here', 'error');
                            setActiveMenuId(null);
                            return;
                          }
                          setAssignModalData(node);
                          setActiveMenuId(null);
                        }}
                        className={`w-full px-4 py-2 text-xs text-slate-700 flex items-center space-x-2 ${
                          isPermitted ? 'hover:bg-slate-50 hover:text-blue-600' : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Admin</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedJurisdiction(node);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-2 border-t border-gray-100"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span>Manage Coverage (Map)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>

          {/* Render Children if expanded */}
          {isExpanded && renderJurisdictionTree(node.id, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <>
    <Header title="Jurisdication"/>
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all transform animate-bounce ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span>BHOOMI-AI Jurisdiction Control</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Admin Portal
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage administrative boundaries, field officers, and spatial project assignments.
          </p>
        </div>

        {/* Access Control Switcher (Demo Feature) */}
        <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <div className="text-xs">
            <span className="text-slate-500 block">Active Scope Context:</span>
            <span className="font-semibold text-slate-800">
              {currentAdminRole.unrestricted ? 'Super Admin (All Scope)' : currentAdminRole.allowedScope}
            </span>
          </div>
          <button
            onClick={() =>
              setCurrentAdminRole(prev => ({
                ...prev,
                unrestricted: !prev.unrestricted
              }))
            }
            className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded text-slate-700 font-medium transition-colors"
          >
            Switch Scope Mode
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'States', count: metrics.State, icon: Building2, color: 'text-purple-600 bg-purple-50' },
          { title: 'Districts', count: metrics.District, icon: Layers, color: 'text-blue-600 bg-blue-50' },
          { title: 'Tehsils/Blocks', count: metrics['Tehsil/Block'], icon: MapPin, color: 'text-indigo-600 bg-indigo-50' },
          { title: 'Villages', count: metrics.Village, icon: MapIcon, color: 'text-emerald-600 bg-emerald-50' },
          { title: 'Total Projects', count: metrics.totalProjects, icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
          { title: 'Active Officers', count: metrics.totalOfficers, icon: Users, color: 'text-rose-600 bg-rose-50' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{item.title}</p>
                <p className="text-lg font-bold text-slate-800">{item.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search jurisdiction name, parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Types</option>
            <option value="State">State</option>
            <option value="District">District</option>
            <option value="Tehsil/Block">Tehsil/Block</option>
            <option value="Village">Village</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Officer Filter */}
          <select
            value={filterOfficer}
            onChange={(e) => setFilterOfficer(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Admins</option>
            {OFFICERS_LIST.map(o => (
              <option key={o.id} value={o.name}>{o.name}</option>
            ))}
          </select>

          {/* Reset Filters Button */}
          {(searchQuery || filterType !== 'All' || filterStatus !== 'All' || filterOfficer !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('All');
                setFilterStatus('All');
                setFilterOfficer('All');
              }}
              className="text-xs text-rose-600 hover:underline flex items-center space-x-1 px-2 py-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT SPLIT: TABLE & GIS MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* JURISDICTION HIERARCHY TABLE (2 Cols Wide) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Jurisdiction Hierarchy & Coverage</span>
            </h2>
            <span className="text-xs text-slate-400">Showing {filteredJurisdictions.length} records</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-4">Jurisdiction Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Parent</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Officers</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJurisdictions.length > 0 ? (
                  // Render root level first; tree recursively expands
                  renderJurisdictionTree(null, 0)
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      No jurisdiction boundaries found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GIS MAP PANEL (1 Col Wide) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
              <MapIcon className="w-4 h-4 text-emerald-600" />
              <span>GIS Boundary Viewer</span>
            </h2>
            {selectedJurisdiction && (
              <button
                onClick={() => setSelectedJurisdiction(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Interactive GIS Canvas Mock */}
          <div className="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Grid Map Vector Graphic Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Simulating Shape Boundaries */}
            <div className="relative z-10 text-center p-4">
              {selectedJurisdiction ? (
                <div className="bg-slate-800/90 backdrop-blur border border-emerald-500/30 p-4 rounded-xl shadow-xl max-w-xs text-left animate-in fade-in">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJurisdiction.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Type: {selectedJurisdiction.type}</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
                    {selectedJurisdiction.boundaryGeoJSON}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-700 pt-2">
                    <span>Projects: {selectedJurisdiction.projectsCount}</span>
                    <span>Officers: {selectedJurisdiction.officersCount}</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center space-y-2">
                  <MapPin className="w-8 h-8 text-emerald-500/50 animate-bounce" />
                  <span>Click any jurisdiction in table to view spatial GIS boundaries & project clusters.</span>
                </div>
              )}
            </div>

            {/* Simulated Overlay Control Legend */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2.5 py-1.5 rounded border border-slate-800 text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active Boundary</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Project Cluster</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700 block mb-0.5">Spatial Layer Info</span>
            GeoJSON polygon data automatically syncs with state, district, and village revenue records for land governance.
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL DIALOGS */}
      {/* ========================================== */}

      {/* VIEW MODAL */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Jurisdiction Details: {viewModalData.name}</span>
              </h3>
              <button onClick={() => setViewModalData(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Jurisdiction Level</span>
                  <span className="font-medium text-slate-800">{viewModalData.type}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Parent Unit</span>
                  <span className="font-medium text-slate-800">{viewModalData.parentName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Assigned Nodal Officer</span>
                  <span className="font-medium text-slate-800">{viewModalData.adminName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Operational Status</span>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                    viewModalData.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {viewModalData.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Active Land Projects</span>
                  <span className="font-medium text-slate-800">{viewModalData.projectsCount}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Field Officers Assigned</span>
                  <span className="font-medium text-slate-800">{viewModalData.officersCount}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">GIS Boundary Geometry</span>
                <p className="bg-slate-100 p-2.5 rounded text-xs font-mono break-all text-slate-600">
                  {viewModalData.boundaryGeoJSON}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewModalData(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <form onSubmit={handleSaveEdit}>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <Edit2 className="w-4 h-4 text-emerald-600" />
                  <span>Edit Jurisdiction: {editModalData.name}</span>
                </h3>
                <button type="button" onClick={() => setEditModalData(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Jurisdiction Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editModalData.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Boundary GeoJSON Data</label>
                  <textarea
                    name="boundaryGeoJSON"
                    rows={4}
                    defaultValue={editModalData.boundaryGeoJSON}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN OFFICER MODAL */}
      {assignModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <form onSubmit={handleSaveAssignment}>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Assign Nodal Admin Officer</span>
                </h3>
                <button type="button" onClick={() => setAssignModalData(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500">
                  Select a registered officer to grant administrative control over <strong>{assignModalData.name}</strong>.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Select Officer</label>
                  <select
                    name="officerId"
                    defaultValue={assignModalData.adminId}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {OFFICERS_LIST.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAssignModalData(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Assign Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">{confirmModalData.title}</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">{confirmModalData.message}</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setConfirmModalData(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmModalData.onConfirm}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}