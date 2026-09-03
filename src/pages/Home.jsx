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

      <div className="relative w-full h-[600px] md:h-[650px] mb-24 md:mb-32">
        <div 
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1466692476877-66184767f00a?auto=format&fit=crop&q=80&w=2000")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-black/20 to-black/60" />
        </div>

        <header className="absolute top-0 left-0 right-0 z-50 w-full">
          <div className="container flex items-center justify-between h-20 px-4 mx-auto md:px-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 text-green-700 bg-white rounded-md shadow-sm">
                <Leaf size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">GreenSpace</span>
            </div>

            <nav className="items-center hidden gap-8 text-sm font-medium text-gray-800 md:flex">
              <Link to="/" className="font-bold text-green-800">Home</Link>
              <Link to="/recherche" className="hover:text-green-800">Explore</Link>
              <Link to="/marche" className="hover:text-green-800">Market</Link>
              <Link to="/reservations" className="hover:text-green-800">Messages</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="hidden text-gray-800 md:flex hover:text-black">
                <Search size={20} />
              </button>
              <button className="hidden text-gray-800 md:flex hover:text-black">
                <Bell size={20} />
              </button>
              
              <div className="hidden w-px h-6 mx-2 bg-gray-400/50 md:block"></div>
              
              <Link to="/dashboard" className="flex items-center gap-2 p-1 pr-2 transition-colors rounded-full hover:bg-white/20">
                <span className="hidden text-sm font-semibold text-gray-900 md:block">{user.firstName} {user.lastName}</span>
                <div className="flex items-center justify-center w-8 h-8 text-white bg-green-700 border-2 border-white rounded-full shadow-md">
                  {user.firstName?.charAt(0).toUpperCase()}
                </div>
              </Link>

              <Button variant="ghost" size="icon" onClick={logout} className="text-gray-800 hover:text-red-700 hover:bg-white/20">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </header>

        {/* Contenu du Hero */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl px-4 mx-auto container md:px-8 pt-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-green-300 uppercase rounded-full bg-green-950/60 backdrop-blur-md w-max">
            Community Ecosystem
          </span>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Share the Earth, <br/>
            <span className="text-green-400">Grow Together.</span>
          </h1>
          <p className="max-w-2xl mb-10 text-lg text-gray-100 md:text-xl font-medium drop-shadow-md">
            Join the modern community connecting conscious landowners with passionate urban gardeners. Cultivate organic food, forge local friendships, and nurture a sustainable future in your neighborhood.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            {isOwner ? (
              <Button asChild size="lg" className="h-14 gap-2 px-8 text-base font-bold text-white bg-green-700 rounded-full hover:bg-green-800 shadow-lg">
                <Link to="/ajouter-jardin">
                  <PlusCircle size={20} /> Offer My Land
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-14 gap-2 px-8 text-base font-bold text-white bg-green-700 rounded-full hover:bg-green-800 shadow-lg">
                <Link to="/recherche">
                  <Sprout size={20} /> Find a Garden
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="h-14 gap-2 px-8 text-base font-bold text-white border-white/50 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md hover:text-white shadow-lg">
              <Link to="/marche">
                Offer My Land
              </Link>
            </Button>
          </div>
        </div>

        {/* Carte des Statistiques (Positionnée à cheval sur le bord inférieur) */}
        <div className="absolute left-0 right-0 hidden -bottom-16 md:block container mx-auto px-8 z-20">
          <Card className="p-8 shadow-2xl rounded-3xl border-none bg-white">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
              
              <div className="flex items-center gap-5 flex-1 justify-center md:justify-start">
                <div className="flex items-center justify-center w-14 h-14 text-white bg-green-700 rounded-full shadow-sm">
                  <Leaf size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">24,500 lbs</h3>
                  <p className="text-sm text-gray-500">Organic produce harvested this season</p>
                </div>
              </div>

              <div className="hidden w-px h-16 bg-gray-200 md:block"></div>

              <div className="flex items-center gap-5 flex-1 justify-center">
                <div className="flex items-center justify-center w-14 h-14 text-orange-600 bg-orange-100 rounded-full shadow-sm">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">1,840</h3>
                  <p className="text-sm text-gray-500">Active landowner partnerships</p>
                </div>
              </div>

              <div className="hidden w-px h-16 bg-gray-200 md:block"></div>

              <div className="flex items-center gap-5 flex-1 justify-center md:justify-end">
                <div className="flex items-center justify-center w-14 h-14 text-white bg-amber-700 rounded-full shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">350 Acres</h3>
                  <p className="text-sm text-gray-500">Urban land revitalized and protected</p>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </div>

      <main className="px-4 py-8 mx-auto container md:px-8 md:py-12">
        <div className="flex flex-col items-start justify-between mb-10 gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-green-700"></div>
              <span className="text-xs font-bold tracking-widest text-green-700 uppercase">
                {isOwner ? "Vos terrains" : "New opportunities"}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
              {isOwner ? "Mes espaces partagés" : "Available Land Plots"}
            </h2>
            <p className="text-gray-500 text-lg">
              {isOwner ? "Gérez les espaces que vous avez mis à disposition." : "Discover unused urban spaces ready for transformation. Connect with owners offering fertile ground for your next project."}
            </p>
          </div>
          <Button variant="link" className="flex items-center gap-2 font-bold text-green-700 text-base p-0 hover:no-underline hover:text-green-800">
            Explore Map View <span>→</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map(n => (
              <Card key={n} className="h-80 bg-gray-100 animate-pulse border-none rounded-3xl" />
            ))}
          </div>
        ) : gardens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-400">
              <Sprout size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No space found at the moment.</h3>
            <p className="text-gray-500">Check back later for new opportunities in your area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {gardens.map((garden) => (
              <Card key={garden.id} className="overflow-hidden transition-all duration-300 border border-gray-100 shadow-md hover:shadow-xl rounded-3xl group bg-white">
                <div className="relative w-full h-56 overflow-hidden bg-gray-200">
                  <img 
                    src={garden.photoUrls?.length > 0 ? garden.photoUrls[0] : 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800'} 
                    alt="Jardin" 
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
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-green-700">$45</span>
                      <span className="text-xs text-gray-500 font-medium">/mo</span>
                    </div>
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
            ))}
          </div>
        )}
      </main>

      <footer className="hidden py-10 border-t bg-gray-50 md:block mt-12">
        <div className="flex flex-col items-center justify-between px-4 mx-auto text-sm text-gray-500 container md:px-8 md:flex-row">
          <div className="flex flex-col mb-4 md:mb-0 gap-1">
            <div className="flex items-center gap-2 text-gray-400">
              <Leaf size={16} />
              <span className="font-semibold text-gray-700">GreenSpace</span>
            </div>
            <span className="text-xs">Nurturing communities, one garden at a time.</span>
          </div>
          <div className="flex gap-8 font-semibold text-gray-600 mb-4 md:mb-0">
            <Link to="#" className="hover:text-green-700">Terms</Link>
            <Link to="#" className="hover:text-green-700">Privacy</Link>
            <Link to="#" className="hover:text-green-700">Help Center</Link>
          </div>
          <div className="text-xs font-medium">© 2026 GreenSpace. Organic Stewardship.</div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-t md:hidden pb-safe">
        <Link to="/" className="flex flex-col items-center text-green-700">
          <HomeIcon size={24} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>
        <Link to="/recherche" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <Compass size={24} />
          <span className="text-[10px] mt-1 font-medium">Explore</span>
        </Link>
        <Link to="/marche" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <ShoppingBag size={24} />
          <span className="text-[10px] mt-1 font-medium">Market</span>
        </Link>
        <Link to="/reservations" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <MessageSquare size={24} />
          <span className="text-[10px] mt-1 font-medium">Messages</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-green-700">
          <User size={24} />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}