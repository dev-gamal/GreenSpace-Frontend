import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Maximize2, ArrowRight, Hammer, Lock, HelpCircle, Pencil, Trash2
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '../api/axiosConfig';

export default function LandDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const canManage = user && (user.role === 'ADMIN' || user.id === garden?.ownerId);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this garden? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/garden/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting garden:', error);
      alert(error.response?.data?.message || 'Failed to delete garden.');
      setDeleting(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.put(`/garden/${id}/status?status=${newStatus}`);
      setGarden(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating garden status:', error);
      alert(error.response?.data?.message || 'Failed to update status.');
    }
  };


  useEffect(() => {
    const fetchGardenDetails = async () => {
      try {
        const response = await api.get(`/garden/${id || 1}`); 
        setGarden(response.data);
      } catch (error) {
        console.error("Error fetching garden details:", error);
        setGarden({});
      } finally {
        setLoading(false);
      }
    };

    fetchGardenDetails();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-green-700 animate-pulse">Loading details...</div>;
  }

  const displayTitle = garden?.title;
  const displayArea = garden?.areaSize || garden?.area;
  const displayCity = garden?.city;

  const images = garden?.photoUrls || [];

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto md:px-8">
      
      <section className="mb-8">
        <div className="relative w-full overflow-hidden h-64 md:h-[450px] rounded-3xl mb-4">
          {images.length > 0 ? (
            <img 
              src={images[0]} 
              alt="Main Garden" 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">No Image Available</div>
          )}
          <div className="absolute flex gap-2 bottom-4 left-4">
            <span className="px-3 py-1 text-xs font-bold text-white uppercase bg-green-700 rounded-md">
              {garden?.status || 'AVAILABLE'}
            </span>
          </div>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images[1] && <img src={images[1]} alt="Thumbnail 1" className="object-cover w-full h-24 rounded-2xl md:h-32" />}
            {images[2] && <img src={images[2]} alt="Thumbnail 2" className="object-cover w-full h-24 rounded-2xl md:h-32" />}
            {images[3] && <img src={images[3]} alt="Thumbnail 3" className="object-cover w-full h-24 rounded-2xl md:h-32" />}
            {images.length > 4 && (
              <button className="flex flex-col items-center justify-center w-full h-24 transition-colors bg-gray-100 md:h-32 rounded-2xl hover:bg-gray-200">
                <div className="grid grid-cols-3 gap-1 mb-2 opacity-50">
                  {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gray-600 rounded-full" />)}
                </div>
                <span className="text-xs font-medium text-gray-600">View all {images.length} photos</span>
              </button>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        <div className="lg:col-span-8">
          
          <div className="pb-8 border-b border-gray-100">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{displayTitle}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-1.5"><MapPin size={18} /> {displayCity}</span>
              <span className="flex items-center gap-1.5"><Maximize2 size={18} /> {displayArea} sq ft</span>
            </div>
          </div>

          <section className="py-8">
            <h2 className="flex items-center gap-3 mb-4 text-xl font-bold text-gray-900">
              <span className="w-1.5 h-6 bg-orange-400 rounded-full"></span> About this land
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{garden?.description}</p>
            </div>
          </section>

          {garden?.hasTools && (
            <section className="p-8 bg-gray-50/80 rounded-3xl">
              <h2 className="mb-6 text-lg font-bold text-gray-900">Available Amenities</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center shrink-0 w-10 h-10 text-green-600 bg-green-100 rounded-full"><Hammer size={20} /></div>
                  <div><h4 className="font-bold text-sm text-gray-900">Tool Shed</h4><p className="text-xs text-gray-500">Basic hand tools available</p></div>
                </div>
              </div>
            </section>
          )}

          <section className="py-8">
            <h2 className="mb-2 text-lg font-bold text-gray-900">Approximate Location</h2>
            <p className="mb-6 text-sm text-gray-500">{garden?.address ? `${garden.address}, ${garden.city}` : garden?.city}. Exact location provided after booking.</p>
            <div className="w-full overflow-hidden bg-gray-200 h-60 rounded-3xl">
              <MapComponent address={garden?.address} city={garden?.city} lat={garden?.latitude} lng={garden?.longitude} />
            </div>
          </section>

        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <Card className="p-6 border-gray-100 shadow-xl rounded-3xl">
              


              <div className="flex items-center gap-4 p-4 mb-6 bg-gray-50/80 rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full shadow-sm">
                  <span className="text-gray-500 font-bold">{garden?.ownerName?.[0] || "H"}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Meet your host</p>
                  <p className="font-bold text-gray-900">{garden?.ownerName || "Host"}</p>
                </div>
              </div>
              
              {canManage && (
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
                    <select
                      value={garden?.status || 'AVAILABLE'}
                      onChange={handleStatusChange}
                      className="flex-1 text-sm font-semibold p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/garden/edit/${id}`)}
                      className="flex-1 h-10 gap-2 text-sm font-semibold text-white bg-green-700 rounded-full hover:bg-green-800"
                    >
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={deleting}
                      variant="outline"
                      className="flex-1 h-10 gap-2 text-sm font-semibold text-red-600 border-red-200 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    if (garden?.ownerId) {
                      navigate(`/messages?userId=${garden.ownerId}&userName=${encodeURIComponent(garden.ownerName || 'Host')}`);
                    }
                  }}
                  className="w-full h-12 gap-2 text-base font-bold text-white bg-green-700 rounded-full hover:bg-green-800"
                >
                  Send Message <ArrowRight size={18} />
                </Button>
                <Button variant="outline" className="w-full h-12 text-sm font-bold text-gray-700 border-gray-200 rounded-full hover:bg-gray-50">
                  Save to Favorites
                </Button>
              </div>
              
              <p className="mt-4 text-xs font-medium text-center text-gray-400">You won't be charged yet</p>

              <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-gray-100 text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <Lock size={18} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <HelpCircle size={18} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Support</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}