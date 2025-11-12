# EduVerse ERP - School Management System

A comprehensive School Management SaaS solution built with Next.js, NestJS, and PostgreSQL.

## 🚀 Features

### Student Management
- ✅ Complete student enrollment with photo upload
- ✅ Comprehensive student profiles with all details
- ✅ Bulk student upload via Excel templates
- ✅ Advanced filtering by school, branch, class, and status
- ✅ Student photo management
- ✅ Parent and guardian information tracking
- ✅ Medical conditions and emergency contacts
- ✅ Transport and hostel requirements

### Master Data Management
- ✅ Schools and branches management
- ✅ Academic years configuration
- ✅ Classes and sections setup
- ✅ Subjects management
- ✅ Fee structures configuration
- ✅ Teachers management with bulk upload

### System Features
- ✅ Multi-tenant architecture
- ✅ Role-based access control
- ✅ Responsive design with modern UI
- ✅ Real-time data updates
- ✅ Comprehensive search and filtering
- ✅ Data export capabilities
- ✅ Photo upload and management

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Custom UI Components** - Reusable component library

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe backend development
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Robust relational database
- **Multer** - File upload handling
- **XLSX** - Excel file processing

## 📁 Project Structure

```
eduverse-erp/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── master/      # Master data management
│   │   │   │   ├── students/    # Student management
│   │   │   │   │   ├── add/     # Add student page
│   │   │   │   │   └── page.tsx # Students list
│   │   │   │   ├── teachers/    # Teacher management
│   │   │   │   ├── classes/     # Class management
│   │   │   │   ├── subjects/    # Subject management
│   │   │   │   ├── academic-years/ # Academic year management
│   │   │   │   └── fee-structures/ # Fee structure management
│   │   │   └── super-admin/ # Super admin features
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries and API clients
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── master/         # Master data module
│   │   │   ├── entities/   # Database entities
│   │   │   ├── dto/        # Data transfer objects
│   │   │   ├── master.controller.ts
│   │   │   ├── master.service.ts
│   │   │   └── master.module.ts
│   │   ├── super-admin/    # Super admin module
│   │   ├── auth/           # Authentication module
│   │   └── common/         # Shared utilities
│   └── uploads/            # File upload storage
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashokverma-an/eduverse-erp.git
   cd eduverse-erp
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb eduverse
   
   # Update backend/.env with your database credentials
   cp backend/.env.example backend/.env
   ```

4. **Environment Configuration**
   
   **Backend (.env)**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=eduverse
   JWT_SECRET=your_jwt_secret
   ```
   
   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. **Start the applications**
   
   **Backend (Terminal 1)**
   ```bash
   cd backend
   npm run start:dev
   ```
   
   **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📚 API Documentation

### Student Management Endpoints

#### Create Student with Photo
```http
POST /master/students/with-photo
Content-Type: multipart/form-data

{
  "firstName": "John",
  "lastName": "Doe",
  "rollNumber": "001",
  "photo": [file],
  // ... other student fields
}
```

#### Get Students
```http
GET /master/students?schoolId={schoolId}&branchId={branchId}&classId={classId}&search={search}
```

#### Bulk Upload Students
```http
POST /master/students/bulk-upload
Content-Type: multipart/form-data

{
  "file": [excel_file],
  "schoolId": "school-id"
}
```

### Template Downloads
```http
GET /master/templates/students    # Download student template
GET /master/templates/teachers    # Download teacher template
```

## 🎯 Key Features Implemented

### Student Management
- **Complete Student Profiles**: All personal, academic, and family information
- **Photo Upload**: Student photo management with preview
- **Bulk Operations**: Excel-based bulk student upload
- **Advanced Search**: Multi-criteria filtering and search
- **Data Validation**: Comprehensive form validation
- **Responsive Design**: Works on all device sizes

### School-Branch Mapping
- **Automatic Branch Selection**: Single branch auto-selection
- **Hierarchical Data**: Proper school → branch → class relationships
- **Fallback Data**: Demo data when APIs are unavailable

### User Experience
- **Modern UI**: Clean, intuitive interface
- **Toast Notifications**: Proper user feedback
- **Loading States**: Smooth user interactions
- **Error Handling**: Graceful error management

## 🔧 Development

### Adding New Features
1. Create backend entities in `backend/src/master/entities/`
2. Add API endpoints in `backend/src/master/master.controller.ts`
3. Implement business logic in `backend/src/master/master.service.ts`
4. Create frontend pages in `frontend/src/app/`
5. Add API client methods in `frontend/src/lib/api/`

### Database Migrations
```bash
cd backend
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashok Verma**
- GitHub: [@ashokverma-an](https://github.com/ashokverma-an)
- Email: ashokverma.an.2001@gmail.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for scalability and maintainability
- Focus on user experience and performance

---

**EduVerse ERP** - Transforming Education Management 🎓