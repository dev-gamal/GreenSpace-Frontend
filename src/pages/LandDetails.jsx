import { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { 
  MapPin, Maximize2, Star, ShieldCheck, ArrowRight, 
  Droplets, Sun, Hammer, Recycle, Car, Dog, Lock, HelpCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '../api/axiosConfig';

export default function LandDetails() {
  const { id } = useParams();
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);


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
  const displayPrice = garden?.price;
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
              Available Now
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-white/90 backdrop-blur-sm rounded-md">
              Organic Only
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

          <section className="p-8 bg-gray-50/80 rounded-3xl">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Available Amenities</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-10 h-10 text-red-600 bg-red-100 rounded-full"><Droplets size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-900">Irrigation</h4><p className="text-xs text-gray-500">Hose & drip line</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-10 h-10 text-amber-600 bg-amber-100 rounded-full"><Sun size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-900">Sunlight</h4><p className="text-xs text-gray-500">Full Sun (8+ hrs)</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-10 h-10 text-green-600 bg-green-100 rounded-full"><Hammer size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-900">Tool Shed</h4><p className="text-xs text-gray-500">Basic hand tools</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-10 h-10 text-red-500 bg-red-50 rounded-full"><Recycle size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-900">Composting</h4><p className="text-xs text-gray-500">3-bin system</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-10 h-10 text-gray-600 bg-gray-200 rounded-full"><Car size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-900">Access</h4><p className="text-xs text-gray-500">Street parking</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-10 h-10 text-green-600 bg-green-100 rounded-full"><Dog size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-900">Pet Friendly</h4><p className="text-xs text-gray-500">Dogs allowed</p></div>
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="mb-2 text-lg font-bold text-gray-900">Approximate Location</h2>
            <p className="mb-6 text-sm text-gray-500">{garden?.address ? `${garden.address}, ${garden.city}` : garden?.city}. Exact location provided after booking.</p>
            <div className="w-full overflow-hidden bg-gray-200 h-60 rounded-3xl">
              <div className="flex items-center justify-center w-full h-full text-gray-400">Map not available</div>
            </div>
          </section>

        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <Card className="p-6 border-gray-100 shadow-xl rounded-3xl">
              
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-3xl font-extrabold text-gray-900">${displayPrice}</span>
                  <span className="text-sm font-medium text-gray-500"> /season</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 mb-6 bg-gray-50/80 rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full shadow-sm">
                  <span className="text-gray-500 font-bold">{garden?.owner?.firstName?.[0] || garden?.owner?.username?.[0] || "H"}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Meet your host</p>
                  <p className="font-bold text-gray-900">{garden?.owner?.firstName || garden?.owner?.username || "Host"}</p>
                </div>
              </div>

              {/* Real season dates would go here if available */}

              <div className="space-y-3">
                <Button className="w-full h-12 gap-2 text-base font-bold text-white bg-green-700 rounded-full hover:bg-green-800">
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