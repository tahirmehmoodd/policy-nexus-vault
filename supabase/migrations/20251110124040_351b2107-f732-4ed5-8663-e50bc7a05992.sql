-- Add rejection_reason column to policies table
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Drop existing problematic RLS policies
DROP POLICY IF EXISTS "Policy creators can update their policies" ON public.policies;
DROP POLICY IF EXISTS "Users can update their own policies or admins can update any" ON public.policies;

-- Create secure RLS policies
-- Users can only create drafts or submit for review (not directly set to active)
CREATE POLICY "Users can create draft policies"
ON public.policies
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  created_by = auth.uid() AND
  status IN ('draft', 'under_review')
);

-- Users can update their own draft policies
CREATE POLICY "Users can update their own draft policies"
ON public.policies
FOR UPDATE
TO authenticated
USING (
  auth.uid() = created_by AND 
  status IN ('draft', 'under_review')
)
WITH CHECK (
  auth.uid() = created_by AND 
  status IN ('draft', 'under_review')
);

-- Admins can update any policy including status changes
CREATE POLICY "Admins can update any policy"
ON public.policies
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Insert admin role for the specified user
-- First, we need to get the user_id from auth.users by email
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user_id for the admin email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'tahirmehmood24898@gmail.com';
  
  -- Only insert if user exists and doesn't already have admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Update notification trigger to also handle email notifications
CREATE OR REPLACE FUNCTION public.notify_admins_policy_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify when status changes to under_review
  IF NEW.status = 'under_review' AND (OLD.status IS NULL OR OLD.status != 'under_review') THEN
    -- Insert notifications for all admin users
    INSERT INTO public.notifications (user_id, type, title, message, link, policy_id)
    SELECT 
      ur.user_id,
      'policy_review',
      'Policy Needs Review',
      'Policy "' || NEW.title || '" has been submitted for review by ' || NEW.author,
      '/admin/policies',
      NEW.id
    FROM public.user_roles ur
    WHERE ur.role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;