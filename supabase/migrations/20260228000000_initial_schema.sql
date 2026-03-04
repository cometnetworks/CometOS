-- Comet OS MVP v0.1 Schema

-- 1. Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('YUC', 'QROO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('YUC', 'QROO')),
  total_units INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Phases
CREATE TABLE phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planeación', 'obra', 'validación', 'aprobado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Sections
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planeación',
  units INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Checklist Templates
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pre-colado', 'pre-cierre', 'pre-entrega')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Checklist Items
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true
);

-- 7. Checklist Submissions
CREATE TABLE checklist_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES checklist_templates(id),
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pendiente', 'aprobado', 'rechazado')) DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Checklist Evidence
CREATE TABLE checklist_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES checklist_submissions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Incidents
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')) DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Infra Score Snapshots
CREATE TABLE infra_score_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE infra_score_snapshots ENABLE ROW LEVEL SECURITY;
