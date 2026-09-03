import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, MessageSquare, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const navItems = [
    { name: 'Home', icon: <Home size={22} />, path: '/' },
    { name: 'Explore', icon: <Compass size={22} />, path: '/explore' },
    { name: 'Market', icon: <ShoppingBag size={22} />, path: '/market' },
    { name: 'Messages', icon: <MessageSquare size={22} />, path: '/messages' },
    { name: 'Profile', icon: <User size={22} />, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-t md:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.name} to={item.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-green-700' : 'text-gray-500 hover:text-green-600'}`}>
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}