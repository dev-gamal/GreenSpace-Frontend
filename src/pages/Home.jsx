import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Calendar, Sprout, PlusCircle, ShoppingBasket, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '../api/axiosConfig';

export default function Home() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ gardens: [], reservations: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === 'OWNER') {
          const gardensRes = await api.get(`/garden/owner/${user.id}`);
          const requestsRes = await api.get(`/reservations/owner/${user.id}/requests`);
          setData({ gardens: gardensRes.data.content || [], reservations: requestsRes.data.content || [] });
        } else if (user?.role === 'GARDENER') {
          const gardensRes = await api.get(`/garden/search?city=&minArea=0`);
          const myRes = await api.get(`/reservations/gardener/${user.id}`);
          setData({ gardens: gardensRes.data.content || [], reservations: myRes.data.content || [] });
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (!user) return null;

  const isOwner = user.role === 'OWNER';

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Sprout className="w-8 h-8 text-green-600" />
            Hello, {user.firstName} !
          </h1>
          <p className="mt-1 text-gray-500">
            Space {isOwner ? 'Owner' : 'Gardener'} • Ready to cultivate your day?
          </p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        {isOwner ? (
          <Link to="/add-garden">
            <Button className="flex items-center justify-center w-full gap-2 bg-green-600 h-14 hover:bg-green-700">
              <PlusCircle className="w-5 h-5" /> Add a new space
            </Button>
          </Link>
        ) : (
          <Link to="/search-garden">
            <Button className="flex items-center justify-center w-full gap-2 bg-green-600 h-14 hover:bg-green-700">
              <MapPin className="w-5 h-5" /> Find a garden
            </Button>
          </Link>
        )}
        <Link to="/market">
          <Button variant="secondary" className="flex items-center justify-center w-full gap-2 h-14">
            <ShoppingBasket className="w-5 h-5" /> Solidaire Market
          </Button>
        </Link>
        <Link to="/calendar">
          <Button variant="outline" className="flex items-center justify-center w-full gap-2 h-14">
            <Calendar className="w-5 h-5" /> My Calendar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        <div className="space-y-6 lg:col-span-2">
          <h2 className="pb-2 text-xl font-semibold text-gray-800 border-b">
            {isOwner ? 'My shared spaces' : 'Available gardens near you'}
          </h2>
          
          {loading ? (
            <div className="text-gray-500 animate-pulse">Loading spaces...</div>
          ) : data.gardens.length === 0 ? (
            <Card className="bg-white border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Leaf className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-gray-500">No gardens found at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.gardens.map((garden, idx) => (
                <Card key={idx} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-center h-32 bg-green-100">
                    <Sprout className="w-10 h-10 text-green-300" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{garden.city || "Jardin Urbain"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4"/> {garden.area || 0} m² available
                    </p>
                    <Button variant="link" className="h-auto p-0 mt-4 text-green-600">
                      View details →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="pb-2 text-xl font-semibold text-gray-800 border-b">
            {isOwner ? 'Pending Requests' : 'My Reservations'}
          </h2>
          
          {loading ? (
            <div className="text-gray-500 animate-pulse">Loading...</div>
          ) : data.reservations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No Requests or Reservations at the moment.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {data.reservations.map((res, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Garden #{res.gardenId}</p>
                        <p className="text-sm text-gray-500">Status : {res.status}</p>
                      </div>
                      <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                        {res.status === 'PENDING' ? 'Pending' : 'Approved'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}