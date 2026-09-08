import { useState } from 'react';
import { Search, MapPin, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    title: 'Heirloom Tomato Seeds', 
    price: 'Trade', 
    type: 'trade', 
    location: 'Pine Ridge Farm', 
    distance: '2.1 mi', 
    user: 'Marcus T.', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1595858641154-1c667084511f?auto=format&fit=crop&w=600' 
  },
  { 
    id: 3, 
    title: 'French Breakfast Radishes', 
    price: '$3.00 / bunch', 
    type: 'sale', 
    location: 'Oak Street Co-op', 
    distance: '1.5 mi', 
    user: 'Elena R.', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1593335553593-36c1e57c6b54?auto=format&fit=crop&w=600' 
  },
  { 
    id: 4, 
    title: 'Vintage Hand Trowel', 
    price: 'Trade', 
    type: 'trade', 
    location: 'Westside Urban Farm', 
    distance: '3.0 mi', 
    user: 'David K.', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 
    image: 'https://images.unsplash.com/photo-1416879598555-22bcf2ebce10?auto=format&fit=crop&w=600' 
  },
];

const categories = ["All", "Vegetables", "Fruits", "Seeds", "Tools"];

export default function Market() {
  const [activeCategory, setActiveCategory] = useState("All");
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
          <Button className="px-8 font-bold text-white bg-green-700 rounded-full h-11 hover:bg-green-800">
            Open Map View
          </Button>
        </div>
      </div>

    </div>
  );
}