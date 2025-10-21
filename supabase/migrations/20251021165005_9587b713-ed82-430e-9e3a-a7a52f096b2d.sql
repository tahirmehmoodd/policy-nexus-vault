-- Week 2: Extend database schema for section storage and lifecycle fields

-- Add new fields to policies table
ALTER TABLE public.policies
ADD COLUMN IF NOT EXISTS owner TEXT,
ADD COLUMN IF NOT EXISTS reviewer UUID,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID;

-- Create policy_sections table for section-level storage
CREATE TABLE IF NOT EXISTS public.policy_sections (
  section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  section_title TEXT NOT NULL,
  section_content TEXT NOT NULL,
  compliance_tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(policy_id, section_number)
);

-- Create index for faster section queries
CREATE INDEX IF NOT EXISTS idx_policy_sections_policy_id ON public.policy_sections(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_sections_compliance ON public.policy_sections USING gin(compliance_tags);

-- Create compliance_frameworks table for framework mapping
CREATE TABLE IF NOT EXISTS public.compliance_frameworks (
  framework_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_name TEXT NOT NULL,
  framework_category TEXT NOT NULL,
  control_id TEXT NOT NULL,
  control_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(framework_name, control_id)
);

-- Create index for compliance framework searches
CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_name ON public.compliance_frameworks(framework_name);
CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_keywords ON public.compliance_frameworks USING gin(keywords);

-- Enable RLS on policy_sections
ALTER TABLE public.policy_sections ENABLE ROW LEVEL SECURITY;

-- RLS policies for policy_sections
CREATE POLICY "Anyone can view sections for active policies"
  ON public.policy_sections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.policies
      WHERE policies.id = policy_sections.policy_id
      AND (policies.status = 'active' OR auth.uid() IS NOT NULL)
    )
  );

CREATE POLICY "Authenticated users can create sections"
  ON public.policy_sections
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Policy creators can update sections"
  ON public.policy_sections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.policies
      WHERE policies.id = policy_sections.policy_id
      AND policies.created_by = auth.uid()
    )
  );

CREATE POLICY "Policy creators can delete sections"
  ON public.policy_sections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.policies
      WHERE policies.id = policy_sections.policy_id
      AND policies.created_by = auth.uid()
    )
  );

-- Enable RLS on compliance_frameworks
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;

-- RLS policies for compliance_frameworks (read-only for all, write for authenticated)
CREATE POLICY "Anyone can view compliance frameworks"
  ON public.compliance_frameworks
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage compliance frameworks"
  ON public.compliance_frameworks
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create trigger for updating policy_sections updated_at
CREATE TRIGGER update_policy_sections_updated_at
  BEFORE UPDATE ON public.policy_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample compliance framework data (ISO 27002, NIST CSF, GDPR)
INSERT INTO public.compliance_frameworks (framework_name, framework_category, control_id, control_description, keywords) VALUES
  ('ISO 27002', 'Access Control', 'A.9.1.1', 'Access control policy', ARRAY['access', 'control', 'authentication', 'authorization']),
  ('ISO 27002', 'Cryptography', 'A.10.1.1', 'Policy on the use of cryptographic controls', ARRAY['encryption', 'cryptography', 'crypto', 'cipher']),
  ('ISO 27002', 'Physical Security', 'A.11.1.1', 'Physical security perimeter', ARRAY['physical', 'perimeter', 'facility', 'building']),
  ('ISO 27002', 'Operations Security', 'A.12.1.1', 'Documented operating procedures', ARRAY['operations', 'procedures', 'documentation']),
  ('ISO 27002', 'Communications Security', 'A.13.1.1', 'Network controls', ARRAY['network', 'communications', 'firewall', 'segmentation']),
  ('ISO 27002', 'System Acquisition', 'A.14.1.1', 'Information security requirements analysis', ARRAY['acquisition', 'development', 'requirements']),
  ('ISO 27002', 'Supplier Relations', 'A.15.1.1', 'Information security policy for supplier relationships', ARRAY['supplier', 'vendor', 'third-party']),
  ('ISO 27002', 'Incident Management', 'A.16.1.1', 'Responsibilities and procedures', ARRAY['incident', 'response', 'breach', 'security event']),
  ('ISO 27002', 'Business Continuity', 'A.17.1.1', 'Planning information security continuity', ARRAY['continuity', 'disaster', 'recovery', 'backup']),
  ('ISO 27002', 'Compliance', 'A.18.1.1', 'Identification of applicable legislation', ARRAY['compliance', 'legal', 'regulation', 'law']),
  ('NIST CSF', 'Identify', 'ID.AM', 'Asset Management', ARRAY['asset', 'inventory', 'hardware', 'software']),
  ('NIST CSF', 'Identify', 'ID.RA', 'Risk Assessment', ARRAY['risk', 'assessment', 'vulnerability', 'threat']),
  ('NIST CSF', 'Protect', 'PR.AC', 'Access Control', ARRAY['access', 'authentication', 'authorization']),
  ('NIST CSF', 'Protect', 'PR.DS', 'Data Security', ARRAY['data', 'protection', 'encryption']),
  ('NIST CSF', 'Detect', 'DE.CM', 'Continuous Monitoring', ARRAY['monitoring', 'detection', 'logging']),
  ('NIST CSF', 'Respond', 'RS.RP', 'Response Planning', ARRAY['response', 'incident', 'plan']),
  ('NIST CSF', 'Recover', 'RC.RP', 'Recovery Planning', ARRAY['recovery', 'restoration', 'backup']),
  ('GDPR', 'Data Protection', 'Art. 5', 'Principles relating to processing of personal data', ARRAY['data', 'personal', 'processing', 'privacy']),
  ('GDPR', 'Data Protection', 'Art. 6', 'Lawfulness of processing', ARRAY['lawful', 'consent', 'legitimate']),
  ('GDPR', 'Data Protection', 'Art. 32', 'Security of processing', ARRAY['security', 'technical', 'organizational', 'measures']),
  ('GDPR', 'Data Protection', 'Art. 33', 'Notification of a personal data breach', ARRAY['breach', 'notification', 'incident']),
  ('GDPR', 'Data Protection', 'Art. 35', 'Data protection impact assessment', ARRAY['impact', 'assessment', 'DPIA', 'risk'])
ON CONFLICT (framework_name, control_id) DO NOTHING;