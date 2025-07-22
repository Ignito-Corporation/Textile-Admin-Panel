import { Menu } from 'lucide-react';

export default function Topbar({ onToggle }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <button onClick={onToggle} className="text-gray-700">
        <Menu size={24} />
      </button>
      <div className="text-sm text-gray-600">Welcome, Admin</div>
    </div>
  );
}
