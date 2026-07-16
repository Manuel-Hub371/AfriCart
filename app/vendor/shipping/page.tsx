"use client";

import { useState, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { ShippingStatistics } from "@/components/vendor/shipping-statistics";
import { ShippingMethodCard, ShippingMethod } from "@/components/vendor/shipping-method-card";
import { ShippingZoneTable, ShippingZone } from "@/components/vendor/shipping-zone-table";
import { ShipmentTable, Shipment, ShipmentStatus } from "@/components/vendor/shipment-table";
import { ShipmentDrawer } from "@/components/vendor/shipment-drawer";
import { ShippingEmptyState } from "@/components/vendor/shipping-empty-state";
import { Plus, Download, FileText } from "lucide-react";

// Generate deterministic shipping methods
const mockShippingMethods: ShippingMethod[] = [
  {
    id: "sm-1",
    name: "Standard Shipping",
    deliveryTime: "3-5 business days",
    cost: 10,
    costType: "flat",
    isActive: true,
    description: "Regular delivery for most orders",
  },
  {
    id: "sm-2",
    name: "Express Shipping",
    deliveryTime: "1-2 business days",
    cost: 25,
    costType: "flat",
    isActive: true,
    description: "Fast delivery for urgent orders",
  },
  {
    id: "sm-3",
    name: "Same Day Delivery",
    deliveryTime: "Same day",
    cost: 35,
    costType: "flat",
    isActive: true,
    description: "Ultra-fast delivery within city limits",
  },
  {
    id: "sm-4",
    name: "Free Shipping",
    deliveryTime: "5-7 business days",
    cost: 0,
    costType: "free",
    isActive: true,
    description: "Free delivery for orders above $100",
  },
  {
    id: "sm-5",
    name: "Store Pickup",
    deliveryTime: "Ready in 2 hours",
    cost: 0,
    costType: "free",
    isActive: false,
    description: "Customer picks up from store location",
  },
];

// Generate deterministic shipping zones
const mockShippingZones: ShippingZone[] = [
  {
    id: "sz-1",
    name: "Greater Accra",
    country: "Ghana",
    regions: ["Accra Central", "East Legon", "Tema", "Madina"],
    shippingFee: 20,
    deliveryTime: "1-2 days",
    isActive: true,
  },
  {
    id: "sz-2",
    name: "Ashanti Region",
    country: "Ghana",
    regions: ["Kumasi", "Obuasi", "Mampong"],
    shippingFee: 35,
    deliveryTime: "2-3 days",
    isActive: true,
  },
  {
    id: "sz-3",
    name: "Western Region",
    country: "Ghana",
    regions: ["Takoradi", "Sekondi", "Tarkwa"],
    shippingFee: 40,
    deliveryTime: "3-4 days",
    isActive: true,
  },
  {
    id: "sz-4",
    name: "Northern Region",
    country: "Ghana",
    regions: ["Tamale", "Yendi", "Savelugu"],
    shippingFee: 50,
    deliveryTime: "4-5 days",
    isActive: true,
  },
  {
    id: "sz-5",
    name: "Eastern Region",
    country: "Ghana",
    regions: ["Koforidua", "Akosombo", "Begoro"],
    shippingFee: 30,
    deliveryTime: "2-3 days",
    isActive: false,
  },
];

// Generate deterministic shipments
function generateShipments(count: number): Shipment[] {
  const shipments: Shipment[] = [];
  const statuses: ShipmentStatus[] = [
    "pending",
    "processing",
    "packed",
    "ready-for-pickup",
    "shipped",
    "in-transit",
    "delivered",
  ];
  
  const customers = [
    "John Mensah",
    "Sarah Osei",
    "Michael Asante",
    "Emily Boateng",
    "David Owusu",
  ];

  const products = [
    "Premium Laptop Stand",
    "Wireless Mouse & Keyboard",
    "USB-C Hub Adapter",
    "Ergonomic Office Chair",
    "4K Webcam",
  ];

  const couriers = [
    "DHL Express",
    "Ghana Post",
    "UPS",
    "FedEx",
    "Local Courier",
  ];

  const addresses = [
    "123 Independence Ave, Accra, Ghana",
    "45 Oxford Street, Osu, Accra, Ghana",
    "78 Spintex Road, Accra, Ghana",
    "12 Kumasi Road, Tema, Ghana",
    "56 Airport Residential, Accra, Ghana",
  ];

  for (let i = 0; i < count; i++) {
    const statusIndex = (i * 2) % statuses.length;
    const day = (i * 3) % 28 + 1;
    
    shipments.push({
      id: `ship-${(1000 + i).toString()}`,
      orderNumber: `ORD-${(20000 + i * 7).toString()}`,
      customer: customers[i % customers.length],
      product: products[i % products.length],
      courier: couriers[i % couriers.length],
      trackingNumber: `TRK${(100000 + i * 123).toString()}`,
      status: statuses[statusIndex],
      deliveryDate: `July ${day}, 2026`,
      shippingAddress: addresses[i % addresses.length],
    });
  }

  return shipments;
}

export default function VendorShippingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Generate mock shipments
  const shipments = useMemo(() => generateShipments(50), []);

  const handleAddShippingMethod = () => {
    console.log("Add shipping method");
  };

  const handleAddZone = () => {
    console.log("Add shipping zone");
  };

  const handleExportShipments = () => {
    console.log("Export shipments");
  };

  const handleCreateRule = () => {
    console.log("Create shipping rule");
  };

  const handleEditMethod = (id: string) => {
    console.log("Edit method:", id);
  };

  const handleToggleMethod = (id: string) => {
    console.log("Toggle method:", id);
  };

  const handleDeleteMethod = (id: string) => {
    console.log("Delete method:", id);
  };

  const handleEditZone = (id: string) => {
    console.log("Edit zone:", id);
  };

  const handleDeleteZone = (id: string) => {
    console.log("Delete zone:", id);
  };

  const handleViewShipment = (id: string) => {
    const shipment = shipments.find((s) => s.id === id);
    if (shipment) {
      setSelectedShipment(shipment);
      setDrawerOpen(true);
    }
  };

  const handleUpdateTracking = (id: string) => {
    console.log("Update tracking:", id);
    setDrawerOpen(false);
  };

  const showEmptyState = mockShippingMethods.length === 0 && mockShippingZones.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Shipping" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Shipping Management
                </h1>
                <p className="text-gray-600">
                  Manage delivery methods, shipping rates, tracking, and fulfillment settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleCreateRule}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportShipments}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={handleAddShippingMethod}
                  className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Method
                </Button>
              </div>
            </div>

            {/* Empty State */}
            {showEmptyState ? (
              <ShippingEmptyState
                onAddShippingMethod={handleAddShippingMethod}
                onAddZone={handleAddZone}
              />
            ) : (
              <>
                {/* Shipping Statistics */}
                <ShippingStatistics />

                {/* Shipping Methods */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Shipping Methods</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Configure available delivery options for your customers
                      </p>
                    </div>
                    <Button
                      onClick={handleAddShippingMethod}
                      variant="outline"
                      className="border-gray-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Method
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockShippingMethods.map((method) => (
                      <ShippingMethodCard
                        key={method.id}
                        method={method}
                        onEdit={handleEditMethod}
                        onToggle={handleToggleMethod}
                        onDelete={handleDeleteMethod}
                      />
                    ))}
                  </div>
                </div>

                {/* Shipping Zones */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Delivery Zones</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Define regions where you deliver and set zone-specific rates
                      </p>
                    </div>
                    <Button
                      onClick={handleAddZone}
                      variant="outline"
                      className="border-gray-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Zone
                    </Button>
                  </div>
                  <ShippingZoneTable
                    zones={mockShippingZones}
                    onEdit={handleEditZone}
                    onDelete={handleDeleteZone}
                  />
                </div>

                {/* Active Shipments */}
                <ShipmentTable
                  shipments={shipments}
                  onViewDetails={handleViewShipment}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Shipment Details Drawer */}
      <ShipmentDrawer
        shipment={selectedShipment}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdateTracking={handleUpdateTracking}
      />
    </div>
  );
}
