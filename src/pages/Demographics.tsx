import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  HardDrive,
  Activity,
  AlertTriangle,
  Building,
  Home,
  PieChart as PieChartIcon,
  BarChart2,
  Globe,
} from "lucide-react";
import { BsLightningCharge } from "react-icons/bs";
import { DataTable } from "../components/Table/DataTable";
import { Chip, CircularProgress } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";

// Define the DemographicsData type
interface RegionDemographics {
  region: string;
  lga: string;
  ward: string;
  totalProperties: number;
  residentialCount: number;
  commercialCount: number;
  industrialCount: number;
  agriculturalCount: number;
  mixedUseCount: number;
  undevelopedCount: number;
  averagePropertySize: number;
  multipleOwnershipPercentage: number;
}

// Mock Data
const mockData = {
  totalCustomers: 10000,
  meterTypes: [
    { type: "Smart", value: 4000 },
    { type: "Prepaid", value: 3500 },
    { type: "Postpaid", value: 2500 },
  ],
  meterStatus: [
    { status: "Active", count: 8000 },
    { status: "Faulty", count: 1500 },
    { status: "Inactive", count: 500 },
  ],
  meterAgeDistribution: [
    { ageGroup: "<5 years", count: 6000 },
    { ageGroup: "5-10 years", count: 3000 },
    { ageGroup: ">10 years", count: 1000 },
  ],
  customersPerDT: [
    { dtName: "DT001", count: 200 },
    { dtName: "DT002", count: 150 },
    { dtName: "DT003", count: 180 },
  ],
  customersPerFeeder: [
    { feederName: "Feeder A", count: 3000 },
    { feederName: "Feeder B", count: 2500 },
    { feederName: "Feeder C", count: 2000 },
  ],
  customersPerUpriser: [
    { upriserNumber: "UP001", count: 1200 },
    { upriserNumber: "UP002", count: 1000 },
    { upriserNumber: "UP003", count: 800 },
  ],
  infractionRate: 15,
  infractionTypes: [
    { type: "Tampering", count: 500 },
    { type: "Bypass", count: 300 },
    { type: "Overloading", count: 200 },
  ],
  propertyTypeBreakdown: [
    { name: "Residential", value: 7000, color: "#3B82F6" },
    { name: "Commercial", value: 2500, color: "#10B981" },
    { name: "Industrial", value: 500, color: "#F59E0B" },
    { name: "Agricultural", value: 800, color: "#6366F1" },
    { name: "Mixed Use", value: 200, color: "#EC4899" },
    { name: "Undeveloped", value: 1000, color: "#8B5CF6" },
  ],
  developmentStatus: [
    { name: "Developed", value: 6000, color: "#22C55E" },
    { name: "Undeveloped", value: 3000, color: "#F97316" },
    { name: "Partially Developed", value: 1000, color: "#06B6D4" },
  ],
  occupancyStatus: [
    { name: "Occupied", value: 7500, color: "#3B82F6" },
    { name: "Vacant", value: 1500, color: "#EF4444" },
    { name: "Partially Occupied", value: 1000, color: "#F59E0B" },
  ],
  multipleOwnershipByRegion: [
    { region: "Jos North", percentage: 45 },
    { region: "Jos South", percentage: 38 },
    { region: "Mangu", percentage: 25 },
    { region: "Bokkos", percentage: 32 },
    { region: "Barkin Ladi", percentage: 28 },
  ],
  propertySizeDistribution: [
    { size: "< 250 sqm", count: 2500 },
    { size: "250-500 sqm", count: 4500 },
    { size: "500-1000 sqm", count: 2000 },
    { size: "> 1000 sqm", count: 1000 },
  ],
};

// Mock Data for Average Installation Date
const installationDateData = [
  { year: "2010", count: 1000 },
  { year: "2015", count: 6000 },
  { year: "2020", count: 3000 },
];

// Mock data for regional demographics table
const regionDemographics: RegionDemographics[] = [
  {
    region: "Plateau",
    lga: "Jos North",
    ward: "Kabong",
    totalProperties: 3500,
    residentialCount: 2800,
    commercialCount: 500,
    industrialCount: 50,
    agriculturalCount: 20,
    mixedUseCount: 80,
    undevelopedCount: 50,
    averagePropertySize: 450,
    multipleOwnershipPercentage: 35,
  },
  {
    region: "Plateau",
    lga: "Jos South",
    ward: "Bukuru",
    totalProperties: 4200,
    residentialCount: 3000,
    commercialCount: 800,
    industrialCount: 150,
    agriculturalCount: 50,
    mixedUseCount: 100,
    undevelopedCount: 100,
    averagePropertySize: 520,
    multipleOwnershipPercentage: 28,
  },
  {
    region: "Plateau",
    lga: "Mangu",
    ward: "Mangu",
    totalProperties: 2100,
    residentialCount: 1500,
    commercialCount: 300,
    industrialCount: 20,
    agriculturalCount: 200,
    mixedUseCount: 30,
    undevelopedCount: 50,
    averagePropertySize: 650,
    multipleOwnershipPercentage: 22,
  },
  {
    region: "Plateau",
    lga: "Barkin Ladi",
    ward: "Barkin Ladi",
    totalProperties: 1800,
    residentialCount: 1200,
    commercialCount: 250,
    industrialCount: 30,
    agriculturalCount: 250,
    mixedUseCount: 20,
    undevelopedCount: 50,
    averagePropertySize: 720,
    multipleOwnershipPercentage: 18,
  },
  {
    region: "Plateau",
    lga: "Bokkos",
    ward: "Bokkos",
    totalProperties: 1500,
    residentialCount: 900,
    commercialCount: 200,
    industrialCount: 50,
    agriculturalCount: 280,
    mixedUseCount: 20,
    undevelopedCount: 50,
    averagePropertySize: 850,
    multipleOwnershipPercentage: 15,
  },
];

// Define the column helper for the data table
const columnHelper = createColumnHelper<RegionDemographics>();

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
    header: "Total Properties",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("residentialCount", {
    header: "Residential",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("commercialCount", {
    header: "Commercial",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("averagePropertySize", {
    header: "Avg Size (sqm)",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("multipleOwnershipPercentage", {
    header: "Multiple Ownership",
    cell: (info) => `${info.getValue()}%`,
  }),
];

// COLORS
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

const Demographics = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Property Demographics Analysis</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Properties"
          value={mockData.propertyTypeBreakdown.reduce((sum, item) => sum + item.value, 0)}
          icon={<Building className="w-5 h-5" />}
        />
        <StatCard
          title="Residential Properties"
          value={mockData.propertyTypeBreakdown.find(item => item.name === "Residential")?.value || 0}
          icon={<Home className="w-5 h-5" />}
        />
        <StatCard
          title="Developed Properties"
          value={mockData.developmentStatus.find(item => item.name === "Developed")?.value || 0}
          icon={<Building className="w-5 h-5" />}
        />
        <StatCard
          title="Properties with Multiple Owners"
          value={(mockData.propertyTypeBreakdown.reduce((sum, item) => sum + item.value, 0) * 0.25).toFixed(0)}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                  data={mockData.propertyTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.propertyTypeBreakdown.map((entry, index) => (
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
                  data={mockData.developmentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.developmentStatus.map((entry, index) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Occupancy Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-purple-500" />
            Occupancy Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.occupancyStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.occupancyStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Size Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Property Size Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.propertySizeDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Number of Properties" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multiple Ownership by Region */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-red-500" />
          Multiple Ownership by Region
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData.multipleOwnershipByRegion}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="percentage" fill="#EF4444" name="Multiple Ownership (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Demographics Table */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-indigo-500" />
          Regional Demographics
        </h2>
        <DataTable columns={columns} data={regionDemographics} />
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

export default Demographics;