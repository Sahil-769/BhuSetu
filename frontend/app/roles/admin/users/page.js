'use client'

import { useEffect, useMemo, useState } from 'react'
import {Header} from '../../../component/layout/index'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  KeyRound,
  MapPinned,
  MoreVertical,
  Search,
  ShieldCheck,
  Users,
  X
} from 'lucide-react'

const roleStyles = {
  'Project Officer': 'bg-sky-50 text-sky-700 ring-sky-200',
  'Land Acquisition Officer': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Nodal Officer': 'bg-violet-50 text-violet-700 ring-violet-200',
  'System Admin': 'bg-amber-50 text-amber-700 ring-amber-200'
}

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Inactive: 'bg-slate-200 text-slate-700 ring-slate-300',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Suspended: 'bg-rose-50 text-rose-700 ring-rose-200'
}

const roleOptions = ['Project Officer', 'Land Acquisition Officer', 'Nodal Officer', 'System Admin']
const jurisdictionOptions = ['District Level', 'Tehsil Level', 'State Level', 'All States']
const statusOptions = ['Active', 'Inactive', 'Pending', 'Suspended']

const normalizeUser = (user) => {
  const assignedProjects = Array.isArray(user.assignedProjects)
    ? user.assignedProjects
    : typeof user.assignedProjects === 'number'
      ? Array.from({ length: Math.max(user.assignedProjects, 1) }, (_, index) => ({
          id: `PROJ-${String(index + 1).padStart(3, '0')}`,
          title: `Project ${index + 1}`
        }))
      : []

  return {
    ...user,
    id: user.id || user.employeeId,
    role: user.role || 'Project Officer',
    status: user.status || 'Active',
    jurisdiction: user.jurisdiction || 'District Level',
    department: user.department || 'Project Management',
    phone: user.phone || '+91 00000 00000',
    district: user.district || 'Lucknow',
    email: user.email || `${user.name?.toLowerCase().replace(/\s+/g, '.')}@bhoomi.gov.in`,
    assignedProjects,
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
    recentActivity: Array.isArray(user.recentActivity) ? user.recentActivity : [],
    account: user.account || {
      createdAt: 'N/A',
      lastPasswordReset: 'N/A',
      securityLevel: 'Standard'
    }
  }
}

const getStoredUsers = () => {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem('bhoomiUsersData')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveStoredUsers = (users) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('bhoomiUsersData', JSON.stringify(users))
  }
}

const getStoredJurisdiction = () => {
  if (typeof window === 'undefined') return 'All States'

  const storedProfile = window.localStorage.getItem('adminProfile') || window.localStorage.getItem('currentProfile') || window.localStorage.getItem('selectedProfile')
  if (!storedProfile) return 'All States'

  try {
    const parsed = JSON.parse(storedProfile)
    return parsed?.jurisdiction || 'All States'
  } catch {
    return 'All States'
  }
}

const shortRole = (role) => {
  if (!role) return 'PO'
  const mapping = {
    'Project Officer': 'PO',
    'Land Acquisition Officer': 'LAO',
    'Nodal Officer': 'NO',
    'System Admin': 'SA'
  }
  return mapping[role] || role.slice(0, 2).toUpperCase()
}

const shortDepartment = (department) => {
  if (!department) return 'PM'
  const words = department.split(' ')
  return words.length > 1 ? words.map((word) => word[0]).slice(0, 2).join('').toUpperCase() : department.slice(0, 2).toUpperCase()
}

const projectSummary = (projects, max = 2) => {
  if (!Array.isArray(projects) || projects.length === 0) return 'None'

  const items = projects.slice(0, max).map((project) => project?.title || project || 'Project')
  const extra = projects.length - items.length

  return extra > 0 ? `${items.join(', ')} +${extra}` : items.join(', ')
}

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [districtFilter, setDistrictFilter] = useState('All Districts')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editorUser, setEditorUser] = useState(null)
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError('')

        const savedUsers = getStoredUsers()
        if (savedUsers.length > 0) {
          setUsers(savedUsers.map(normalizeUser))
          setLoading(false)
          return
        }

        const response = await fetch('/data/users.json')
        if (!response.ok) throw new Error('Unable to load user records.')

        const data = await response.json()
        const jurisdiction = getStoredJurisdiction()
        const scopedUsers = jurisdiction === 'All States'
          ? data
          : data.filter((user) => user.jurisdiction === jurisdiction || user.district === jurisdiction)

        const normalized = scopedUsers.map(normalizeUser)
        setUsers(normalized)
        saveStoredUsers(normalized)
      } catch (loadError) {
        setError(loadError.message || 'Something went wrong while loading users.')
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const haystack = [user.name, user.employeeId, user.role, user.district, user.department].join(' ').toLowerCase()
      const matchesSearch = haystack.includes(search.toLowerCase())
      const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
      const matchesDistrict = districtFilter === 'All Districts' || user.district === districtFilter
      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesDistrict && matchesStatus
    })
  }, [users, search, roleFilter, districtFilter, statusFilter])

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === 'Active').length
  const pendingUsers = users.filter((user) => user.status === 'Pending').length
  const jurisdictionValue = getStoredJurisdiction()

  const summaryCards = [
    { label: 'Total Users', value: totalUsers, icon: Users, tone: 'bg-sky-50 text-sky-700' },
    { label: 'Active', value: activeUsers, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Pending', value: pendingUsers, icon: ShieldCheck, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Jurisdiction', value: jurisdictionValue, icon: MapPinned, tone: 'bg-violet-50 text-violet-700' }
  ]

  const saveUsers = (nextUsers) => {
    const normalized = nextUsers.map(normalizeUser)
    setUsers(normalized)
    saveStoredUsers(normalized)
  }

  const handleToggleStatus = (userId) => {
    const currentUser = users.find((user) => user.id === userId)
    if (!currentUser) return

    const nextStatus = currentUser.status === 'Active' ? 'Inactive' : 'Active'
    const updated = users.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user))
    saveUsers(updated)
    setOpenMenuId(null)
  }

  const handleResetPassword = (userId) => {
    const user = users.find((entry) => entry.id === userId)
    if (!user) return

    const confirmed = window.confirm(`Reset the password for ${user.name}?`)
    if (!confirmed) return

    const updated = users.map((entry) => {
      if (entry.id !== userId) return entry
      return {
        ...entry,
        passwordResetAt: new Date().toISOString(),
        securityNote: 'Password reset requested by admin.'
      }
    })

    saveUsers(updated)
    setOpenMenuId(null)
  }

  const handleAssignRole = (userId) => {
    const user = users.find((entry) => entry.id === userId)
    if (!user) return

    const nextRole = window.prompt('Choose a role', user.role)
    if (!nextRole) return

    const cleanRole = nextRole.trim()
    if (!roleOptions.includes(cleanRole)) {
      setError('Please choose a valid role from the available options.')
      return
    }

    const updated = users.map((entry) => (entry.id === userId ? { ...entry, role: cleanRole } : entry))
    saveUsers(updated)
    setOpenMenuId(null)
    setError('')
  }

  const handleAssignJurisdiction = (userId) => {
    const user = users.find((entry) => entry.id === userId)
    if (!user) return

    const nextJurisdiction = window.prompt('Update jurisdiction', user.jurisdiction)
    if (!nextJurisdiction) return

    const cleanJurisdiction = nextJurisdiction.trim()
    if (!jurisdictionOptions.includes(cleanJurisdiction)) {
      setError('Please choose a valid jurisdiction level.')
      return
    }

    const updated = users.map((entry) => (entry.id === userId ? { ...entry, jurisdiction: cleanJurisdiction } : entry))
    saveUsers(updated)
    setOpenMenuId(null)
    setError('')
  }

  const handleAssignProject = (userId) => {
    const user = users.find((entry) => entry.id === userId)
    if (!user) return

    const value = window.prompt('Add project assignment (format: PROJECT-204 - Metro Corridor)', 'PROJECT-204 - Metro Corridor')
    if (!value) return

    const trimmed = value.trim()
    if (!trimmed.includes('-')) {
      setError('Project format must include a title, for example: PROJECT-204 - Metro Corridor.')
      return
    }

    const [projectId, ...titleParts] = trimmed.split('-')
    const projectTitle = titleParts.join('-').trim() || 'Assigned Project'
    const project = {
      id: projectId.trim(),
      title: projectTitle
    }

    const updated = users.map((entry) => {
      if (entry.id !== userId) return entry
      return {
        ...entry,
        assignedProjects: [...(Array.isArray(entry.assignedProjects) ? entry.assignedProjects : []), project]
      }
    })

    saveUsers(updated)
    setOpenMenuId(null)
    setError('')
  }

  const handleSaveEdit = () => {
    if (!editorUser?.name?.trim()) {
      setFormError('Name is required.')
      return
    }

    if (!editorUser.role || !roleOptions.includes(editorUser.role)) {
      setFormError('Please choose a valid role.')
      return
    }

    if (!editorUser.department?.trim()) {
      setFormError('Department is required.')
      return
    }

    if (!editorUser.jurisdiction || !jurisdictionOptions.includes(editorUser.jurisdiction)) {
      setFormError('Please choose a valid jurisdiction.')
      return
    }

    const updated = users.map((user) => (user.id === editorUser.id ? { ...user, ...editorUser } : user))
    saveUsers(updated)
    setEditorUser(null)
    setFormError('')
  }

  return (
    <>
    <Header title="Users"/>
    <div className="min-h-screen  px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 px-5 py-4 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Admin Panel</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">Users</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_35px_-32px_rgba(15,23,42,0.4)] transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-inner shadow-slate-100">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, employee ID, role, district"
                className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:w-[32rem]">
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                <option>All Roles</option>
                {roleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select value={districtFilter} onChange={(event) => setDistrictFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                <option>All Districts</option>
                {['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Patna', 'Bhopal', 'Jaipur', 'Delhi'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                <option>All Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.42)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Name', 'ID', 'Role', 'Department', 'Jurisdiction', 'Projects', 'Status', 'Last Login', 'Actions'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{heading}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">Loading user records…</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">No users found for the selected filters.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-sky-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-100 via-indigo-100 to-sky-200 text-xs font-bold text-sky-700">
                            {user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{user.employeeId}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${roleStyles[user.role] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                          {shortRole(user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{shortDepartment(user.department)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.jurisdiction}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{projectSummary(user.assignedProjects, 2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyles[user.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.lastLogin}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedUser(user)} className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <div className="relative">
                            <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100">
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {openMenuId === user.id && (
                              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200">
                                <button onClick={() => { setSelectedUser(user); setOpenMenuId(null) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">View</button>
                                <button onClick={() => { setEditorUser({ ...user }); setOpenMenuId(null); setFormError('') }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                                <button onClick={() => handleToggleStatus(user.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">{user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                                <button onClick={() => handleResetPassword(user.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Reset Password</button>
                                <button onClick={() => handleAssignRole(user.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Assign Role</button>
                                <button onClick={() => handleAssignJurisdiction(user.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Assign Jurisdiction</button>
                                <button onClick={() => handleAssignProject(user.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Assign Project</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_60px_-30px_rgba(15,23,42,0.7)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">User profile</p>
                <h2 className="text-xl font-bold text-slate-900">{selectedUser.name}</h2>
              </div>
              <button onClick={() => setSelectedUser(null)} className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-[26px] border border-sky-100 bg-linear-to-br from-sky-50 via-white to-indigo-50 p-4 shadow-inner shadow-sky-100">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-sky-200">
                      {selectedUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{selectedUser.name}</h3>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${roleStyles[selectedUser.role] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>{selectedUser.role}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{selectedUser.employeeId} • {selectedUser.department}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyles[selectedUser.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>{selectedUser.status}</span>
                    <button onClick={() => { setEditorUser({ ...selectedUser }); setSelectedUser(null); setFormError('') }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Edit</button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">District</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{selectedUser.district}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Jurisdiction</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{selectedUser.jurisdiction}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Assigned Projects</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{projectSummary(selectedUser.assignedProjects, 3)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Last Login</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{selectedUser.lastLogin}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Personal details</h4>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Email</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Phone</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Department</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.department}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Manager</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.manager || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Gender</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.gender || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Date of Birth</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.dateOfBirth || 'Not provided'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Address</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{selectedUser.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Account</h4>
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Created</p>
                      <p className="mt-1 font-semibold text-slate-800">{selectedUser.account?.createdAt || 'N/A'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Last Password Reset</p>
                      <p className="mt-1 font-semibold text-slate-800">{selectedUser.account?.lastPasswordReset || 'N/A'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Security Level</p>
                      <p className="mt-1 font-semibold text-slate-800">{selectedUser.account?.securityLevel || 'Standard'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Assigned permissions</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(selectedUser.permissions?.length ? selectedUser.permissions : ['View Records', 'Update Records']).map((permission) => (
                      <span key={permission} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">{permission}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Recent Activity</h4>
                  <div className="mt-4 space-y-3">
                    {(selectedUser.recentActivity?.length ? selectedUser.recentActivity : [{ title: 'Project review', detail: 'Reviewed project updates and assigned tasks.', time: 'Today' }]).map((item) => (
                      <div key={`${item.title}-${item.time}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-slate-800">{item.title}</p>
                          <span className="text-[11px] font-medium text-slate-500">{item.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setSelectedUser(null)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editorUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_28px_60px_-30px_rgba(15,23,42,0.7)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Edit User</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{editorUser.name}</h2>
              </div>
              <button onClick={() => { setEditorUser(null); setFormError('') }} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4" />
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-600">
                <span>Full Name</span>
                <input value={editorUser.name} onChange={(event) => setEditorUser((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-sky-400" />
              </label>

              <label className="space-y-1 text-sm text-slate-600">
                <span>Employee ID</span>
                <input value={editorUser.employeeId} onChange={(event) => setEditorUser((current) => ({ ...current, employeeId: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-sky-400" />
              </label>

              <label className="space-y-1 text-sm text-slate-600">
                <span>Role</span>
                <select value={editorUser.role} onChange={(event) => setEditorUser((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-sky-400">
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-slate-600">
                <span>Department</span>
                <input value={editorUser.department} onChange={(event) => setEditorUser((current) => ({ ...current, department: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-sky-400" />
              </label>

              <label className="space-y-1 text-sm text-slate-600">
                <span>Jurisdiction</span>
                <select value={editorUser.jurisdiction} onChange={(event) => setEditorUser((current) => ({ ...current, jurisdiction: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-sky-400">
                  {jurisdictionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-slate-600">
                <span>Status</span>
                <select value={editorUser.status} onChange={(event) => setEditorUser((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-sky-400">
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={() => { setEditorUser(null); setFormError('') }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
              <button onClick={handleSaveEdit} className="rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200 hover:from-sky-500 hover:to-indigo-500">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default UsersPage