import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { GoogleMap, Marker, InfoWindow, useLoadScript, Libraries } from "@react-google-maps/api";
import { DataTable } from "../components/Table/DataTable";
import { Chip, CircularProgress, Stack } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Users,
  Home,
  Building,
  Factory,
  Map as MapIcon,
  BarChart2,
  Activity,
  MapPin,
} from "lucide-react";

// Define the PropertyRecord type
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
}

// Mock Data
const mockData = {
  totalProperties: 10000,
  propertyTypeBreakdown: [
    { type: "Residential", count: 7000 },
    { type: "Commercial", count: 2500 },
    { type: "Industrial", count: 500 },
    { type: "Agricultural", count: 800 },
    { type: "Mixed Use", count: 200 },
    { type: "Undeveloped", count: 1000 },
  ],
  geographicDistributionLga: [
    { region: "Barkin Ladi", properties: 3500 },
    { region: "Bassa", properties: 3200 },
    { region: "Bokkos", properties: 2800 },
    { region: "Jos East", properties: 1100 },
    { region: "Jos North", properties: 8900 },
    { region: "Jos South", properties: 5300 },
    { region: "Kanam", properties: 2000 },
    { region: "Kanke", properties: 1500 },
    { region: "Langtang North", properties: 2000 },
    { region: "Langtang South", properties: 1500 },
    { region: "Mangu", properties: 3008 },
    { region: "Mikang", properties: 800 },
    { region: "Pankshin", properties: 2990 },
    { region: "Quanpan", properties: 1400 },
    { region: "Riyom", properties: 600 },
    { region: "Shendam", properties: 1004 },
    { region: "Wase", properties: 2020 },
  ],
  developmentStatus: [
    { status: "Developed", percentage: 60 },
    { status: "Undeveloped", percentage: 30 },
    { status: "Partially Developed", percentage: 10 },
  ],
  propertySizeByLga: [
    { region: "Barkin Ladi", avgSize: 400 },
    { region: "Jos North", avgSize: 300 },
    { region: "Mangu", avgSize: 500 },
  ],
  propertyDistributionByRegion: [
    { region: "Barkin Ladi", properties: 3500 },
    { region: "Bassa", properties: 3200 },
    { region: "Bokkos", properties: 2800 },
    { region: "Jos East", properties: 1100 },
    { region: "Jos North", properties: 8900 },
    { region: "Jos South", properties: 5300 },
    { region: "Kanam", properties: 2000 },
    { region: "Kanke", properties: 1500 },
    { region: "Langtang North", properties: 2000 },
    { region: "Langtang South", properties: 1500 },
    { region: "Mangu", properties: 3008 },
    { region: "Mikang", properties: 800 },
    { region: "Pankshin", properties: 2990 },
    { region: "Quanpan", properties: 1400 },
    { region: "Riyom", properties: 600 },
    { region: "Shendam", properties: 1004 },
    { region: "Wase", properties: 2020 },
  ],
  multipleOwnership: [
    { region: "Bokkos", percentage: 40 },
    { region: "Jos South", percentage: 30 },
    { region: "Wase", percentage: 20 },
  ],
  businessActivity: [
    { type: "Retail", count: 800 },
    { type: "Manufacturing", count: 500 },
    { type: "Services", count: 700 },
    { type: "Agriculture", count: 400 },
    { type: "Hospitality", count: 300 },
  ],
  spatialDistribution: [
    { lat: 9.9188, lng: 8.8942, type: "Commercial" },
    { lat: 9.861, lng: 8.8369, type: "Industrial" },
    { lat: 9.9785, lng: 8.8483, type: "Residential" },
    { lat: 9.8943, lng: 8.8806, type: "Agricultural" },
  ],
};

// Mock Data for DataTable
const propertyMetrics: PropertyMetric[] = [
  {
    ownerName: "John Doe",
    propertyId: "PROP-12345",
    lat: 9.9188,
    lng: 8.8942,
    propertyType: "Residential",
    propertySize: 500,
    taxStatus: "Paid",
    region: "Plateau",
    lga: "Jos North",
    ward: "Kabong",
  },
  {
    ownerName: "Jane Smith",
    propertyId: "PROP-67890",
    lat: 9.861,
    lng: 8.8369,
    propertyType: "Commercial",
    propertySize: 1200,
    taxStatus: "Unpaid",
    region: "Plateau",
    lga: "Riyom",
    ward: "Riyom",
  },
  {
    ownerName: "Alice Johnson",
    propertyId: "PROP-54321",
    lat: 9.9785,
    lng: 8.8483,
    propertyType: "Industrial",
    propertySize: 3500,
    taxStatus: "Partially Paid",
    region: "Plateau",
    lga: "Mikang",
    ward: "Mikang",
  },
  {
    ownerName: "Sani Bulus",
    propertyId: "PROP-66612",
    lat: 9.9717,
    lng: 8.8425,
    propertyType: "Agricultural",
    propertySize: 8000,
    taxStatus: "Paid",
    region: "Plateau",
    lga: "Mikang",
    ward: "Tunkus",
  },
  {
    ownerName: "Judith James",
    propertyId: "PROP-56871",
    lat: 9.9765,
    lng: 8.8413,
    propertyType: "Residential",
    propertySize: 450,
    taxStatus: "Paid",
    region: "Plateau",
    lga: "Mikang",
    ward: "Mikang",
  },
  {
    ownerName: "Khadija Sani",
    propertyId: "PROP-88001",
    lat: 9.9254,
    lng: 8.8242,
    propertyType: "Mixed Use",
    propertySize: 1800,
    taxStatus: "Unpaid",
    region: "Plateau",
    lga: "Jos North",
    ward: "Jenta",
  },
  {
    ownerName: "Daniel Walker",
    propertyId: "PROP-77721",
    lat: 9.885462,
    lng: 8.943817,
    propertyType: "Residential",
    propertySize: 650,
    taxStatus: "Exempt",
    region: "Plateau",
    lga: "Jos South",
    ward: "Bukuru",
  },
];

// Define the column helper for the data table
const columnHelper = createColumnHelper<PropertyMetric>();

// Define columns for the data table
const columns = [
  columnHelper.accessor("ownerName", {
    header: "Owner Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("propertyId", {
    header: "Property ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("propertyType", {
    header: "Property Type",
    cell: (info) => {
      const propertyType = info.getValue();
      let color = "default";
      
      switch (propertyType) {
        case "Residential":
          color = "primary";
          break;
        case "Commercial":
          color = "success";
          break;
        case "Industrial":
          color = "warning";
          break;
        case "Agricultural":
          color = "info";
          break;
        case "Mixed Use":
          color = "secondary";
          break;
        default:
          color = "default";
      }
      
      return <Chip label={propertyType} color={color as any} size="small" />;
    },
  }),
  columnHelper.accessor("propertySize", {
    header: "Size (sqm)",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("taxStatus", {
    header: "Tax Status",
    cell: (info) => {
      const status = info.getValue();
      let color = "default";
      
      switch (status) {
        case "Paid":
          color = "success";
          break;
        case "Unpaid":
          color = "error";
          break;
        case "Partially Paid":
          color = "warning";
          break;
        case "Exempt":
          color = "info";
          break;
        default:
          color = "default";
      }
      
      return <Chip label={status} color={color as any} size="small" />;
    },
  }),
  columnHelper.accessor("lga", {
    header: "LGA",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ward", {
    header: "Ward",
    cell: (info) => info.getValue(),
  }),
];

// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Define center for map (Plateau State)
const center = {
  lat: 9.082,
  lng: 8.675,
};

// Libraries for Google Maps
const libraries: Libraries = ["marker"];

const Properties = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [selectedMarker, setSelectedMarker] = React.useState<PropertyMetric | null>(null);

  const handleMarkerClick = (marker: PropertyMetric) => setSelectedMarker(marker);
  const handleInfoWindowClose = () => setSelectedMarker(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Property Demographics</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Properties"
          value={mockData.totalProperties}
          icon={<Home className="w-5 h-5" />}
        />
        <StatCard
          title="Residential Properties"
          value={mockData.propertyTypeBreakdown.find(type => type.type === "Residential")?.count}
          icon={<Home className="w-5 h-5" />}
        />
        <StatCard
          title="Commercial Properties"
          value={mockData.propertyTypeBreakdown.find(type => type.type === "Commercial")?.count}
          icon={<Building className="w-5 h-5" />}
        />
        <StatCard
          title="Industrial Properties"
          value={mockData.propertyTypeBreakdown.find(type => type.type === "Industrial")?.count}
          icon={<Factory className="w-5 h-5" />}
        />
      </div>

      {/* Property Type Distribution */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
          Property Type Distribution
        </h2>
        <div className="h-80">
          <BarChart
            width={500}
            height={300}
            data={mockData.propertyTypeBreakdown}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Number of Properties" />
          </BarChart>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Geographic Distribution Map */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-500" />
            Geographic Distribution
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
              {propertyMetrics.map((property, index) => (
                <Marker
                  key={index}
                  position={{ lat: property.lat, lng: property.lng }}
                  onClick={() => handleMarkerClick(property)}
                  icon={{
                    url: property.propertyType === "Residential"
                      ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                      : property.propertyType === "Commercial"
                      ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                      : property.propertyType === "Industrial"
                      ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  }}
                />
              ))}
              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div>
                    <h3 className="font-bold">{selectedMarker.ownerName}</h3>
                    <p>Property ID: {selectedMarker.propertyId}</p>
                    <p>Type: {selectedMarker.propertyType}</p>
                    <p>Size: {selectedMarker.propertySize} sqm</p>
                    <p>LGA: {selectedMarker.lga}</p>
                    <p>Ward: {selectedMarker.ward}</p>
                    <p>Tax Status: {selectedMarker.taxStatus}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

        {/* LGA Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MapIcon className="w-5 h-5 mr-2 text-green-500" />
            Distribution by LGA
          </h2>
          <div className="h-80 overflow-auto">
            <BarChart
              width={500}
              height={500}
              data={mockData.geographicDistributionLga}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="properties" fill="#10B981" name="Number of Properties" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* Business Activity Distribution */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-500" />
          Business Activity Distribution
        </h2>
        <div className="h-80">
          <BarChart
            width={500}
            height={300}
            data={mockData.businessActivity}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8B5CF6" name="Number of Businesses" />
          </BarChart>
        </div>
      </div>

      {/* Property Data Table */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Property Records</h2>
        <DataTable columns={columns} data={propertyMetrics} />
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon }: { title: string; value: number | undefined; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-bold">{value?.toLocaleString() || "N/A"}</p>
  </div>
);

export default Properties;