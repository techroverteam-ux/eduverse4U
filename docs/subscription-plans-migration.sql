-- Subscription Plans and Multi-Branch Support Migration

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2) NOT NULL,
    max_students INTEGER NOT NULL,
    max_branches INTEGER NOT NULL,
    features TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create school branches table
CREATE TABLE IF NOT EXISTS school_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    branch_manager VARCHAR(255),
    manager_phone VARCHAR(20),
    manager_email VARCHAR(255),
    students INTEGER DEFAULT 0,
    teachers INTEGER DEFAULT 0,
    classrooms INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Setup' CHECK (status IN ('Active', 'Inactive', 'Setup')),
    is_main_branch BOOLEAN DEFAULT FALSE,
    school_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE(school_id, branch_code)
);

-- Add subscription plan fields to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS subscription_plan_id UUID;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly'));
ALTER TABLE schools ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS total_branches INTEGER DEFAULT 1;

-- Add foreign key constraint
ALTER TABLE schools ADD CONSTRAINT fk_schools_subscription_plan 
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, code, monthly_price, yearly_price, max_students, max_branches, features, sort_order) VALUES
('Basic Plan', 'BASIC', 2999.00, 29990.00, 500, 1, ARRAY[
    'Up to 500 students',
    'Single branch',
    'Basic student management',
    'Attendance tracking',
    'Basic reports',
    'Email support'
], 1),
('Standard Plan', 'STANDARD', 4999.00, 49990.00, 1500, 3, ARRAY[
    'Up to 1500 students',
    'Up to 3 branches',
    'Advanced student management',
    'Fee management',
    'Parent portal',
    'SMS notifications',
    'Priority support'
], 2),
('Premium Plan', 'PREMIUM', 7999.00, 79990.00, -1, 10, ARRAY[
    'Unlimited students',
    'Up to 10 branches',
    'Complete ERP solution',
    'Advanced analytics',
    'Mobile app',
    'Custom integrations',
    '24/7 dedicated support'
], 3),
('Enterprise Plan', 'ENTERPRISE', 12999.00, 129990.00, -1, -1, ARRAY[
    'Unlimited students',
    'Unlimited branches',
    'White-label solution',
    'Custom development',
    'On-premise deployment',
    'Dedicated account manager',
    'SLA guarantee'
], 4)
ON CONFLICT (code) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort ON subscription_plans(sort_order);
CREATE INDEX IF NOT EXISTS idx_school_branches_school_id ON school_branches(school_id);
CREATE INDEX IF NOT EXISTS idx_school_branches_main ON school_branches(is_main_branch);
CREATE INDEX IF NOT EXISTS idx_schools_subscription_plan ON schools(subscription_plan_id);

-- Update existing schools with default subscription plan
UPDATE schools 
SET subscription_plan_id = (SELECT id FROM subscription_plans WHERE code = 'BASIC' LIMIT 1)
WHERE subscription_plan_id IS NULL;

-- Create main branches for existing schools
INSERT INTO school_branches (
    name, branch_code, address, city, state, pincode, phone, email, 
    students, teachers, is_main_branch, school_id
)
SELECT 
    name || ' - Main Campus' as name,
    school_code || '-MAIN' as branch_code,
    location as address,
    city,
    state,
    pincode,
    phone,
    email,
    students,
    teachers,
    true as is_main_branch,
    id as school_id
FROM schools 
WHERE id NOT IN (SELECT DISTINCT school_id FROM school_branches WHERE is_main_branch = true);

-- Update trigger for subscription plans
CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_subscription_plans_updated_at();

-- Update trigger for school branches
CREATE TRIGGER update_school_branches_updated_at 
    BEFORE UPDATE ON school_branches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;