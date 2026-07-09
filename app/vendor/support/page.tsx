"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Video,
  BookOpen
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VendorSupportPage() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for support tickets
  const tickets = [
    {
      id: "#SUP-001",
      subject: "Payment not received for order #ORD-1234",
      category: "Payment",
      status: "open",
      priority: "high",
      lastUpdate: "2 hours ago",
      messages: 3
    },
    {
      id: "#SUP-002",
      subject: "How to configure shipping rates?",
      category: "Shipping",
      status: "in-progress",
      priority: "medium",
      lastUpdate: "1 day ago",
      messages: 5
    },
    {
      id: "#SUP-003",
      subject: "Product not appearing in search results",
      category: "Technical",
      status: "resolved",
      priority: "low",
      lastUpdate: "3 days ago",
      messages: 8
    },
    {
      id: "#SUP-004",
      subject: "Need help with bulk product upload",
      category: "Products",
      status: "closed",
      priority: "low",
      lastUpdate: "1 week ago",
      messages: 4
    }
  ];

  // Mock data for FAQ
  const faqCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      faqs: [
        {
          question: "How do I set up my store?",
          answer: "Go to Store Settings to configure your store information, banner, and policies."
        },
        {
          question: "How do I add my first product?",
          answer: "Navigate to Products > Add New Product to create your first listing."
        }
      ]
    },
    {
      title: "Orders & Fulfillment",
      icon: FileText,
      faqs: [
        {
          question: "How do I process an order?",
          answer: "Go to Orders, select the order, and click 'Process Order' to begin fulfillment."
        },
        {
          question: "Can I print shipping labels?",
          answer: "Yes, you can print shipping labels from the order details page."
        }
      ]
    },
    {
      title: "Payments & Payouts",
      icon: Video,
      faqs: [
        {
          question: "When will I receive my payout?",
          answer: "Payouts are processed weekly, typically within 7-14 business days."
        },
        {
          question: "How are marketplace fees calculated?",
          answer: "Marketplace fees are a percentage of each sale, displayed in your Finance dashboard."
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <MessageSquare className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">Get help and manage support tickets</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600 mt-1">support@africart.com</p>
                <p className="text-xs text-gray-500 mt-2">Response within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-sm text-gray-600 mt-1">+1 (555) 123-4567</p>
                <p className="text-xs text-gray-500 mt-2">Mon-Fri, 9 AM - 5 PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600 mt-1">Chat with our team</p>
                <p className="text-xs text-gray-500 mt-2">Average response: 5 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="faq">Help Center</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>View and manage your support requests</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">{ticket.status}</span>
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            <span className="capitalize">{ticket.priority}</span>
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {ticket.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.messages} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.lastUpdate}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronDown className="h-4 w-4 ml-1 -rotate-90" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Ticket Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and our team will help you resolve it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account & Profile</SelectItem>
                    <SelectItem value="products">Products & Listings</SelectItem>
                    <SelectItem value="orders">Orders & Fulfillment</SelectItem>
                    <SelectItem value="payment">Payment & Payouts</SelectItem>
                    <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="policy">Policies & Guidelines</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General question</SelectItem>
                    <SelectItem value="medium">Medium - Need assistance</SelectItem>
                    <SelectItem value="high">High - Urgent issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your issue..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Related Order ID (Optional)</Label>
                <Input
                  id="order"
                  placeholder="e.g., #ORD-1234"
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Submit Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqCategories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      </div>
                      <div className="space-y-2 pl-7">
                        {category.faqs.map((faq, faqIdx) => (
                          <details key={faqIdx} className="group">
                            <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              <ChevronDown className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="p-3 text-sm text-gray-600">
                              {faq.answer}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to help. Create a ticket or contact us directly.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Create Ticket
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Vendor Guide</CardTitle>
                    <CardDescription>Complete guide for sellers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Learn everything about selling on AfriCart, from setting up your store to managing orders and growing your business.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Video Tutorials</CardTitle>
                    <CardDescription>Watch and learn</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Step-by-step video tutorials covering product management, order processing, and marketing strategies.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">API Documentation</CardTitle>
                    <CardDescription>For developers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Integrate with our API for advanced inventory management, automated order processing, and custom workflows.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Community Forum</CardTitle>
                    <CardDescription>Connect with other vendors</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Join our community of vendors to share tips, ask questions, and learn best practices from experienced sellers.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Visit Forum
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Help */}
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need personalized assistance?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Schedule a one-on-one consultation with our vendor success team to optimize your store and increase sales.
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
                  Schedule Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
