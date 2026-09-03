import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Bell, MapPin, Droplets, Maximize2, 
  Heart, Users, Home as HomeIcon, Compass, ShoppingBag, 
  MessageSquare, User, Leaf, LogOut, PlusCircle, Sprout 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Home() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gardens, setGardens] = useState([]);

const isOwner = user?.role === 'OWNER';

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        if (isOwner) {
          const response = await api.get(`/garden/owner/${user.id}`);
          setGardens(response.data.content || []);
        } else {
          const response = await api.get(`/garden/search?city=&minArea=0`);
          setGardens(response.data.content || []);
        }
      } catch (error) {
        console.error("Error while fetching gardens", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchGardens();
  }, [user, isOwner]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 bg-gray-50 md:pb-0">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-100 rounded-md">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-green-800">GreenSpace</span>
          </div>

          <nav className="items-center hidden gap-8 text-sm font-medium text-gray-600 md:flex">
            <Link to="/" className="font-semibold text-green-700">Home</Link>
            <Link to="/recherche" className="hover:text-green-700">Explore</Link>
            <Link to="/marche" className="hover:text-green-700">Market</Link>
            <Link to="/reservations" className="hover:text-green-700">Reservations</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden text-gray-500 md:flex hover:text-gray-900">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium md:block">{user.firstName}</span>
              <div className="flex items-center justify-center w-8 h-8 text-white bg-green-700 border rounded-full">
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative w-full h-150 md:h-125">
        <div 
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1466692476877-66184767f00a?auto=format&fit=crop&q=80&w=2000")' }}
        >
          <div className="absolute inset-0 bg-black/40 md:bg-linear-to-r md:from-black/70 md:to-transparent" />
        </div>

        <div className="relative flex flex-col justify-center h-full max-w-3xl px-4 mx-auto container">
          <span className="hidden px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full md:inline-block bg-white/20 backdrop-blur-sm w-max">
            Community Ecosystem
          </span>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Sharing the land, <br/>
            <span className="text-green-400">Cultivating together.</span>
          </h1>
          <p className="max-w-xl mb-8 text-lg text-gray-200 md:text-xl">
            Join the network that connects engaged landowners with urban gardening enthusiasts.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            {isOwner ? (
              <Button asChild size="lg" className="h-12 gap-2 px-6 text-base text-white bg-green-700 rounded-full hover:bg-green-800">
                <Link to="/ajouter-jardin">
                  <PlusCircle size={18} /> Add a garden
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-12 gap-2 px-6 text-base text-white bg-green-700 rounded-full hover:bg-green-800">
                <Link to="/recherche">
                  <Search size={18} /> Find a garden
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="h-12 gap-2 px-6 text-base text-white border-white/30 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm hover:text-white">
              <Link to="/marche">
                <ShoppingBag size={18} /> View the market
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute left-0 right-0 hidden -bottom-10 md:block container mx-auto px-4">
          <Card className="flex items-center justify-around p-6 shadow-lg rounded-2xl border-none">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-green-700 bg-green-100 rounded-full">
                <Leaf size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">12,500 kg</h3>
                <p className="text-sm text-gray-500">Shared harvests</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-full">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">1,840</h3>
                <p className="text-sm text-gray-500">Active gardeners</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-900/10 text-amber-900 rounded-full">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">350 ha</h3>
                <p className="text-sm text-gray-500">Urban lands revitalized</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <main className="px-4 py-12 mx-auto container md:pt-24 md:pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="hidden mb-2 text-sm font-semibold tracking-widest text-green-700 uppercase md:block">
              {isOwner ? "Your lands" : "New opportunities"}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {isOwner ? "My shared spaces" : "Available lands"}
            </h2>
            <p className="hidden mt-2 text-gray-600 md:block">
              {isOwner ? "Manage the spaces you have made available." : "Discover spaces ready to be transformed."}
            </p>
          </div>
          <Button variant="link" className="flex items-center gap-1 font-medium text-green-700">
            View on the map <span className="hidden md:inline">→</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map(n => (
              <Card key={n} className="h-64 bg-gray-100 animate-pulse border-none rounded-2xl" />
            ))}
          </div>
        ) : gardens.length === 0 ? (
          <div className="py-20 text-center text-gray-500 border-2 border-dashed rounded-2xl">
            <Sprout className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No space found at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {gardens.map((garden) => (
              <Card key={garden.id} className="overflow-hidden transition-shadow border shadow-sm group hover:shadow-md rounded-2xl">
                <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                  <img 
                    src={garden.photoUrls?.length > 0 ? garden.photoUrls[0] : 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800'} 
                    alt="Jardin" 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute px-2 py-1 text-xs font-semibold text-white bg-green-800 rounded-md top-3 left-3">
                    {garden.status === 'AVAILABLE' ? 'Available' : 'Occupied'}
                  </div>
                  <button className="absolute flex items-center justify-center w-8 h-8 text-gray-500 transition-colors rounded-full top-3 right-3 bg-white/90 backdrop-blur hover:text-red-500">
                    <Heart size={16} />
                  </button>
                </div>
                
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold leading-tight text-gray-900">
                      Garden in {garden.city}
                    </h3>
                  </div>
                  <div className="flex items-center mb-4 text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    Code postal: {garden.postalCode || 'N/A'}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                      <Maximize2 size={14} /> {garden.area} m²
                    </span>
                    {garden.hasWaterAccess && (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                        <Droplets size={14} /> Water Access
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* 4. Footer Desktop */}
      <footer className="hidden py-8 border-t bg-gray-50 md:block">
        <div className="flex flex-col items-center justify-between px-4 mx-auto text-sm text-gray-500 container md:flex-row">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf size={16} className="text-green-700" />
            <span className="font-semibold text-gray-900">GreenSpace</span>
          </div>
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link to="#" className="hover:text-gray-900">Conditions</Link>
            <Link to="#" className="hover:text-gray-900">Confidentialité</Link>
          </div>
          <div>© 2026 GreenSpace.</div>
        </div>
      </footer>

      {/* 5. Navigation Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-t md:hidden pb-safe">
        <Link to="/" className="flex flex-col items-center text-green-700">
          <HomeIcon size={24} />
          <span className="text-[10px] mt-1 font-medium">Accueil</span>
        </Link>
        <Link to="/recherche" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <Compass size={24} />
          <span className="text-[10px] mt-1 font-medium">Explorer</span>
        </Link>
        <Link to="/marche" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <ShoppingBag size={24} />
          <span className="text-[10px] mt-1 font-medium">Marché</span>
        </Link>
        <Link to="/reservations" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <MessageSquare size={24} />
          <span className="text-[10px] mt-1 font-medium">Demandes</span>
        </Link>
        <Link to="/profil" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <User size={24} />
          <span className="text-[10px] mt-1 font-medium">Profil</span>
        </Link>
      </nav>
    </div>
  );
}