-- Update handle_new_user to assign viewer role by default (not editor)
-- This ensures normal users can only view policies, not create them
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
    -- Assign reviewer role (can approve/reject policies)
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'reviewer'::app_role, NEW.id);
  ELSIF NEW.email = 'tahirmehmood98824@gmail.com' THEN
    -- Assign editor role (can create/edit policies)
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'editor'::app_role, NEW.id);
  ELSE
    -- Default to viewer for all other new users (can only view active/approved policies)
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'viewer'::app_role, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Ensure notify_admins also notifies reviewers when policy is submitted for review
CREATE OR REPLACE FUNCTION public.notify_admins_policy_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only notify when status changes to review
  IF NEW.status = 'review' AND (OLD IS NULL OR OLD.status != 'review') THEN
    -- Insert notifications for admins AND reviewers
    INSERT INTO public.notifications (user_id, type, title, message, link, policy_id)
    SELECT 
      ur.user_id,
      'policy_review',
      'Policy Needs Review',
      'Policy "' || NEW.title || '" has been submitted for review by ' || NEW.author,
      '/admin/policies',
      NEW.id
    FROM public.user_roles ur
    WHERE ur.role IN ('admin', 'reviewer');
  END IF;
  
  RETURN NEW;
END;
$function$;