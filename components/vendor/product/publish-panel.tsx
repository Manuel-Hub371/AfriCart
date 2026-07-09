"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Eye,
  CheckCircle,
  Calendar,
  Globe,
  Store,
} from "lucide-react";

interface PublishPanelProps {
  onPublish: () => void;
  onSaveDraft: () => void;
}

export default function PublishPanel({
  onPublish,
  onSaveDraft,
}: PublishPanelProps) {
  const [status, setStatus] = useState("draft");
  const [visibility, setVisibility] = useState("public");
  const [publishDate, setPublishDate] = useState("");

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Product Preview Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Product Preview</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300" />
          <div className="p-3">
            <p className="font-medium text-gray-900 mb-1">Product Name</p>
            <p className="text-lg font-bold text-emerald-600">$0.00</p>
            <Badge variant="secondary" className="mt-2">
              Draft
            </Badge>
          </div>
        </div>
      </Card>

      {/* Status & Visibility */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Publishing</h3>

        <div className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Scheduled Date */}
          {status === "scheduled" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Publish Date
              </label>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          {/* Store */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Store className="h-4 w-4" />
              Store
            </label>
            <p className="text-sm text-gray-600">Tech World</p>
          </div>

          {/* Last Saved */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Last saved: Never (auto-save enabled)
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <div className="space-y-3">
          <Button onClick={onPublish} className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Publish Product
          </Button>
          <Button
            variant="outline"
            onClick={onSaveDraft}
            className="w-full gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </Card>

      {/* Requirements */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Requirements</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            Product name required
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            At least one image required
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            Price required
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            Category required
          </div>
        </div>
      </Card>
    </div>
  );
}
