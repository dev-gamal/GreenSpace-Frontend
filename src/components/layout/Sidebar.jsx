import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, CalendarCheck, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: 'My Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'My Listings', icon: <List size={20} />, path: '/listings' },
    { name: 'Bookings', icon: <CalendarCheck size={20} />, path: '/bookings', badge: 3 },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="hidden w-64 bg-white border-r h-[calc(100vh-65px)] md:flex md:flex-col justify-between sticky top-16.25">
      <div className="p-4 space-y-2 mt-4">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-green-700 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3 font-medium">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`w-5 h-5 flex items-center justify-center text-xs rounded-full ${isActive ? 'bg-green-600' : 'bg-green-100 text-green-700'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-6 mb-4">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-500 uppercase">
          <span>Profile Strength</span>
          <span className="text-green-600">60%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-600 w-[60%] rounded-full"></div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-800">Intermediate</p>
      </div>
    </aside>
  );
}