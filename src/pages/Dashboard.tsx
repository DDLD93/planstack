import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { GoogleMap, Marker, InfoWindow, useLoadScript, Libraries } from "@react-google-maps/api";
import {
  Building,
  Home,
  DollarSign,
  FileText,
  MapPin,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Users,
  CalendarDays,
} from "lucide-react";

// Mock dashboard overview data
const dashboardData = {
  totalProperties: 21000,
  totalRevenue: 25000000,
  totalRegions: 17,
  pendingValidations: 245,
  totalEvaluationPrice: 972000000000,
  
  propertyTypeDistribution: [
    { name: "Residential", value: 14000, color: "#3B82F6" },
    { name: "Commercial", value: 4500, color: "#10B981" },
    { name: "Industrial", value: 1000, color: "#F59E0B" },
    { name: "Agricultural", value: 1000, color: "#6366F1" },
    { name: "Mixed Use", value: 500, color: "#EC4899" },
  ],
  
  developmentStatus: [
    { name: "Developed", value: 16000, color: "#22C55E" },
    { name: "Undeveloped", value: 3000, color: "#F97316" },
    { name: "Partially Developed", value: 2000, color: "#06B6D4" },
  ],
  
  regionBreakdown: [
    { region: "Jos North", properties: 8500 },
    { region: "Jos South", properties: 7200 },
    { region: "Mangu", properties: 3500 },
    { region: "Barkin Ladi", properties: 2800 },
    { region: "Bokkos", properties: 2100 },
    { region: "Other Regions", properties: 1900 },
  ],
  
  monthlyEnumerations: [
    { month: "Jan", count: 1200 },
    { month: "Feb", count: 1500 },
    { month: "Mar", count: 1800 },
    { month: "Apr", count: 2100 },
    { month: "May", count: 1900 },
    { month: "Jun", count: 1700 },
    { month: "Jul", count: 1600 },
    { month: "Aug", count: 1800 },
    { month: "Sep", count: 2000 },
    { month: "Oct", count: 2200 },
    { month: "Nov", count: 2100 },
    { month: "Dec", count: 1800 },
  ],
  
  revenueByMonth: [
    { month: "Jan", revenue: 1500000 },
    { month: "Feb", revenue: 1800000 },
    { month: "Mar", revenue: 1650000 },
    { month: "Apr", revenue: 1900000 },
    { month: "May", revenue: 2100000 },
    { month: "Jun", revenue: 1950000 },
    { month: "Jul", revenue: 1700000 },
    { month: "Aug", revenue: 1850000 },
    { month: "Sep", revenue: 2000000 },
    { month: "Oct", revenue: 2200000 },
    { month: "Nov", revenue: 1950000 },
    { month: "Dec", revenue: 1800000 },
  ],
};

// Heat map points for property density
const locationPoints = [
  { lat: 9.9188, lng: 8.8942, weight: 30, name: "Jos North Center", properties: 4250 }, // Jos North center
  { lat: 9.8943, lng: 8.8806, weight: 25, name: "Jos South Center", properties: 3800 }, // Jos South center
  { lat: 9.5292, lng: 9.0089, weight: 15, name: "Mangu Center", properties: 2100 }, // Mangu center
  { lat: 9.5333, lng: 8.9, weight: 12, name: "Barkin Ladi Center", properties: 1850 },    // Barkin Ladi center
  { lat: 9.3, lng: 9.0, weight: 10, name: "Bokkos Center", properties: 1500 },       // Bokkos center
  
  // Additional density points around Jos North
  { lat: 9.9288, lng: 8.9042, weight: 28, name: "Jos North (East)", properties: 3950 },
  { lat: 9.9388, lng: 8.8842, weight: 27, name: "Jos North (West)", properties: 3750 },
  { lat: 9.9088, lng: 8.8742, weight: 26, name: "Jos North (South)", properties: 3600 },
  { lat: 9.8988, lng: 8.9142, weight: 22, name: "Jos North (Outskirts)", properties: 3200 },
  
  // Additional density points around Jos South
  { lat: 9.8843, lng: 8.8706, weight: 23, name: "Jos South (North)", properties: 3450 },
  { lat: 9.8743, lng: 8.8906, weight: 22, name: "Jos South (East)", properties: 3250 },
  { lat: 9.9043, lng: 8.9006, weight: 21, name: "Jos South (West)", properties: 3100 },
  { lat: 9.9143, lng: 8.8606, weight: 20, name: "Jos South (Outskirts)", properties: 2900 },
];

// Recent activity data
const recentActivity = [
  { id: 1, action: "Property Enumerated", location: "Jos North", timestamp: "Today, 10:45 AM" },
  { id: 2, action: "Tax Payment Received", location: "Jos South", timestamp: "Today, 09:30 AM" },
  { id: 3, action: "Property Validation", location: "Mangu", timestamp: "Yesterday, 03:15 PM" },
  { id: 4, action: "Ownership Transfer", location: "Barkin Ladi", timestamp: "Yesterday, 11:20 AM" },
  { id: 5, action: "Property Enumerated", location: "Bokkos", timestamp: "2 days ago, 02:45 PM" },
];

// Define the map container style
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Define the default center (Plateau State coordinates)
const center = {
  lat: 9.8965,
  lng: 8.8583,
};

// Define libraries for Google Maps
const libraries: Libraries = ["visualization"];

// StatCard Component
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
  </div>
);

// Dashboard Component
const Dashboard = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState<typeof locationPoints[0] | null>(null);

  // Calculate marker size based on weight
  const getMarkerSize = (weight: number) => {
    const minSize = 24;
    const maxSize = 48;
    const minWeight = 10; // Minimum weight in data
    const maxWeight = 30; // Maximum weight in data
    
    return minSize + ((weight - minWeight) / (maxWeight - minWeight)) * (maxSize - minSize);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lands and Survey Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Properties"
          value={dashboardData.totalProperties}
          icon={<Building className="w-5 h-5" />}
        />
        <StatCard
          title="Total Revenue"
          value={`₦${dashboardData.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Total Evaluation"
          value={`₦${dashboardData.totalEvaluationPrice.toLocaleString()}`}
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard
          title="Regions Covered"
          value={dashboardData.totalRegions}
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>

      {/* Property Map */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-500" />
          Property Distribution Map
        </h2>
        {loadError && <div>Error loading maps</div>}
        {!isLoaded ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={10}
            center={center}
          >
            {locationPoints.map((point, index) => (
              <Marker
                key={index}
                position={{ lat: point.lat, lng: point.lng }}
                onClick={() => setSelectedLocation(point)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#3B82F6',
                  fillOpacity: 0.8,
                  strokeWeight: 1,
                  strokeColor: '#1E40AF',
                  scale: getMarkerSize(point.weight) / 10,
                }}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                  <p className="text-gray-700">Properties: {selectedLocation.properties.toLocaleString()}</p>
                  <p className="text-gray-700">Density: {selectedLocation.weight}/30</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Property Type Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-blue-500" />
            Property Type Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.propertyTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.propertyTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Development Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-green-500" />
            Development Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.developmentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.developmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Region Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Properties by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.regionBreakdown}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="properties" fill="#3B82F6" name="Number of Properties" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Monthly Revenue
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.revenueByMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Monthly Enumerations */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-purple-500" />
            Monthly Property Enumerations
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.monthlyEnumerations}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" name="Properties Enumerated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-500" />
            Recent Activity
          </h2>
          <div className="h-80 overflow-y-auto">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 p-3 border-b border-gray-100">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.location} • {activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;