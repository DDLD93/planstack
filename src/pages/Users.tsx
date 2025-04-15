import React, { useState } from 'react';
import { DataTable } from '../components/Table/DataTable'; // Import the DataTable component
import { Plus, User, UserCheck, UserX, Activity } from 'lucide-react';

// Define the UserRecord interface
interface UserRecord {
  userId: string;
  userName: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  createdAt: string;
  lga: string;
  ward: string;
}

// Mock data for demonstration
const mockUsers: UserRecord[] = [
  {
    userId: '1',
    userName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Active',
    lastLogin: '2023-10-15 10:30 AM',
    createdAt: '2023-01-01',
    lga: 'Igabi',
    ward: 'chukun',
  },
  {
    userId: '2',
    userName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Inactive',
    lastLogin: '2023-09-20 02:15 PM',
    createdAt: '2023-03-15',
    lga: 'Igabi',
    ward: 'chukun',
  },
  // Add more mock data as needed
];

// Analytics Card Component
const AnalyticsCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendValue: string;
}> = ({ title, value, icon, trend, trendValue }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-red-50 text-red-600 rounded-lg">{icon}</div>
    </div>
    <div className="flex items-end gap-2 mb-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <p className="text-sm">
      <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </span>
      <span className="text-gray-500"> vs last month</span>
    </p>
  </div>
);

// Add User Modal Component
const AddUserModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: UserRecord) => void;
}) => {
  const [newUser, setNewUser] = useState<Partial<UserRecord>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newUser as UserRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Enumerators</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              placeholder="Enter..."
              value={newUser.userName || ''}
              onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter..."
              value={newUser.email || ''}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Users Page Component
export default function Users() {
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Columns for the DataTable
  const columns = [
    {
      accessorKey: 'userName',
      header: 'User Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
    },
    {
      accessorKey: 'lga',
      header: 'LGA',
    },
    {
      accessorKey: 'ward',
      header: 'Ward',
    },
  ];

  // Filtered users based on the selected filter
  const filteredUsers =
    filter === 'all'
      ? users
      : users.filter((user) => user.status.toLowerCase() === filter);

  // Add a new user
  const handleAddUser = (newUser: UserRecord) => {
    setUsers([
      ...users,
      {
        ...newUser,
        userId: String(users.length + 1),
        status: 'Active',
        lastLogin: 'N/A',
        createdAt: new Date().toISOString().split('T')[0],
        lga: 'Igabi',
        ward: 'chukun',
      },
    ]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enumerators Management</h1>
          <p className="text-gray-600 mt-1">Manage your enumerators and view analytics</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Tab-style Filter */}
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setFilter('all')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    filter === 'all'
                      ? 'border-red-600 text-red-600 dark:text-red-500 dark:border-red-500'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  All
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setFilter('active')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    filter === 'active'
                      ? 'border-red-600 text-red-600 dark:text-red-500 dark:border-red-500'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Active
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setFilter('inactive')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    filter === 'inactive'
                      ? 'border-red-600 text-red-600 dark:text-red-500 dark:border-red-500'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Inactive
                </a>
              </li>
            </ul>
          </div>
          {/* Add Enumerator Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Plus size={16} />
            Add Enumerator
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Enumerators"
          value={users.length.toString()}
          icon={<User size={20} />}
          trend="up"
          trendValue="12%"
        />
        <AnalyticsCard
          title="Active Enumerators"
          value={users.filter((u) => u.status === 'Active').length.toString()}
          icon={<UserCheck size={20} />}
          trend="up"
          trendValue="8%"
        />
        <AnalyticsCard
          title="Inactive Enumerators"
          value={users.filter((u) => u.status === 'Inactive').length.toString()}
          icon={<UserX size={20} />}
          trend="down"
          trendValue="5%"
        />
        <AnalyticsCard
          title="Avg. Performance"
          value="4.2/5"
          icon={<Activity size={20} />}
          trend="up"
          trendValue="3%"
        />
      </div>

      {/* Users Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        enableSearch
        enablePagination
        enableSorting
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
}