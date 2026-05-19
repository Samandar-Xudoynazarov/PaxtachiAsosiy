import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import {
  LayoutDashboard, Users, Map, FileText, Tractor, Droplets,
  Flower2, UserCheck, MapPin, Award, UserCog, FileSpreadsheet,
  Settings, LogOut, Leaf, Menu, X, Bell, ChevronRight, ClipboardList,
} from 'lucide-react'
import { getInitials } from '../utils/helpers'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { path: '/farmers', label: 'Fermerlar', icon: <Users size={18} /> },
  { path: '/land-balance', label: 'Yer balansi', icon: <Map size={18} /> },
  { path: '/cadastre', label: 'Kadastr yer yozuvlari', icon: <FileText size={18} /> },
  { path: '/agro-technics', label: 'Agro texnikalar', icon: <Tractor size={18} /> },
  { path: '/pump-stations', label: 'Nasos stansiyalari', icon: <Droplets size={18} /> },
  { path: '/greenhouse', label: 'Issiqxona yozuvlari', icon: <Flower2 size={18} /> },
  { path: '/representatives', label: 'Fermer vakillari', icon: <UserCheck size={18} /> },
  { path: '/land-contours', label: 'Yer konturlari', icon: <MapPin size={18} /> },
  { path: '/specializations', label: 'Ixtisosliklar', icon: <Award size={18} /> },
  { path: '/users', label: 'Foydalanuvchilar', icon: <UserCog size={18} /> },
  { path: '/excel-import', label: 'Excel import', icon: <FileSpreadsheet size={18} /> },
  { path: '/reports', label: 'Hisobotlar va Buyruqlar', icon: <ClipboardList size={18} /> },
  { path: '/settings', label: 'Sozlamalar', icon: <Settings size={18} /> },
]

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const currentPage = navItems.find((n) =>
    n.path === '/' ? location.pathname === '/' : location.pathname.startsWith(n.path)
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="shrink-0 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl p-2 shadow-md">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-display font-bold text-slate-800 text-lg leading-none">Paxtachi</span>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Boshqaruv paneli</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-sm border border-primary-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <span className={`shrink-0 transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <ChevronRight size={14} className="text-primary-400" />}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-100 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getInitials(user?.username || 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
              <p className="text-xs text-slate-400 truncate">{user?.direction || 'Admin'}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
              title="Chiqish"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex justify-center p-2.5 rounded-xl hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
            title="Chiqish"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl border-r border-slate-100 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar — desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-100 shadow-sm sidebar-transition ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-slate-100 px-4 lg:px-6 py-4 flex items-center gap-4 shadow-sm">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {collapsed ? <Menu size={20} className="text-slate-600" /> : <X size={20} className="text-slate-600" />}
          </button>

          {/* Breadcrumb */}
          <div className="flex-1">
            <h1 className="font-display font-bold text-slate-800 text-lg leading-none">
              {currentPage?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {getInitials(user?.username || 'U')}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
