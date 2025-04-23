import React from 'react';
import { Outlet, Link, useNavigate, useMatch } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Network,
  UserCog
} from 'lucide-react';
import { Logo } from '../assets';
import { ImMeter } from 'react-icons/im';
import { BiChart } from 'react-icons/bi';
import { Button } from './ui/button';
import { BsOpencollective } from 'react-icons/bs';
import FloatingActionButton from './FloatingActionButton';
import ChatModal from './ChatModal';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Properties', path: '/properties' },
    { icon: <ImMeter size={20} />, label: 'Demographics', path: '/demographics' },
    { icon: <BiChart size={20} />, label: 'Revenue', path: '/revenue' },
    { icon: <Network size={20} />, label: 'Regional Data', path: '/regional-data' },
    { icon: <BsOpencollective size={20} />, label: 'Operational Efficiency', path: '/operational-efficiency' },
    { icon: <UserCog size={20} />, label: 'Users', path: '/users' },
  ];

  const isCurrentPath = (path: string) => {
    const match = useMatch(path);
    return match !== null;
  };

  // Ensure valid width and height for the sidebar and main content
  const sidebarWidth = isSidebarOpen ? 240 : 80; // Fixed valid numbers
  const mainContentMarginLeft = isSidebarOpen ? 240 : 80; // Fixed valid numbers

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 z-20`}
        style={{ width: sidebarWidth }} // Ensure valid width
      >
        <div className="p-6 flex justify-between items-center border-b">
          <img src={Logo} alt="logo" className='w-[50%] h-[50%]' />
          <Button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                isCurrentPath(item.path)
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <Button
          onClick={handleLogout}
          className="absolute bottom-8 left-4 flex items-center gap-3 p-4 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </Button>
      </div>

      {/* Header */}
      <div 
        className={`fixed top-0 right-0 h-16 bg-white shadow-sm z-10 transition-all duration-300`}
        style={{ left: sidebarWidth }} // Ensure valid left position
      >
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <User size={20} className="text-green-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={`transition-all duration-300 pt-16`}
        style={{ marginLeft: mainContentMarginLeft }} // Ensure valid margin
      >
        <div className="p-8">
          <Outlet />
        </div>
      </div>

      {/* Chat Modal and Floating Action Button */}
      <FloatingActionButton />
      <ChatModal />
    </div>
  );
};

export default Layout;