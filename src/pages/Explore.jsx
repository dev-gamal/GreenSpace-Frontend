import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Droplets, Maximize2,
  Heart, Sprout, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '../api/axiosConfig';

export default function Explore() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  const fetchGardens = async (city = '') => {
    try {
      setLoading(true);
      const response = await api.get(`/garden/search?city=${city}&minArea=0`);
      setGardens(response.data.content || []);
    } catch (error) {
      console.error("Error fetching gardens", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardens();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGardens(searchCity);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-px bg-green-700"></div>
          <span className="text-xs font-bold tracking-widest text-green-700 uppercase">
            Discover
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
          Explore Available Gardens
        </h1>
        <p className="text-gray-500 text-lg">
          Find unused urban spaces ready for transformation. Connect with owners offering fertile ground for your next project.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
        <Button type="submit" className="bg-green-700 hover:bg-green-800 rounded-xl px-6">
          Search
        </Button>
      </form>

      {/* Garden grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => (
            <Card key={n} className="h-80 bg-gray-100 animate-pulse border-none rounded-3xl" />
          ))}
        </div>
      ) : gardens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-400">
            <Sprout size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No gardens found.</h3>
          <p className="text-gray-500">Try a different search or check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {gardens.map((garden) => (
            <Link key={garden.id} to={`/garden/${garden.id}`}>
              <Card className="overflow-hidden transition-all duration-300 border border-gray-100 shadow-md hover:shadow-xl rounded-3xl group bg-white">
                <div className="relative w-full h-56 overflow-hidden bg-gray-200">
                  <img
                    src={garden.photoUrls?.length > 0 ? garden.photoUrls[0] : 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800'}
                    alt="Garden"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute px-3 py-1.5 text-xs font-bold text-white bg-green-800 rounded-lg top-4 left-4 shadow-sm">
                    {garden.status === 'AVAILABLE' ? 'Ready to Plant' : 'Occupied'}
                  </div>
                  <button className="absolute flex items-center justify-center w-10 h-10 text-gray-500 transition-colors bg-white rounded-full top-4 right-4 shadow-md hover:text-red-500">
                    <Heart size={18} />
                  </button>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <h3 className="text-xl font-bold leading-tight text-gray-900 truncate">
                      Garden in {garden.city}
                    </h3>
                  </div>

                  <div className="flex items-center mb-6 text-sm text-gray-500 font-medium">
                    <MapPin size={16} className="mr-1.5 text-gray-400" />
                    {garden.city}, {garden.postalCode || 'N/A'}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {garden.hasWaterAccess && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 rounded-md">
                        <Droplets size={14} /> Water Acc.
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-md">
                      <Sprout size={14} /> Full Sun
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md">
                      <Maximize2 size={14} /> {garden.area} sq ft
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
