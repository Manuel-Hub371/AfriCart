"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import AddressCard from "@/components/checkout/address-card";
import AddressForm from "@/components/checkout/address-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const savedAddresses = [
  {
    id: "1",
    name: "John Doe",
    phone: "+233 XX XXX XXXX",
    email: "john.doe@example.com",
    country: "Ghana",
    region: "Greater Accra",
    city: "Accra",
    address: "123 Oxford Street, Osu",
    postalCode: "GA-123-4567",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "+233 XX XXX XXXX",
    email: "john.doe@example.com",
    country: "Ghana",
    region: "Ashanti",
    city: "Kumasi",
    address: "456 Adum Street",
    postalCode: "AK-456-7890",
    isDefault: false,
  },
  {
    id: "3",
    name: "John Doe",
    phone: "+233 XX XXX XXXX",
    email: "john.doe@example.com",
    country: "Ghana",
    region: "Western",
    city: "Takoradi",
    address: "789 Market Circle",
    postalCode: "WS-789-0123",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState(savedAddresses);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

  const handleSaveAddress = (newAddress: any) => {
    setAddresses([...addresses, newAddress]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Address
                </Button>
              )}
            </div>
            <p className="text-gray-600">
              Manage your delivery addresses
            </p>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
              <AddressForm
                onSave={handleSaveAddress}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddress.id === address.id}
                onSelect={() => setSelectedAddress(address)}
                onEdit={() => setShowForm(true)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
