"use client";

import {
  DollarSign,
  ShoppingBag,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the chart
const chartData = [
  { name: "Jan", value: 300 },
  { name: "Feb", value: 350 },
  { name: "Mar", value: 400 },
  { name: "Apr", value: 380 },
  { name: "May", value: 450 },
  { name: "Jun", value: 500 },
  { name: "Jul", value: 480 },
  { name: "Aug", value: 550 },
  { name: "Sep", value: 520 },
  { name: "Oct", value: 580 },
  { name: "Nov", value: 600 },
  { name: "Dec", value: 650 },
];

// Mock data for top products
const topProducts = [
  {
    name: "Maneki Neko Poster",
    sold: 1249,
    change: 15.2,
    image: "/api/placeholder/40/40",
  },
  {
    name: "Echoes Necklace",
    sold: 1145,
    change: 13.9,
    image: "/api/placeholder/40/40",
  },
  {
    name: "Spiky Ring",
    sold: 1073,
    change: 9.5,
    image: "/api/placeholder/40/40",
  },
  {
    name: "Pastel Petals Poster",
    sold: 1022,
    change: 2.3,
    image: "/api/placeholder/40/40",
  },
  {
    name: "Il Limone",
    sold: 980,
    change: 1.8,
    image: "/api/placeholder/40/40",
  },
];

const Overview = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
          <Select
            defaultValue="monthly"
            className="text-sm font-medium text-gray-700"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Profit */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">Total profit</p>
              <p className="text-2xl font-semibold text-gray-900">$82,373.21</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  +3.4% from last month
                </span>
              </div>
            </div>
          </div>

          {/* Total Order */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">Total order</p>
              <p className="text-2xl font-semibold text-gray-900">7,234</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-red-600 font-medium">
                  -2.8% from last month
                </span>
              </div>
            </div>
          </div>

          {/* Impression */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">Impression</p>
              <p className="text-2xl font-semibold text-gray-900">3.1M</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  +4.6% from last month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Graph */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[200, 700]}
                  ticks={[300, 400, 500, 600]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#518fff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Target */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales target
            </h3>
            <Select
              defaultValue="monthly"
              className="text-sm font-medium text-gray-700"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#518fff"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56 * 0.75} ${
                    2 * Math.PI * 56
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-[#518fff]">
                  75%
                </span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                1.3K / 1.8K Units
              </p>
              <p className="text-sm text-gray-600">Made this month year</p>
            </div>
          </div>
        </div>

        {/* Top Product */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top product</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sold: {product.sold.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{product.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
