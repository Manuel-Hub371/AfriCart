"use client";

import { MessageCircle, Mail, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  color: string;
}

function ContactCard({ icon, title, description, action, onClick, color }: ContactCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full border-gray-200"
      >
        {action}
      </Button>
    </div>
  );
}

export function ContactSupportCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ContactCard
        icon={<MessageCircle className="h-6 w-6 text-white" />}
        title="Live Chat"
        description="Get instant help from our support team"
        action="Start Chat"
        onClick={() => console.log("Start chat")}
        color="bg-emerald-600"
      />
      <ContactCard
        icon={<Mail className="h-6 w-6 text-white" />}
        title="Email Support"
        description="Send us a detailed message"
        action="Send Email"
        onClick={() => console.log("Send email")}
        color="bg-blue-600"
      />
      <ContactCard
        icon={<Phone className="h-6 w-6 text-white" />}
        title="Phone Support"
        description="Call us: +233 24 123 4567"
        action="Call Now"
        onClick={() => console.log("Call")}
        color="bg-purple-600"
      />
      <ContactCard
        icon={<Users className="h-6 w-6 text-white" />}
        title="Community Forum"
        description="Connect with other vendors"
        action="Visit Forum"
        onClick={() => console.log("Forum")}
        color="bg-orange-600"
      />
    </div>
  );
}
