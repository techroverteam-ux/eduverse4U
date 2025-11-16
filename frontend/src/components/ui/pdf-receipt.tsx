"use client"

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

interface ReceiptData {
  school: {
    id: string
    name: string
    logo?: string
    email: string
    phone: string
    location: string
  }
  receiptNumber: string
  date: string
  amount: number
  plan: string
  description: string
  dueDate?: string
  status: string
}

export const generatePDFReceipt = async (data: ReceiptData) => {
  // Create receipt HTML
  const receiptHTML = `
    <div id="receipt-content" style="width: 800px; padding: 40px; font-family: Arial, sans-serif; background: white;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <div style="display: flex; align-items: center;">
          ${data.school.logo ? 
            `<img src="${data.school.logo}" alt="School Logo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">` :
            `<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin-right: 15px;">${data.school.name.charAt(0)}</div>`
          }
          <div>
            <h1 style="margin: 0; font-size: 24px; color: #1f2937; font-weight: bold;">${data.school.name}</h1>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${data.school.location}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 28px; color: #6366f1; font-weight: bold;">RECEIPT</h2>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">#${data.receiptNumber}</p>
        </div>
      </div>

      <!-- School Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: bold;">Bill To:</h3>
          <p style="margin: 0; color: #1f2937; font-weight: bold; font-size: 16px;">${data.school.name}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">School ID: ${data.school.id}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${data.school.email}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${data.school.phone}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; min-width: 200px;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Receipt Date:</p>
            <p style="margin: 0 0 15px 0; color: #1f2937; font-weight: bold; font-size: 16px;">${data.date}</p>
            ${data.dueDate ? `
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Due Date:</p>
              <p style="margin: 0; color: #1f2937; font-weight: bold; font-size: 16px;">${data.dueDate}</p>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Receipt Details -->
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
        <div style="background: #6366f1; color: white; padding: 15px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Description</span>
            <span>Amount</span>
          </div>
        </div>
        <div style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div>
              <p style="margin: 0; font-weight: bold; color: #1f2937; font-size: 16px;">${data.description}</p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Plan: ${data.plan}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #059669;">₹${data.amount.toLocaleString()}</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 18px; font-weight: bold; color: #1f2937;">Total Amount:</span>
              <span style="font-size: 24px; font-weight: bold; color: #059669;">₹${data.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <div>
          <span style="background: ${data.status === 'Paid' ? '#dcfce7' : '#fef3c7'}; color: ${data.status === 'Paid' ? '#166534' : '#92400e'}; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px;">
            ${data.status.toUpperCase()}
          </span>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Thank you for choosing EduVerse ERP!</p>
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">This is a computer-generated receipt. No signature required.</p>
      </div>
    </div>
  `

  // Create temporary div
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = receiptHTML
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  document.body.appendChild(tempDiv)

  try {
    // Convert to canvas
    const canvas = await html2canvas(tempDiv.querySelector('#receipt-content') as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    // Save PDF
    pdf.save(`receipt-${data.receiptNumber}.pdf`)
    
  } finally {
    // Clean up
    document.body.removeChild(tempDiv)
  }
}

export const ReceiptGenerator = ({ data, children }: { data: ReceiptData, children: React.ReactNode }) => {
  const handleGenerateReceipt = () => {
    generatePDFReceipt(data)
  }

  return (
    <div onClick={handleGenerateReceipt} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}