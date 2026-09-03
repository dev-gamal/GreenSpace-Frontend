import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ gardens: [], reservations: [] });
  const [loading, setLoading] = useState(true);

  // Vérifie si l'utilisateur est un propriétaire
  const isOwner = user?.role === "ROLE_PROPRIETAIRE";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isOwner) {
          const gardensRes = await api.get(`/garden/owner/${user.id}`);
          const requestsRes = await api.get(`/reservations/owner/${user.id}/requests`);
          setData({ 
            gardens: gardensRes.data.content || [], 
            reservations: requestsRes.data.content || [] 
          });
        } else {
          const gardensRes = await api.get(`/garden/search?city=&minArea=0`);
          const myRes = await api.get(`/reservations/gardener/${user.id}`);
          setData({ 
            gardens: gardensRes.data.content || [], 
            reservations: myRes.data.content || [] 
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user, isOwner]);

  // Calcul dynamique des statistiques
  const activeListings = isOwner ? data.gardens.length : 0;
  const pendingRequests = data.reservations.filter((r) => r.status === "PENDING").length;

  const stats = [
    {
      title: isOwner ? "Espaces Actifs" : "Espaces Disponibles",
      value: isOwner ? activeListings : data.gardens.length,
      icon: <Sprout size={20} className="text-green-700" />,
      bg: "bg-gradient-to-br from-green-50 to-green-100/50",
    },
    {
      title: "Messages Non Lus",
      value: "0",
      icon: <Mail size={20} className="text-orange-700" />,
      bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    },
    {
      title: isOwner ? "Demandes en attente" : "Mes Réservations",
      value: isOwner ? pendingRequests : data.reservations.length,
      icon: <ClipboardList size={20} className="text-yellow-700" />,
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100/50",
      hideOnMobile: true,
    },
  ];

  // Si aucun utilisateur n'est connecté, on ne rend rien (le routeur gère la redirection)
  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* HEADER DYNAMIQUE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Initiale dynamique au lieu de l'image de Sarah */}
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm bg-green-700 text-white flex items-center justify-center text-2xl font-bold">
            {user.firstName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hello, {user.firstName}!
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              <span className="md:hidden">
                Prêt à cultiver aujourd'hui ?
              </span>
              <span className="hidden md:inline">
                Voici ce qui se passe dans votre espace aujourd'hui.
              </span>
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="hidden md:flex bg-gray-100/50 border-gray-200 text-gray-700 rounded-full h-9"
        >
          <span className="text-xs mr-1">✏️</span> Éditer Profil
        </Button>
      </div>

      {/* STATS CARDS */}
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

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT ACTIVITY (Connecté au backend) */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Activité Récente</h2>
            <button className="text-sm font-semibold text-green-700 flex items-center gap-1 hover:underline">
              Tout voir <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-gray-500 animate-pulse">
                Chargement des activités...
              </div>
            ) : data.reservations.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center text-gray-500">
                Aucune activité récente.
              </div>
            ) : (
              data.reservations.slice(0, 4).map((res) => (
                <div key={res.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        Réservation #{res.id}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">
                        Jardin ID: {res.gardenId}{" "}
                        <span className="hidden md:inline">• Récemment</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {res.status === 'PENDING' ? 'En attente' : 'Validé'}
                    </span>
                    {/* Boutons d'action visibles uniquement pour le propriétaire si la demande est en attente */}
                    {isOwner && res.status === 'PENDING' && (
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

        {/* QUICK ACTIONS / LINKS */}
        <div className="lg:col-span-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 mt-4 lg:mt-0 md:text-xl md:text-gray-900 md:normal-case md:tracking-normal">
            <span className="md:hidden">Liens Rapides</span>
            <span className="hidden md:inline">Actions Rapides</span>
          </h2>

          <div className="flex justify-around md:hidden mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Sprout size={20} />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Terrains
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Demandes
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
                  <Settings size={20} />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Paramètres
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-4">
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
                  Ajouter un terrain
                </h3>
                <p className="text-white/80 text-xs">
                  Partagez votre espace.
                </p>
              </div>
            </div>

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
                  Marché Solidaire
                </h3>
                <p className="text-white/80 text-xs">
                  Outils, graines et récoltes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}