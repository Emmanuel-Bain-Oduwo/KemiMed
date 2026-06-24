-- KemiMed™ Database Seed Script
-- Run this after alembic upgrade head

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Seed 20 clinical topics
INSERT INTO topics (id, slug, name, description, category, disciplines, icon, color, is_featured)
VALUES
  (uuid_generate_v4(), 'drug-interactions', 'Drug Interactions (DDI)', 'Pharmacokinetic and pharmacodynamic drug interactions', 'pharmacy', '{"pharmacy","medicine","nursing"}', '💊', '#0B5C8F', true),
  (uuid_generate_v4(), 'pharmacokinetics', 'Pharmacokinetics', 'ADME: absorption, distribution, metabolism, excretion', 'pharmacy', '{"pharmacy","medicine"}', '🧬', '#0CA89E', true),
  (uuid_generate_v4(), 'pharmacogenomics', 'Pharmacogenomics', 'Genetic variation and drug response, CYP450 polymorphisms', 'pharmacy', '{"pharmacy","medicine"}', '🔬', '#C78B0A', false),
  (uuid_generate_v4(), 'antimicrobials', 'Antimicrobials', 'Antibiotics, antivirals, antifungals, resistance mechanisms', 'pharmacy', '{"pharmacy","medicine","nursing"}', '🦠', '#DC2626', true),
  (uuid_generate_v4(), 'cardiovascular-drugs', 'Cardiovascular Pharmacology', 'Antihypertensives, antiarrhythmics, anticoagulants', 'pharmacy', '{"pharmacy","medicine","nursing"}', '🫀', '#16A34A', true),
  (uuid_generate_v4(), 'anaesthetics', 'Anaesthetics', 'General/local anaesthesia, sedation, muscle relaxants', 'pharmacy', '{"pharmacy","medicine"}', '😴', '#7C3AED', false),
  (uuid_generate_v4(), 'anatomy', 'Anatomy', 'Human body structure: gross, clinical, applied anatomy', 'medicine', '{"medicine","physiotherapy","nursing"}', '🦴', '#0CA89E', true),
  (uuid_generate_v4(), 'physiology', 'Physiology', 'Normal body function: CVS, respiratory, renal, neuro', 'medicine', '{"medicine","nursing","physiotherapy"}', '❤️', '#DC2626', true),
  (uuid_generate_v4(), 'pathology', 'Pathology', 'Disease mechanisms, cellular injury, inflammation, neoplasia', 'medicine', '{"medicine"}', '🔭', '#7C3AED', false),
  (uuid_generate_v4(), 'clinical-medicine', 'Clinical Medicine', 'History taking, examination, diagnosis, management', 'medicine', '{"medicine"}', '🩺', '#0B5C8F', true),
  (uuid_generate_v4(), 'microbiology', 'Microbiology', 'Bacteriology, virology, mycology, parasitology', 'medicine', '{"medicine","mls","nursing"}', '🦠', '#16A34A', false),
  (uuid_generate_v4(), 'immunology', 'Immunology', 'Innate and adaptive immunity, vaccines, hypersensitivity', 'medicine', '{"medicine","mls","nursing"}', '🛡️', '#C78B0A', false),
  (uuid_generate_v4(), 'oncology', 'Oncology', 'Cancer biology, chemotherapy, targeted therapy', 'medicine', '{"medicine","pharmacy","nursing"}', '🧪', '#DC2626', false),
  (uuid_generate_v4(), 'nursing-care', 'Nursing Care Plans', 'Patient assessment, care planning, interventions', 'nursing', '{"nursing"}', '💙', '#0CA89E', false),
  (uuid_generate_v4(), 'lab-interpretation', 'Lab Interpretation (MLS)', 'Haematology, biochemistry, reference ranges', 'mls', '{"mls","medicine","nursing","pharmacy"}', '🔬', '#7C3AED', true),
  (uuid_generate_v4(), 'public-health', 'Public Health & Epidemiology', 'Disease burden, biostatistics, research methods', 'public_health', '{"medicine","nursing","pharmacy","public_health"}', '🌍', '#C78B0A', false),
  (uuid_generate_v4(), 'biochemistry', 'Biochemistry', 'Metabolism, enzymes, molecular biology, genetics', 'medicine', '{"medicine","pharmacy","mls"}', '⚗️', '#0B5C8F', false),
  (uuid_generate_v4(), 'pharmacodynamics', 'Pharmacodynamics', 'Drug-receptor interactions, dose-response, efficacy', 'pharmacy', '{"pharmacy","medicine"}', '⚗️', '#7C3AED', false),
  (uuid_generate_v4(), 'physiotherapy', 'Physiotherapy', 'Musculoskeletal, neurological, cardiorespiratory rehab', 'physio', '{"physiotherapy"}', '🏃', '#16A34A', false),
  (uuid_generate_v4(), 'obs-gynae', 'Obstetrics & Gynaecology', 'Pregnancy, labour, postnatal, gynaecological conditions', 'medicine', '{"medicine","nursing","pharmacy"}', '🤱', '#DC2626', false)
ON CONFLICT (slug) DO NOTHING;
