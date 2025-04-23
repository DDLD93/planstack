import React from "react";
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
} from "recharts";
import { GoogleMap, Marker, InfoWindow, useLoadScript, Libraries, HeatmapLayer } from "@react-google-maps/api";
import { DataTable } from "../components/Table/DataTable";
import { Chip, CircularProgress } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Map as MapIcon,
  Globe,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";

// Define the RegionSummary type
interface RegionSummary {
  region: string;
  lga: string;
  ward: string;
  totalProperties: number;
  population: number;
  populationDensity: number;
  landArea: number;
  propertyDensity: number;
  averagePropertySize: number;
  valuePerSqMeter: number;
  totalEvaluationPrice: number;
}

// Define HeatMapPoint type
interface HeatMapPoint {
  lat: number;
  lng: number;
  weight: number;
}

// Mock Data
const mockData = {
  regionBreakdown: [
    { region: "Jos North", properties: 8500, area: 85, population: 420000 },
    { region: "Jos South", properties: 7200, area: 95, population: 380000 },
    { region: "Mangu", properties: 3500, area: 150, population: 295000 },
    { region: "Barkin Ladi", properties: 2800, area: 110, population: 175000 },
    { region: "Bokkos", properties: 2100, area: 130, population: 145000 },
  ],
  
  wardDistribution: [
    { ward: "Kabong", properties: 2100, area: 12, population: 85000 },
    { ward: "Jenta", properties: 1800, area: 10, population: 76000 },
    { ward: "Tudun Wada", properties: 1650, area: 8, population: 72000 },
    { ward: "Bukuru", properties: 1900, area: 15, population: 82000 },
    { ward: "Gyel", properties: 1500, area: 18, population: 68000 },
    { ward: "Other Wards", properties: 12050, area: 507, population: 657000 },
  ],
  
  propertyTypeByRegion: [
    { 
      region: "Jos North", 
      residential: 6000,
      commercial: 1800,
      industrial: 300,
      agricultural: 100,
      undeveloped: 300,
    },
    { 
      region: "Jos South", 
      residential: 4800,
      commercial: 1200,
      industrial: 400,
      agricultural: 200,
      undeveloped: 600,
    },
    { 
      region: "Mangu", 
      residential: 2200,
      commercial: 400,
      industrial: 150,
      agricultural: 550,
      undeveloped: 200,
    },
    { 
      region: "Barkin Ladi", 
      residential: 1800,
      commercial: 350,
      industrial: 100,
      agricultural: 450,
      undeveloped: 100,
    },
    { 
      region: "Bokkos", 
      residential: 1400,
      commercial: 250,
      industrial: 50,
      agricultural: 350,
      undeveloped: 50,
    },
  ],
  
  densityDistribution: [
    { name: "High Density", value: 45, color: "#EF4444" },
    { name: "Medium Density", value: 30, color: "#F59E0B" },
    { name: "Low Density", value: 25, color: "#10B981" },
  ],
  
  landValueByRegion: [
    { region: "Jos North", valuePerSqm: 85000 },
    { region: "Jos South", valuePerSqm: 75000 },
    { region: "Mangu", valuePerSqm: 42000 },
    { region: "Barkin Ladi", valuePerSqm: 38000 },
    { region: "Bokkos", valuePerSqm: 30000 },
  ],
};

// Heat map points for property density
const heatMapPoints: HeatMapPoint[] = [
  { lat: 9.9188, lng: 8.8942, weight: 30 }, // Jos North center
  { lat: 9.8943, lng: 8.8806, weight: 25 }, // Jos South center
  { lat: 9.5292, lng: 9.0089, weight: 15 }, // Mangu center
  { lat: 9.5333, lng: 8.9, weight: 12 },    // Barkin Ladi center
  { lat: 9.3, lng: 9.0, weight: 10 },       // Bokkos center
  
  // Additional density points around Jos North
  { lat: 9.9288, lng: 8.9042, weight: 28 },
  { lat: 9.9388, lng: 8.8842, weight: 27 },
  { lat: 9.9088, lng: 8.8742, weight: 26 },
  { lat: 9.8988, lng: 8.9142, weight: 22 },
  
  // Additional density points around Jos South
  { lat: 9.8843, lng: 8.8706, weight: 23 },
  { lat: 9.8743, lng: 8.8906, weight: 22 },
  { lat: 9.9043, lng: 8.9006, weight: 21 },
  { lat: 9.9143, lng: 8.8606, weight: 20 },
];

// Mock data for regional summary table
const regionSummary: RegionSummary[] = [
  {
    region: "Plateau",
    lga: "Jos North",
    ward: "Kabong",
    totalProperties: 2100,
    population: 85000,
    populationDensity: 7083,
    landArea: 12,
    propertyDensity: 175,
    averagePropertySize: 420,
    valuePerSqMeter: 80000,
    totalEvaluationPrice: 2100 * 420 * 80000, // 70,560,000,000
  },
  {
    region: "Plateau",
    lga: "Jos North",
    ward: "Jenta",
    totalProperties: 1800,
    population: 76000,
    populationDensity: 7600,
    landArea: 10,
    propertyDensity: 180,
    averagePropertySize: 380,
    valuePerSqMeter: 85000,
    totalEvaluationPrice: 1800 * 380 * 85000, // 58,140,000,000
  },
  {
    region: "Plateau",
    lga: "Jos North",
    ward: "Tudun Wada",
    totalProperties: 1650,
    population: 72000,
    populationDensity: 9000,
    landArea: 8,
    propertyDensity: 206,
    averagePropertySize: 350,
    valuePerSqMeter: 90000,
    totalEvaluationPrice: 1650 * 350 * 90000, // 51,975,000,000
  },
  {
    region: "Plateau",
    lga: "Jos South",
    ward: "Bukuru",
    totalProperties: 1900,
    population: 82000,
    populationDensity: 5467,
    landArea: 15,
    propertyDensity: 127,
    averagePropertySize: 480,
    valuePerSqMeter: 75000,
    totalEvaluationPrice: 1900 * 480 * 75000, // 68,400,000,000
  },
  {
    region: "Plateau",
    lga: "Jos South",
    ward: "Gyel",
    totalProperties: 1500,
    population: 68000,
    populationDensity: 3778,
    landArea: 18,
    propertyDensity: 83,
    averagePropertySize: 520,
    valuePerSqMeter: 70000,
    totalEvaluationPrice: 1500 * 520 * 70000, // 54,600,000,000
  },
];

// Define the column helper for the data table
const columnHelper = createColumnHelper<RegionSummary>();

// Define columns for the data table
const columns = [
  columnHelper.accessor("lga", {
    header: "LGA",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ward", {
    header: "Ward",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("totalProperties", {
    header: "Properties",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("population", {
    header: "Population",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("landArea", {
    header: "Area (km²)",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("propertyDensity", {
    header: "Property Density",
    cell: (info) => `${info.getValue()}/km²`,
  }),
  columnHelper.accessor("populationDensity", {
    header: "Population Density",
    cell: (info) => `${info.getValue()}/km²`,
  }),
  columnHelper.accessor("valuePerSqMeter", {
    header: "Value/m²",
    cell: (info) => `₦${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("totalEvaluationPrice", {
    header: "Total Evaluation",
    cell: (info) => `₦${info.getValue().toLocaleString()}`,
  }),
];

// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Define center for map (Plateau State)
const center = {
  lat: 9.8965,
  lng: 8.8583,
};

// Libraries for Google Maps
const libraries: Libraries = ["visualization"];

const RegionalData = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  // Prepare stacked bar chart data
  const stackedBarData = mockData.propertyTypeByRegion.map((item) => ({
    region: item.region,
    Residential: item.residential,
    Commercial: item.commercial,
    Industrial: item.industrial,
    Agricultural: item.agricultural,
    Undeveloped: item.undeveloped,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Regional Data Analysis</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Regions Analyzed"
          value={mockData.regionBreakdown.length}
          icon={<Globe className="w-5 h-5" />}
        />
        <StatCard
          title="Total Properties"
          value={mockData.regionBreakdown.reduce((sum, item) => sum + item.properties, 0)}
          icon={<MapIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Total Population"
          value={mockData.regionBreakdown.reduce((sum, item) => sum + item.population, 0)}
          icon={<Globe className="w-5 h-5" />}
        />
        <StatCard
          title="Total Land Area"
          value={`${mockData.regionBreakdown.reduce((sum, item) => sum + item.area, 0)} km²`}
          icon={<MapIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Total Evaluation Value"
          value={`₦${regionSummary.reduce((sum, item) => sum + item.totalEvaluationPrice, 0).toLocaleString()}`}
          icon={<BarChart2 className="w-5 h-5" />}
        />
      </div>

      {/* Property Heat Map */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MapIcon className="w-5 h-5 mr-2 text-red-500" />
          Property Density Heat Map
        </h2>
        {loadError && <div>Error loading maps</div>}
        {!isLoaded ? (
          <div className="flex justify-center items-center h-80">
            <CircularProgress />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={10}
            center={center}
          >
            <HeatmapLayer
              data={heatMapPoints.map(point => ({
                location: new google.maps.LatLng(point.lat, point.lng),
                weight: point.weight,
              }))}
              options={{
                radius: 20,
                opacity: 0.7,
                gradient: [
                  'rgba(0, 255, 255, 0)',
                  'rgba(0, 255, 255, 1)',
                  'rgba(0, 191, 255, 1)',
                  'rgba(0, 127, 255, 1)',
                  'rgba(0, 63, 255, 1)',
                  'rgba(0, 0, 255, 1)',
                  'rgba(0, 0, 223, 1)',
                  'rgba(0, 0, 191, 1)',
                  'rgba(0, 0, 159, 1)',
                  'rgba(0, 0, 127, 1)',
                  'rgba(63, 0, 91, 1)',
                  'rgba(127, 0, 63, 1)',
                  'rgba(191, 0, 31, 1)',
                  'rgba(255, 0, 0, 1)'
                ]
              }}
            />
          </GoogleMap>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Property Distribution by Region */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Property Distribution by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.regionBreakdown}
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

        {/* Property Type Distribution by Region */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-green-500" />
            Property Types by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stackedBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="Residential" stackId="a" fill="#3B82F6" name="Residential" />
                <Bar dataKey="Commercial" stackId="a" fill="#10B981" name="Commercial" />
                <Bar dataKey="Industrial" stackId="a" fill="#F59E0B" name="Industrial" />
                <Bar dataKey="Agricultural" stackId="a" fill="#8B5CF6" name="Agricultural" />
                <Bar dataKey="Undeveloped" stackId="a" fill="#EC4899" name="Undeveloped" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Density Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-purple-500" />
            Property Density Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.densityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.densityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Land Value by Region */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-yellow-500" />
            Land Value by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.landValueByRegion}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="valuePerSqm" fill="#F59E0B" name="Value per sq meter" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Data Table */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-500" />
          Detailed Regional Data
        </h2>
        <DataTable columns={columns} data={regionSummary} />
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
  </div>
);

export default RegionalData;