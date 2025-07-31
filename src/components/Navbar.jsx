import { useState } from 'react';
import {
  Home,
  List,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  ClipboardList
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: <Home size={18} />, label: 'Dashboard', to: '/dashboard' },
  { icon: <PlusCircle size={18} />, label: 'Create PO', to: '/create-po' },
  { icon: <List size={18} />, label: 'Create Purchase Bill', to: '/create-purchase-bill' },
  { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },
  { icon: <ClipboardList size={18} />, label: 'Final Stock', to: '/final-stock' },
  { icon: <LogOut size={18} />, label: 'Logout', to: '/logout' },
];

export default function Navbar({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#1f2a40] text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'
          } h-full flex flex-col fixed top-0 left-0 z-20`}
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

      {/* Main Content + Topbar */}
      <div
        className={`flex flex-col w-full transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'
          }`}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white shadow px-4 py-2 flex justify-between items-center">
          <button onClick={handleToggle} className="text-gray-700">
            <Menu size={24} />
          </button>
          <div className="text-sm text-gray-600">Welcome, Admin</div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
