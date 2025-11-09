-- Add missing columns to policies table
ALTER TABLE public.policies 
ADD COLUMN IF NOT EXISTS framework_category text,
ADD COLUMN IF NOT EXISTS security_domain text;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_policies_framework_category ON public.policies(framework_category);
CREATE INDEX IF NOT EXISTS idx_policies_security_domain ON public.policies(security_domain);

COMMENT ON COLUMN public.policies.framework_category IS 'Security framework category (e.g., Physical, Technical, Organizational)';
COMMENT ON COLUMN public.policies.security_domain IS 'Security domain classification';