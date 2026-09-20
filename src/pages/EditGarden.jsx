import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Leaf, MapPin, Ruler, Camera, CheckSquare, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditGarden() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    areaSize: '',
    address: '',
    city: '',
    postalCode: '',
    rules: '',
    hasTools: false,
    photoUrls: '',
    latitude: '',
    longitude: ''
  });

  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    const fetchGarden = async () => {
      try {
        const response = await api.get(`/garden/${id}`);
        const garden = response.data;
        setOwnerId(garden.ownerId);
        
        setFormData({
          title: garden.title || '',
          description: garden.description || '',
          areaSize: garden.areaSize || '',
          address: garden.address || '',
          city: garden.city || '',
          postalCode: garden.postalCode || '',
          rules: garden.rules || '',
          hasTools: garden.hasTools || false,
          photoUrls: garden.photoUrls ? garden.photoUrls.join(', ') : '',
          latitude: garden.latitude || '',
          longitude: garden.longitude || ''
        });
      } catch (err) {
        console.error("Error fetching garden", err);
        setError("Failed to load garden details.");
      } finally {
        setFetching(false);
      }
    };
    fetchGarden();
  }, [id]);

  if (fetching) {
    return <div className="flex items-center justify-center min-h-[60vh] text-green-700 animate-pulse">Loading details...</div>;
  }

  if (!user || (user.id !== ownerId && user.role !== 'ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to edit this garden.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const photos = formData.photoUrls
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      await api.put(`/garden/${id}`, {
        title: formData.title,
        description: formData.description,
        areaSize: parseFloat(formData.areaSize),
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        rules: formData.rules,
        hasTools: formData.hasTools,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        photoUrls: photos
      });

      navigate(`/garden/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update garden. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const textareaClass = "w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-h-[100px]";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-700 uppercase tracking-wider";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <Leaf className="text-green-600" size={32} />
          Edit Garden
        </h1>
        <p className="text-gray-500 mt-2">
          Update the details of your garden space.
        </p>
      </div>

      <Card className="shadow-xl rounded-3xl border-0 overflow-hidden">
        <CardHeader className="bg-green-800 text-white p-6">
          <CardTitle className="text-xl">Garden Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Garden Title *</label>
                <div className="relative">
                  <Leaf className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Sunny Backyard Plot"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Area Size (m²) *</label>
                <div className="relative">
                  <Ruler className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="number"
                    name="areaSize"
                    required
                    min="1"
                    step="0.1"
                    value={formData.areaSize}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <div className="relative">
                <AlignLeft className="absolute text-gray-400 left-3 top-3.5" size={16} />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your garden space, sunlight, soil quality..."
                  className={textareaClass}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Location</h3>
              
              <div>
                <label className={labelClass}>Street Address</label>
                <div className="relative">
                  <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Green Avenue"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>City *</label>
                  <div className="relative">
                    <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Casablanca"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <div className="relative">
                    <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 20000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className={labelClass}>Latitude</label>
                  <div className="relative">
                    <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 33.5731"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <div className="relative">
                    <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="e.g. -7.5898"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Additional Details</h3>

              <div>
                <label className={labelClass}>Garden Rules</label>
                <div className="relative">
                  <CheckSquare className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    placeholder="e.g. Organic farming only, no loud noises..."
                    className={textareaClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Photos (URLs)</label>
                <div className="relative">
                  <Camera className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="text"
                    name="photoUrls"
                    value={formData.photoUrls}
                    onChange={handleChange}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">Separate multiple image URLs with commas</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                <input
                  type="checkbox"
                  id="hasTools"
                  name="hasTools"
                  checked={formData.hasTools}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="hasTools" className="text-sm font-medium text-green-900 cursor-pointer">
                  I can provide basic gardening tools (shovels, rakes, watering cans)
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg font-bold text-white bg-green-800 rounded-xl hover:bg-green-900 shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
