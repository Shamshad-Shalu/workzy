import React, { useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Filter,
  Download,
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

interface User {
  id: number;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  createdOn: string;
  status: 'Active' | 'Blocked' | 'Pending';
  role: 'Admin' | 'Worker' | 'User';
}

const WorkerManagementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Dummy user data
  const dummyUsers: User[] = [
    {
      id: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramu',
      name: 'Ramu',
      email: 'ramutha@gmail.com',
      phone: '8797088890',
      createdOn: '2/4/23',
      status: 'Active',
      role: 'Worker',
    },
    {
      id: 2,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramshad',
      name: 'Ramshad',
      email: 'helo@gmail.com',
      phone: '7868989758',
      createdOn: '23/4/21',
      status: 'Blocked',
      role: 'User',
    },
    {
      id: 3,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh',
      name: 'Ramesh',
      email: 'ramesh@gmail.com',
      phone: '9876543210',
      createdOn: '15/3/22',
      status: 'Active',
      role: 'Admin',
    },
    {
      id: 4,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      name: 'Rajesh',
      email: 'rajesh@gmail.com',
      phone: '9123456789',
      createdOn: '10/5/23',
      status: 'Pending',
      role: 'Worker',
    },
    {
      id: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      name: 'Priya',
      email: 'priya@gmail.com',
      phone: '9876512345',
      createdOn: '8/7/23',
      status: 'Active',
      role: 'User',
    },
    {
      id: 6,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun',
      name: 'Arun',
      email: 'arun@gmail.com',
      phone: '8765432109',
      createdOn: '22/2/23',
      status: 'Blocked',
      role: 'Worker',
    },
    {
      id: 7,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa',
      name: 'Deepa',
      email: 'deepa@gmail.com',
      phone: '9123987654',
      createdOn: '5/8/23',
      status: 'Active',
      role: 'User',
    },
    {
      id: 8,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
      name: 'Vikram',
      email: 'vikram@gmail.com',
      phone: '8876543210',
      createdOn: '12/6/23',
      status: 'Active',
      role: 'Admin',
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(dummyUsers.length / itemsPerPage);

  // Filter users
  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email.toLowerCase().includes(searchInput.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Blocked':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-section-blue text-blue-700';
      case 'Worker':
        return 'bg-section-red text-red-700';
      case 'User':
        return 'bg-section-green text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage your platform users</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={v => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              placeholder="All Status"
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
                { label: 'Pending', value: 'pending' },
              ]}
              leftIcon={<Filter className="w-4 h-4" />}
            />

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onChange={v => {
                setRoleFilter(v);
                setCurrentPage(1);
              }}
              placeholder="All Roles"
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Admin', value: 'admin' },
                { label: 'Worker', value: 'worker' },
                { label: 'User', value: 'user' },
              ]}
              leftIcon={<Filter className="w-4 h-4" />}
            />

            {/* Export Button */}
            <Button variant="blue" fullWidth iconLeft={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-muted/50 px-6 py-4 border-b border-border">
            <div className="grid grid-cols-12 gap-4 font-semibold text-foreground text-sm">
              <div className="col-span-1">#</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-1">Phone</div>
              <div className="col-span-1">Created</div>
              <div className="col-span-1">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, idx) => (
                <div key={user.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm text-muted-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </div>

                    {/* User Info */}
                    <div className="col-span-2 flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <span className="font-medium text-foreground text-sm">{user.name}</span>
                    </div>

                    {/* Email */}
                    <div className="col-span-2 text-sm text-muted-foreground">{user.email}</div>

                    {/* Phone */}
                    <div className="col-span-1 text-sm text-muted-foreground">{user.phone}</div>

                    {/* Created Date */}
                    <div className="col-span-1 text-sm text-muted-foreground">{user.createdOn}</div>

                    {/* Role */}
                    <div className="col-span-1">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRoleColor(user.role)}`}
                        style={{
                          backgroundColor: `var(--section-${user.role === 'Admin' ? 'blue' : user.role === 'Worker' ? 'red' : 'green'})/20`,
                          color:
                            user.role === 'Admin'
                              ? 'var(--section-blue-border)'
                              : user.role === 'Worker'
                                ? 'var(--section-red-border)'
                                : 'var(--section-green-border)',
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center gap-2">
                      <Button
                        variant="blue"
                        className="text-xs py-1 px-3"
                        iconLeft={<Eye className="w-3 h-3" />}
                      >
                        View
                      </Button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}{' '}
            users
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="py-2 px-3"
              iconLeft={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-muted-foreground">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg font-medium hover:bg-muted text-foreground transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="py-2 px-3"
              iconRight={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerManagementPage;
