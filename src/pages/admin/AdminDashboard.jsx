import { useEffect, useState } from 'react';
import { Users, Sprout, ShoppingBag, CalendarCheck, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '../../api/axiosConfig';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([
    { id: 1, name: 'Gamal Badie', email: 'gamal@test.com', role: 'GARDENER', isBlocked: false },
    { id: 2, name: 'Laarbi Hachemi', email: 'laarbi@test.com', role: 'OWNER', isBlocked: true },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error loading statistics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const toggleUserBlock = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-block`);
      setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error) {
      console.error("Error updating user.", error);
      alert("Error updating user.");
    }
  };

  if (loading) return <div className="p-10 text-center">Dashboard loading...</div>;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome to the Admin Dashboard</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Shared Gardens</CardTitle>
            <Sprout className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalGardens || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Market Products</CardTitle>
            <ShoppingBag className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Reservations</CardTitle>
            <CalendarCheck className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.activeReservations || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                      {user.role === 'OWNER' ? 'Owner' : 'Gardener'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <span className="text-red-500 flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Blocked</span>
                    ) : (
                      <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Active</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => toggleUserBlock(user.id)}
                      className={`px-3 py-1 text-sm text-white rounded transition-colors ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {user.isBlocked ? 'Block' : 'Unblock'}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}