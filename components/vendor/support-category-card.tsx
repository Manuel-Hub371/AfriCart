"use client";

import { LucideIcon } from "lucide-react";

interface SupportCategoryCardProps {
  title: string;
  icon: LucideIcon;
  topics: string[];
  color: string;
  onClick: () => void;
}

export function SupportCategoryCard({ 
  title, 
  icon: Icon, 
  topics, 
  color,
  onClick 
}: SupportCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-gray-200 p-6 text-left hover:border-emerald-500 hover:shadow-md transition-all group"
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {topics.map((topic, index) => (
          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>{topic}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
