-- Fix RLS policy to allow viewing both 'active' and 'approved' policies
-- This was missing 'approved' status which caused visibility issues

-- Drop the old policy that only allows 'active' policies
DROP POLICY IF EXISTS "Anyone can view active and approved policies" ON public.policies;

-- Create new policy that allows viewing both 'active' AND 'approved' policies
CREATE POLICY "Authenticated users can view active and approved policies"
ON public.policies
FOR SELECT
TO authenticated
USING (status IN ('active', 'approved'));