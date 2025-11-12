# 🔌 EduVerse ERP API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.eduverse.in
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🔐 Authentication Endpoints

### POST /auth/login
Login user and get JWT token
```json
{
  "email": "admin@school.com",
  "password": "password123"
}
```

### POST /auth/register
Register new tenant (school)
```json
{
  "schoolName": "ABC Public School",
  "subdomain": "abc-school",
  "adminEmail": "admin@abcschool.com",
  "adminPassword": "securepass123",
  "adminName": "John Doe",
  "phone": "+91-9876543210"
}
```

## 👥 User Management

### GET /users
Get all users for tenant
- **Query params:** `role`, `page`, `limit`
- **Roles:** `admin`, `teacher`, `parent`, `student`

### POST /users
Create new user
```json
{
  "email": "teacher@school.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teacher",
  "phone": "+91-9876543210"
}
```

### PUT /users/:id
Update user details

### DELETE /users/:id
Deactivate user

## 🎓 Student Management

### GET /students
Get all students
- **Query params:** `class`, `section`, `page`, `limit`

### POST /students
Add new student
```json
{
  "admissionNumber": "2024001",
  "firstName": "Rahul",
  "lastName": "Kumar",
  "class": "10",
  "section": "A",
  "rollNumber": "15",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "parentEmail": "parent@email.com",
  "address": "123 Main Street, Delhi"
}
```

### GET /students/:id
Get student details

### PUT /students/:id
Update student information

## 💰 Fee Management

### GET /fees/structures
Get fee structures by class

### POST /fees/structures
Create fee structure
```json
{
  "name": "Tuition Fee",
  "class": "10",
  "amount": 5000,
  "frequency": "monthly",
  "dueDate": 5
}
```

### POST /fees/payments
Record fee payment
```json
{
  "studentId": "uuid",
  "feeStructureId": "uuid",
  "amount": 5000,
  "paymentMethod": "upi",
  "transactionId": "TXN123456789"
}
```

### GET /fees/payments
Get payment history
- **Query params:** `studentId`, `month`, `year`

### GET /fees/receipts/:paymentId
Generate fee receipt PDF

## 📅 Attendance Management

### POST /attendance/mark
Mark attendance for class
```json
{
  "class": "10",
  "section": "A",
  "date": "2024-01-15",
  "attendance": [
    {"studentId": "uuid1", "status": "present"},
    {"studentId": "uuid2", "status": "absent"},
    {"studentId": "uuid3", "status": "late"}
  ]
}
```

### GET /attendance
Get attendance records
- **Query params:** `studentId`, `class`, `date`, `month`

### GET /attendance/summary
Get attendance summary/statistics

## 📚 Timetable Management

### GET /timetable
Get timetable by class/teacher
- **Query params:** `class`, `section`, `teacherId`

### POST /timetable
Create timetable entry
```json
{
  "class": "10",
  "section": "A",
  "dayOfWeek": 1,
  "period": 1,
  "subject": "Mathematics",
  "teacherId": "uuid",
  "startTime": "09:00",
  "endTime": "09:45"
}
```

## 🔔 Notifications

### GET /notifications
Get notifications for user

### POST /notifications
Send notification
```json
{
  "title": "Fee Reminder",
  "message": "Monthly fee due on 5th",
  "type": "fee_reminder",
  "targetRole": "parent",
  "targetUserId": "uuid"
}
```

## 📊 Reports & Analytics

### GET /reports/fees
Fee collection reports
- **Query params:** `month`, `year`, `class`

### GET /reports/attendance
Attendance reports
- **Query params:** `class`, `month`, `student`

### GET /reports/dashboard
Dashboard statistics

## 📄 Document Generation

### GET /documents/certificate/:studentId
Generate student certificate

### GET /documents/id-card/:studentId
Generate student ID card

### GET /documents/report-card/:studentId
Generate report card

## 🏫 Tenant Management (Super Admin)

### GET /tenants
Get all tenants (super admin only)

### POST /tenants
Create new tenant

### PUT /tenants/:id
Update tenant settings

## Error Responses

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error