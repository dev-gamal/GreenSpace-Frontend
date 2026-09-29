import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { createGarden } from '../api/gardenService';
import { gardenSchema } from '../validations/gardenSchema';
import MapComponent from '../components/MapComponent';
import { Leaf, MapPin, Ruler, Camera, CheckSquare, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddGarden() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gardenSchema),
    defaultValues: {
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
      longitude: '',
    },
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const address = watch('address');
  const city = watch('city');
  const hasTools = watch('hasTools');

  if (user?.role !== 'OWNER') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only Property Owners can add a garden.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const photos = data.photoUrls
        ? data.photoUrls.split(',').map((url) => url.trim()).filter((url) => url.length > 0)
        : [];

      await createGarden({
        title: data.title,
        description: data.description,
        areaSize: parseFloat(data.areaSize),
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        rules: data.rules,
        hasTools: data.hasTools,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        photoUrls: photos
      }, user.id);

      navigate(user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add garden. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const inputErrorClass = "w-full pl-10 py-3 bg-red-50 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm";
  const textareaClass = "w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-h-[100px]";
  const textareaErrorClass = "w-full pl-10 py-3 bg-red-50 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm min-h-[100px]";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-700 uppercase tracking-wider";
  const fieldError = "text-xs text-red-600 mt-1 pl-1";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <Leaf className="text-green-600" size={32} />
          Offer a Green Space
        </h1>
        <p className="text-gray-500 mt-2">
          Share your land with gardeners and grow the community.
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Garden Title *</label>
                <div className="relative">
                  <Leaf className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="text"
                    {...register('title')}
                    placeholder="e.g. Sunny Backyard Plot"
                    className={errors.title ? inputErrorClass : inputClass}
                  />
                </div>
                {errors.title && <p className={fieldError}>{errors.title.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Area Size (m²) *</label>
                <div className="relative">
                  <Ruler className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="number"
                    {...register('areaSize')}
                    min="1"
                    step="0.1"
                    placeholder="e.g. 25"
                    className={errors.areaSize ? inputErrorClass : inputClass}
                  />
                </div>
                {errors.areaSize && <p className={fieldError}>{errors.areaSize.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <div className="relative">
                <AlignLeft className="absolute text-gray-400 left-3 top-3.5" size={16} />
                <textarea
                  {...register('description')}
                  placeholder="Describe your garden space, sunlight, soil quality..."
                  className={errors.description ? textareaErrorClass : textareaClass}
                />
              </div>
              {errors.description && <p className={fieldError}>{errors.description.message}</p>}
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
                    {...register('address')}
                    placeholder="123 Green Avenue"
                    className={errors.address ? inputErrorClass : inputClass}
                  />
                </div>
                {errors.address && <p className={fieldError}>{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>City *</label>
                  <div className="relative">
                    <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="e.g. Casablanca"
                      className={errors.city ? inputErrorClass : inputClass}
                    />
                  </div>
                  {errors.city && <p className={fieldError}>{errors.city.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <div className="relative">
                    <MapPin className="absolute text-gray-400 left-3 top-3.5" size={16} />
                    <input
                      type="text"
                      {...register('postalCode')}
                      placeholder="e.g. 20000"
                      className={errors.postalCode ? inputErrorClass : inputClass}
                    />
                  </div>
                  {errors.postalCode && <p className={fieldError}>{errors.postalCode.message}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className={labelClass}>Pinpoint Exact Location</label>
                <p className="text-xs text-gray-500 mb-2">Click on the map to set the exact latitude and longitude instead of entering an address manually.</p>
                <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden mb-3">
                  <MapComponent 
                    address={address}
                    city={city}
                    lat={latitude}
                    lng={longitude}
                    onLocationSelect={(lat, lng) => {
                      setValue('latitude', lat, { shouldValidate: true });
                      setValue('longitude', lng, { shouldValidate: true });
                    }}
                  />
                </div>
                {latitude && longitude && (
                  <p className="text-xs font-semibold text-green-700">
                    Selected Location: {Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}
                  </p>
                )}
                {(errors.latitude || errors.longitude) && (
                  <p className={fieldError}>{errors.latitude?.message || errors.longitude?.message}</p>
                )}
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
                    {...register('rules')}
                    placeholder="e.g. Organic farming only, no loud noises..."
                    className={errors.rules ? textareaErrorClass : textareaClass}
                  />
                </div>
                {errors.rules && <p className={fieldError}>{errors.rules.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Photos (URLs)</label>
                <div className="relative">
                  <Camera className="absolute text-gray-400 left-3 top-3.5" size={16} />
                  <input
                    type="text"
                    {...register('photoUrls')}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className={errors.photoUrls ? inputErrorClass : inputClass}
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">Separate multiple image URLs with commas</p>
                </div>
                {errors.photoUrls && <p className={fieldError}>{errors.photoUrls.message}</p>}
              </div>

              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                <input
                  type="checkbox"
                  id="hasTools"
                  {...register('hasTools')}
                  checked={hasTools}
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
                {loading ? 'Creating Garden...' : 'Publish Garden Space'}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
