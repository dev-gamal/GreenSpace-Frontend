import { useEffect, useState } from 'react';
import { Users, Sprout, ShoppingBag, CalendarCheck, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '../../api/axiosConfig';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error loading admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          {users.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No users found.</div>
          ) : (
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
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'text-purple-700 bg-purple-100' 
                          : user.role === 'OWNER' 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-blue-700 bg-blue-100'
                      }`}>
                        {user.role === 'ADMIN' ? 'Admin' : user.role === 'OWNER' ? 'Owner' : 'Gardener'}
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
                      {user.role !== 'ADMIN' && (
                        <button 
                          onClick={() => toggleUserBlock(user.id)}
                          className={`px-3 py-1 text-sm text-white rounded transition-colors ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}