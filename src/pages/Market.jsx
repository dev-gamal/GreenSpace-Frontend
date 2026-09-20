import { useState } from 'react';
import { Search, MapPin, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MapComponent from '../components/MapComponent';

const mockProducts = [
  { 
    id: 1, 
    title: 'Organic Lacinato Kale', 
    price: '$4.50 / bunch', 
    type: 'sale', 
    location: 'Maplewood Community Garden', 
    distance: '0.8 mi', 
    user: 'Sarah J.', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600' 
  },
  { 
    id: 2, 
    title: 'Heirloom Tomato Seedlings', 
    price: 'Swap for compost', 
    type: 'swap', 
    location: 'Pine Ridge Farm', 
    distance: '1.2 mi', 
    user: 'Marcus T.', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600' 
  },
  { 
    id: 3, 
    title: 'Fresh Compost (5 gal)', 
    price: '$12.00', 
    type: 'sale', 
    location: 'Oak Street Co-op', 
    distance: '2.5 mi', 
    user: 'Elena R.', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1605366406977-83281be2d7b4?auto=format&fit=crop&w=600' 
  },
  { 
    id: 4, 
    title: 'Mint & Basil Cuttings', 
    price: 'Free', 
    type: 'swap', 
    location: 'Westside Urban Farm', 
    distance: '0.5 mi', 
    user: 'David K.', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600' 
  },
];

const categories = ['All', 'Produce', 'Seeds', 'Tools', 'Compost'];

export default function Market() {
  const [activeTab, setActiveTab] = useState('All');
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl md:px-8 md:py-12">
      
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
          Community Marketplace
        </h1>
        <p className="text-lg text-gray-500">
          Connect with local gardeners. Trade your surplus, sell your harvest, or find seeds and tools from your neighbors.
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row bg-white p-2 rounded-full border border-gray-100 shadow-sm">
      
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search harvests, seeds, tools..." 
            className="w-full py-2.5 pl-11 pr-4 text-sm bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex w-full gap-2 overflow-x-auto md:w-auto no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeCategory === category 
                  ? 'bg-green-700 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-4">
        {mockProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden transition-shadow border-gray-100 shadow-sm hover:shadow-md rounded-3xl bg-white flex flex-col">
           
            <div className="relative h-48 bg-gray-100 shrink-0">
              <img 
                src={product.image} 
                alt={product.title} 
                className="object-cover w-full h-full"
              />
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                product.type === 'trade' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-green-800 text-white'
              }`}>
                {product.type === 'trade' && <ArrowLeftRight size={12} />}
                {product.price}
              </div>
            </div>

            <CardContent className="flex flex-col flex-1 p-5">
              <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 line-clamp-2">
                {product.title}
              </h3>
              
              <div className="flex items-start gap-1.5 mb-4 text-xs font-medium text-gray-500">
                <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                <span className="line-clamp-2">{product.location} • {product.distance}</span>
              </div>

              <div className="flex items-center gap-2 mb-6 mt-auto">
                <img src={product.avatar} alt={product.user} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-sm font-semibold text-gray-700">{product.user}</span>
              </div>

              <Button variant="outline" className="w-full text-sm font-bold text-gray-700 border-gray-200 rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] shadow-lg h-72 md:h-80 group">
        {showMap ? (
          <div className="absolute inset-0 z-10 w-full h-full bg-gray-100">
            <MapComponent city="Casablanca" />
            <Button 
              onClick={() => setShowMap(false)} 
              className="absolute z-20 px-4 py-2 font-bold text-gray-700 bg-white shadow-md top-4 right-4 rounded-full hover:bg-gray-50"
            >
              Close Map
            </Button>
          </div>
        ) : (
          <>
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
              alt="Map Background" 
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-800/60 to-gray-500/30 backdrop-blur-[2px]"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="mb-3 text-3xl font-extrabold text-white md:text-4xl drop-shadow-md">
                Discover your local foodshed
              </h2>
              <p className="max-w-xl mb-8 text-sm font-medium text-gray-200 md:text-base drop-shadow-md">
                Explore the interactive map to find nearby growers, available plots, and community hubs.
              </p>
              <Button 
                onClick={() => setShowMap(true)}
                className="px-8 font-bold text-white bg-green-700 rounded-full h-11 hover:bg-green-800"
              >
                Open Map View
              </Button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}