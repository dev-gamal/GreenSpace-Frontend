import { Link } from 'react-router-dom';
import { Search, Bell, Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3 mx-auto md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-50 rounded-lg">
            <Leaf size={20} />
          </div>
          <span className="text-xl font-bold text-green-800">GreenSpace</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-gray-500 md:flex">
          <Link to="/" className="text-green-700 font-semibold">Home</Link>
          <Link to="/explore" className="hover:text-green-700">Explore</Link>
          <Link to="/market" className="hover:text-green-700">Market</Link>
          <Link to="/messages" className="hover:text-green-700">Messages</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden gap-4 text-gray-400 md:flex">
            <button className="hover:text-gray-600"><Search size={20} /></button>
            <button className="hover:text-gray-600"><Bell size={20} /></button>
          </div>
          
          <div className="hidden w-px h-6 bg-gray-200 md:block"></div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 uppercase md:normal-case md:text-gray-900">
              <span className="md:hidden">Profile</span>
              <span className="hidden md:inline">Alex River</span>
            </span>
            <img 
              src="https://i.pravatar.cc/150?img=32" 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-200 object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}