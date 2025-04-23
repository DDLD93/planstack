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
  PieChartIcon,
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

// Property data interface
interface PropertyMetric {
  ownerName: string;
  propertyId: string;
  lat: number;
  lng: number;
  propertyType: string;
  propertySize: number;
  taxStatus: string;
  region: string;
  lga: string;
  ward: string;
  evaluationPrice: number;
}

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

// Comprehensive property location data
const locationPoints: PropertyMetric[] = [
  {
    ownerName: "John Adamu",
    propertyId: "JN-12345",
    lat: 9.9188,
    lng: 8.8942,
    propertyType: "Residential",
    propertySize: 850,
    taxStatus: "Paid",
    region: "Northern",
    lga: "Jos North",
    ward: "Naraguta",
    evaluationPrice: 25000000,
  },
  {
    ownerName: "Sarah Ibrahim",
    propertyId: "JS-67890",
    lat: 9.8943,
    lng: 8.8806,
    propertyType: "Commercial",
    propertySize: 1200,
    taxStatus: "Paid",
    region: "Southern",
    lga: "Jos South",
    ward: "Bukuru",
    evaluationPrice: 45000000,
  },
  {
    ownerName: "Michael Okonkwo",
    propertyId: "MG-23456",
    lat: 9.5292,
    lng: 9.0089,
    propertyType: "Residential",
    propertySize: 620,
    taxStatus: "Pending",
    region: "Central",
    lga: "Mangu",
    ward: "Mangu Central",
    evaluationPrice: 18500000,
  },
  {
    ownerName: "Elizabeth Danladi",
    propertyId: "BL-34567",
    lat: 9.5333,
    lng: 8.9,
    propertyType: "Agricultural",
    propertySize: 5000,
    taxStatus: "Paid",
    region: "Western",
    lga: "Barkin Ladi",
    ward: "Barkin Ladi",
    evaluationPrice: 32000000,
  },
  {
    ownerName: "Emmanuel Joseph",
    propertyId: "BK-45678",
    lat: 9.3,
    lng: 9.0,
    propertyType: "Mixed Use",
    propertySize: 1500,
    taxStatus: "Overdue",
    region: "Eastern",
    lga: "Bokkos",
    ward: "Bokkos Central",
    evaluationPrice: 28000000,
  },
  {
    ownerName: "Patricia Lar",
    propertyId: "JN-56789",
    lat: 9.9288,
    lng: 8.9042,
    propertyType: "Commercial",
    propertySize: 1800,
    taxStatus: "Paid",
    region: "Northern",
    lga: "Jos North",
    ward: "Jenta Adamu",
    evaluationPrice: 52000000,
  },
  {
    ownerName: "David Ahmed",
    propertyId: "JN-67890",
    lat: 9.9388,
    lng: 8.8842,
    propertyType: "Residential",
    propertySize: 750,
    taxStatus: "Pending",
    region: "Northern",
    lga: "Jos North",
    ward: "Jenta Mangoro",
    evaluationPrice: 21000000,
  },
  {
    ownerName: "Grace Emmanuel",
    propertyId: "JN-78901",
    lat: 9.9088,
    lng: 8.8742,
    propertyType: "Residential",
    propertySize: 680,
    taxStatus: "Paid",
    region: "Northern",
    lga: "Jos North",
    ward: "Apata",
    evaluationPrice: 19500000,
  },
  {
    ownerName: "Peter Musa",
    propertyId: "JN-89012",
    lat: 9.8988,
    lng: 8.9142,
    propertyType: "Industrial",
    propertySize: 3200,
    taxStatus: "Overdue",
    region: "Northern",
    lga: "Jos North",
    ward: "Laranto",
    evaluationPrice: 85000000,
  },
  {
    ownerName: "Fatima Bello",
    propertyId: "JS-90123",
    lat: 9.8843,
    lng: 8.8706,
    propertyType: "Commercial",
    propertySize: 1400,
    taxStatus: "Paid",
    region: "Southern",
    lga: "Jos South",
    ward: "Gyel",
    evaluationPrice: 48000000,
  },
  {
    ownerName: "James Yakubu",
    propertyId: "JS-01234",
    lat: 9.8743,
    lng: 8.8906,
    propertyType: "Residential",
    propertySize: 550,
    taxStatus: "Exempt",
    region: "Southern",
    lga: "Jos South",
    ward: "Vwang",
    evaluationPrice: 16500000,
  },
  {
    ownerName: "Mary Dung",
    propertyId: "JS-34567",
    lat: 9.9043,
    lng: 8.9006,
    propertyType: "Mixed Use",
    propertySize: 1250,
    taxStatus: "Paid",
    region: "Southern",
    lga: "Jos South",
    ward: "Du",
    evaluationPrice: 35000000,
  },
  {
    ownerName: "Paul Gyang",
    propertyId: "JS-45678",
    lat: 9.9143,
    lng: 8.8606,
    propertyType: "Agricultural",
    propertySize: 7500,
    taxStatus: "Pending",
    region: "Southern",
    lga: "Jos South",
    ward: "Kuru",
    evaluationPrice: 42000000,
  },
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
  height: "500px", // Increased height for better visibility
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

  const [selectedLocation, setSelectedLocation] = useState<PropertyMetric | null>(null);
  const [showStreetView, setShowStreetView] = useState(false);
  const [mapType, setMapType] = useState("roadmap"); // Use string instead of google.maps.MapTypeId

  // Get marker color based on property type
  const getMarkerColor = (propertyType: string) => {
    switch (propertyType) {
      case "Residential": return "#3B82F6"; // blue
      case "Commercial": return "#10B981"; // green
      case "Industrial": return "#F59E0B"; // amber
      case "Agricultural": return "#6366F1"; // indigo
      case "Mixed Use": return "#EC4899"; // pink
      default: return "#3B82F6"; // blue default
    }
  };

  // Get marker icon based on tax status - only called when map is loaded
  const getMarkerIcon = useCallback((property: PropertyMetric) => {
    if (!isLoaded) return undefined; // Return undefined instead of null
    
    const color = getMarkerColor(property.propertyType);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeWeight: 1,
      strokeColor: "#FFFFFF",
      scale: 10 + (property.propertySize / 1000), // Size based on property size
    };
  }, [isLoaded]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      case "Exempt": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return <Check className="w-4 h-4" />;
      case "Pending": return <Clock className="w-4 h-4" />;
      case "Overdue": return <XCircle className="w-4 h-4" />;
      case "Exempt": return <Shield className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  // Toggle street view
  const toggleStreetView = useCallback(() => {
    setShowStreetView(!showStreetView);
  }, [showStreetView]);

  // Change map type - using string values
  const changeMapType = useCallback((type: string) => {
    setMapType(type);
  }, []);

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
        <div className="mb-4 flex flex-wrap gap-2">
          <button 
            onClick={() => changeMapType("roadmap")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${mapType === "roadmap" ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <Map className="w-4 h-4" /> Road
          </button>
          <button 
            onClick={() => changeMapType("satellite")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${mapType === "satellite" ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <Layers className="w-4 h-4" /> Satellite
          </button>
          <button 
            onClick={() => changeMapType("hybrid")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${mapType === "hybrid" ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <Layers className="w-4 h-4" /> Hybrid
          </button>
          <button 
            onClick={() => changeMapType("terrain")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${mapType === "terrain" ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <Mountain className="w-4 h-4" /> Terrain
          </button>
        </div>
        {loadError && <div>Error loading maps</div>}
        {!isLoaded ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={15}
              center={center}
              mapTypeId={mapType}
              options={{
                streetViewControl: true,
                mapTypeControl: false, // We're using our custom controls
                fullscreenControl: true,
                zoomControl: true,
                styles: [
                  {
                    featureType: "administrative",
                    elementType: "geometry",
                    stylers: [{ visibility: "on" }],
                  },
                  {
                    featureType: "poi",
                    stylers: [{ visibility: "on" }],
                  },
                ],
              }}
            >
              {showStreetView && selectedLocation ? (
                <StreetViewPanorama
                  options={{
                    position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
                    enableCloseButton: true,
                    addressControl: true,
                    visible: true
                  }}
                  onCloseclick={() => setShowStreetView(false)}
                />
              ) : (
                <>
                  {locationPoints.map((property, index) => (
                    <Marker
                      key={index}
                      position={{ lat: property.lat, lng: property.lng }}
                      onClick={() => {
                        setSelectedLocation(property);
                        setShowStreetView(false);
                      }}
                      icon={isLoaded ? getMarkerIcon(property) : undefined}
                      title={property.propertyId}
                    />
                  ))}
                </>
              )}

              {selectedLocation && !showStreetView && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2 w-72 max-w-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{selectedLocation.propertyId}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedLocation.taxStatus)}`}>
                        {getStatusIcon(selectedLocation.taxStatus)}
                        {selectedLocation.taxStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Owner</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {selectedLocation.ownerName}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Type</span>
                        <span className="text-sm font-medium">{selectedLocation.propertyType}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Size</span>
                        <span className="text-sm font-medium">{selectedLocation.propertySize} m²</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Value</span>
                        <span className="text-sm font-medium">₦{selectedLocation.evaluationPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md mb-3">
                      <div className="text-xs text-gray-500 mb-1">Location</div>
                      <div className="text-sm">
                        {selectedLocation.ward}, {selectedLocation.lga}, {selectedLocation.region} Region
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={toggleStreetView}
                        className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-md text-sm flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> Street View
                      </button>
                      <button 
                        className="flex-1 bg-gray-100 px-3 py-1 rounded-md text-sm flex items-center justify-center gap-1"
                        onClick={() => window.open(`/properties/${selectedLocation.propertyId}`, '_blank')}
                      >
                        <FileText className="w-4 h-4" /> Details
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
            
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-10">
              <div className="text-xs text-gray-500 mb-1">Property Types</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Residential</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Commercial</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs">Industrial</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-xs">Agricultural</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-xs">Mixed Use</span>
                </div>
              </div>
            </div>
          </div>
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