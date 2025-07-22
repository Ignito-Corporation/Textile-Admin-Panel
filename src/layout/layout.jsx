import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-20">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex flex-col w-full transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        {/* Fixed Topbar */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <Topbar onToggle={() => setCollapsed(!collapsed)} />
        </div>

        {/* Routed Page Content */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
