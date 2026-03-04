-- Seed Data for Comet OS MVP

-- 1. Create a demo organization (Yucatan)
INSERT INTO organizations (id, name, region) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Desarrolladora Demo', 'YUC')
ON CONFLICT (id) DO NOTHING;

-- 2. Create a demo project
INSERT INTO projects (id, organization_id, name, state, total_units, status)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Proyecto Alpha Yucatán', 'YUC', 1200, 'active')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Phases
INSERT INTO phases (id, project_id, name, status)
VALUES 
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Fase 1: Privada Norte', 'obra'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Fase 2: Privada Sur', 'planeación')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Sections (Manzanas)
INSERT INTO sections (id, phase_id, name, status, units)
VALUES 
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'Manzana 1', 'validación', 50),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Manzana 2', 'obra', 50),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'Manzana 3', 'planeación', 45)
ON CONFLICT (id) DO NOTHING;

-- 5. Create Checklist Templates
INSERT INTO checklist_templates (id, name, type)
VALUES 
('00000000-0000-0000-0000-000000000008', 'Validación Pre-Colado', 'pre-colado'),
('00000000-0000-0000-0000-000000000009', 'Validación Pre-Cierre Vialidad', 'pre-cierre')
ON CONFLICT (id) DO NOTHING;

-- 6. Create Checklist Items
INSERT INTO checklist_items (template_id, label, required)
VALUES 
('00000000-0000-0000-0000-000000000008', '¿Ductería instalada a la profundidad correcta según plano?', true),
('00000000-0000-0000-0000-000000000008', '¿Registros nivelados pre-colado?', true),
('00000000-0000-0000-0000-000000000008', '¿Guías de hilo colocadas en cada ducto?', true),

('00000000-0000-0000-0000-000000000009', '¿Registros limpios y sin escombro interior?', true),
('00000000-0000-0000-0000-000000000009', '¿Tapas de registro instaladas y alineadas?', true);

-- 7. Add dummy incidents to Manzana 1 to test Infra Score impact
INSERT INTO incidents (section_id, severity, description, status)
VALUES 
('00000000-0000-0000-0000-000000000005', 'minor', 'Registro R-12 con escombro leve exterior', 'open'),
('00000000-0000-0000-0000-000000000005', 'major', 'Ducto aplastado en crucero principal', 'in_progress');

-- 8. Add initial Infra Score Snapshot (Calculated Demo)
-- Base 100 - (1 minor * 3) - (1 major * 8) = 89
INSERT INTO infra_score_snapshots (project_id, score)
VALUES ('00000000-0000-0000-0000-000000000002', 89);
