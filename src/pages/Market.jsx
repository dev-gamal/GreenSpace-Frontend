import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  MapPin,
  ArrowLeftRight,
  Plus,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Leaf,
  Apple,
  Sprout,
  Flower2,
  ShoppingBag,
  Tag,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import {
  getMarketProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from '../api/productService';

const PRODUCT_TYPES = [
  { label: 'All', value: null, icon: ShoppingBag },
  { label: 'Vegetable', value: 'VEGETABLE', icon: Leaf },
  { label: 'Fruit', value: 'FRUIT', icon: Apple },
  { label: 'Seed', value: 'SEED', icon: Sprout },
  { label: 'Plant', value: 'PLANT', icon: Flower2 },
];

const EXCHANGE_TYPES = [
  { label: 'For Sale', value: 'SALE' },
  { label: 'For Barter', value: 'BARTER' },
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600';

export default function Market() {
  const { user } = useAuth();

  const [exchangeType, setExchangeType] = useState('SALE');
  const [city, setCity] = useState(user?.city || '');
  const [cityInput, setCityInput] = useState(user?.city || '');
  const [activeProductType, setActiveProductType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMap, setShowMap] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantityKgOrUnits: '',
    price: '',
    productType: 'VEGETABLE',
    exchangeType: 'SALE',
    imageUrl: '',
  });

  const canPublish = user?.role === 'GARDENER';
  const canDelete = (product) =>
    product.publisherId === user?.id || user?.role === 'ADMIN';

  const fetchProducts = useCallback(async () => {
    if (!city.trim()) {
      setProducts([]);
      setTotalPages(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getMarketProducts(exchangeType, city, page, 12);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [exchangeType, city, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCitySearch = () => {
    setCity(cityInput.trim());
    setPage(0);
  };

  const handleCityKeyDown = (e) => {
    if (e.key === 'Enter') handleCitySearch();
  };

  const filteredProducts = products.filter((p) => {
    if (activeProductType && p.productType !== activeProductType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.publisherName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleViewDetail = async (productId) => {
    setDetailLoading(true);
    try {
      const data = await getProductById(productId);
      setSelectedProduct(data);
    } catch (err) {
      console.error('Error fetching product detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(productId, user.id);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      if (selectedProduct?.id === productId) setSelectedProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        quantityKgOrUnits: parseFloat(formData.quantityKgOrUnits),
        price: formData.exchangeType === 'SALE' ? parseFloat(formData.price || 0) : 0,
        productType: formData.productType,
        exchangeType: formData.exchangeType,
      };

      await createProduct(payload, user.id, formData.imageUrl || DEFAULT_IMAGE);

      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        quantityKgOrUnits: '',
        price: '',
        productType: 'VEGETABLE',
        exchangeType: 'SALE',
        imageUrl: '',
      });
      setPage(0);
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      setFormError(
        err.response?.data?.message || 'Failed to create product. Please check your input.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const formatPrice = (product) => {
    if (product.exchangeType === 'BARTER') return 'Swap / Barter';
    if (!product.price || product.price === 0) return 'Free';
    return `${product.price.toFixed(2)} MAD`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl md:px-8 md:py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
          Community Marketplace
        </h1>
        <p className="text-lg text-gray-500">
          Connect with local gardeners. Trade your surplus, sell your harvest, or find seeds and plants from your neighbors.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row bg-white p-2 rounded-full border border-gray-100 shadow-sm">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by city..."
              className="w-full py-2.5 pl-11 pr-20 text-sm bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/20"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={handleCityKeyDown}
            />
            <button
              onClick={handleCitySearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold text-white bg-green-700 rounded-full hover:bg-green-800 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2.5 pl-11 pr-4 text-sm bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 px-2">
            {EXCHANGE_TYPES.map((et) => (
              <button
                key={et.value}
                onClick={() => {
                  setExchangeType(et.value);
                  setPage(0);
                }}
                className={`whitespace-nowrap px-5 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 ${
                  exchangeType === et.value
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {et.value === 'BARTER' && <ArrowLeftRight size={14} />}
                {et.value === 'SALE' && <Tag size={14} />}
                {et.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {PRODUCT_TYPES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveProductType(cat.value)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 ${
                    activeProductType === cat.value
                      ? 'bg-green-700 text-white'
                      : 'text-gray-600 bg-white border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {canPublish && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-green-700 hover:bg-green-800 text-white rounded-full px-5 shrink-0 flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 text-red-700 bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!city.trim() && !loading && (
        <div className="text-center py-16">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Enter your city to explore</h3>
          <p className="text-sm text-gray-500">
            Type a city name above and press Search to find products near you.
          </p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-green-700" />
        </div>
      )}

      {!loading && city.trim() && filteredProducts.length === 0 && !error && (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No products found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Try a different city, change the exchange type, or adjust your filters.
          </p>
          {canPublish && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-green-700 hover:bg-green-800 text-white rounded-full"
            >
              <Plus size={16} className="mr-2" />
              Be the first to list a product
            </Button>
          )}
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden transition-shadow border-gray-100 shadow-sm hover:shadow-md rounded-3xl bg-white flex flex-col"
            >
              <div className="relative h-48 bg-gray-100 shrink-0">
                <img
                  src={product.imageUrl || DEFAULT_IMAGE}
                  alt={product.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
                <div
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                    product.exchangeType === 'BARTER'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-800 text-white'
                  }`}
                >
                  {product.exchangeType === 'BARTER' && <ArrowLeftRight size={12} />}
                  {formatPrice(product)}
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm">
                  {product.productType}
                </div>
              </div>

              <CardContent className="flex flex-col flex-1 p-5">
                <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 line-clamp-2">
                  {product.title}
                </h3>

                {product.description && (
                  <p className="mb-3 text-xs text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-start gap-1.5 mb-4 text-xs font-medium text-gray-500">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                  <span className="line-clamp-1">
                    {product.publisherCity || 'Unknown city'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4 mt-auto">
                  <div className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {product.publisherName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {product.publisherName || 'Anonymous'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetail(product.id)}
                    className="flex-1 text-sm font-bold text-gray-700 border-gray-200 rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                  >
                    View Details
                  </Button>
                  {canDelete(product) && (
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full px-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-full px-4"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[2.5rem] shadow-lg h-72 md:h-80 group">
        {showMap ? (
          <div className="absolute inset-0 z-10 w-full h-full bg-gray-100">
            <MapComponent city={city || 'Casablanca'} />
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

      {(selectedProduct || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-green-700" />
              </div>
            ) : (
              <>
                <div className="relative h-56 bg-gray-100 rounded-t-3xl overflow-hidden">
                  <img
                    src={selectedProduct.imageUrl || DEFAULT_IMAGE}
                    alt={selectedProduct.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-gray-900 shadow-md backdrop-blur-sm"
                  >
                    <X size={18} />
                  </button>
                  <div
                    className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                      selectedProduct.exchangeType === 'BARTER'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-800 text-white'
                    }`}
                  >
                    {selectedProduct.exchangeType === 'BARTER' && (
                      <ArrowLeftRight size={12} />
                    )}
                    {formatPrice(selectedProduct)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedProduct.title}
                    </h2>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-600 shrink-0">
                      {selectedProduct.productType}
                    </span>
                  </div>

                  {selectedProduct.description && (
                    <p className="mb-5 text-sm text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Quantity
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedProduct.quantityKgOrUnits} kg/units
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Status
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedProduct.status}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Exchange
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedProduct.exchangeType}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Listed
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(selectedProduct.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
                    <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                      {selectedProduct.publisherName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedProduct.publisherName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} />
                        {selectedProduct.publisherCity || 'Unknown city'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedProduct(null)}
                      variant="outline"
                      className="flex-1 rounded-full font-bold"
                    >
                      Close
                    </Button>
                    {canDelete(selectedProduct) && (
                      <Button
                        onClick={() => handleDelete(selectedProduct.id)}
                        variant="outline"
                        className="rounded-full font-bold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError(null);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-900"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Fresh Organic Tomatoes"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Describe your product..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Quantity (kg/units) *
                    </label>
                    <input
                      type="number"
                      name="quantityKgOrUnits"
                      required
                      min="0"
                      step="0.1"
                      value={formData.quantityKgOrUnits}
                      onChange={handleFormChange}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Price (MAD)
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      disabled={formData.exchangeType === 'BARTER'}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Product Type *
                    </label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
                    >
                      <option value="VEGETABLE">Vegetable</option>
                      <option value="FRUIT">Fruit</option>
                      <option value="SEED">Seed</option>
                      <option value="PLANT">Plant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Exchange Type *
                    </label>
                    <select
                      name="exchangeType"
                      value={formData.exchangeType}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
                    >
                      <option value="SALE">For Sale</option>
                      <option value="BARTER">For Barter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormError(null);
                    }}
                    className="flex-1 rounded-full font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-full font-bold"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}