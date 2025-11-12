-- Add transition tracking columns to policies
ALTER TABLE public.policies 
ADD COLUMN IF NOT EXISTS transitioned_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS transitioned_at timestamp with time zone;

-- Create indexes for dashboard performance
CREATE INDEX IF NOT EXISTS idx_policies_reviewer_status ON public.policies(reviewer_id, status);
CREATE INDEX IF NOT EXISTS idx_policies_creator_status ON public.policies(created_by, status);
CREATE INDEX IF NOT EXISTS idx_policies_status_updated ON public.policies(status, updated_at DESC);

-- Create view for user current role (highest priority role)
CREATE OR REPLACE VIEW public.v_user_current_role AS
SELECT DISTINCT ON (user_id)
  user_id,
  role,
  created_at
FROM public.user_roles
ORDER BY user_id, 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'reviewer' THEN 2
    WHEN 'editor' THEN 3
    WHEN 'viewer' THEN 4
  END,
  created_at DESC;

-- Create policy status transition function
CREATE OR REPLACE FUNCTION public.transition_policy_status(
  policy_id_param uuid,
  new_status_param policy_status,
  rejection_reason_param text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_status policy_status;
  user_role app_role;
  policy_reviewer_id uuid;
BEGIN
  -- Get current policy status and reviewer_id
  SELECT status, reviewer_id INTO current_status, policy_reviewer_id
  FROM policies
  WHERE id = policy_id_param;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Policy not found';
  END IF;

  -- Get user's highest role
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'reviewer' THEN 2
    WHEN 'editor' THEN 3
    WHEN 'viewer' THEN 4
  END
  LIMIT 1;

  -- Validate transitions based on current status and user role
  IF current_status = 'draft' AND new_status_param = 'review' THEN
    -- Editor submitting for review
    IF user_role NOT IN ('editor', 'admin') THEN
      RAISE EXCEPTION 'Only editors can submit policies for review';
    END IF;
    
    -- Require reviewer_id to be set
    IF policy_reviewer_id IS NULL THEN
      RAISE EXCEPTION 'A reviewer must be assigned before submitting for review';
    END IF;

  ELSIF current_status = 'review' AND new_status_param = 'approved' THEN
    -- Reviewer approving
    IF user_role NOT IN ('reviewer', 'admin') THEN
      RAISE EXCEPTION 'Only reviewers can approve policies';
    END IF;

  ELSIF current_status = 'review' AND new_status_param = 'draft' THEN
    -- Reviewer rejecting back to draft
    IF user_role NOT IN ('reviewer', 'admin') THEN
      RAISE EXCEPTION 'Only reviewers can reject policies';
    END IF;

  ELSIF current_status = 'approved' AND new_status_param = 'active' THEN
    -- Admin publishing
    IF user_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can publish policies';
    END IF;

  ELSIF current_status = 'active' AND new_status_param = 'archived' THEN
    -- Admin archiving
    IF user_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can archive policies';
    END IF;

  ELSE
    RAISE EXCEPTION 'Invalid status transition from % to %', current_status, new_status_param;
  END IF;

  -- Update policy status
  UPDATE policies
  SET 
    status = new_status_param,
    transitioned_by = auth.uid(),
    transitioned_at = now(),
    rejection_reason = CASE 
      WHEN new_status_param = 'draft' AND current_status = 'review' 
      THEN rejection_reason_param 
      ELSE rejection_reason 
    END,
    updated_by = auth.uid(),
    updated_at = now()
  WHERE id = policy_id_param;
END;
$$;

-- Update RLS policies on policies table
DROP POLICY IF EXISTS "Editors can create draft policies" ON public.policies;
DROP POLICY IF EXISTS "Editors can update own policies" ON public.policies;
DROP POLICY IF EXISTS "Editors can delete own draft policies" ON public.policies;
DROP POLICY IF EXISTS "Editors can view own drafts and reviews" ON public.policies;
DROP POLICY IF EXISTS "Reviewers can view policies under review" ON public.policies;
DROP POLICY IF EXISTS "Reviewers can update policies under review" ON public.policies;
DROP POLICY IF EXISTS "Viewers can view approved policies" ON public.policies;
DROP POLICY IF EXISTS "Admins can view all policies" ON public.policies;
DROP POLICY IF EXISTS "Admins can update any policy" ON public.policies;
DROP POLICY IF EXISTS "Admins can delete any policy" ON public.policies;

-- New RLS policies with corrected logic
CREATE POLICY "Editors and Admins can create draft policies"
ON public.policies
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (created_by = auth.uid()) AND 
  (status = 'draft') AND
  (has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Editors can update own draft policies"
ON public.policies
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = created_by) AND 
  (status = 'draft')
)
WITH CHECK (
  (auth.uid() = created_by) AND 
  (status = 'draft')
);

CREATE POLICY "Editors can delete own draft policies"
ON public.policies
FOR DELETE
TO authenticated
USING (
  (auth.uid() = created_by) AND 
  (status = 'draft')
);

CREATE POLICY "Editors can view own drafts and reviews"
ON public.policies
FOR SELECT
TO authenticated
USING (
  (auth.uid() = created_by) AND 
  (status IN ('draft', 'review'))
);

CREATE POLICY "Reviewers can view assigned review policies"
ON public.policies
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'reviewer') AND 
  (status = 'review')
);

CREATE POLICY "Reviewers can update metadata of review policies"
ON public.policies
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'reviewer') AND 
  (status = 'review')
)
WITH CHECK (
  has_role(auth.uid(), 'reviewer')
);

CREATE POLICY "Viewers can view active policies"
ON public.policies
FOR SELECT
TO authenticated
USING (status = 'active');

CREATE POLICY "Admins can view all policies"
ON public.policies
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any policy"
ON public.policies
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any policy"
ON public.policies
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Update handle_new_user function to assign Reviewer role to specific email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign role based on email
  IF NEW.email = 'tahirmehmood24898@gmail.com' THEN
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'admin'::app_role, NEW.id);
  ELSIF NEW.email = 'tahir.mehmood22011@gmail.com' THEN
    -- Assign reviewer role
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'reviewer'::app_role, NEW.id);
  ELSIF NEW.email = 'tahirmehmood98824@gmail.com' THEN
    -- Assign editor role
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'editor'::app_role, NEW.id);
  ELSE
    -- Default to editor for all other new users
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'editor'::app_role, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update notify_admins trigger to only fire on transition to 'review'
CREATE OR REPLACE FUNCTION public.notify_admins_policy_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only notify when status changes to review (not from draft creation)
  IF NEW.status = 'review' AND (OLD IS NULL OR OLD.status != 'review') THEN
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
$function$;