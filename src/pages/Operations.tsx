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
  LineChart,
  Line,
} from "recharts";
import { DataTable } from "../components/Table/DataTable";
import { Chip, CircularProgress } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  Laptop,
  Home,
} from "lucide-react";
import { ValidationStatus } from "../types";

// Define the EnumeratorStats type
interface EnumeratorStats {
  id: string;
  name: string;
  region: string;
  propertiesEnumerated: number;
  validationRate: number;
  errorRate: number;
  averageTimePerProperty: number;
  lastActive: string;
}

// Mock Data
const mockData = {
  totalEnumerators: 85,
  totalPropertiesEnumerated: 21000,
  validationRate: 94,
  pendingValidations: 245,
  
  enumerationByDay: [
    { day: "Monday", count: 730 },
    { day: "Tuesday", count: 820 },
    { day: "Wednesday", count: 880 },
    { day: "Thursday", count: 790 },
    { day: "Friday", count: 680 },
    { day: "Saturday", count: 450 },
    { day: "Sunday", count: 150 },
  ],
  
  enumerationByMonth: [
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
  
  enumerationByRegion: [
    { region: "Jos North", count: 5200 },
    { region: "Jos South", count: 4800 },
    { region: "Mangu", count: 3500 },
    { region: "Barkin Ladi", count: 2800 },
    { region: "Bokkos", count: 2100 },
    { region: "Other Regions", count: 2600 },
  ],
  
  dataQualityMetrics: [
    { name: "Complete Records", value: 85, color: "#22C55E" },
    { name: "Partial Records", value: 12, color: "#F59E0B" },
    { name: "Error Records", value: 3, color: "#EF4444" },
  ],
  
  validationStatus: [
    { name: ValidationStatus.Validated, value: 94, color: "#22C55E" },
    { name: ValidationStatus.Pending, value: 5, color: "#F59E0B" },
    { name: ValidationStatus.Rejected, value: 1, color: "#EF4444" },
  ],
  
  averageTimePerProperty: [
    { region: "Jos North", minutes: 28 },
    { region: "Jos South", minutes: 32 },
    { region: "Mangu", minutes: 45 },
    { region: "Barkin Ladi", minutes: 38 },
    { region: "Bokkos", minutes: 42 },
  ],
};

// Mock data for enumerator stats table
const enumeratorStats: EnumeratorStats[] = [
  {
    id: "EN001",
    name: "John Doe",
    region: "Jos North",
    propertiesEnumerated: 452,
    validationRate: 96,
    errorRate: 2.1,
    averageTimePerProperty: 25,
    lastActive: "Today, 10:45 AM",
  },
  {
    id: "EN002",
    name: "Jane Smith",
    region: "Jos South",
    propertiesEnumerated: 387,
    validationRate: 94,
    errorRate: 3.2,
    averageTimePerProperty: 30,
    lastActive: "Today, 11:30 AM",
  },
  {
    id: "EN003",
    name: "Mohammed Ibrahim",
    region: "Mangu",
    propertiesEnumerated: 328,
    validationRate: 92,
    errorRate: 4.5,
    averageTimePerProperty: 35,
    lastActive: "Yesterday, 4:15 PM",
  },
  {
    id: "EN004",
    name: "Alice Johnson",
    region: "Barkin Ladi",
    propertiesEnumerated: 298,
    validationRate: 95,
    errorRate: 2.8,
    averageTimePerProperty: 28,
    lastActive: "Today, 9:20 AM",
  },
  {
    id: "EN005",
    name: "Samuel Dakwom",
    region: "Bokkos",
    propertiesEnumerated: 265,
    validationRate: 93,
    errorRate: 3.5,
    averageTimePerProperty: 32,
    lastActive: "Today, 12:45 PM",
  },
];

// Define the column helper for the data table
const columnHelper = createColumnHelper<EnumeratorStats>();

// Define columns for the data table
const columns = [
  columnHelper.accessor("name", {
    header: "Enumerator",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("region", {
    header: "Region",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("propertiesEnumerated", {
    header: "Properties Enumerated",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("validationRate", {
    header: "Validation Rate",
    cell: (info) => {
      const rate = info.getValue();
      let color = "default";
      
      if (rate >= 95) color = "success";
      else if (rate >= 90) color = "warning";
      else color = "error";
      
      return <Chip label={`${rate}%`} color={color as any} size="small" />;
    },
  }),
  columnHelper.accessor("errorRate", {
    header: "Error Rate",
    cell: (info) => {
      const rate = info.getValue();
      let color = "default";
      
      if (rate <= 2.5) color = "success";
      else if (rate <= 5) color = "warning";
      else color = "error";
      
      return <Chip label={`${rate}%`} color={color as any} size="small" />;
    },
  }),
  columnHelper.accessor("averageTimePerProperty", {
    header: "Avg. Time",
    cell: (info) => `${info.getValue()} mins`,
  }),
  columnHelper.accessor("lastActive", {
    header: "Last Active",
    cell: (info) => info.getValue(),
  }),
];

// Operations Component
const OperationalEfficiency = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Operational Efficiency</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Enumerators"
          value={mockData.totalEnumerators}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Properties Enumerated"
          value={mockData.totalPropertiesEnumerated}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatCard
          title="Validation Rate"
          value={`${mockData.validationRate}%`}
          icon={<Activity className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Validations"
          value={mockData.pendingValidations}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* House Numbering Analytics */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-blue-500" />
          House Numbering Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-md font-semibold mb-2">Numbered vs Unnumbered Properties</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[{name: 'Numbered', value: 7000}, {name: 'Unnumbered', value: 3000}]} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name}: ${(percent*100).toFixed(0)}%`} />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-2">Numbering Progress by Area</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{area: 'Jos North', numbered: 3000, unnumbered: 1000}, {area: 'Jos South', numbered: 2500, unnumbered: 800}, {area: 'Mangu', numbered: 1500, unnumbered: 700}]}> {/* Mock data */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="numbered" fill="#3B82F6" name="Numbered" />
                <Bar dataKey="unnumbered" fill="#EF4444" name="Unnumbered" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* More House Numbering Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* House Numbering Completion Rate */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">House Numbering Completion Rate</h3>
          <div className="text-3xl font-bold text-green-600">70%</div>
          <div className="text-sm text-gray-500">of properties have been numbered</div>
        </div>
        {/* House Numbering by Enumerator */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">House Numbering by Enumerator</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{name: 'Enumerator A', count: 2000}, {name: 'Enumerator B', count: 1500}, {name: 'Enumerator C', count: 1000}]}> {/* Mock data */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Numbered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">House Numbering Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[{month: 'Jan', numbered: 1000}, {month: 'Feb', numbered: 2000}, {month: 'Mar', numbered: 3000}, {month: 'Apr', numbered: 4000}]}> {/* Mock data */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="numbered" stroke="#10B981" strokeWidth={2} name="Numbered" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enumeration by Month */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
            Monthly Enumeration Progress
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData.enumerationByMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  name="Properties Enumerated"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enumeration by Day of Week */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-green-500" />
            Enumeration by Day of Week
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.enumerationByDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="count" fill="#10B981" name="Properties Enumerated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Data Quality Metrics */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-purple-500" />
            Data Quality Metrics
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.dataQualityMetrics}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.dataQualityMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Validation Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-red-500" />
            Validation Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.validationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.validationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enumeration by Region */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Enumeration by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.enumerationByRegion}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Properties Enumerated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Time per Property by Region */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            Average Time per Property by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.averageTimePerProperty}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} minutes`} />
                <Legend />
                <Bar dataKey="minutes" fill="#F59E0B" name="Average Time (minutes)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enumerator Performance Table */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Laptop className="w-5 h-5 mr-2 text-indigo-500" />
          Enumerator Performance
        </h2>
        <DataTable columns={columns} data={enumeratorStats} />
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

export default OperationalEfficiency;