import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Leaf, HelpCircle, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../../context/AuthContext';

export default function Error401() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();

  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [role, setRole] = useState('GARDENER');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const redirectTo = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { firstName, lastName, email: regEmail, password: regPassword, role };
      if (role === 'OWNER') {
        data.phoneNumber = phoneNumber;
        data.city = city;
        data.postalCode = postalCode;
      }
      await registerUser(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const backendErrors = err.response?.data?.validationErrors;
      if (backendErrors) {
        setError('Please check the form fields.');
      } else {
        setError(err.response?.data?.message || 'An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm';
  const labelClass = 'block mb-1 text-xs font-medium text-gray-600';

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-50 rounded-full blur-[100px] -z-10 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-[100px] -z-10 opacity-70"></div>

      <div className="relative mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
          <Lock className="text-green-800" size={24} />
        </div>
        <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
          <Leaf className="text-green-600" size={14} fill="currentColor" />
        </div>
      </div>

      <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-green-800 uppercase bg-green-100 rounded-full">
        <span className="inline-block w-1.5 h-1.5 mr-2 bg-green-600 rounded-full"></span>
        ERROR 401 • PRIVATE GARDEN AREA
      </div>

      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl max-w-2xl">
        You need an authorized key to<br/>enter this garden.
      </h1>
      
      <p className="max-w-xl mb-10 text-base text-gray-500">
        This plot, direct message, or booking dashboard is reserved for verified community members. Please sign in to your GreenSpace account or create one to proceed.
      </p>

      <Card className="w-full max-w-md p-2 mb-8 bg-white border-gray-100 shadow-2xl rounded-3xl">
        <CardContent className="p-6">
          <div className="flex p-1 mb-6 bg-gray-50 rounded-xl">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                activeTab === 'signin'
                  ? 'text-white bg-green-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                activeTab === 'register'
                  ? 'text-white bg-green-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {activeTab === 'signin' && (
            <form onSubmit={handleLogin}>
              <div className="space-y-4 mb-6 text-left">
                <div>
                  <label className={labelClass}>Community Email</label>
                  <div className="relative">
                    <MailIcon className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={16} />
                    <input 
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="alex.gardener@example.com" 
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-600">Garden Key Passcode</label>
                    <a href="#" className="text-xs font-semibold text-green-700 hover:underline">Forgot key?</a>
                  </div>
                  <div className="relative">
                    <KeyIcon className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={16} />
                    <input 
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••" 
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-base font-bold text-white bg-green-800 rounded-xl hover:bg-green-900 shadow-md mb-4 disabled:opacity-50"
              >
                {loading ? 'Unlocking…' : 'Unlock & Proceed →'}
              </Button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="space-y-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={16} />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Alex"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <div className="relative">
                      <UserIcon className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={16} />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Gardener"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Community Email</label>
                  <div className="relative">
                    <MailIcon className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={16} />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex.gardener@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Create Passcode</label>
                  <div className="relative">
                    <KeyIcon className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={16} />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>I am a…</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-700"
                  >
                    <option value="GARDENER">Gardener looking for a space</option>
                    <option value="OWNER">Property owner offering a space</option>
                  </select>
                </div>

                {role === 'OWNER' && (
                  <div className="p-4 space-y-3 border border-green-200 rounded-xl bg-green-50/50">
                    <p className="text-xs font-semibold text-green-800">Owner information</p>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +212 6XX-XXXXXX"
                        className="w-full py-3 px-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Casablanca"
                          className="w-full py-3 px-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Postal Code</label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="e.g. 20000"
                          className="w-full py-3 px-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-base font-bold text-white bg-green-800 rounded-xl hover:bg-green-900 shadow-md mb-4 disabled:opacity-50"
              >
                {loading ? 'Creating account…' : 'Join the Garden →'}
              </Button>
            </form>
          )}

          <p className="text-xs text-gray-400 text-center">
            Protected by GreenSpace Trust & Organic Security.
          </p>
        </CardContent>
      </Card>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2 text-left">
        <Link to="/explore" className="flex items-start gap-3 p-4 transition-colors bg-gray-50 hover:bg-gray-100 rounded-2xl">
          <div className="flex items-center justify-center p-2 bg-white text-green-700 rounded-lg shadow-sm shrink-0">
            <Compass size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Looking for public spaces?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Explore hundreds of open community plots and public harvests without signing in.</p>
          </div>
        </Link>
        <a href="#" className="flex items-start gap-3 p-4 transition-colors bg-gray-50 hover:bg-gray-100 rounded-2xl">
          <div className="flex items-center justify-center p-2 bg-white text-orange-700 rounded-lg shadow-sm shrink-0">
            <HelpCircle size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Need access assistance?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Invited by a host or lost your garden credential? Contact Community Help.</p>
          </div>
        </a>
      </div>
    </div>
  );
}

function MailIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function KeyIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
