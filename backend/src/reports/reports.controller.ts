import { Controller, Get, Param, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req) {
    return this.reportsService.getDashboardStats(req.user.tenantId);
  }

  @Get('receipt/:paymentId')
  async getFeeReceipt(@Param('paymentId') paymentId: string, @Request() req, @Res() res: Response) {
    const receipt = await this.reportsService.generateFeeReceipt(paymentId, req.user.tenantId);
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Generate simple HTML receipt
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .content { margin: 30px 0; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fee Receipt</h1>
          <p>Receipt No: ${receipt.receiptNumber}</p>
        </div>
        <div class="content">
          <div class="row"><span>Student Name:</span><span>${receipt.student.name}</span></div>
          <div class="row"><span>Admission No:</span><span>${receipt.student.admissionNumber}</span></div>
          <div class="row"><span>Class:</span><span>${receipt.student.class} ${receipt.student.section || ''}</span></div>
          <div class="row"><span>Fee Type:</span><span>${receipt.fee.name}</span></div>
          <div class="row"><span>Payment Method:</span><span>${receipt.fee.method}</span></div>
          <div class="row"><span>Date:</span><span>${new Date(receipt.date).toLocaleDateString()}</span></div>
          <hr>
          <div class="row"><span>Amount Paid:</span><span class="amount">₹${receipt.fee.amount}</span></div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('certificate/:studentId')
  async getStudentCertificate(@Param('studentId') studentId: string, @Request() req, @Res() res: Response) {
    const certificate = await this.reportsService.getStudentCertificate(studentId, req.user.tenantId);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Certificate</title>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 60px; text-align: center; }
          .certificate { border: 5px solid #2563eb; padding: 40px; }
          .title { font-size: 36px; font-weight: bold; color: #2563eb; margin-bottom: 30px; }
          .content { font-size: 18px; line-height: 1.8; }
          .student-name { font-size: 24px; font-weight: bold; color: #1e40af; }
          .signature { margin-top: 60px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="title">BONAFIDE CERTIFICATE</div>
          <div class="content">
            <p>This is to certify that <span class="student-name">${certificate.studentName}</span> 
            is a bonafide student of <strong>${certificate.schoolName}</strong>.</p>
            
            <p>Admission Number: <strong>${certificate.admissionNumber}</strong></p>
            <p>Class: <strong>${certificate.class} ${certificate.section || ''}</strong></p>
            
            <p>This certificate is issued for official purposes.</p>
            
            <div class="signature">
              <p>Date: ${new Date(certificate.issueDate).toLocaleDateString()}</p>
              <br><br>
              <p>_____________________</p>
              <p><strong>Principal</strong></p>
              <p>${certificate.schoolName}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}