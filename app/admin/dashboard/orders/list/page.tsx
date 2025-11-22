"use client";

import { useState } from "react";
import { Search, Filter, Download, Plus, Eye, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Mock order data
const mockOrders = [
  {
    id: "95954",
    date: "10/08/2022",
    customer: "Ron Vargas",
    status: "Paid",
    paymentMethod: "VISA",
    paymentDetails: ".... 6165",
    total: 168.0,
    paymentLogo: "visa",
  },
  {
    id: "95423",
    date: "29/07/2022",
    customer: "Carolyn Hanso",
    status: "Paid",
    paymentMethod: "VISA",
    paymentDetails: ".... 7128",
    total: 523.0,
    paymentLogo: "visa",
  },
  {
    id: "92903",
    date: "18/07/2022",
    customer: "Gabriella May",
    status: "Paid",
    paymentMethod: "PayPal",
    paymentDetails: "....@gmail.com",
    total: 81.0,
    paymentLogo: "paypal",
  },
  {
    id: "92627",
    date: "09/07/2022",
    customer: "Tara Fletcher",
    status: "Paid",
    paymentMethod: "Mastercard",
    paymentDetails: ".... 0921",
    total: 279.0,
    paymentLogo: "mastercard",
  },
  {
    id: "92509",
    date: "26/06/2022",
    customer: "Joyce Freeman",
    status: "Pending",
    paymentMethod: "VISA",
    paymentDetails: ".... 1232",
    total: 831.0,
    paymentLogo: "visa",
  },
  {
    id: "91621",
    date: "18/06/2022",
    customer: "Brittany Hale",
    status: "Paid",
    paymentMethod: "VISA",
    paymentDetails: ".... 4597",
    total: 142.0,
    paymentLogo: "visa",
  },
];

const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentDetails.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-800";
    } else if (status === "Pending") {
      return "bg-orange-100 text-orange-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getPaymentLogo = (logo: string) => {
    // Using placeholder for payment logos - in real app, you'd use actual logo images
    if (logo === "visa") {
      return "💳"; // VISA placeholder
    } else if (logo === "paypal") {
      return "🔵"; // PayPal placeholder
    } else if (logo === "mastercard") {
      return "💳"; // Mastercard placeholder
    }
    return "💳";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button className="flex items-center gap-2 bg-[#518fff] hover:bg-[#4078e0] text-white">
            <Plus className="w-4 h-4" />
            Add new
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ORDER
                    </span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DATE
                    </span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CUSTOMER
                    </span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      STATUS
                    </span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      PAYMENT METHOD
                    </span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      TOTAL
                    </span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ACTION
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      #{order.id}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{order.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{order.customer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPaymentLogo(order.paymentLogo)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.paymentMethod}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.paymentDetails}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-[#518fff] hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

