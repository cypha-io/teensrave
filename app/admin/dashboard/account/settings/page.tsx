"use client";

import { useState } from "react";
import { User, Lock, Bell, DollarSign, RefreshCw, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Image from "next/image";

const Settings = () => {
  const [profileImage, setProfileImage] = useState("/api/placeholder/120/120");

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      {/* Main Content */}
      <div className="bg-white max-w-4xl mx-auto rounded-lg border border-gray-200 shadow-sm p-6 space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal information
          </h2>

          {/* Profile Picture */}
          <div className="flex items-center justify-between  gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex  items-center gap-2">
              <Button className="flex items-center gap-2 bg-[#518fff] hover:bg-[#4078e0] text-white w-fit">
                <Plus className="w-4 h-4" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 w-fit"
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First name
              </label>
              <Input type="text" defaultValue="Angelina" className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                User name
              </label>
              <Input type="text" defaultValue="Gotelli" className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                defaultValue="carolyn_h@hotmail.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone number
              </label>
              <div className="flex gap-2">
                <div className="relative flex items-center border border-gray-300 rounded-md bg-white px-3 h-9 min-w-[100px]">
                  <span className="text-base mr-1">🇺🇸</span>
                  <select className="appearance-none bg-transparent border-none outline-none cursor-pointer text-sm font-medium text-gray-700 focus:outline-none">
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+33">+33</option>
                  </select>
                </div>
                <Input type="tel" defaultValue="121231234" className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Address information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Street address
              </label>
              <Input
                type="text"
                placeholder="Enter street address"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <Input type="text" placeholder="Enter city" className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                State/Province
              </label>
              <Input
                type="text"
                placeholder="Enter state or province"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ZIP/Postal code
              </label>
              <Input
                type="text"
                placeholder="Enter ZIP or postal code"
                className="w-full"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>
              <Select className="w-full">
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-[#518fff] hover:bg-[#4078e0] text-white">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
