-- Enhanced School Onboarding Schema for Indian Schools

-- School registration table with comprehensive details
CREATE TABLE school_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    school_name VARCHAR(255) NOT NULL,
    school_code VARCHAR(50) UNIQUE NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    
    -- Legal Information (As per Indian Education Laws)
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    affiliation_board VARCHAR(100) NOT NULL, -- CBSE, ICSE, State Board, etc.
    affiliation_number VARCHAR(100),
    recognition_certificate VARCHAR(500), -- File path
    noc_certificate VARCHAR(500), -- No Objection Certificate
    fire_safety_certificate VARCHAR(500),
    building_safety_certificate VARCHAR(500),
    
    -- Contact Information
    principal_name VARCHAR(255) NOT NULL,
    principal_email VARCHAR(255) NOT NULL,
    principal_phone VARCHAR(15) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    admin_phone VARCHAR(15) NOT NULL,
    
    -- Address Information
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    district VARCHAR(100) NOT NULL,
    
    -- School Details
    school_type VARCHAR(50) NOT NULL, -- Primary, Secondary, Senior Secondary, Pre-Primary
    medium_of_instruction TEXT[], -- Hindi, English, Regional Languages
    classes_offered TEXT[], -- Pre-KG, KG, 1-12
    total_students INTEGER DEFAULT 0,
    total_teachers INTEGER DEFAULT 0,
    total_staff INTEGER DEFAULT 0,
    establishment_year INTEGER NOT NULL,
    
    -- Infrastructure
    total_classrooms INTEGER DEFAULT 0,
    has_library BOOLEAN DEFAULT false,
    has_laboratory BOOLEAN DEFAULT false,
    has_computer_lab BOOLEAN DEFAULT false,
    has_playground BOOLEAN DEFAULT false,
    has_auditorium BOOLEAN DEFAULT false,
    has_medical_room BOOLEAN DEFAULT false,
    has_canteen BOOLEAN DEFAULT false,
    has_transport BOOLEAN DEFAULT false,
    
    -- Branding
    logo_url VARCHAR(500),
    website_url VARCHAR(255),
    school_colors JSONB, -- Primary and secondary colors
    
    -- Package Selection
    selected_package VARCHAR(50) NOT NULL, -- basic, standard, premium
    selected_modules TEXT[], -- library, accounting, certification, etc.
    pricing_tier VARCHAR(50) NOT NULL, -- free_150, per_student_5
    
    -- Status and Approval
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, active, suspended
    approval_notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- Payment Information
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
    payment_amount DECIMAL(10,2),
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School branches table
CREATE TABLE school_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES school_registrations(id) ON DELETE CASCADE,
    
    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    
    -- Branch Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    
    -- Branch Details
    branch_head_name VARCHAR(255),
    branch_head_email VARCHAR(255),
    branch_head_phone VARCHAR(15),
    
    students_count INTEGER DEFAULT 0,
    teachers_count INTEGER DEFAULT 0,
    
    is_main_branch BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(school_id, branch_code)
);

-- Academic years table
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES school_registrations(id) ON DELETE CASCADE,
    
    year_name VARCHAR(50) NOT NULL, -- 2024-25
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    is_current BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(school_id, year_name)
);

-- Classes table
CREATE TABLE school_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES school_registrations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES school_branches(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    
    class_name VARCHAR(50) NOT NULL, -- Pre-KG, KG, 1, 2, ..., 12
    section VARCHAR(10) NOT NULL, -- A, B, C, etc.
    
    class_teacher_id UUID REFERENCES users(id),
    max_students INTEGER DEFAULT 40,
    current_students INTEGER DEFAULT 0,
    
    classroom_number VARCHAR(20),
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(school_id, branch_id, academic_year_id, class_name, section)
);

-- Package pricing table
CREATE TABLE package_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    package_name VARCHAR(50) NOT NULL,
    package_display_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    base_price DECIMAL(10,2) NOT NULL,
    per_student_price DECIMAL(10,2) DEFAULT 0,
    free_student_limit INTEGER DEFAULT 0,
    
    features JSONB, -- List of features included
    modules JSONB, -- Available modules
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default packages
INSERT INTO package_pricing (package_name, package_display_name, description, base_price, per_student_price, free_student_limit, features, modules) VALUES
('basic', 'Basic Plan', 'Perfect for small schools', 0, 5, 150, 
 '["Student Management", "Basic Attendance", "Fee Collection", "Basic Reports"]',
 '["core", "attendance", "fees"]'),
('standard', 'Standard Plan', 'Ideal for medium schools', 2000, 3, 200,
 '["All Basic Features", "Library Management", "Exam Management", "Advanced Reports", "Parent Portal"]',
 '["core", "attendance", "fees", "library", "exams", "parent_portal"]'),
('premium', 'Premium Plan', 'Complete solution for large schools', 5000, 2, 300,
 '["All Standard Features", "Accounting & Finance", "HR Management", "Transport Management", "Hostel Management", "Certification System"]',
 '["core", "attendance", "fees", "library", "exams", "parent_portal", "accounting", "hr", "transport", "hostel", "certification"]');

-- School documents table
CREATE TABLE school_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES school_registrations(id) ON DELETE CASCADE,
    
    document_type VARCHAR(100) NOT NULL, -- registration, affiliation, noc, etc.
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_school_registrations_status ON school_registrations(status);
CREATE INDEX idx_school_registrations_state ON school_registrations(state);
CREATE INDEX idx_school_registrations_package ON school_registrations(selected_package);
CREATE INDEX idx_school_branches_school_id ON school_branches(school_id);
CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_school_classes_school_branch ON school_classes(school_id, branch_id);