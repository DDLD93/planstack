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
import { DevelopmentStatus, OccupancyStatus, PropertyType } from "../types";

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
  mixedCount: number;
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
    { name: PropertyType.Residential, value: 7000, color: "#3B82F6" },
    { name: PropertyType.Commercial, value: 2500, color: "#10B981" },
    { name: PropertyType.Industrial, value: 500, color: "#F59E0B" },
    { name: PropertyType.Agricultural, value: 800, color: "#6366F1" },
    { name: PropertyType.Mixed, value: 200, color: "#EC4899" },
  ],
  developmentStatus: [
    { name: DevelopmentStatus.Developed, value: 6000, color: "#22C55E" },
    { name: DevelopmentStatus.Undeveloped, value: 3000, color: "#F97316" },
    { name: DevelopmentStatus.UnderDevelopment, value: 1000, color: "#06B6D4" },
  ],
  occupancyStatus: [
    { name: OccupancyStatus.Occupied, value: 7500, color: "#3B82F6" },
    { name: OccupancyStatus.Vacant, value: 1500, color: "#EF4444" },
    { name: OccupancyStatus.PartiallyOccupied, value: 1000, color: "#F59E0B" },
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
    mixedCount: 80,
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
    mixedCount: 100,
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
    mixedCount: 30,
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
    mixedCount: 20,
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
    mixedCount: 20,
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
          value={mockData.totalCustomers.toLocaleString()}
          icon={<Home className="text-blue-500" />}
        />
        <StatCard
          title="Average Property Size"
          value={`${(
            regionDemographics.reduce(
              (acc, curr) => acc + curr.averagePropertySize,
              0
            ) / regionDemographics.length
          ).toFixed(2)} sqm`}
          icon={<Building className="text-green-500" />}
        />
        <StatCard
          title="Multiple Ownership Rate"
          value={`${(
            mockData.multipleOwnershipByRegion.reduce(
              (acc, curr) => acc + curr.percentage,
              0
            ) / mockData.multipleOwnershipByRegion.length
          ).toFixed(2)}%`}
          icon={<Users className="text-yellow-500" />}
        />
        <StatCard
          title="Highest Property Region"
          value={
            mockData.multipleOwnershipByRegion.sort(
              (a, b) => b.percentage - a.percentage
            )[0].region
          }
          icon={<Globe className="text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Property Type Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Property Type Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.propertyTypeBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {mockData.propertyTypeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Development Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Development Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.developmentStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d">
                {mockData.developmentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Occupancy Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Occupancy Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.occupancyStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {mockData.occupancyStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Property Size Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Property Size Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.propertySizeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Demographics Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Regional Demographics Overview
        </h2>
        <DataTable columns={columns} data={regionDemographics} />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="mr-4">{icon}</div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Demographics;