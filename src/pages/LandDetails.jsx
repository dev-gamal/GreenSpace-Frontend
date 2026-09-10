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

  const mockDetails = {
    title: "Sunny South-Facing Urban Plot",
    description1: "Welcome to our sunny slice of heaven right in the heart of Hawthorne! We have a spacious, south-facing backyard that gets fantastic sunlight year-round. We've previously grown tomatoes, peppers, and an extensive herb garden here, so the soil is rich and ready to go.",
    description2: "Ideal for a passionate urban gardener looking to cultivate organic produce. We prioritize sustainable practices and kindly ask that no synthetic fertilizers or pesticides are used. The plot is mostly level with established raised beds and a dedicated composting area.",
    rating: 4.9,
    reviews: 14,
    price: 45,
    host: {
      name: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      verified: true
    },
    seasonStart: "Mar 15, 2026",
    seasonEnd: "Oct 31, 2026",
    mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" // Placeholder carte
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

  const displayTitle = garden?.title || mockDetails.title;
  const displayArea = garden?.area || 400;
  const displayCity = garden?.city || "Portland, OR (Hawthorne District)";
  const displayPrice = garden?.price || mockDetails.price;
  const images = garden?.photoUrls?.length > 0 ? garden.photoUrls : [
    "https://images.unsplash.com/photo-1466692476877-66184767f00a?auto=format&fit=crop&w=1600",
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400",
    "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=400",
    "https://images.unsplash.com/photo-1416879598555-22bcf2ebce10?auto=format&fit=crop&w=400"
  ];

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto md:px-8">
      
      <section className="mb-8">
        <div className="relative w-full overflow-hidden h-64 md:h-[450px] rounded-3xl mb-4">
          <img 
            src={images[0]} 
            alt="Main Garden" 
            className="object-cover w-full h-full"
          />
          <div className="absolute flex gap-2 bottom-4 left-4">
            <span className="px-3 py-1 text-xs font-bold text-white uppercase bg-green-700 rounded-md">
              Available Now
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-white/90 backdrop-blur-sm rounded-md">
              Organic Only
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <img src={images[1]} alt="Thumbnail 1" className="object-cover w-full h-24 rounded-2xl md:h-32" />
          <img src={images[2]} alt="Thumbnail 2" className="object-cover w-full h-24 rounded-2xl md:h-32" />
          <img src={images[3]} alt="Thumbnail 3" className="object-cover w-full h-24 rounded-2xl md:h-32" />
          <button className="flex flex-col items-center justify-center w-full h-24 transition-colors bg-gray-100 md:h-32 rounded-2xl hover:bg-gray-200">
            <div className="grid grid-cols-3 gap-1 mb-2 opacity-50">
              {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gray-600 rounded-full" />)}
            </div>
            <span className="text-xs font-medium text-gray-600">View all 12 photos</span>
          </button>
        </div>
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
              <p>{mockDetails.description1}</p>
              <p>{mockDetails.description2}</p>
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
            <p className="mb-6 text-sm text-gray-500">Hawthorne District, Portland. Exact location provided after booking.</p>
            <div className="w-full overflow-hidden bg-gray-200 h-60 rounded-3xl">
              <img src={mockDetails.mapImage} alt="Map" className="object-cover w-full h-full opacity-80 mix-blend-multiply" />
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
                <div className="flex items-center gap-1 pb-1 text-sm font-medium text-gray-600">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="font-bold text-gray-900">{mockDetails.rating}</span>
                  <span className="underline decoration-gray-300 underline-offset-2">({mockDetails.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 mb-6 bg-gray-50/80 rounded-2xl">
                <img src={mockDetails.host.avatar} alt="Host" className="object-cover w-12 h-12 rounded-full shadow-sm" />
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Meet your host</p>
                  <p className="font-bold text-gray-900">{mockDetails.host.name}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-green-700 font-medium">
                    <ShieldCheck size={14} /> Identity verified
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Season Starts</span>
                  <span className="font-bold text-gray-900">{mockDetails.seasonStart}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Season Ends</span>
                  <span className="font-bold text-gray-900">{mockDetails.seasonEnd}</span>
                </div>
              </div>

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