import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
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
import { DevelopmentStatus, Facility, OccupancyStatus, PropertyType, TaxStatus, ValidationStatus } from "../types";

interface PropertyData extends Facility {
  lga: string;
  ward: string;
}

// Mock Data
const mockData = {
  totalProperties: 10000,
  propertyTypeBreakdown: [
    { type: PropertyType.Residential, count: 7000 },
    { type: PropertyType.Commercial, count: 2500 },
    { type: PropertyType.Industrial, count: 500 },
    { type: PropertyType.Agricultural, count: 800 },
    { type: PropertyType.Mixed, count: 200 },
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
    { status: DevelopmentStatus.Developed, percentage: 60 },
    { status: DevelopmentStatus.Undeveloped, percentage: 30 },
    { status: DevelopmentStatus.UnderDevelopment, percentage: 10 },
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
const propertyData: PropertyData[] = [
  {
    ownerName: "John Doe",
    propertyId: "PROP-12345",
    nationalIdentificationNumber: '12345',
    phoneNumber1: '12345',
    physicalAddress: 'address',
    gpsLatitude: 9.9188,
    gpsLongitude: 8.8942,
    geocodedAddress: 'address',
    propertyType: PropertyType.Residential,
    propertySize: 500,
    taxStatus: TaxStatus.Paid,
    region: "Plateau",
    lga: "Jos North",
    ward: "Kabong",
    marketValueAssessment: 45000000,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: false,
    taxLevyCategory: 'A',
    taxLevyAmount: 1000,
    annualRate: 0.05,
    reliefRate: 0,
    imageOfProperty: '',
    dataValidationStatus: ValidationStatus.Validated
  },
  {
    ownerName: "Jane Smith",
    propertyId: "PROP-67890",
    nationalIdentificationNumber: '12345',
    phoneNumber1: '12345',
    physicalAddress: 'address',
    gpsLatitude: 9.861,
    gpsLongitude: 8.8369,
    geocodedAddress: 'address',
    propertyType: PropertyType.Commercial,
    propertySize: 1200,
    taxStatus: TaxStatus.Unpaid,
    region: "Plateau",
    lga: "Riyom",
    ward: "Riyom",
    marketValueAssessment: 120000000,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: false,
    taxLevyCategory: 'A',
    taxLevyAmount: 1000,
    annualRate: 0.05,
    reliefRate: 0,
    imageOfProperty: '',
    dataValidationStatus: ValidationStatus.Validated
  },
  {
    ownerName: "Alice Johnson",
    propertyId: "PROP-54321",
    nationalIdentificationNumber: '12345',
    phoneNumber1: '12345',
    physicalAddress: 'address',
    gpsLatitude: 9.9785,
    gpsLongitude: 8.8483,
    geocodedAddress: 'address',
    propertyType: PropertyType.Industrial,
    propertySize: 3500,
    taxStatus: TaxStatus.PartiallyPaid,
    region: "Plateau",
    lga: "Mikang",
    ward: "Mikang",
    marketValueAssessment: 350000000,
    developmentStatus: DevelopmentStatus.Developed,
    occupancyStatus: OccupancyStatus.Occupied,
    multipleOwnership: false,
    taxLevyCategory: 'A',
    taxLevyAmount: 1000,
    annualRate: 0.05,
    reliefRate: 0,
    imageOfProperty: '',
    dataValidationStatus: ValidationStatus.Validated
  },
];

// Define the column helper for the data table
const columnHelper = createColumnHelper<PropertyData>();

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
    cell: (info) => <Chip label={info.getValue()} size="small" />,
  }),
  columnHelper.accessor("propertySize", {
    header: "Property Size (sqm)",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("taxStatus", {
    header: "Tax Status",
    cell: (info) => {
      const status = info.getValue();
      let color: "success" | "warning" | "error" | "info" | "default" = "default";
      if (status === TaxStatus.Paid) color = "success";
      if (status === TaxStatus.PartiallyPaid) color = "warning";
      if (status === TaxStatus.Unpaid) color = "error";
      if (status === TaxStatus.Exempted) color = "info";
      return <Chip label={status} color={color} size="small" />;
    },
  }),
  columnHelper.accessor("region", {
    header: "Region",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lga", {
    header: "LGA",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ward", {
    header: "Ward",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("marketValueAssessment", {
    header: "Evaluation Price",
    cell: (info) => `₦${info.getValue()?.toLocaleString()}`,
  }),
];

// Map container style
const mapContainerStyle = {
  height: "500px",
  width: "100%",
};

// Libraries for Google Maps
const libraries: Libraries = ["places"];

const Properties = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [selectedMarker, setSelectedMarker] = useState<PropertyData | null>(null);

  const handleMarkerClick = (marker: PropertyData) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Property Insights and Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Properties" value={mockData.totalProperties} icon={<Home />} />
        <StatCard
          title="Residential Properties"
          value={mockData.propertyTypeBreakdown.find(p => p.type === PropertyType.Residential)?.count}
          icon={<Home />}
        />
        <StatCard
          title="Commercial Properties"
          value={mockData.propertyTypeBreakdown.find(p => p.type === PropertyType.Commercial)?.count}
          icon={<Building />}
        />
        <StatCard
          title="Industrial Properties"
          value={mockData.propertyTypeBreakdown.find(p => p.type === PropertyType.Industrial)?.count}
          icon={<Factory />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Property Location Map</h2>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: 9.9188, lng: 8.8942 }}
            zoom={10}
          >
            {propertyData.map((marker) => (
              <Marker
                key={marker.propertyId}
                position={{ lat: marker.gpsLatitude, lng: marker.gpsLongitude }}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.gpsLatitude, lng: selectedMarker.gpsLongitude }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-2">
                  <h3 className="font-bold">{selectedMarker.ownerName}</h3>
                  <p>{selectedMarker.propertyType}</p>
                  <p>Size: {selectedMarker.propertySize} sqm</p>
                  <p>Tax Status: {selectedMarker.taxStatus}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Property Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.propertyTypeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="my-8 bg-white p-4 rounded-lg shadow-md">
        <DataTable columns={columns} data={propertyData} />
      </div>

    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon }: { title: string; value: number | undefined; icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center">
    <div className="mr-4 text-blue-500">{icon}</div>
    <div>
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value?.toLocaleString()}</p>
    </div>
  </div>
);

export default Properties;