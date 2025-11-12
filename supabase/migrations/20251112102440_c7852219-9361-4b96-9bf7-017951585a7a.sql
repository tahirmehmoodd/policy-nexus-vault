-- Drop the redundant view
DROP VIEW IF EXISTS public.v_user_current_role;

-- Drop existing RLS policies on policies table
DROP POLICY IF EXISTS "Editors can view own drafts and reviews" ON public.policies;
DROP POLICY IF EXISTS "Viewers can view active policies" ON public.policies;
DROP POLICY IF EXISTS "Reviewers can view assigned review policies" ON public.policies;
DROP POLICY IF EXISTS "Admins can view all policies" ON public.policies;
DROP POLICY IF EXISTS "Editors and Admins can create draft policies" ON public.policies;
DROP POLICY IF EXISTS "Editors can update own draft policies" ON public.policies;
DROP POLICY IF EXISTS "Editors can delete own draft policies" ON public.policies;
DROP POLICY IF EXISTS "Reviewers can update metadata of review policies" ON public.policies;
DROP POLICY IF EXISTS "Admins can update any policy" ON public.policies;
DROP POLICY IF EXISTS "Admins can delete any policy" ON public.policies;

-- Create improved RLS policies for policies table

-- SELECT policies: Everyone can view active/approved policies, editors can view their own drafts/reviews
CREATE POLICY "Anyone can view active and approved policies"
ON public.policies
FOR SELECT
USING (status IN ('active', 'approved'));

CREATE POLICY "Editors can view own drafts and reviews"
ON public.policies
FOR SELECT
USING (
  auth.uid() = created_by 
  AND status IN ('draft', 'review')
);

CREATE POLICY "Reviewers can view assigned review policies"
ON public.policies
FOR SELECT
USING (
  has_role(auth.uid(), 'reviewer') 
  AND status = 'review'
);

CREATE POLICY "Admins can view all policies"
ON public.policies
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- INSERT policies: Editors and Admins can create draft policies
CREATE POLICY "Editors and Admins can create draft policies"
ON public.policies
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND created_by = auth.uid()
  AND status = 'draft'
  AND (has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'admin'))
);

-- UPDATE policies: Different rules for different roles
CREATE POLICY "Editors can update own draft policies"
ON public.policies
FOR UPDATE
USING (
  auth.uid() = created_by 
  AND status = 'draft'
)
WITH CHECK (
  auth.uid() = created_by 
  AND status = 'draft'
);

CREATE POLICY "Reviewers can update metadata of review policies"
ON public.policies
FOR UPDATE
USING (
  has_role(auth.uid(), 'reviewer') 
  AND status = 'review'
)
WITH CHECK (has_role(auth.uid(), 'reviewer'));

CREATE POLICY "Admins can update any policy"
ON public.policies
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- DELETE policies: Editors can delete own drafts, Admins can delete any
CREATE POLICY "Editors can delete own draft policies"
ON public.policies
FOR DELETE
USING (
  auth.uid() = created_by 
  AND status = 'draft'
);

CREATE POLICY "Admins can delete any policy"
ON public.policies
FOR DELETE
USING (has_role(auth.uid(), 'admin'));