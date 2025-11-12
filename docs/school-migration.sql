-- Enhanced School Registration Migration
-- This script updates the schools table to support comprehensive registration data

-- Drop existing table if needed (use with caution in production)
-- DROP TABLE IF EXISTS schools;

-- Create comprehensive schools table
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    school_code VARCHAR(50) UNIQUE NOT NULL,
    registration_number VARCHAR(100),
    affiliation_number VARCHAR(100),
    established_year VARCHAR(4),
    school_type VARCHAR(50),
    board VARCHAR(50),
    
    -- Address Information
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    district VARCHAR(100),
    country VARCHAR(50) DEFAULT 'India',
    
    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    
    -- Principal Information
    principal VARCHAR(255) NOT NULL,
    principal_email VARCHAR(255),
    principal_phone VARCHAR(20),
    principal_qualification VARCHAR(255),
    principal_experience VARCHAR(255),
    
    -- Admin Information
    admin_name VARCHAR(255),
    admin_email VARCHAR(255),
    admin_phone VARCHAR(20),
    
    -- Academic Information
    medium_of_instruction TEXT[], -- Array of strings
    classes_offered TEXT[], -- Array of strings
    
    -- Statistics
    students INTEGER DEFAULT 0,
    teachers INTEGER DEFAULT 0,
    total_staff INTEGER DEFAULT 0,
    total_classrooms INTEGER DEFAULT 0,
    
    -- Infrastructure (Boolean flags)
    has_library BOOLEAN DEFAULT FALSE,
    has_laboratory BOOLEAN DEFAULT FALSE,
    has_computer_lab BOOLEAN DEFAULT FALSE,
    has_playground BOOLEAN DEFAULT FALSE,
    has_auditorium BOOLEAN DEFAULT FALSE,
    has_medical_room BOOLEAN DEFAULT FALSE,
    has_canteen BOOLEAN DEFAULT FALSE,
    has_transport BOOLEAN DEFAULT FALSE,
    
    -- Business Information
    selected_package VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Active', 'Inactive', 'Trial', 'Suspended', 'Pending')),
    monthly_revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Timestamps
    last_active TIMESTAMP,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_state ON schools(state);
CREATE INDEX IF NOT EXISTS idx_schools_package ON schools(selected_package);
CREATE INDEX IF NOT EXISTS idx_schools_code ON schools(school_code);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schools_updated_at 
    BEFORE UPDATE ON schools 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO schools (
    name, school_code, location, state, principal, email, phone, 
    students, teachers, selected_package, status
) VALUES 
(
    'Delhi Public School', 'DPS001', 'Mumbai, Maharashtra', 'Maharashtra', 
    'Dr. Rajesh Kumar', 'principal@dpsmumbai.edu.in', '+91 98765 43210',
    2847, 156, 'premium', 'Active'
),
(
    'Ryan International School', 'RIS002', 'Delhi, Delhi', 'Delhi',
    'Mrs. Priya Sharma', 'admin@ryandelhi.edu.in', '+91 98765 43211',
    1923, 98, 'standard', 'Active'
),
(
    'Kendriya Vidyalaya', 'KV003', 'Bangalore, Karnataka', 'Karnataka',
    'Mr. Suresh Reddy', 'kv.bangalore@gmail.com', '+91 98765 43212',
    3421, 187, 'premium', 'Active'
),
(
    'DAV Public School', 'DAV004', 'Chennai, Tamil Nadu', 'Tamil Nadu',
    'Dr. Meera Nair', 'dav.chennai@edu.in', '+91 98765 43213',
    1567, 89, 'basic', 'Pending'
)
ON CONFLICT (school_code) DO NOTHING;

-- Update monthly revenue based on package
UPDATE schools SET monthly_revenue = 
    CASE 
        WHEN selected_package = 'basic' THEN 2999
        WHEN selected_package = 'standard' THEN 4999
        WHEN selected_package = 'premium' THEN 7999
        ELSE 0
    END
WHERE monthly_revenue = 0;

COMMIT;