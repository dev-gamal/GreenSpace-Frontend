import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  X,
  Sprout,
  Mail,
  ClipboardList,
  Settings,
  CalendarCheck,
  ShoppingBag,
  Pencil,
  Trash2,
  MapPin,
  Maximize2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ gardens: [], reservations: [] });
  const [loading, setLoading] = useState(true);

  const isOwner = user?.role === "OWNER";

  const handleDeleteGarden = async (gardenId) => {
    if (!window.confirm("Are you sure you want to delete this garden?")) return;
    try {
      await api.delete(`/garden/${gardenId}`);
      setData((prev) => ({
        ...prev,
        gardens: prev.gardens.filter((g) => g.id !== gardenId),
      }));
    } catch (error) {
      console.error("Error deleting garden:", error);
      alert(error.response?.data?.message || "Failed to delete garden.");
    }
  };

  const handleStatusChange = async (gardenId, newStatus) => {
    try {
      await api.put(`/garden/${gardenId}/status?status=${newStatus}`);
      setData((prev) => ({
        ...prev,
        gardens: prev.gardens.map((g) =>
          g.id === gardenId ? { ...g, status: newStatus } : g,
        ),
      }));
    } catch (error) {
      console.error("Error updating garden status:", error);
      alert(error.response?.data?.message || "Failed to update status.");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isOwner) {
          const gardensRes = await api.get(`/garden/owner/${user.id}`);
          const requestsRes = await api.get(
            `/reservations/owner/${user.id}/requests`,
          );
          setData({
            gardens: gardensRes.data.content || [],
            reservations: requestsRes.data.content || [],
          });
        } else {
          const gardensRes = await api.get(`/garden/search?city=&minArea=0`);
          const myRes = await api.get(`/reservations/gardener/${user.id}`);
          setData({
            gardens: gardensRes.data.content || [],
            reservations: myRes.data.content || [],
          });
        }
      } catch (error) {
        console.error("Error while loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user, isOwner]);

  const activeListings = isOwner ? data.gardens.length : 0;
  const pendingRequests = data.reservations.filter(
    (r) => r.status === "PENDING",
  ).length;

  const stats = [
    {
      title: isOwner ? "Active Listings" : "Available Gardens",
      value: isOwner ? activeListings : data.gardens.length,
      icon: <Sprout size={20} className="text-green-700" />,
      bg: "bg-gradient-to-br from-green-50 to-green-100/50",
    },
    {
      title: "Unread Messages",
      value: "0",
      icon: <Mail size={20} className="text-orange-700" />,
      bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    },
    {
      title: isOwner ? "Waiting demands" : "Mes Réservations",
      value: isOwner ? pendingRequests : data.reservations.length,
      icon: <ClipboardList size={20} className="text-yellow-700" />,
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100/50",
      hideOnMobile: true,
    },
  ];

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm bg-green-700 text-white flex items-center justify-center text-2xl font-bold">
            {user.firstName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hello, {user.firstName}!
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              <span className="md:hidden">Ready to cultivate your garden?</span>
              <span className="hidden md:inline">
                Here's what's happening today.
              </span>
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="hidden md:flex bg-gray-100/50 border-gray-200 text-gray-700 rounded-full h-9"
        >
          <span className="text-xs mr-1">✏️</span> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.hideOnMobile ? "hidden md:block" : ""} ${stat.bg} p-5 rounded-3xl relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
              <ArrowUpRight size={20} className="text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "-" : stat.value}
            </h3>
            <p className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wider">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {isOwner && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Gardens</h2>
            <Link
              to="/garden/add"
              className="text-sm font-semibold text-green-700 flex items-center gap-1 hover:underline"
            >
              <Plus size={16} /> Add Garden
            </Link>
          </div>
          {loading ? (
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-gray-500 animate-pulse">
              Loading gardens...
            </div>
          ) : data.gardens.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500 mb-4">
                You haven't added any gardens yet.
              </p>
              <Link to="/garden/add">
                <Button className="bg-green-700 hover:bg-green-800 rounded-full">
                  Add Your First Garden
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.gardens.map((garden) => (
                <div
                  key={garden.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <Link to={`/garden/${garden.id}`}>
                    <div className="relative h-36 overflow-hidden bg-gray-200">
                      <img
                        src={
                          garden.photoUrls?.length > 0
                            ? garden.photoUrls[0]
                            : "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={garden.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg text-white ${
                          garden.status === "AVAILABLE"
                            ? "bg-green-700"
                            : garden.status === "RESERVED"
                              ? "bg-orange-500"
                              : "bg-gray-500"
                        }`}
                      >
                        {garden.status}
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/garden/${garden.id}`}>
                      <h3 className="font-bold text-gray-900 text-sm truncate mb-1">
                        {garden.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {garden.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 size={12} /> {garden.areaSize} m²
                      </span>
                    </div>
                    <div className="mb-3">
                      <select
                        value={garden.status}
                        onChange={(e) =>
                          handleStatusChange(garden.id, e.target.value)
                        }
                        className="w-full text-xs font-semibold p-1.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/garden/edit/${garden.id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGarden(garden.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm font-semibold text-green-700 flex items-center gap-1 hover:underline">
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-gray-500 animate-pulse">
                Activity loading...
              </div>
            ) : data.reservations.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center text-gray-500">
                No recent activity found.
              </div>
            ) : (
              data.reservations.slice(0, 4).map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        Reservation #{res.id}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">
                        Garden ID: {res.gardenId}{" "}
                        <span className="hidden md:inline">• Recently</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${res.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                    >
                      {res.status === "PENDING" ? "Pending" : "Approved"}
                    </span>
                    {isOwner && res.status === "PENDING" && (
                      <div className="hidden md:flex gap-1">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-600">
                          <X size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white hover:bg-green-800">
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 mt-4 lg:mt-0 md:text-xl md:text-gray-900 md:normal-case md:tracking-normal">
            <span className="md:hidden">Fast Links</span>
            <span className="hidden md:inline">Quick actions</span>
          </h2>

          <div className="flex justify-around md:hidden mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Sprout size={20} />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">Gardens</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Requests
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
                  <Settings size={20} />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Settings
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-4">
            <Link to="/garden/add">
              <div className="relative h-32 rounded-3xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1592424001844-0b1a0e1cb1dc?auto=format&fit=crop&w=600"
                  alt="New Listing"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white mb-2 backdrop-blur-sm">
                    <span className="text-lg leading-none">+</span>
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    Add a Garden
                  </h3>
                  <p className="text-white/80 text-xs">Share your space.</p>
                </div>
              </div>
            </Link>

            <Link to="/market">
              <div className="relative h-32 rounded-3xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600"
                  alt="Market"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white mb-2 backdrop-blur-sm">
                    <ShoppingBag size={14} />
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    Market
                  </h3>
                  <p className="text-white/80 text-xs">
                    Tools, seeds and harvest.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
