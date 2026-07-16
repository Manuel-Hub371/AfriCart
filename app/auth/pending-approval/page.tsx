import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Clock, CheckCircle, AlertCircle, FileText, Home, Eye } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <AuthLayout>
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Application Under Review
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for applying to become a vendor on AfriCart!
            </p>
          </div>

          {/* Status Box */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Application ID</p>
                <p className="text-lg font-bold text-gray-900">#VND-2024-00123</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-green-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-900">Status: Pending Review</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Review Process</h3>
            <div className="space-y-4">
              {/* Step 1 - Completed */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-0.5 h-full bg-green-600 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-semibold text-gray-900">Application Received</h4>
                  <p className="text-sm text-gray-600">Your application has been successfully submitted</p>
                  <p className="text-xs text-green-600 mt-1">Completed</p>
                </div>
              </div>

              {/* Step 2 - In Progress */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-semibold text-gray-900">Document Verification</h4>
                  <p className="text-sm text-gray-600">Our team is reviewing your documents and business information</p>
                  <p className="text-xs text-yellow-600 mt-1">In Progress (1-3 business days)</p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-semibold text-gray-500">Background Check</h4>
                  <p className="text-sm text-gray-500">Final verification and approval process</p>
                  <p className="text-xs text-gray-400 mt-1">Pending</p>
                </div>
              </div>

              {/* Step 4 - Pending */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-500">Store Activation</h4>
                  <p className="text-sm text-gray-500">Your store will be activated and ready to sell</p>
                  <p className="text-xs text-gray-400 mt-1">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">What happens next?</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• We'll review your application within 1-3 business days</li>
                  <li>• You'll receive an email notification about your application status</li>
                  <li>• Once approved, you can start listing products immediately</li>
                  <li>• Our support team may contact you if additional information is needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/profile" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
              >
                <Home className="h-5 w-5 mr-2" />
                Go to Customer Dashboard
              </Button>
            </Link>
            <Link href="/profile/vendor-application" className="flex-1">
              <Button
                className="w-full gradient-primary text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Eye className="h-5 w-5 mr-2" />
                View Application Status
              </Button>
            </Link>
          </div>

          {/* Support Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Need help?{" "}
            <Link 
              href="/support"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
