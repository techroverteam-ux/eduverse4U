# EduVerse ERP - India's Advanced School Management SaaS

A comprehensive school management system designed specifically for Indian educational institutions with multi-tenant architecture and compliance with Indian education laws.

## 🚀 Features

### 🏫 School Onboarding System
- **4-Step Registration Wizard** with validation
- **Indian Education Law Compliance** fields
- **Document Upload** for certificates and compliance
- **Package Selection** (Basic, Standard, Premium)
- **Registration Receipt** generation
- **Approval Workflow** for super admin

### 📊 Super Admin Dashboard
- **Platform Overview** with real-time statistics
- **School Management** with advanced filtering
- **Pagination** for large datasets
- **Compact UI** with minimal scrolling
- **Revenue Analytics** and reporting
- **User Management** across all schools

### 💰 Pricing Packages

#### Basic Plan
- **Free up to 150 students**
- **₹5 per student** after limit
- Core features: Student Management, Attendance, Fee Collection

#### Standard Plan  
- **₹2,000/month + ₹3/student** (200 free)
- All Basic features plus Library, Exams, Parent Portal

#### Premium Plan
- **₹5,000/month + ₹2/student** (300 free)  
- All Standard features plus Accounting, HR, Transport, Hostel

### 🎨 UI/UX Features
- **Responsive Design** optimized for all devices
- **Minimal Spacing** and compact layouts
- **Smooth Pagination** with navigation controls
- **Student-Friendly Interface** with clear navigation
- **Gradient Themes** and modern styling
- **Minimal Scrolling** except for table pagination

## 🛠 Technical Stack

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Lucide React** icons
- **Responsive Design**

### Backend
- **NestJS** with TypeScript
- **PostgreSQL** database
- **JWT Authentication**
- **Role-Based Access Control**
- **Multi-tenant Architecture**

### Infrastructure
- **Docker** containerization
- **Nginx** reverse proxy
- **Git** version control
- **Environment-based** configuration

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/techroverteam-ux/eduverse4U.git
cd eduverse4U
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../frontend && npm install
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb eduverse

# Run database schema
psql -d eduverse -f docs/database-schema.sql
```

### 4. Environment Configuration
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Update database credentials in backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=eduverse
```

### 5. Create Super Admin
```bash
# Run super admin creation script
node scripts/create-superadmin-final.js
```

### 6. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run backend:dev  # Backend on :3001
npm run frontend:dev # Frontend on :3000
```

## 🔐 Default Login Credentials

### Super Admin
- **URL**: http://localhost:3000/login
- **Email**: superadmin@demo.com
- **Password**: admin123
- **Tenant**: platform

## 📱 Key Pages & Features

### Super Admin Portal
- **Dashboard**: `/super-admin` - Platform overview and statistics
- **Schools**: `/super-admin/schools` - Manage all schools with pagination
- **Add School**: `/super-admin/schools/add` - 4-step registration wizard
- **Success**: `/super-admin/schools/success` - Registration confirmation

### School Registration Flow
1. **Basic Information** - School details and legal info
2. **Contact Information** - Principal and admin contacts  
3. **Address Details** - Complete address with Indian states
4. **Package Selection** - Choose pricing plan and features

### UI/UX Enhancements
- **Compact Headers** with essential information only
- **Minimal Cards** with optimized spacing
- **Smart Pagination** with page numbers and navigation
- **Responsive Tables** that work on all screen sizes
- **Quick Actions** for common tasks

## 🏗 Architecture

### Multi-Tenant Design
- **Tenant Isolation** - Complete data separation per school
- **Subdomain Routing** - school.eduverse.com
- **Role-Based Access** - Super Admin, School Admin, Teacher, Student, Parent
- **Scalable Infrastructure** - Supports unlimited schools

### Database Schema
- **Enhanced School Registration** table with Indian compliance
- **Package Pricing** with flexible billing
- **Academic Years** and class management
- **Document Management** for certificates
- **Audit Trails** for all operations

## 📊 School Management Features

### Registration Process
- **Document Verification** - Upload and verify certificates
- **Approval Workflow** - Super admin approval required
- **Payment Integration** - Package-based billing
- **Automated Setup** - Database and portal creation

### Compliance Features
- **Registration Certificate** upload
- **Affiliation Board** selection (CBSE, ICSE, State Board)
- **NOC Certificate** management
- **Fire Safety** and building certificates
- **Indian State** selection with validation

### Package Management
- **Flexible Pricing** - Base price + per-student charges
- **Feature Modules** - Core, Library, Accounting, etc.
- **Usage Tracking** - Monitor student limits
- **Billing Automation** - Monthly invoice generation

## 🔧 Development

### Project Structure
```
eduverse-erp/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application  
├── docs/            # Documentation and schemas
├── scripts/         # Database and setup scripts
├── docker-compose.yml
└── package.json     # Root package file
```

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run build        # Build both applications
npm run backend:dev  # Start backend only
npm run frontend:dev # Start frontend only
```

### Database Scripts
```bash
node scripts/create-superadmin-final.js  # Create super admin
node scripts/check-db.js                 # Check database structure
node scripts/verify-login.js             # Verify login credentials
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment
1. Build applications: `npm run build`
2. Set production environment variables
3. Start backend: `cd backend && npm start`
4. Serve frontend with nginx or similar
5. Configure reverse proxy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@eduverse.com
- **Phone**: +91-1800-123-4567
- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ School onboarding system
- ✅ Super admin dashboard
- ✅ Package management
- ✅ Enhanced UI/UX

### Phase 2 (Next)
- 📅 Academic year management
- 🏫 Branch management  
- 👥 Student/teacher onboarding
- 📊 Advanced analytics

### Phase 3 (Future)
- 📱 Mobile applications
- 🔔 Real-time notifications
- 📈 Advanced reporting
- 🌐 Multi-language support

---

**Built with ❤️ for Indian Education System**