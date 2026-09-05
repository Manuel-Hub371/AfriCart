"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";

interface CampaignToolbarProps {
  onCreateCampaign: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

export function CampaignToolbar({ onCreateCampaign, onExport, onRefresh }: CampaignToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={onRefresh}
        className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={onExport}
        className="h-10 px-4 border-gray-200 hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button
        onClick={onCreateCampaign}
        className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create Campaign
      </Button>
    </div>
  );
}
