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
import { useAuth } from "../../context/AuthContext";

export default function Error403() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center">
      <div className="inline-block px-4 py-1 mb-8 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
        <span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full"></span>
        ERROR 403 • PRIVATE AND SECURED PLOT
      </div>

      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-white border border-gray-100 shadow-xl rounded-full">
          <div className="text-green-800">
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-0 px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm whitespace-nowrap translate-y-1/2 flex items-center gap-1">
            <ShieldCheck size={14} className="text-green-600" /> Reserved Access
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-4xl font-extrabold text-gray-900 md:text-5xl max-w-2xl">
        this plot is carefully protected
      </h1>

      <p className="max-w-2xl mb-10 text-lg text-gray-500">
        You are trying to enter a private agricultural plot, a restricted
        co-gardening contract, or a culture journal reserved for accredited
        members of GreenSpace.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Button className="gap-2 px-8 py-6 text-white bg-green-800 rounded-full hover:bg-green-900 shadow-lg">
          <Key size={18} /> Request access from the owner
        </Button>
        <Button
          asChild
          variant="secondary"
          className="gap-2 px-8 py-6 text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <Link to="/explore">
            <Compass size={18} /> Explore public vegetable gardens
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="gap-2 px-6 py-6 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <Link to="/login">
            <Users size={18} /> Change account
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
                <h3 className="font-bold text-gray-900">Volunteer Gardener?</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                  Guest Status
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              If a grower or owner has given you a digital key to a plot, check
              your notifications for the invitation.
            </p>
            <Link
              to="/messages"
              className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              Open my inbox →
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
                <h3 className="font-bold text-gray-900">Property Owner?</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                  Host / Lessor Role
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Ensure you are logged in using your cadastral identifier or the
              certified account managing this land.
            </p>
            <Link
              to={user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'}
              className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              Verify my permissions <Lock size={14} />
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
                  GreenSpace Assistant
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                  Rural warden 24/7
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              A lease-related issue or a breakdown in communication? Our team of
              community mediators will respond to you promptly.
            </p>
            <a
              href="#"
              className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              Contact the support team ✉
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
              Are you looking for available land to cultivate?
            </h4>
            <p className="text-sm text-gray-500">
              More than 1,200 urban parcels, shared balconies, and collective orchards
              are open without any badge restrictions in your area.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shrink-0 px-6 py-6 rounded-full font-semibold shadow-sm"
        >
          <Link to="/explore">
            View available land <Map size={18} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
