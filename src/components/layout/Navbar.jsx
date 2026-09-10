import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3 mx-auto md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-50 rounded-lg">
            <Leaf size={20} />
          </div>
          <span className="text-xl font-bold text-green-800">GreenSpace</span>
        </Link>

        {/* Liens Desktop */}
        <nav className="hidden gap-8 text-sm font-medium text-gray-500 md:flex">
          {navLinks.map((link) => {
            const isActive = 
              location.pathname === link.path || 
              (link.path === '/explore' && location.pathname.startsWith('/garden/'));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={isActive ? 'text-green-700 font-semibold' : 'hover:text-green-700'}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Profil */}
        <div className="flex items-center gap-4">
          <div className="hidden gap-4 text-gray-400 md:flex">
            <button className="hover:text-gray-600"><Search size={20} /></button>
            <button className="hover:text-gray-600"><Bell size={20} /></button>
          </div>
          
          <div className="hidden w-px h-6 bg-gray-200 md:block"></div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-3 p-1 pr-3 transition-colors rounded-full hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700 md:text-gray-900">
                <span className="md:hidden">Profil</span>
                <span className="hidden md:inline">{user?.firstName} {user?.lastName}</span>
              </span>
              <div className="flex items-center justify-center w-8 h-8 text-white bg-green-700 border-2 border-green-200 rounded-full shadow-sm">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            </Link>
            {user && (
              <button 
                onClick={logout}
                className="flex items-center justify-center p-2 text-gray-400 transition-colors rounded-full hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}