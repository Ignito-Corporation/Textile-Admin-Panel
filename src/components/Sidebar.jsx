import {
  Home,
  FileText,
  List,
  Settings,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: <Home size={18} />, label: 'Dashboard', to: '/dashboard' },
  { icon: <PlusCircle size={18} />, label: 'Create PO', to: '/create-po' },
  { icon: <List size={18} />, label: 'All POs', to: '/all-pos' },
  { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },
  { icon: <LogOut size={18} />, label: 'Logout', to: '/logout' }
];

export default function Sidebar({ collapsed }) {
  const location = useLocation();

  return (
    <div
      className={`bg-[#1f2a40] text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } h-full flex flex-col`}
    >
      <div className="px-4 py-6 text-sm border-b border-gray-700">
        {!collapsed ? (
          <>
            <div className="text-lg font-bold flex items-center gap-1">
              <Home size={20} /> Fabric PO
            </div>
            <div className="text-xs text-gray-400">Purchase Order Management</div>
          </>
        ) : (
          <div className="flex justify-center">
            <Home size={24} />
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={index}
              to={item.to}
              className={`flex items-center gap-3 text-sm px-3 py-2 rounded cursor-pointer transition-all
                ${isActive ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
