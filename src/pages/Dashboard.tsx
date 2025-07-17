import React, { useState, useCallback, useRef } from "react";
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
import { GoogleMap, Marker, InfoWindow, useLoadScript, Libraries, StreetViewPanorama } from "@react-google-maps/api";
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
  Navigation,
  User,
  Check,
  XCircle,
  Layers,
  Eye,
  Map,
  Clock,
  Shield,
  Info,
  Mountain,
} from "lucide-react";
import { DevelopmentStatus, Facility, OccupancyStatus, PropertyType, TaxStatus, ValidationStatus } from "../types";

// Property data interface
interface DashboardLocationPoint extends Facility {
  lga: string;
  ward: string;
}

// Mock dashboard overview data
const dashboardData = {
  totalProperties: 21000,
  totalRevenue: 25000000,
  totalRegions: 17,
  pendingValidations: 245,
  totalEvaluationPrice: 972000000000,
  
  propertyTypeDistribution: [
    { name: PropertyType.Residential, value: 14000, color: "#3B82F6" },
    { name: PropertyType.Commercial, value: 4500, color: "#10B981" },
    { name: PropertyType.Industrial, value: 1000, color: "#F59E0B" },
    { name: PropertyType.Agricultural, value: 1000, color: "#6366F1" },
    { name: PropertyType.Mixed, value: 500, color: "#EC4899" },
  ],
  
  developmentStatus: [
    { name: DevelopmentStatus.Developed, value: 16000, color: "#22C55E" },
    { name: DevelopmentStatus.Undeveloped, value: 3000, color: "#F97316" },
    { name: DevelopmentStatus.UnderDevelopment, value: 2000, color: "#06B6D4" },
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

// Comprehensive property location data
const locationPoints: DashboardLocationPoint[] = [
  {
    propertyId: "JN-12345",
    ownerName: "John Adamu",
    nationalIdentificationNumber: "1234567890",
    phoneNumber1: "08012345678",
    physicalAddress: "123 University of Jos Road",
    gpsLatitude: 9.9188,
    gpsLongitude: 8.8942,
    geocodedAddress: "University of Jos, Jos, Plateau State",
    region: "Northern",
    propertyType: PropertyType.Residential,
    propertySize: 850,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: false,
    taxLevyCategory: "A",
    taxLevyAmount: 50000,
    taxStatus: TaxStatus.Paid,
    marketValueAssessment: 25000000,
    annualRate: 0.05,
    reliefRate: 0,
    imageOfProperty: "https://via.placeholder.com/150",
    dataValidationStatus: ValidationStatus.Validated,
    lga: "Jos North",
    ward: "Naraguta",
  },
  {
    propertyId: "JS-67890",
    ownerName: "Sarah Ibrahim",
    nationalIdentificationNumber: "0987654321",
    phoneNumber1: "08098765432",
    physicalAddress: "456 Bukuru Expressway",
    gpsLatitude: 9.8943,
    gpsLongitude: 8.8806,
    geocodedAddress: "Bukuru, Jos South, Plateau State",
    region: "Southern",
    propertyType: PropertyType.Commercial,
    propertySize: 1200,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: true,
    taxLevyCategory: "B",
    taxLevyAmount: 150000,
    taxStatus: TaxStatus.Paid,
    marketValueAssessment: 45000000,
    annualRate: 0.07,
    reliefRate: 0,
    imageOfProperty: "https://via.placeholder.com/150",
    dataValidationStatus: ValidationStatus.Validated,
    lga: "Jos South",
    ward: "Bukuru",
  },
  {
    propertyId: "MG-23456",
    ownerName: "Michael Okonkwo",
    nationalIdentificationNumber: "1122334455",
    phoneNumber1: "08011223344",
    physicalAddress: "789 Mangu Halle",
    gpsLatitude: 9.5292,
    gpsLongitude: 9.0089,
    geocodedAddress: "Mangu, Plateau State",
    region: "Central",
    propertyType: PropertyType.Residential,
    propertySize: 620,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: false,
    taxLevyCategory: "A",
    taxLevyAmount: 40000,
    taxStatus: TaxStatus.Unpaid,
    marketValueAssessment: 18500000,
    annualRate: 0.05,
    reliefRate: 0,
    imageOfProperty: "https://via.placeholder.com/150",
    dataValidationStatus: ValidationStatus.Pending,
    lga: "Mangu",
    ward: "Mangu Central",
  },
  {
    propertyId: "BL-34567",
    ownerName: "Elizabeth Danladi",
    nationalIdentificationNumber: "6677889900",
    phoneNumber1: "08066778899",
    physicalAddress: "101 Barakin Ladi Farms",
    gpsLatitude: 9.5333,
    gpsLongitude: 8.9,
    geocodedAddress: "Barkin Ladi, Plateau State",
    region: "Western",
    propertyType: PropertyType.Agricultural,
    propertySize: 5000,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: false,
    taxLevyCategory: "C",
    taxLevyAmount: 20000,
    taxStatus: TaxStatus.Paid,
    marketValueAssessment: 32000000,
    annualRate: 0.03,
    reliefRate: 0.1,
    imageOfProperty: "https://via.placeholder.com/150",
    dataValidationStatus: ValidationStatus.Validated,
    lga: "Barkin Ladi",
    ward: "Barkin Ladi",
  },
  {
    propertyId: "BK-45678",
    ownerName: "Emmanuel Joseph",
    nationalIdentificationNumber: "1231231231",
    phoneNumber1: "08012312312",
    physicalAddress: "234 Bokkos Market Road",
    gpsLatitude: 9.3,
    gpsLongitude: 9.0,
    geocodedAddress: "Bokkos, Plateau State",
    region: "Eastern",
    propertyType: PropertyType.Mixed,
    propertySize: 1500,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.PartiallyOccupied,
    multipleOwnership: false,
    taxLevyCategory: "B",
    taxLevyAmount: 75000,
    taxStatus: TaxStatus.Unpaid,
    marketValueAssessment: 28000000,
    annualRate: 0.06,
    reliefRate: 0,
    imageOfProperty: "https://via.placeholder.com/150",
    dataValidationStatus: ValidationStatus.Validated,
    lga: "Bokkos",
    ward: "Bokkos Central",
  },
];

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
    <div className="p-3 bg-gray-100 rounded-full mr-4">{icon}</div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["visualization"] as Libraries,
  });

  const [selectedPoint, setSelectedPoint] = useState<DashboardLocationPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DashboardLocationPoint | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getMarkerColor = (propertyType: PropertyType) => {
    switch (propertyType) {
      case PropertyType.Residential:
        return "#3B82F6"; // Blue
      case PropertyType.Commercial:
        return "#10B981"; // Green
      case PropertyType.Industrial:
        return "#F59E0B"; // Amber
      case PropertyType.Agricultural:
        return "#8B5CF6"; // Violet
      case PropertyType.Mixed:
        return "#EC4899"; // Pink
      default:
        return "#6B7280"; // Gray
    }
  };

  const getStatusColor = (status: TaxStatus) => {
    switch (status) {
      case TaxStatus.Paid:
        return "text-green-500";
      case TaxStatus.Unpaid:
        return "text-red-500";
      case TaxStatus.PartiallyPaid:
        return "text-yellow-500";
      case TaxStatus.Exempted:
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: TaxStatus) => {
    switch (status) {
      case TaxStatus.Paid:
        return <Check size={16} />;
      case TaxStatus.Unpaid:
        return <XCircle size={16} />;
      case TaxStatus.PartiallyPaid:
        return <Clock size={16} />;
      case TaxStatus.Exempted:
        return <Shield size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Plateau State Property Dashboard</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Properties" value={dashboardData.totalProperties} icon={<Home className="text-blue-500" />} />
        <StatCard title="Total Revenue (Est.)" value={`₦${(dashboardData.totalRevenue / 1000000).toFixed(1)}M`} icon={<DollarSign className="text-green-500" />} />
        <StatCard title="Total LGAs" value={dashboardData.totalRegions} icon={<Mountain className="text-yellow-500" />} />
        <StatCard title="Pending Validations" value={dashboardData.pendingValidations} icon={<FileText className="text-red-500" />} />
        <StatCard title="Total Assessed Value" value={`₦${(dashboardData.totalEvaluationPrice / 1000000000).toFixed(1)}B`} icon={<BarChart3 className="text-purple-500" />} />
      </div>

      {/* Property Valuation Analytics */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="mr-2 text-blue-500" />
          Property Valuation Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Valuation Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Valuation Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{range: '<10M', count: 5}, {range: '10M-50M', count: 12}, {range: '50M-100M', count: 7}, {range: '100M+', count: 3}]}> {/* Mock data */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Properties" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Valuation Trends */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Valuation Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[{month: 'Jan', value: 20000000}, {month: 'Feb', value: 25000000}, {month: 'Mar', value: 22000000}, {month: 'Apr', value: 27000000}]}> {/* Mock data */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => `₦${(v/1000000).toFixed(1)}M`} />
                <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} name="Avg. Valuation" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top/Bottom Properties */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Top & Bottom Properties by Valuation</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Property ID</th>
                  <th className="px-2 py-1 text-left">Owner</th>
                  <th className="px-2 py-1 text-left">Valuation (₦)</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock data */}
                <tr><td className="px-2 py-1">JN-12345</td><td className="px-2 py-1">John Adamu</td><td className="px-2 py-1">25,000,000</td></tr>
                <tr><td className="px-2 py-1">JS-54321</td><td className="px-2 py-1">Jane Musa</td><td className="px-2 py-1">120,000,000</td></tr>
                <tr><td className="px-2 py-1">MG-67890</td><td className="px-2 py-1">Ali Bello</td><td className="px-2 py-1">8,000,000</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map and Property Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-500" />
            Live Property Map
          </h2>
          <div className="h-[600px] w-full mb-4">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 9.8965, lng: 8.8583 }}
              zoom={10}
              onLoad={onMapLoad}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {locationPoints.map((point) => (
                <Marker
                  key={point.propertyId}
                  position={{ lat: point.gpsLatitude, lng: point.gpsLongitude }}
                  onClick={() => setSelectedPoint(point)}
                  onMouseOver={() => setHoveredPoint(point)}
                  onMouseOut={() => setHoveredPoint(null)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: getMarkerColor(point.propertyType),
                    fillOpacity: 0.8,
                    strokeColor: "white",
                    strokeWeight: 1.5,
                    scale: 8,
                  }}
                />
              ))}
              {selectedPoint && (
                <InfoWindow
                  position={{ lat: selectedPoint.gpsLatitude, lng: selectedPoint.gpsLongitude }}
                  onCloseClick={() => setSelectedPoint(null)}
                >
                  <div className="p-2 w-64">
                    <h3 className="font-bold text-lg mb-2">{selectedPoint.ownerName}</h3>
                    <p className="text-sm">
                      <strong className="font-semibold">ID:</strong> {selectedPoint.propertyId}
                    </p>
                    <p className="text-sm">
                      <strong className="font-semibold">Type:</strong> {selectedPoint.propertyType}
                    </p>
                    <p className="text-sm">
                      <strong className="font-semibold">Size:</strong> {selectedPoint.propertySize} sqm
                    </p>
                    <div className={`flex items-center text-sm ${getStatusColor(selectedPoint.taxStatus)}`}>
                      <strong className="font-semibold mr-1">Status:</strong>
                      {getStatusIcon(selectedPoint.taxStatus)}
                      <span className="ml-1">{selectedPoint.taxStatus}</span>
                    </div>
                    <button
                      className="mt-2 w-full bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600"
                      onClick={() => alert(`Viewing details for ${selectedPoint.propertyId}`)}
                    >
                      View Details
                    </button>
                  </div>
                </InfoWindow>
              )}
              {hoveredPoint && !selectedPoint && (
                <InfoWindow
                  position={{ lat: hoveredPoint.gpsLatitude, lng: hoveredPoint.gpsLongitude }}
                >
                  <div className="p-1">
                    <p className="text-sm font-semibold">{hoveredPoint.ownerName}</p>
                    <p className="text-xs">{hoveredPoint.propertyType}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Charts and Key Metrics */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PieChartIcon className="mr-2 text-green-500" />
              Property Type
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.propertyTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.propertyTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2 text-red-500" />
              Development Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardData.developmentStatus} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Properties" fill="#8884d8">
                  {dashboardData.developmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarDays className="mr-2 text-purple-500" />
            Monthly Enumeration
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.monthlyEnumerations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Properties" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-indigo-500" />
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${(value/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;