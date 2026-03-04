-- Add role column to auth.users if needed or use a separate table
-- For MVP, we will assume a simple role mapping table to make it easy

CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coordinador', 'supervisor')),
  organization_id UUID REFERENCES organizations(id) -- Nullable for super admins
);

-- RLS for user_roles (Admins can do everything, users can read their own)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- Example RLS Policy for Projects:
-- - Admins can read all projects
-- - Coordinators and Supervisors can read projects in their organization

CREATE POLICY "Users can view projects in their organization"
  ON projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role = 'admin' OR user_roles.organization_id = projects.organization_id)
    )
  );

CREATE POLICY "Admins can insert projects"
  ON projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update projects"
  ON projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
  
-- Allow public read access for now to speed up MVP frontend development (We can tighten this later before PROD)
-- WARNING: THESE ARE DUMMY POLICIES FOR FAST FRONTEND PROTOTYPING.
-- REMOVE BEFORE PRODUCTION!

CREATE POLICY "Allow public read for organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Allow public read for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read for phases" ON phases FOR SELECT USING (true);
CREATE POLICY "Allow public read for sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow public read for templates" ON checklist_templates FOR SELECT USING (true);
CREATE POLICY "Allow public read for items" ON checklist_items FOR SELECT USING (true);
CREATE POLICY "Allow public read for incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Allow public read for score" ON infra_score_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public read for submissions" ON checklist_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public read for evidence" ON checklist_evidence FOR SELECT USING (true);

-- Allow inserting checklists and evidence for any authenticated user 
CREATE POLICY "Any authenticated user can insert checklist" 
  ON checklist_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Any authenticated user can insert evidence" 
  ON checklist_evidence FOR INSERT TO authenticated WITH CHECK (true);
