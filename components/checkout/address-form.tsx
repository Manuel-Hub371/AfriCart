"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddressFormProps {
  onSave: (address: any) => void;
  onCancel: () => void;
}

export default function AddressForm({ onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "Ghana",
    region: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      ...formData,
      isDefault: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+233 XX XXX XXXX"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option>Ghana</option>
            <option>Nigeria</option>
            <option>Kenya</option>
            <option>South Africa</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region/State *
          </label>
          <Input
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Greater Accra"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Accra"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <Input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="GA-123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address *
        </label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Oxford Street, Osu"
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          Save Address
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
