"use client";

import { CampaignCard, Campaign } from "./campaign-card";

interface CampaignsListProps {
  campaigns: Campaign[];
  onEdit: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (campaign: Campaign) => void;
}

export function CampaignsList({
  campaigns,
  onEdit,
  onPause,
  onResume,
  onDuplicate,
  onDelete,
  onViewDetails,
}: CampaignsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onEdit={onEdit}
          onPause={onPause}
          onResume={onResume}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
