import { Link } from "react-router-dom";
import {
  Lock,
  Key,
  Compass,
  Users,
  Inbox,
  ShieldCheck,
  Mail,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Error403() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center">
      <div className="inline-block px-4 py-1 mb-8 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
        <span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full"></span>
        ERREUR 403 • PARCELLE PRIVÉE & SÉCURISÉE
      </div>

      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-white border border-gray-100 shadow-xl rounded-full">
          <div className="text-green-800">
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-0 px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm whitespace-nowrap translate-y-1/2 flex items-center gap-1">
            <ShieldCheck size={14} className="text-green-600" /> Zone Réservée
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-4xl font-extrabold text-gray-900 md:text-5xl max-w-2xl">
        Cette parcelle est soigneusement protégée.
      </h1>

      <p className="max-w-2xl mb-10 text-lg text-gray-500">
        Vous tentez d'entrer dans une parcelle agricole privative, un contrat de
        co-jardinage restreint ou un carnet de culture réservé aux membres
        accrédités de GreenSpace.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Button className="gap-2 px-8 py-6 text-white bg-green-800 rounded-full hover:bg-green-900 shadow-lg">
          <Key size={18} /> Demander l'accès au propriétaire
        </Button>
        <Button
          asChild
          variant="secondary"
          className="gap-2 px-8 py-6 text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <Link to="/explore">
            <Compass size={18} /> Explorer les potagers publics
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="gap-2 px-6 py-6 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <Link to="/login">
            <Users size={18} /> Changer de compte
          </Link>
        </Button>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mb-12 text-left">
        <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center justify-center shrink-0 w-12 h-12 bg-green-100 text-green-700 rounded-full">
                <Inbox size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Jardinier bénévole ?
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                  Statut invité
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Si un maraîcher ou un propriétaire vous a confié une clé numérique
              de parcelle, vérifiez l'invitation dans vos notifications.
            </p>
            <Link
              to="/messages"
              className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              Ouvrir ma boîte de réception →
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center justify-center shrink-0 w-12 h-12 bg-orange-100 text-orange-700 rounded-full">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Propriétaire foncier ?
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                  Rôle Hôte / Bailleur
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Assurez-vous d'être connecté avec votre identifiant cadastral ou
              le compte certifié gérant ce terrain.
            </p>
            <Link
              to="/dashboard"
              className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              Vérifier mes autorisations <Lock size={14} />
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center justify-center shrink-0 w-12 h-12 bg-gray-100 text-gray-700 rounded-full">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Assistance GreenSpace
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                  Garde-champêtre 24/7
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Un dysfonctionnement de bail ou un lien brisé ? Notre équipe de
              médiateurs communautaires vous répond rapidement.
            </p>
            <a
              href="#"
              className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              Contacter le support sol ✉
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-5xl p-6 bg-gray-50 rounded-3xl flex flex-col md:flex-row items-center justify-between text-left gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white text-green-700 rounded-full shadow-sm shrink-0">
            <Map size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">
              Vous cherchez de la terre libre à cultiver ?
            </h4>
            <p className="text-sm text-gray-500">
              Plus de 1 200 parcelles urbaines, balcons partagés et vergers
              collectifs sont ouverts sans restriction de badge dans votre
              périmètre.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shrink-0 px-6 py-6 rounded-full font-semibold shadow-sm"
        >
          <Link to="/explore">
            Voir la carte ouverte <Map size={18} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
