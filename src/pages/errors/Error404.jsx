import { Link } from 'react-router-dom';
import { Sprout, Search, Home, Compass, Store, MapPin, Leaf, Sun, HelpCircle, User, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Error404() {
  const destinations = [
    { title: "Find Garden Plots", desc: "Shared urban yards", icon: <MapPin className="text-green-600" size={20} />, bg: "bg-green-100" },
    { title: "Heirloom Seeds", desc: "Community seed exc", icon: <Leaf className="text-orange-600" size={20} />, bg: "bg-orange-100" },
    { title: "Fresh Harvests", desc: "Seasonal organic loc", icon: <Sun className="text-yellow-600" size={20} />, bg: "bg-yellow-100" },
    { title: "Help & Support", desc: "Guides, land use byl", icon: <HelpCircle className="text-gray-600" size={20} />, bg: "bg-gray-200" },
    { title: "Contact Host", desc: "Connect with garder", icon: <User className="text-green-600" size={20} />, bg: "bg-green-100" },
    { title: "Soil & Compost", desc: "Free neighborhood", icon: <Droplets className="text-orange-600" size={20} />, bg: "bg-orange-100" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
        <Leaf size={16} /> SEED #404
      </div>

      <div className="relative w-64 h-48 mb-8">
        {/* Placeholder for the illustration */}
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="w-48 h-8 bg-gray-200 rounded-[100%] opacity-50 blur-sm"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end justify-center gap-4">
             <div className="w-1 h-24 bg-green-700 rounded-t-full transform -rotate-12"></div>
             <div className="w-1.5 h-32 bg-green-800 rounded-t-full relative">
                <div className="absolute top-2 -left-3 w-4 h-4 bg-yellow-400 rounded-full border-4 border-yellow-200"></div>
             </div>
             <div className="w-1 h-20 bg-green-600 rounded-t-full transform rotate-12"></div>
          </div>
        </div>
        <div className="absolute bottom-0 px-3 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full shadow-sm left-1/2 transform -translate-x-1/2 translate-y-1/2 whitespace-nowrap">
          <MapPin size={12} className="inline mr-1" /> Plot Unmapped
        </div>
      </div>

      <div className="inline-block px-4 py-1 mb-6 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
        <Sprout size={16} className="inline mr-2" /> Error 404 • Lost in the weeds
      </div>

      <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
        Looks like you've wandered<br />off the garden path.
      </h1>
      
      <p className="max-w-xl mb-10 text-lg text-gray-500">
        The plot or page you are looking for has been moved, harvested, or never existed in the first place. Let's get you back to familiar soil.
      </p>

      <div className="w-full max-w-2xl mb-10">
        <div className="relative flex items-center">
          <Search className="absolute text-gray-400 left-4" size={20} />
          <input 
            type="text" 
            placeholder="Search lands, seeds, produce, or community topics..." 
            className="w-full py-4 pl-12 pr-32 text-lg border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button className="absolute right-2 top-2 bottom-2 rounded-full bg-green-800 hover:bg-green-900 text-white px-6 font-semibold">
            Search →
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Button asChild className="gap-2 px-6 py-6 text-white bg-green-800 rounded-full hover:bg-green-900">
          <Link to="/">
            <Home size={18} /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2 px-6 py-6 text-green-800 bg-white border-gray-200 rounded-full hover:bg-gray-50 hover:text-green-900 shadow-sm">
          <Link to="/explore">
            <Compass size={18} /> Explore Available Lands
          </Link>
        </Button>
        <Button asChild variant="ghost" className="gap-2 px-6 py-6 text-gray-600 rounded-full hover:bg-gray-100">
          <Link to="/market">
            <Store size={18} /> Visit Community Market
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-4xl p-8 bg-white border-gray-100 shadow-xl rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
            <Compass size={16} className="text-green-700" /> Popular Destinations
          </h2>
          <span className="text-xs text-gray-500">Quick navigation</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {destinations.map((dest, i) => (
            <Link key={i} to="/" className="flex items-start gap-4 p-4 transition-colors rounded-2xl bg-gray-50 hover:bg-gray-100">
              <div className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full ${dest.bg}`}>
                {dest.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm">{dest.title}</h3>
                <p className="text-xs text-gray-500">{dest.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
