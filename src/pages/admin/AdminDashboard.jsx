import { useEffect, useState } from 'react';
import { Users, Sprout, ShoppingBag, CalendarCheck, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  getAdminStats,
  getAdminUsers,
  getAdminGardens,
  getAdminProducts,
  toggleUserBlock,
  searchAdminUsers,
  getAdminUserById,
  updateAdminGardenStatus
} from '../../api/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, gardensRes, productsRes] = await Promise.all([
          getAdminStats(),
          getAdminUsers(),
          getAdminGardens(100),
          getAdminProducts(100),
        ]);
        setStats(statsRes);
        setUsers(usersRes);
        setGardens(gardensRes?.content || []);
        setProducts(productsRes?.content || []);
      } catch (error) {
        console.error("Error loading admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleUserBlock = async (userId) => {
    try {
      await toggleUserBlock(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error) {
      console.error("Error updating user.", error);
      alert("Error updating user.");
    }
  };

  const handleSearchUsers = async () => {
    if (!userSearchQuery.trim()) {
      try {
        const usersRes = await getAdminUsers();
        setUsers(usersRes);
      } catch (error) {
        console.error("Error loading users", error);
      }
      return;
    }
    try {
      const res = await searchAdminUsers(userSearchQuery);
      setUsers(res);
    } catch (error) {
      console.error("Error searching users", error);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const res = await getAdminUserById(userId);
      setSelectedUser(res);
      alert(`User Details:\nName: ${res.firstName} ${res.lastName}\nEmail: ${res.email}\nRole: ${res.role}\nJoined: ${res.createdAt}`);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const handleUpdateGardenStatus = async (gardenId, newStatus) => {
    try {
      await updateAdminGardenStatus(gardenId, newStatus);
      setGardens(gardens.map(g => g.id === gardenId ? { ...g, status: newStatus } : g));
    } catch (error) {
      console.error("Error updating garden status", error);
      alert("Error updating garden status.");
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
            <div className="text-2xl font-bold text-gray-900">{stats?.totalProduct || 0}</div>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users management</CardTitle>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <button 
              onClick={handleSearchUsers}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Search
            </button>
          </div>
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
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewUser(user.id)}
                        className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        View
                      </button>
                      {user.role !== 'ADMIN' && (
                        <button 
                          onClick={() => handleToggleUserBlock(user.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>Gardens management</CardTitle>
        </CardHeader>
        <CardContent>
          {gardens.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No gardens found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Size (m²)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gardens.map((garden) => (
                  <TableRow key={garden.id}>
                    <TableCell className="font-medium">{garden.city}, {garden.address}</TableCell>
                    <TableCell>{garden.areaSize}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        garden.status === 'AVAILABLE' 
                          ? 'text-green-700 bg-green-100' 
                          : garden.status === 'RESERVED' 
                            ? 'text-blue-700 bg-blue-100' 
                            : 'text-gray-700 bg-gray-100'
                      }`}>
                        {garden.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <select 
                        value={garden.status}
                        onChange={(e) => handleUpdateGardenStatus(garden.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm bg-white"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products management</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No products found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.productType}</TableCell>
                    <TableCell>{product.exchangeType}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'AVAILABLE' 
                          ? 'text-green-700 bg-green-100' 
                          : product.status === 'RESERVED' 
                            ? 'text-orange-700 bg-orange-100' 
                            : 'text-gray-700 bg-gray-100'
                      }`}>
                        {product.status}
                      </span>
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