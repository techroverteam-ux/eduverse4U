"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, Download, Mail, Phone, Building2, 
  Calendar, IndianRupee, FileText, ArrowLeft
} from "lucide-react"

export default function SchoolRegistrationSuccess() {
  const registrationData = {
    registrationId: 'REG-' + Date.now(),
    schoolName: 'Demo School',
    submittedDate: new Date().toLocaleDateString(),
    selectedPackage: 'Basic Plan',
    estimatedApproval: '3-5 business days'
  }

  const handleDownloadReceipt = () => {
    console.log('Downloading registration receipt...')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-green-600">Registration Successful!</h1>
        <p className="text-xl text-gray-600">
          Your school registration has been submitted successfully
        </p>
      </div>

      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center text-green-800">
            <Building2 className="h-6 w-6 mr-2" />
            Registration Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Registration ID</label>
                <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                  {registrationData.registrationId}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">School Name</label>
                <p className="text-lg">{registrationData.schoolName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Selected Package</label>
                <p className="text-lg flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  {registrationData.selectedPackage}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-lg">Pending Approval</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Document Verification</h3>
                <p className="text-gray-600">Our team will verify your submitted documents.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Approval Notification</h3>
                <p className="text-gray-600">You'll receive an email notification once approved.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Payment & Activation</h3>
                <p className="text-gray-600">Complete payment and your portal will be activated.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleDownloadReceipt}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/super-admin/schools'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Schools
        </Button>
      </div>
    </div>
  )
}