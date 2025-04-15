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
import { DataTable } from "../components/Table/DataTable";
import { Chip, CircularProgress } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import {
  BarChart2,
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  AlertTriangle,
  Activity,
} from "lucide-react";

// Define the RevenueSummary type
interface RevenueSummary {
  region: string;
  lga: string;
  totalProperties: number;
  potentialRevenue: number;
  actualRevenue: number;
  taxComplianceRate: number;
  taxLossDueToVacant: number;
  taxLossDueToUndeveloped: number;
}

// Mock Data
const mockData = {
  totalPotentialRevenue: 25000000,
  actualRevenue: 17500000,
  complianceRate: 70,
  revenueLoss: 7500000,
  
  revenueByPropertyType: [
    { name: "Residential", value: 10000000, color: "#3B82F6" },
    { name: "Commercial", value: 7500000, color: "#10B981" },
    { name: "Industrial", value: 5000000, color: "#F59E0B" },
    { name: "Agricultural", value: 2000000, color: "#6366F1" },
    { name: "Mixed Use", value: 500000, color: "#EC4899" },
  ],
  
  taxComplianceByPropertyType: [
    { type: "Residential", compliance: 75 },
    { type: "Commercial", compliance: 85 },
    { type: "Industrial", compliance: 90 },
    { type: "Agricultural", compliance: 65 },
    { type: "Mixed Use", compliance: 70 },
  ],
  
  revenueLossCauses: [
    { name: "Vacant Properties", value: 3000000, color: "#EF4444" },
    { name: "Undeveloped Land", value: 2500000, color: "#F59E0B" },
    { name: "Tax Evasion", value: 1500000, color: "#8B5CF6" },
    { name: "Exemptions", value: 500000, color: "#10B981" },
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
  
  revenueByRegion: [
    { region: "Jos North", revenue: 8000000 },
    { region: "Jos South", revenue: 6500000 },
    { region: "Mangu", revenue: 3500000 },
    { region: "Barkin Ladi", revenue: 2500000 },
    { region: "Bokkos", revenue: 1500000 },
    { region: "Other Regions", revenue: 3000000 },
  ],
};

// Mock data for regional revenue summary table
const revenueSummary: RevenueSummary[] = [
  {
    region: "Plateau",
    lga: "Jos North",
    totalProperties: 3500,
    potentialRevenue: 8500000,
    actualRevenue: 6800000,
    taxComplianceRate: 80,
    taxLossDueToVacant: 1000000,
    taxLossDueToUndeveloped: 700000,
  },
  {
    region: "Plateau",
    lga: "Jos South",
    totalProperties: 4200,
    potentialRevenue: 9000000,
    actualRevenue: 6750000,
    taxComplianceRate: 75,
    taxLossDueToVacant: 1500000,
    taxLossDueToUndeveloped: 750000,
  },
  {
    region: "Plateau",
    lga: "Mangu",
    totalProperties: 2100,
    potentialRevenue: 3500000,
    actualRevenue: 2450000,
    taxComplianceRate: 70,
    taxLossDueToVacant: 600000,
    taxLossDueToUndeveloped: 450000,
  },
  {
    region: "Plateau",
    lga: "Barkin Ladi",
    totalProperties: 1800,
    potentialRevenue: 2500000,
    actualRevenue: 1625000,
    taxComplianceRate: 65,
    taxLossDueToVacant: 500000,
    taxLossDueToUndeveloped: 375000,
  },
  {
    region: "Plateau",
    lga: "Bokkos",
    totalProperties: 1500,
    potentialRevenue: 1500000,
    actualRevenue: 875000,
    taxComplianceRate: 58,
    taxLossDueToVacant: 350000,
    taxLossDueToUndeveloped: 275000,
  },
];

// Define the column helper for the data table
const columnHelper = createColumnHelper<RevenueSummary>();

// Define columns for the data table
const columns = [
  columnHelper.accessor("lga", {
    header: "LGA",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("totalProperties", {
    header: "Properties",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("potentialRevenue", {
    header: "Potential Revenue",
    cell: (info) => `₦${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("actualRevenue", {
    header: "Actual Revenue",
    cell: (info) => `₦${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("taxComplianceRate", {
    header: "Compliance Rate",
    cell: (info) => {
      const rate = info.getValue();
      let color = "default";
      
      if (rate >= 80) color = "success";
      else if (rate >= 60) color = "warning";
      else color = "error";
      
      return <Chip label={`${rate}%`} color={color as any} size="small" />;
    },
  }),
  columnHelper.accessor("taxLossDueToVacant", {
    header: "Loss (Vacant)",
    cell: (info) => `₦${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("taxLossDueToUndeveloped", {
    header: "Loss (Undeveloped)",
    cell: (info) => `₦${info.getValue().toLocaleString()}`,
  }),
];

// COLORS
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

const Revenue = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Revenue Analysis</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Potential Revenue"
          value={`₦${mockData.totalPotentialRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Actual Revenue Collected"
          value={`₦${mockData.actualRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Tax Compliance Rate"
          value={`${mockData.complianceRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Revenue Loss"
          value={`₦${mockData.revenueLoss.toLocaleString()}`}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue by Month Trend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Revenue Trend by Month
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData.revenueByMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  name="Revenue"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Region */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-green-500" />
            Revenue by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.revenueByRegion}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue by Property Type */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-blue-500" />
            Revenue by Property Type
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.revenueByPropertyType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.revenueByPropertyType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Loss Causes */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-red-500" />
            Revenue Loss Causes
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.revenueLossCauses}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.revenueLossCauses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tax Compliance by Property Type */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
          Tax Compliance by Property Type
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData.taxComplianceByPropertyType}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="compliance" fill="#8B5CF6" name="Compliance Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Summary Table */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue Summary by Region</h2>
        <DataTable columns={columns} data={revenueSummary} />
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Revenue;